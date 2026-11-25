package com.homiesstay.api.application;

import java.util.List;

import org.springframework.data.domain.Page;

public record ApplicationPageResponse<T>(List<T> content, int page, int size, long totalElements, int totalPages) {
	public static <T> ApplicationPageResponse<T> from(Page<T> result) {
		return new ApplicationPageResponse<>(result.getContent(), result.getNumber(), result.getSize(),
				result.getTotalElements(), result.getTotalPages());
	}
}
