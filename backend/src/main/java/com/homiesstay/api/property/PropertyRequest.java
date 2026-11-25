package com.homiesstay.api.property;

import java.math.BigDecimal;
import java.util.List;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record PropertyRequest(
		@NotBlank @Size(max = 160) String name,
		@NotBlank @Size(max = 60) String propertyType,
		@NotBlank @Pattern(regexp = "(?i:MEN|WOMEN|UNISEX)") String genderPolicy,
		@Size(max = 10000) String description,
		@Size(max = 255) String addressLine,
		@NotBlank @Size(max = 120) String area,
		@NotBlank @Size(max = 120) String city,
		@Size(max = 120) String state,
		@Size(max = 20) String postalCode,
		@jakarta.validation.constraints.DecimalMin("-90.0") @jakarta.validation.constraints.DecimalMax("90.0") BigDecimal latitude,
		@jakarta.validation.constraints.DecimalMin("-180.0") @jakarta.validation.constraints.DecimalMax("180.0") BigDecimal longitude,
		@Size(max = 180) String nearbyInstitution,
		@DecimalMin("0.0") @Digits(integer = 5, fraction = 2) BigDecimal distanceKm,
		@NotNull @DecimalMin(value = "0.01") @Digits(integer = 10, fraction = 2) BigDecimal monthlyRent,
		@NotNull @Min(1) Integer capacity,
		@NotNull @Min(0) Integer availableBeds,
		@Size(max = 10) List<@NotBlank @Size(max = 2048) String> images,
		@Size(max = 30) List<@NotBlank @Size(max = 80) String> amenities) {
}
