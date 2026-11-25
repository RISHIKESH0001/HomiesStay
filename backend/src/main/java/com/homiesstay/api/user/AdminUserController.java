package com.homiesstay.api.user;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/users")
public class AdminUserController {
	private final AdminUserService adminUserService;

	public AdminUserController(AdminUserService adminUserService) {
		this.adminUserService = adminUserService;
	}

	@GetMapping
	public AdminUserPageResponse listAccounts(
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "20") int size,
			@RequestParam(required = false) String search,
			@RequestParam(required = false) UserRole role,
			@RequestParam(required = false) AccountStatus status) {
		return adminUserService.listAccounts(page, size, search, role, status);
	}

	@PatchMapping("/{userId}/suspension")
	public AdminUserResponse suspendAccount(@PathVariable Long userId,
			@Valid @RequestBody AdminUserSuspensionRequest request, Authentication authentication) {
		return adminUserService.suspendAccount(userId, request, authentication);
	}

	@PatchMapping("/{userId}/suspension/lift")
	public AdminUserResponse liftSuspension(@PathVariable Long userId,
			@Valid @RequestBody AdminUserActionRequest request, Authentication authentication) {
		return adminUserService.liftSuspension(userId, request.reason(), authentication);
	}

	@DeleteMapping("/{userId}")
	public ResponseEntity<Void> terminateAccount(@PathVariable Long userId,
			@Valid @RequestBody AdminUserTerminationRequest request, Authentication authentication) {
		adminUserService.terminateAccount(userId, request, authentication);
		return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
	}
}
