package com.homiesstay.api.auth;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.homiesstay.api.user.AppUserEntity;
import com.homiesstay.api.user.AppUserRepository;
import com.homiesstay.api.user.UserRole;

class AuthServiceTest {
	private AppUserRepository userRepository;
	private PasswordEncoder passwordEncoder;
	private EmailVerificationService emailVerificationService;
	private AuthService authService;

	@BeforeEach
	void setUp() {
		userRepository = org.mockito.Mockito.mock(AppUserRepository.class);
		passwordEncoder = org.mockito.Mockito.mock(PasswordEncoder.class);
		emailVerificationService = org.mockito.Mockito.mock(EmailVerificationService.class);
		authService = new AuthService(userRepository, passwordEncoder, emailVerificationService);
	}

	@Test
	void registerNormalizesAccountFieldsAndEncodesPassword() {
		RegisterRequest request = new RegisterRequest(" Riya Shah ", " Riya@Example.com ", "Riya.Shah", "+91 98765 43210", "StrongPass1", "OWNER");
		when(userRepository.existsByEmailIgnoreCase("riya@example.com")).thenReturn(false);
		when(userRepository.existsByUsernameIgnoreCase("riya.shah")).thenReturn(false);
		when(passwordEncoder.encode("StrongPass1")).thenReturn("encoded-password");
		when(userRepository.saveAndFlush(any(AppUserEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));

		AccountResponse response = authService.register(request);

		assertEquals("riya@example.com", response.email());
		assertEquals("Riya Shah", response.name());
		assertEquals("+919876543210", response.phone());
		assertEquals("owner", response.role());
		verify(passwordEncoder).encode("StrongPass1");
	}

	@Test
	void registerRejectsAnExistingEmailBeforeEncodingOrSaving() {
		RegisterRequest request = new RegisterRequest("Riya Shah", "riya@example.com", "riya", "9876543210", "StrongPass1", "student");
		when(userRepository.existsByEmailIgnoreCase("riya@example.com")).thenReturn(true);

		assertThrows(AccountAlreadyExistsException.class, () -> authService.register(request));

		verify(passwordEncoder, never()).encode(any());
		verify(userRepository, never()).saveAndFlush(any(AppUserEntity.class));
	}

	@Test
	void updateProfilePersistsNameAndNormalizedPhoneWithoutChangingLoginIdentity() {
		AppUserEntity user = AppUserEntity.create("student@example.com", "student", "encoded-password",
				"Previous Name", "+919876543210", UserRole.STUDENT);
		Authentication authentication = org.mockito.Mockito.mock(Authentication.class);
		when(authentication.getName()).thenReturn("student@example.com");
		when(userRepository.findByEmailIgnoreCase("student@example.com")).thenReturn(Optional.of(user));

		AccountResponse response = authService.updateProfile(authentication,
				new ProfileUpdateRequest(" New Name ", "+91 98765-43210"));

		assertEquals("New Name", response.name());
		assertEquals("+919876543210", response.phone());
		assertEquals("student@example.com", response.email());
		assertEquals("student", response.username());
	}
}
