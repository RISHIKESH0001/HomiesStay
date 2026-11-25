package com.homiesstay.api.property;

import java.util.List;

public record OwnerPropertyPageResponse(
		List<OwnerPropertyResponse> content,
		int page,
		int size,
		long totalElements,
		int totalPages) {
}
