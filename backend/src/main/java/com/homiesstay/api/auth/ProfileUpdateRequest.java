package com.homiesstay.api.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ProfileUpdateRequest(
		@NotBlank @Size(max = 120) String name,
		@NotBlank @Size(max = 32) @Pattern(regexp = "\\+?[1-9][0-9\\s-]{5,29}[0-9]") String phone) {
}
