package com.homiesstay.api.property;

import java.net.URI;
import java.text.Normalizer;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PropertyMediaService {
	private final JdbcTemplate jdbcTemplate;

	public PropertyMediaService(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	@Transactional
	public void replace(Long propertyId, List<String> imageUrls, List<String> requestedAmenities) {
		List<String> images = normalizeImages(imageUrls);
		List<String> amenities = normalizeAmenities(requestedAmenities);
		jdbcTemplate.update("DELETE FROM property_images WHERE property_id = ?", propertyId);
		for (int index = 0; index < images.size(); index++) {
			jdbcTemplate.update("INSERT INTO property_images (property_id, image_url, display_order) VALUES (?, ?, ?)",
					propertyId, images.get(index), index);
		}
		jdbcTemplate.update("DELETE FROM property_amenities WHERE property_id = ?", propertyId);
		for (String amenity : amenities) {
			String normalized = amenity.toLowerCase(Locale.ROOT);
			jdbcTemplate.update("INSERT IGNORE INTO amenities (name, normalized_name) VALUES (?, ?)", amenity, normalized);
			Long amenityId = jdbcTemplate.queryForObject(
					"SELECT id FROM amenities WHERE normalized_name = ?", Long.class, normalized);
			jdbcTemplate.update("INSERT INTO property_amenities (property_id, amenity_id) VALUES (?, ?)", propertyId, amenityId);
		}
	}

	@Transactional(readOnly = true)
	public PropertyMedia forProperty(Long propertyId) {
		return forProperties(List.of(propertyId)).getOrDefault(propertyId, PropertyMedia.empty());
	}

	@Transactional(readOnly = true)
	public Map<Long, PropertyMedia> forProperties(List<Long> propertyIds) {
		Map<Long, List<String>> images = new LinkedHashMap<>();
		Map<Long, List<String>> amenities = new LinkedHashMap<>();
		for (Long propertyId : propertyIds) {
			images.put(propertyId, new ArrayList<>());
			amenities.put(propertyId, new ArrayList<>());
		}
		if (propertyIds.isEmpty()) {
			return Map.of();
		}
		String placeholders = String.join(",", propertyIds.stream().map(id -> "?").toList());
		Object[] queryArgs = propertyIds.toArray();
		jdbcTemplate.query("SELECT property_id, image_url FROM property_images WHERE property_id IN (" + placeholders + ") ORDER BY property_id, display_order, id",
				(rs) -> {
					images.get(rs.getLong("property_id")).add(rs.getString("image_url"));
				}, queryArgs);
		jdbcTemplate.query("SELECT pa.property_id, a.name FROM property_amenities pa JOIN amenities a ON a.id = pa.amenity_id WHERE pa.property_id IN (" + placeholders + ") ORDER BY pa.property_id, a.normalized_name",
				(rs) -> {
					amenities.get(rs.getLong("property_id")).add(rs.getString("name"));
				}, queryArgs);
		Map<Long, PropertyMedia> result = new LinkedHashMap<>();
		for (Long propertyId : propertyIds) {
			result.put(propertyId, new PropertyMedia(List.copyOf(images.get(propertyId)), List.copyOf(amenities.get(propertyId))));
		}
		return result;
	}

	private List<String> normalizeImages(List<String> requestedImages) {
		List<String> images = requestedImages == null ? List.of() : requestedImages;
		if (images.size() > 10) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A listing can have at most 10 photos.");
		}
		List<String> normalized = new ArrayList<>();
		for (String image : images) {
			String url = image.trim();
			try {
				URI uri = URI.create(url);
				if (!"https".equalsIgnoreCase(uri.getScheme()) || uri.getHost() == null || uri.getUserInfo() != null || url.length() > 2048) {
					throw new IllegalArgumentException();
				}
			} catch (IllegalArgumentException exception) {
				throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Photos must use valid HTTPS URLs without embedded credentials.");
			}
			normalized.add(url);
		}
		return normalized;
	}

	private List<String> normalizeAmenities(List<String> requestedAmenities) {
		List<String> amenities = requestedAmenities == null ? List.of() : requestedAmenities;
		if (amenities.size() > 30) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A listing can have at most 30 amenities.");
		}
		Set<String> names = new HashSet<>();
		List<String> normalized = new ArrayList<>();
		for (String amenity : amenities) {
			String name = amenity.trim().replaceAll("\\s+", " ");
			String key = Normalizer.normalize(name, Normalizer.Form.NFD).replaceAll("\\p{M}+", "").toLowerCase(Locale.ROOT);
			if (name.isBlank() || name.length() > 80 || !names.add(key)) {
				throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Amenities must be non-empty, unique, and no longer than 80 characters.");
			}
			normalized.add(name);
		}
		return normalized;
	}
}
