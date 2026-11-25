package com.homiesstay.api.application;

import java.time.LocalDate;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record StudentApplicationRequest(
		@NotNull @FutureOrPresent LocalDate moveInDate,
		@NotBlank @Size(max = 80) String roomPreference,
		@NotBlank @Size(max = 2000) String message) {
}
