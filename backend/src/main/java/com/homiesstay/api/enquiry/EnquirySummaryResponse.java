package com.homiesstay.api.enquiry;

import java.time.LocalDateTime;

public record EnquirySummaryResponse(Long id, Long propertyId, String propertySlug, String propertyName,
		String participantName, LocalDateTime createdAt, LocalDateTime updatedAt) {
	static EnquirySummaryResponse from(PropertyEnquiryEntity enquiry, boolean ownerView) {
		return new EnquirySummaryResponse(enquiry.getId(), enquiry.getProperty().getId(),
				enquiry.getProperty().getSlug(), enquiry.getProperty().getName(),
				ownerView ? enquiry.getStudent().getDisplayName() : "Property owner",
				enquiry.getCreatedAt(), enquiry.getUpdatedAt());
	}
}
