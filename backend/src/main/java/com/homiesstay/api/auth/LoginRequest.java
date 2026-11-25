package com.homiesstay.api.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginRequest(
		@NotBlank @Size(max = 254) String identifier,
		@NotBlank @Size(min = 1, max = 72) String password) {
}
