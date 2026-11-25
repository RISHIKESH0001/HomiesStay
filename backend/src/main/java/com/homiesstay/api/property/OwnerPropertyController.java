package com.homiesstay.api.property;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/owner/properties")
public class OwnerPropertyController {
	private final OwnerPropertyService propertyService;

	public OwnerPropertyController(OwnerPropertyService propertyService) {
		this.propertyService = propertyService;
	}

	@GetMapping
	public OwnerPropertyPageResponse listOwnedProperties(
			Authentication authentication,
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "20") int size) {
		return propertyService.listOwnedProperties(authentication, page, size);
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public OwnerPropertyResponse createProperty(Authentication authentication, @Valid @RequestBody PropertyRequest request) {
		return propertyService.createProperty(authentication, request);
	}

	@GetMapping("/{propertyId}")
	public OwnerPropertyResponse getOwnedProperty(Authentication authentication, @PathVariable Long propertyId) {
		return propertyService.getOwnedProperty(authentication, propertyId);
	}

	@PutMapping("/{propertyId}")
	public OwnerPropertyResponse updateProperty(
			Authentication authentication,
			@PathVariable Long propertyId,
			@Valid @RequestBody PropertyRequest request) {
		return propertyService.updateProperty(authentication, propertyId, request);
	}

	@PostMapping("/{propertyId}/submit")
	public OwnerPropertyResponse submitForReview(Authentication authentication, @PathVariable Long propertyId) {
		return propertyService.submitForReview(authentication, propertyId);
	}

	@DeleteMapping("/{propertyId}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void deleteDraft(Authentication authentication, @PathVariable Long propertyId) {
		propertyService.deleteDraft(authentication, propertyId);
	}
}
