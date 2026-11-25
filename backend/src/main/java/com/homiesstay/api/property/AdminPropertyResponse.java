package com.homiesstay.api.property;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record AdminPropertyResponse(
		Long id,
		String slug,
		String name,
		String propertyType,
		String genderPolicy,
		String description,
		String addressLine,
		String area,
		String city,
		String state,
		String postalCode,
		BigDecimal latitude,
		BigDecimal longitude,
		String nearbyInstitution,
		BigDecimal distanceKm,
		BigDecimal monthlyRent,
		Integer capacity,
		Integer availableBeds,
		String listingStatus,
		String reviewStatus,
		String reviewNote,
		List<String> images,
		List<String> amenities,
		LocalDateTime createdAt,
		Long ownerId,
		String ownerName,
		String ownerEmail,
		String ownerPhone) {
}
