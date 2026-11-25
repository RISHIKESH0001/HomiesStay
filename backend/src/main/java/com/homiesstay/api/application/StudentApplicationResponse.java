package com.homiesstay.api.application;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record StudentApplicationResponse(
		Long id,
		ApplicationStatus status,
		LocalDate moveInDate,
		String roomPreference,
		String message,
		LocalDateTime createdAt,
		Long propertyId,
		String propertySlug,
		String propertyName,
		String area,
		String city,
		BigDecimal monthlyRent) {
	static StudentApplicationResponse from(StudentApplicationEntity application) {
		var property = application.getProperty();
		return new StudentApplicationResponse(application.getId(), application.getStatus(), application.getMoveInDate(),
				application.getRoomPreference(), application.getMessage(), application.getCreatedAt(), property.getId(),
				property.getSlug(), property.getName(), property.getArea(), property.getCity(), property.getMonthlyRent());
	}
}
