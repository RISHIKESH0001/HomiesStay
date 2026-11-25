package com.homiesstay.api.auth;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.homiesstay.api.user.AppUserEntity;
import com.homiesstay.api.user.AppUserRepository;
import com.homiesstay.api.user.UserRole;

class PasswordResetServiceTest {
	private AppUserRepository userRepository;
	private PasswordResetCodeRepository codeRepository;
	private PasswordEncoder passwordEncoder;
	private JdbcTemplate jdbcTemplate;
	private PasswordResetService service;

	@BeforeEach
	void setUp() {
		userRepository = Mockito.mock(AppUserRepository.class);
		codeRepository = Mockito.mock(PasswordResetCodeRepository.class);
		passwordEncoder = Mockito.mock(PasswordEncoder.class);
		jdbcTemplate = Mockito.mock(JdbcTemplate.class);
		service = new PasswordResetService(userRepository, codeRepository, passwordEncoder,
				Mockito.mock(JavaMailSender.class), jdbcTemplate, "no-reply@example.com", "https://example.com");
	}

	@Test
	void validResetReplacesPasswordConsumesCodeAndRevokesSessions() {
		AppUserEntity user = activeUser();
		PasswordResetCodeEntity code = validCode();
		when(userRepository.findByEmailIgnoreCase("student@example.com")).thenReturn(Optional.of(user));
		when(codeRepository.findByUserId(null)).thenReturn(Optional.of(code));
		when(passwordEncoder.matches("123456", code.getOtpHash())).thenReturn(true);
		when(passwordEncoder.encode("NewPassword1")).thenReturn("encoded-new-password");

		EmailOtpVerificationResponse response = service.reset(
				new ResetPasswordRequest("student@example.com", "123456", "NewPassword1"));

		assertTrue(response.verified());
		assertEquals("encoded-new-password", user.getPasswordHash());
		verify(codeRepository).delete(code);
		verify(jdbcTemplate).update("DELETE FROM SPRING_SESSION WHERE PRINCIPAL_NAME = ?", "student@example.com");
	}

	@Test
	void invalidResetCodeIncrementsFailureCountWithoutChangingPassword() {
		AppUserEntity user = activeUser();
		PasswordResetCodeEntity code = validCode();
		when(userRepository.findByEmailIgnoreCase("student@example.com")).thenReturn(Optional.of(user));
		when(codeRepository.findByUserId(null)).thenReturn(Optional.of(code));
		when(passwordEncoder.matches("000000", code.getOtpHash())).thenReturn(false);

		EmailOtpVerificationResponse response = service.reset(
				new ResetPasswordRequest("student@example.com", "000000", "NewPassword1"));

		assertFalse(response.verified());
		assertEquals(1, code.getFailedAttempts());
		verify(jdbcTemplate, never()).update(any(String.class), any(Object[].class));
	}

	private AppUserEntity activeUser() {
		AppUserEntity user = AppUserEntity.create("student@example.com", "student", "old-hash",
				"Student", "9876543210", UserRole.STUDENT);
		user.activate();
		return user;
	}

	private PasswordResetCodeEntity validCode() {
		LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);
		return PasswordResetCodeEntity.create(null, "hashed-otp", now, now.plusMinutes(10));
	}
}
