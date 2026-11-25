package com.homiesstay.api.auth;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Locale;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.homiesstay.api.user.AccountStatus;
import com.homiesstay.api.user.AppUserEntity;
import com.homiesstay.api.user.AppUserRepository;

@Service
public class PasswordResetService {
	private static final Logger LOGGER = LoggerFactory.getLogger(PasswordResetService.class);
	private static final int MAX_FAILED_ATTEMPTS = 5;
	private static final Duration CODE_LIFETIME = Duration.ofMinutes(10);
	private static final Duration RESEND_COOLDOWN = Duration.ofSeconds(60);
	private static final SecureRandom SECURE_RANDOM = new SecureRandom();
	private final AppUserRepository userRepository;
	private final PasswordResetCodeRepository codeRepository;
	private final PasswordEncoder passwordEncoder;
	private final JavaMailSender mailSender;
	private final JdbcTemplate jdbcTemplate;
	private final String mailFrom;
	private final String publicUrl;

	public PasswordResetService(
			AppUserRepository userRepository,
			PasswordResetCodeRepository codeRepository,
			PasswordEncoder passwordEncoder,
			JavaMailSender mailSender,
			JdbcTemplate jdbcTemplate,
			@Value("${app.mail.from}") String mailFrom,
			@Value("${app.public-url}") String publicUrl) {
		this.userRepository = userRepository;
		this.codeRepository = codeRepository;
		this.passwordEncoder = passwordEncoder;
		this.mailSender = mailSender;
		this.jdbcTemplate = jdbcTemplate;
		this.mailFrom = mailFrom;
		this.publicUrl = publicUrl;
	}

	@Transactional
	public void requestReset(String email) {
		AppUserEntity user = userRepository.findByEmailIgnoreCase(email.trim()).orElse(null);
		if (user == null || user.getAccountStatus() != AccountStatus.ACTIVE) {
			return;
		}
		LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);
		PasswordResetCodeEntity existingCode = codeRepository.findByUserId(user.getId()).orElse(null);
		if (existingCode != null && existingCode.getLastSentAt().plus(RESEND_COOLDOWN).isAfter(now)) {
			return;
		}
		String otp = createOtp();
		PasswordResetCodeEntity code = existingCode == null
				? PasswordResetCodeEntity.create(user.getId(), passwordEncoder.encode(otp), now, now.plus(CODE_LIFETIME))
				: existingCode;
		if (existingCode != null) {
			code.rotate(passwordEncoder.encode(otp), now, now.plus(CODE_LIFETIME));
		}
		codeRepository.save(code);
		try {
			sendOtp(user, otp);
		} catch (MailException exception) {
			LOGGER.warn("Password reset message could not be delivered");
		}
	}

	@Transactional
	public EmailOtpVerificationResponse reset(ResetPasswordRequest request) {
		AppUserEntity user = userRepository.findByEmailIgnoreCase(request.email().trim()).orElse(null);
		if (user == null || user.getAccountStatus() != AccountStatus.ACTIVE) {
			return invalidCodeResponse();
		}
		PasswordResetCodeEntity code = codeRepository.findByUserId(user.getId()).orElse(null);
		LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);
		if (code == null || !code.getExpiresAt().isAfter(now) || code.getFailedAttempts() >= MAX_FAILED_ATTEMPTS) {
			return invalidCodeResponse();
		}
		if (!passwordEncoder.matches(request.otp(), code.getOtpHash())) {
			code.recordFailedAttempt();
			return invalidCodeResponse();
		}
		user.updatePasswordHash(passwordEncoder.encode(request.newPassword()));
		codeRepository.delete(code);
		jdbcTemplate.update("DELETE FROM SPRING_SESSION WHERE PRINCIPAL_NAME = ?", user.getEmail());
		return new EmailOtpVerificationResponse(true, "Password updated. Your active sessions were signed out.");
	}

	private void sendOtp(AppUserEntity user, String otp) {
		SimpleMailMessage message = new SimpleMailMessage();
		message.setFrom(mailFrom);
		message.setTo(user.getEmail());
		message.setSubject("Reset your Homies Stay password");
		message.setText("Your Homies Stay password reset code is " + otp
				+ ". It expires in 10 minutes. If you did not request this, you can ignore this email.\n\n"
				+ publicUrl);
		mailSender.send(message);
	}

	private String createOtp() {
		return String.format(Locale.ROOT, "%06d", SECURE_RANDOM.nextInt(1_000_000));
	}

	private EmailOtpVerificationResponse invalidCodeResponse() {
		return new EmailOtpVerificationResponse(false, "The reset code is invalid, expired, or unavailable.");
	}
}
