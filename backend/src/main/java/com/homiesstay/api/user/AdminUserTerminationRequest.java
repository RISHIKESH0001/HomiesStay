package com.homiesstay.api.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AdminUserTerminationRequest(
		@NotBlank @Size(max = 30) String confirmation,
		@NotBlank @Size(max = 500) String reason) {
}
