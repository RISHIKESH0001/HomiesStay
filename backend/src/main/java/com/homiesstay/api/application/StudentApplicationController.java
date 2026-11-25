package com.homiesstay.api.application;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/student/applications")
public class StudentApplicationController {
	private final StudentApplicationService applicationService;

	public StudentApplicationController(StudentApplicationService applicationService) {
		this.applicationService = applicationService;
	}

	@GetMapping
	public ApplicationPageResponse<StudentApplicationResponse> list(Authentication authentication,
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "20") int size) {
		return applicationService.listStudentApplications(authentication, page, size);
	}

	@PostMapping("/properties/{propertyId}")
	@ResponseStatus(HttpStatus.CREATED)
	public StudentApplicationResponse apply(
			Authentication authentication,
			@PathVariable Long propertyId,
			@Valid @RequestBody StudentApplicationRequest request) {
		return applicationService.apply(authentication, propertyId, request);
	}

	@PostMapping("/{applicationId}/withdraw")
	public StudentApplicationResponse withdraw(Authentication authentication, @PathVariable Long applicationId) {
		return applicationService.withdraw(authentication, applicationId);
	}
}
