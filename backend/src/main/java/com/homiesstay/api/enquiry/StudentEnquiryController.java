package com.homiesstay.api.enquiry;

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

import com.homiesstay.api.user.UserRole;

@RestController
@RequestMapping("/api/v1/student/enquiries")
public class StudentEnquiryController {
	private final PropertyEnquiryService enquiryService;

	public StudentEnquiryController(PropertyEnquiryService enquiryService) { this.enquiryService = enquiryService; }

	@GetMapping
	public EnquiryPageResponse<EnquirySummaryResponse> list(Authentication authentication,
			@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size) {
		return enquiryService.listStudent(authentication, page, size);
	}

	@PostMapping("/properties/{propertyId}")
	@ResponseStatus(HttpStatus.CREATED)
	public EnquirySummaryResponse start(Authentication authentication, @PathVariable Long propertyId,
			@Valid @RequestBody EnquiryMessageRequest request) {
		return enquiryService.start(authentication, propertyId, request);
	}

	@GetMapping("/{enquiryId}/messages")
	public java.util.List<EnquiryMessageResponse> messages(Authentication authentication, @PathVariable Long enquiryId) {
		return enquiryService.messages(authentication, UserRole.STUDENT, enquiryId);
	}

	@PostMapping("/{enquiryId}/messages")
	public EnquiryMessageResponse reply(Authentication authentication, @PathVariable Long enquiryId,
			@Valid @RequestBody EnquiryMessageRequest request) {
		return enquiryService.reply(authentication, UserRole.STUDENT, enquiryId, request);
	}
}
