package com.homiesstay.api.auth;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Locale;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.homiesstay.api.user.AccountStatus;
import com.homiesstay.api.user.AppUserEntity;
import com.homiesstay.api.user.AppUserRepository;

@Service
public class EmailVerificationService {
	private static final int OTP_LENGTH = 6;
	private static final int MAX_FAILED_ATTEMPTS = 5;
	private static final Duration OTP_LIFETIME = Duration.ofMinutes(10);
	private static final Duration RESEND_COOLDOWN = Duration.ofSeconds(60);
	private static final SecureRandom SECURE_RANDOM = new SecureRandom();
	private final AppUserRepository userRepository;
	private final EmailVerificationCodeRepository codeRepository;
	private final PasswordEncoder passwordEncoder;
	private final JavaMailSender mailSender;
	private final String mailFrom;
	private final String publicUrl;

	public EmailVerificationService(
			AppUserRepository userRepository,
			EmailVerificationCodeRepository codeRepository,
			PasswordEncoder passwordEncoder,
			JavaMailSender mailSender,
			@Value("${app.mail.from}") String mailFrom,
			@Value("${app.public-url}") String publicUrl) {
		this.userRepository = userRepository;
		this.codeRepository = codeRepository;
		this.passwordEncoder = passwordEncoder;
		this.mailSender = mailSender;
		this.mailFrom = mailFrom;
		this.publicUrl = publicUrl;
	}

	@Transactional
	public EmailOtpVerificationResponse issueRegistrationCode(AppUserEntity user) {
		String otp = createOtp();
		LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);
		EmailVerificationCodeEntity code = codeRepository.findByUserId(user.getId())
				.map(existing -> {
					existing.rotate(passwordEncoder.encode(otp), now, now.plus(OTP_LIFETIME));
					return existing;
				})
				.orElseGet(() -> EmailVerificationCodeEntity.create(user.getId(), passwordEncoder.encode(otp), now, now.plus(OTP_LIFETIME)));
		codeRepository.save(code);
		sendOtp(user, otp);
		return new EmailOtpVerificationResponse(false, "A verification code has been sent to your email address.");
	}

	@Transactional
	public EmailOtpVerificationResponse verify(VerifyEmailRequest request) {
		AppUserEntity user = userRepository.findByEmailIgnoreCase(request.email().trim()).orElse(null);
		if (user == null) {
			return invalidCodeResponse();
		}
		if (user.getAccountStatus() == AccountStatus.ACTIVE) {
			return new EmailOtpVerificationResponse(true, "Your email address is already verified.");
		}
		EmailVerificationCodeEntity code = codeRepository.findByUserId(user.getId()).orElse(null);
		LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);
		if (code == null || !code.getExpiresAt().isAfter(now) || code.getFailedAttempts() >= MAX_FAILED_ATTEMPTS) {
			return invalidCodeResponse();
		}
		if (!passwordEncoder.matches(request.otp(), code.getOtpHash())) {
			code.recordFailedAttempt();
			return invalidCodeResponse();
		}
		user.activate();
		codeRepository.delete(code);
		return new EmailOtpVerificationResponse(true, "Email verified. You can now log in.");
	}

	@Transactional
	public void resend(String email) {
		AppUserEntity user = userRepository.findByEmailIgnoreCase(email.trim()).orElse(null);
		if (user == null || user.getAccountStatus() != AccountStatus.PENDING) {
			return;
		}
		LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);
		EmailVerificationCodeEntity existingCode = codeRepository.findByUserId(user.getId()).orElse(null);
		if (existingCode != null && existingCode.getLastSentAt().plus(RESEND_COOLDOWN).isAfter(now)) {
			return;
		}
		issueRegistrationCode(user);
	}

	private void sendOtp(AppUserEntity user, String otp) {
		SimpleMailMessage message = new SimpleMailMessage();
		message.setFrom(mailFrom);
		message.setTo(user.getEmail());
		message.setSubject("Verify your Homies Stay email");
		message.setText("Your Homies Stay verification code is " + otp
				+ ". It expires in 10 minutes. If you did not create this account, you can ignore this email.\n\n"
				+ publicUrl);
		mailSender.send(message);
	}

	private String createOtp() {
		return String.format(Locale.ROOT, "%0" + OTP_LENGTH + "d", SECURE_RANDOM.nextInt(1_000_000));
	}

	private EmailOtpVerificationResponse invalidCodeResponse() {
		return new EmailOtpVerificationResponse(false, "The verification code is invalid, expired, or unavailable.");
	}
}
