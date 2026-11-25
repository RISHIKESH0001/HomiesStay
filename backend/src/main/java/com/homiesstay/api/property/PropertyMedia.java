package com.homiesstay.api.property;

import java.util.List;

public record PropertyMedia(List<String> images, List<String> amenities) {
	public static PropertyMedia empty() {
		return new PropertyMedia(List.of(), List.of());
	}
}
