package com.homiesstay.api.auth;

import com.homiesstay.api.user.AppUserEntity;

public record AccountResponse(Long id, String email, String username, String name, String phone, String role, String profileImage) {
	static AccountResponse from(AppUserEntity user) {
		String profileImage = user.getProfileImageVersion() == 0 ? null
				: "/auth/profile-picture?v=" + user.getProfileImageVersion();
		return new AccountResponse(user.getId(), user.getEmail(), user.getUsername(), user.getDisplayName(), user.getPhone(), user.getRole().name().toLowerCase(), profileImage);
	}
}
