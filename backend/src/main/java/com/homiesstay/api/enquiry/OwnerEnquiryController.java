package com.homiesstay.api.enquiry;

import jakarta.validation.Valid;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.homiesstay.api.user.UserRole;

@RestController
@RequestMapping("/api/v1/owner/enquiries")
public class OwnerEnquiryController {
	private final PropertyEnquiryService enquiryService;

	public OwnerEnquiryController(PropertyEnquiryService enquiryService) { this.enquiryService = enquiryService; }

	@GetMapping
	public EnquiryPageResponse<EnquirySummaryResponse> list(Authentication authentication,
			@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size) {
		return enquiryService.listOwner(authentication, page, size);
	}

	@GetMapping("/{enquiryId}/messages")
	public java.util.List<EnquiryMessageResponse> messages(Authentication authentication, @PathVariable Long enquiryId) {
		return enquiryService.messages(authentication, UserRole.OWNER, enquiryId);
	}

	@PostMapping("/{enquiryId}/messages")
	public EnquiryMessageResponse reply(Authentication authentication, @PathVariable Long enquiryId,
			@Valid @RequestBody EnquiryMessageRequest request) {
		return enquiryService.reply(authentication, UserRole.OWNER, enquiryId, request);
	}
}
