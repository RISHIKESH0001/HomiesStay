package com.homiesstay.api.property;

import java.util.List;

public record AdminPropertyPageResponse(
		List<AdminPropertyResponse> content,
		int page,
		int size,
		long totalElements,
		int totalPages) {
}
