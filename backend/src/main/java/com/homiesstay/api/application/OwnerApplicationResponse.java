package com.homiesstay.api.application;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record OwnerApplicationResponse(
		Long id,
		ApplicationStatus status,
		LocalDate moveInDate,
		String roomPreference,
		String message,
		LocalDateTime createdAt,
		Long propertyId,
		String propertySlug,
		String propertyName,
		Long studentId,
		String studentName,
		String studentEmail,
		String studentPhone) {
	static OwnerApplicationResponse from(StudentApplicationEntity application) {
		var property = application.getProperty();
		var student = application.getStudent();
		return new OwnerApplicationResponse(application.getId(), application.getStatus(), application.getMoveInDate(),
				application.getRoomPreference(), application.getMessage(), application.getCreatedAt(), property.getId(),
				property.getSlug(), property.getName(), student.getId(), student.getDisplayName(), student.getEmail(), student.getPhone());
	}
}
