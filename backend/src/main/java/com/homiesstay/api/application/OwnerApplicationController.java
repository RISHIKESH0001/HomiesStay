package com.homiesstay.api.application;

import jakarta.validation.Valid;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/owner/applications")
public class OwnerApplicationController {
	private final StudentApplicationService applicationService;

	public OwnerApplicationController(StudentApplicationService applicationService) {
		this.applicationService = applicationService;
	}

	@GetMapping
	public ApplicationPageResponse<OwnerApplicationResponse> list(Authentication authentication,
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "20") int size) {
		return applicationService.listOwnerApplications(authentication, page, size);
	}

	@PatchMapping("/{applicationId}/status")
	public OwnerApplicationResponse updateStatus(
			Authentication authentication,
			@PathVariable Long applicationId,
			@Valid @RequestBody UpdateApplicationStatusRequest request) {
		return applicationService.updateOwnerStatus(authentication, applicationId, request.status());
	}
}
