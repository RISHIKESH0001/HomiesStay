package com.homiesstay.api.property;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.homiesstay.api.user.AppUserEntity;
import com.homiesstay.api.user.AppUserRepository;
import com.homiesstay.api.user.UserRole;

@Service
public class StudentSavedPropertyService {
	private static final int MAX_PAGE_SIZE = 50;
	private final JdbcTemplate jdbcTemplate;
	private final AppUserRepository userRepository;
	private final PropertyRepository propertyRepository;
	private final PropertyMediaService mediaService;

	public StudentSavedPropertyService(JdbcTemplate jdbcTemplate, AppUserRepository userRepository,
			PropertyRepository propertyRepository, PropertyMediaService mediaService) {
		this.jdbcTemplate = jdbcTemplate;
		this.userRepository = userRepository;
		this.propertyRepository = propertyRepository;
		this.mediaService = mediaService;
	}

	@Transactional(readOnly = true)
	public PropertyPageResponse list(Authentication authentication, int page, int size) {
		validatePage(page, size);
		AppUserEntity student = getStudent(authentication);
		long totalElements = jdbcTemplate.queryForObject(
				"SELECT COUNT(*) FROM student_saved_properties saved "
						+ "JOIN properties property ON property.id = saved.property_id "
						+ "WHERE saved.student_id = ? AND property.listing_status = 'LIVE' AND property.review_status = 'APPROVED'",
					Long.class, student.getId());
		List<Long> ids = jdbcTemplate.query(
				"SELECT property.id FROM student_saved_properties saved "
						+ "JOIN properties property ON property.id = saved.property_id "
						+ "WHERE saved.student_id = ? AND property.listing_status = 'LIVE' AND property.review_status = 'APPROVED' "
						+ "ORDER BY saved.created_at DESC, property.id DESC LIMIT ? OFFSET ?",
				(rs, rowNumber) -> rs.getLong(1), student.getId(), size, (long) page * size);
		Map<Long, PropertyEntity> properties = new HashMap<>();
		propertyRepository.findAllById(ids).forEach(property -> properties.put(property.getId(), property));
		Map<Long, PropertyMedia> media = mediaService.forProperties(ids);
		List<PropertyResponse> content = ids.stream()
				.map(properties::get)
				.filter(java.util.Objects::nonNull)
				.map(property -> PropertyResponse.from(property, media.getOrDefault(property.getId(), PropertyMedia.empty())))
				.toList();
		int totalPages = totalElements == 0 ? 0 : (int) ((totalElements + size - 1) / size);
		return new PropertyPageResponse(content, page, size, totalElements, totalPages);
	}

	@Transactional
	public void save(Authentication authentication, Long propertyId) {
		AppUserEntity student = getStudent(authentication);
		propertyRepository.findByIdAndListingStatusAndReviewStatus(
				propertyId, PropertyListingStatus.LIVE, PropertyReviewStatus.APPROVED)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Property not found."));
		jdbcTemplate.update("INSERT IGNORE INTO student_saved_properties (student_id, property_id) VALUES (?, ?)",
				student.getId(), propertyId);
	}

	@Transactional
	public void remove(Authentication authentication, Long propertyId) {
		AppUserEntity student = getStudent(authentication);
		jdbcTemplate.update("DELETE FROM student_saved_properties WHERE student_id = ? AND property_id = ?",
				student.getId(), propertyId);
	}

	private AppUserEntity getStudent(Authentication authentication) {
		return userRepository.findByEmailIgnoreCase(authentication.getName())
				.filter(user -> user.getRole() == UserRole.STUDENT)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "STUDENT account required."));
	}

	private void validatePage(int page, int size) {
		if (page < 0 || size < 1 || size > MAX_PAGE_SIZE) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
					"Page must be non-negative and size must be between 1 and " + MAX_PAGE_SIZE);
		}
	}
}
