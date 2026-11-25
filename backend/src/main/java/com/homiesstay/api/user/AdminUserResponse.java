package com.homiesstay.api.user;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.Instant;

public record AdminUserResponse(
		Long id,
		String email,
		String username,
		String displayName,
		String phone,
		String role,
		String accountStatus,
		LocalDateTime createdAt,
		LocalDateTime updatedAt,
		Instant suspendedUntil) {
	static AdminUserResponse from(AppUserEntity account) {
		return new AdminUserResponse(account.getId(), account.getEmail(), account.getUsername(),
				account.getDisplayName(), account.getPhone(), account.getRole().name(),
				account.getAccountStatus().name(), account.getCreatedAt(), account.getUpdatedAt(),
				account.getSuspendedUntil() == null ? null : account.getSuspendedUntil().toInstant(ZoneOffset.UTC));
	}
}
