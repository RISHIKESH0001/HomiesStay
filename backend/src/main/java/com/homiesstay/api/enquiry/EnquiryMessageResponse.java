package com.homiesstay.api.enquiry;

import java.time.LocalDateTime;

public record EnquiryMessageResponse(Long id, String senderName, String senderRole, String message, LocalDateTime createdAt) {
	static EnquiryMessageResponse from(PropertyEnquiryMessageEntity entry) {
		return new EnquiryMessageResponse(entry.getId(), entry.getSender().getDisplayName(),
				entry.getSender().getRole().name(), entry.getMessage(), entry.getCreatedAt());
	}
}
