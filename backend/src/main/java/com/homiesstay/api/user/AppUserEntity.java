package com.homiesstay.api.user;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "app_users")
public class AppUserEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, unique = true, length = 254)
	private String email;

	@Column(nullable = false, unique = true, length = 30)
	private String username;

	@Column(name = "password_hash", nullable = false, length = 255)
	private String passwordHash;

	@Column(name = "display_name", nullable = false, length = 120)
	private String displayName;

	@Column(length = 32)
	private String phone;

	@Column(name = "profile_image_version", nullable = false)
	private long profileImageVersion;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 20)
	private UserRole role;

	@Enumerated(EnumType.STRING)
	@Column(name = "account_status", nullable = false, length = 20)
	private AccountStatus accountStatus;

	@Column(name = "suspended_until")
	private LocalDateTime suspendedUntil;

	@Column(name = "created_at", nullable = false, insertable = false, updatable = false)
	private LocalDateTime createdAt;

	@Column(name = "updated_at", nullable = false, insertable = false, updatable = false)
	private LocalDateTime updatedAt;

	protected AppUserEntity() {
	}

	public static AppUserEntity create(String email, String username, String passwordHash, String displayName, String phone, UserRole role) {
		AppUserEntity user = new AppUserEntity();
		user.email = email;
		user.username = username;
		user.passwordHash = passwordHash;
		user.displayName = displayName;
		user.phone = phone;
		user.role = role;
		user.accountStatus = AccountStatus.PENDING;
		return user;
	}

	public Long getId() {
		return id;
	}

	public String getEmail() {
		return email;
	}

	public String getUsername() {
		return username;
	}

	public String getPasswordHash() {
		return passwordHash;
	}

	public String getDisplayName() {
		return displayName;
	}

	public String getPhone() {
		return phone;
	}

	public long getProfileImageVersion() {
		return profileImageVersion;
	}

	public UserRole getRole() {
		return role;
	}

	public AccountStatus getAccountStatus() {
		return accountStatus;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}

	public LocalDateTime getSuspendedUntil() {
		return suspendedUntil;
	}

	public boolean hasExpiredSuspension(LocalDateTime now) {
		return accountStatus == AccountStatus.SUSPENDED && suspendedUntil != null && !suspendedUntil.isAfter(now);
	}

	public void suspendUntil(LocalDateTime suspendedUntil) {
		accountStatus = AccountStatus.SUSPENDED;
		this.suspendedUntil = suspendedUntil;
	}

	public void liftSuspension() {
		accountStatus = AccountStatus.ACTIVE;
		suspendedUntil = null;
	}

	public void activate() {
		accountStatus = AccountStatus.ACTIVE;
		suspendedUntil = null;
	}

	public void updateProfile(String displayName, String phone) {
		this.displayName = displayName.trim();
		this.phone = phone;
	}

	public void updatePasswordHash(String passwordHash) {
		this.passwordHash = passwordHash;
	}

	public void updateProfileImageVersion(long profileImageVersion) {
		this.profileImageVersion = profileImageVersion;
	}
}
