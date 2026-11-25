package com.homiesstay.api.enquiry;

import java.util.List;

import org.springframework.data.domain.Page;

public record EnquiryPageResponse<T>(List<T> content, int page, int size, long totalElements, int totalPages) {
	public static <T> EnquiryPageResponse<T> from(Page<T> result) {
		return new EnquiryPageResponse<>(result.getContent(), result.getNumber(), result.getSize(),
				result.getTotalElements(), result.getTotalPages());
	}
}
