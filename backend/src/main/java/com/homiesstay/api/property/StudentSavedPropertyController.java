package com.homiesstay.api.property;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/student/saved-properties")
public class StudentSavedPropertyController {
	private final StudentSavedPropertyService savedPropertyService;

	public StudentSavedPropertyController(StudentSavedPropertyService savedPropertyService) {
		this.savedPropertyService = savedPropertyService;
	}

	@GetMapping
	public PropertyPageResponse list(Authentication authentication,
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "20") int size) {
		return savedPropertyService.list(authentication, page, size);
	}

	@PostMapping("/{propertyId}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void save(Authentication authentication, @PathVariable Long propertyId) {
		savedPropertyService.save(authentication, propertyId);
	}

	@DeleteMapping("/{propertyId}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void remove(Authentication authentication, @PathVariable Long propertyId) {
		savedPropertyService.remove(authentication, propertyId);
	}
}
