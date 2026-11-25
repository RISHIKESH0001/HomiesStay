package com.homiesstay.api.auth;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class AuthExceptionHandler {
	private static final Logger LOGGER = LoggerFactory.getLogger(AuthExceptionHandler.class);
	private final String adminContactEmail;

	public AuthExceptionHandler(@Value("${app.admin-contact-email}") String adminContactEmail) {
		this.adminContactEmail = adminContactEmail;
	}

	@ExceptionHandler(AccountAlreadyExistsException.class)
	public ResponseEntity<Map<String, String>> handleAccountAlreadyExists() {
		return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "An account with this email or username already exists."));
	}

	@ExceptionHandler(BadCredentialsException.class)
	public ResponseEntity<Map<String, String>> handleBadCredentials() {
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
				"message", "Invalid email or password. If you believe your account access is restricted, contact the administrator.",
				"adminContactEmail", adminContactEmail));
	}

	@ExceptionHandler(MailException.class)
	public ResponseEntity<Map<String, String>> handleMailFailure(MailException exception) {
		LOGGER.warn("Email verification message could not be delivered", exception);
		return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
				.body(Map.of("message", "Email delivery is unavailable. Check the API SMTP configuration and try again."));
	}
}
