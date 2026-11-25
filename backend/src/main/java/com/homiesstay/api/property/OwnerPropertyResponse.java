package com.homiesstay.api.property;

import java.math.BigDecimal;
import java.util.List;

public record OwnerPropertyResponse(
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
		List<String> amenities) {
	static OwnerPropertyResponse from(PropertyEntity property, PropertyMedia media) {
		return new OwnerPropertyResponse(
				property.getId(), property.getSlug(), property.getName(), property.getPropertyType(),
				property.getGenderPolicy(), property.getDescription(), property.getAddressLine(),
				property.getArea(), property.getCity(), property.getState(), property.getPostalCode(),
				property.getLatitude(), property.getLongitude(), property.getNearbyInstitution(),
				property.getDistanceKm(), property.getMonthlyRent(), property.getCapacity(),
				property.getAvailableBeds(), property.getListingStatus().name(), property.getReviewStatus().name(),
				property.getReviewNote(), media.images(), media.amenities());
	}
}
