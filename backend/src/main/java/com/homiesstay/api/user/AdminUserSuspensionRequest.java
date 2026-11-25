package com.homiesstay.api.user;

import java.time.Instant;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record AdminUserSuspensionRequest(
		@NotNull @Future Instant suspendedUntil,
		@NotBlank @Size(max = 500) String reason) {
}
