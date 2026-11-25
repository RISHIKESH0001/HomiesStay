package com.homiesstay.api.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AdminUserActionRequest(@NotBlank @Size(max = 500) String reason) {
}
