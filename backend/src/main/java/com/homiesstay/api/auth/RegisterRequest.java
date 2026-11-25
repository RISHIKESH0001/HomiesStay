package com.homiesstay.api.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
		@NotBlank @Size(min = 2, max = 120) String name,
		@NotBlank @Email @Size(max = 254) String email,
		@NotBlank @Pattern(regexp = "^[A-Za-z0-9._-]{3,30}$") String username,
		@NotBlank @Pattern(regexp = "^(?:\\+91[\\s-]*)?[6-9](?:[\\s-]*\\d){9}$") String phone,
		@NotBlank @Size(min = 8, max = 72) @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$") String password,
		@NotBlank @Pattern(regexp = "(?i:student|owner)") String role) {
}
