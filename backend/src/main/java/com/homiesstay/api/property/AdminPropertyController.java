package com.homiesstay.api.property;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/properties")
public class AdminPropertyController {
	private final AdminPropertyService propertyService;

	public AdminPropertyController(AdminPropertyService propertyService) {
		this.propertyService = propertyService;
	}

	@GetMapping("/review-queue")
	public AdminPropertyPageResponse listPendingProperties(
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "20") int size) {
		return propertyService.listPendingProperties(page, size);
	}

	@PatchMapping("/{propertyId}/review")
	public OwnerPropertyResponse reviewProperty(
			@PathVariable Long propertyId,
			@Valid @RequestBody PropertyReviewRequest request) {
		return propertyService.reviewProperty(propertyId, request);
	}
}
