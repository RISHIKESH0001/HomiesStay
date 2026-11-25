package com.homiesstay.api.auth;

import java.util.Locale;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.homiesstay.api.user.AppUserEntity;
import com.homiesstay.api.user.AppUserRepository;
import com.homiesstay.api.user.UserRole;

@Service
public class AuthService {
	private final AppUserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final EmailVerificationService emailVerificationService;

	public AuthService(AppUserRepository userRepository, PasswordEncoder passwordEncoder, EmailVerificationService emailVerificationService) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.emailVerificationService = emailVerificationService;
	}

	@Transactional
	public AccountResponse register(RegisterRequest request) {
		String email = request.email().trim().toLowerCase(Locale.ROOT);
		if (userRepository.existsByEmailIgnoreCase(email)) {
			throw new AccountAlreadyExistsException();
		}
		String username = request.username().trim().toLowerCase(Locale.ROOT);
		if (userRepository.existsByUsernameIgnoreCase(username)) {
			throw new AccountAlreadyExistsException();
		}

		String phone = request.phone().replaceAll("[\\s-]", "");
		UserRole role = UserRole.valueOf(request.role().trim().toUpperCase(Locale.ROOT));
		AppUserEntity user = AppUserEntity.create(email, username, passwordEncoder.encode(request.password()),
				request.name().trim(), phone, role);
		try {
			AppUserEntity savedUser = userRepository.saveAndFlush(user);
			emailVerificationService.issueRegistrationCode(savedUser);
			return AccountResponse.from(savedUser);
		} catch (DataIntegrityViolationException exception) {
			throw new AccountAlreadyExistsException();
		}
	}

	@Transactional
	public AccountResponse updateProfile(Authentication authentication, ProfileUpdateRequest request) {
		AppUserEntity user = userRepository.findByEmailIgnoreCase(authentication.getName())
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Account not found."));
		String phone = request.phone().replaceAll("[\\s-]", "");
		user.updateProfile(request.name(), phone);
		return AccountResponse.from(user);
	}
}
