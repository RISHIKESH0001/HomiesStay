package com.homiesstay.api.property;

import java.util.List;

public record PropertyPageResponse(
		List<PropertyResponse> content,
		int page,
		int size,
		long totalElements,
		int totalPages) {
}
