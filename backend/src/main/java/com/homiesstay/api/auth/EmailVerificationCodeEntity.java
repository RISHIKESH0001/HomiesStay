package com.homiesstay.api.auth;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "email_verification_codes")
public class EmailVerificationCodeEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "user_id", nullable = false, unique = true)
	private Long userId;

	@Column(name = "otp_hash", nullable = false, length = 100)
	private String otpHash;

	@Column(name = "expires_at", nullable = false)
	private LocalDateTime expiresAt;

	@Column(name = "last_sent_at", nullable = false)
	private LocalDateTime lastSentAt;

	@Column(name = "failed_attempts", nullable = false)
	private int failedAttempts;

	protected EmailVerificationCodeEntity() {
	}

	public static EmailVerificationCodeEntity create(Long userId, String otpHash, LocalDateTime now, LocalDateTime expiresAt) {
		EmailVerificationCodeEntity code = new EmailVerificationCodeEntity();
		code.userId = userId;
		code.rotate(otpHash, now, expiresAt);
		return code;
	}

	public void rotate(String nextOtpHash, LocalDateTime now, LocalDateTime nextExpiresAt) {
		otpHash = nextOtpHash;
		lastSentAt = now;
		expiresAt = nextExpiresAt;
		failedAttempts = 0;
	}

	public void recordFailedAttempt() {
		failedAttempts++;
	}

	public Long getUserId() {
		return userId;
	}

	public String getOtpHash() {
		return otpHash;
	}

	public LocalDateTime getExpiresAt() {
		return expiresAt;
	}

	public LocalDateTime getLastSentAt() {
		return lastSentAt;
	}

	public int getFailedAttempts() {
		return failedAttempts;
	}
}
