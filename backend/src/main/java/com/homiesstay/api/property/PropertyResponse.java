package com.homiesstay.api.property;

import java.math.BigDecimal;
import java.util.List;

public record PropertyResponse(
		Long id,
		String slug,
		String name,
		String propertyType,
		String genderPolicy,
		String description,
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
		List<String> images,
		List<String> amenities) {
	static PropertyResponse from(PropertyEntity property, PropertyMedia media) {
		return new PropertyResponse(
				property.getId(),
				property.getSlug(),
				property.getName(),
				property.getPropertyType(),
				property.getGenderPolicy(),
				property.getDescription(),
				property.getArea(),
				property.getCity(),
				property.getState(),
				property.getPostalCode(),
				property.getLatitude(),
				property.getLongitude(),
				property.getNearbyInstitution(),
				property.getDistanceKm(),
				property.getMonthlyRent(),
				property.getCapacity(),
				property.getAvailableBeds(), media.images(), media.amenities());
	}
}
