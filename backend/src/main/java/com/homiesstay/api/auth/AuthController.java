package com.homiesstay.api.auth;

import java.time.Duration;
import java.util.Map;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.homiesstay.api.user.AppUserEntity;
import com.homiesstay.api.user.AppUserRepository;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
	private final AuthService authService;
	private final AuthRateLimitService authRateLimitService;
	private final PasswordResetService passwordResetService;
	private final ProfilePictureService profilePictureService;
	private final EmailVerificationService emailVerificationService;
	private final AuthenticationManager authenticationManager;
	private final AppUserRepository userRepository;
	private final SecurityContextRepository securityContextRepository;

	public AuthController(
			AuthService authService,
			AuthRateLimitService authRateLimitService,
			PasswordResetService passwordResetService,
			ProfilePictureService profilePictureService,
			EmailVerificationService emailVerificationService,
			AuthenticationManager authenticationManager,
			AppUserRepository userRepository,
			SecurityContextRepository securityContextRepository) {
		this.authService = authService;
		this.authRateLimitService = authRateLimitService;
		this.passwordResetService = passwordResetService;
		this.profilePictureService = profilePictureService;
		this.emailVerificationService = emailVerificationService;
		this.authenticationManager = authenticationManager;
		this.userRepository = userRepository;
		this.securityContextRepository = securityContextRepository;
	}

	@GetMapping("/csrf")
	public Map<String, String> csrf(CsrfToken csrfToken) {
		return Map.of("headerName", csrfToken.getHeaderName(), "token", csrfToken.getToken());
	}

	@PostMapping("/register")
	public ResponseEntity<AccountResponse> register(@Valid @RequestBody RegisterRequest request, HttpServletRequest servletRequest) {
		authRateLimitService.enforce("register", servletRequest.getRemoteAddr(), "all", 20, Duration.ofHours(1));
		return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
	}

	@PostMapping("/verify-email")
	public EmailOtpVerificationResponse verifyEmail(@Valid @RequestBody VerifyEmailRequest request, HttpServletRequest servletRequest) {
		authRateLimitService.enforce("verify-email", servletRequest.getRemoteAddr(), request.email(), 10, Duration.ofMinutes(15));
		return emailVerificationService.verify(request);
	}

	@PostMapping("/resend-verification-otp")
	public ResponseEntity<Map<String, String>> resendVerificationOtp(@Valid @RequestBody ResendVerificationRequest request, HttpServletRequest servletRequest) {
		authRateLimitService.enforce("resend-verification", servletRequest.getRemoteAddr(), request.email(), 5, Duration.ofHours(1));
		emailVerificationService.resend(request.email());
		return ResponseEntity.accepted().body(Map.of("message", "If the account needs verification, a code will be sent when eligible."));
	}

	@PostMapping("/forgot-password")
	public ResponseEntity<Map<String, String>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request, HttpServletRequest servletRequest) {
		authRateLimitService.enforce("forgot-password", servletRequest.getRemoteAddr(), request.email(), 5, Duration.ofHours(1));
		passwordResetService.requestReset(request.email());
		return ResponseEntity.accepted().body(Map.of("message", "If an active account exists for that email, a reset code will be sent when eligible."));
	}

	@PostMapping("/reset-password")
	public EmailOtpVerificationResponse resetPassword(@Valid @RequestBody ResetPasswordRequest request, HttpServletRequest servletRequest) {
		authRateLimitService.enforce("reset-password", servletRequest.getRemoteAddr(), request.email(), 10, Duration.ofMinutes(15));
		return passwordResetService.reset(request);
	}

	@PostMapping("/login")
	public AccountResponse login(
			@Valid @RequestBody LoginRequest request,
			HttpServletRequest servletRequest,
			HttpServletResponse servletResponse) {
		authRateLimitService.enforce("login", servletRequest.getRemoteAddr(), request.identifier(), 10, Duration.ofMinutes(15));
		Authentication authentication = authenticationManager.authenticate(
				UsernamePasswordAuthenticationToken.unauthenticated(request.identifier().trim(), request.password()));

		if (servletRequest.getSession(false) == null) {
			servletRequest.getSession(true);
		}
		servletRequest.changeSessionId();
		SecurityContext context = SecurityContextHolder.createEmptyContext();
		context.setAuthentication(authentication);
		SecurityContextHolder.setContext(context);
		securityContextRepository.saveContext(context, servletRequest, servletResponse);

		return AccountResponse.from(findAccount(authentication));
	}

	@GetMapping("/me")
	public AccountResponse currentAccount(Authentication authentication) {
		return AccountResponse.from(findAccount(authentication));
	}

	@PatchMapping("/profile")
	public AccountResponse updateProfile(Authentication authentication, @Valid @RequestBody ProfileUpdateRequest request) {
		return authService.updateProfile(authentication, request);
	}

	@PostMapping(value = "/profile-picture", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public AccountResponse updateProfilePicture(Authentication authentication, @RequestParam("file") MultipartFile file) {
		return profilePictureService.save(authentication, file);
	}

	@GetMapping("/profile-picture")
	public ResponseEntity<byte[]> profilePicture(Authentication authentication) {
		return ResponseEntity.ok()
				.contentType(MediaType.IMAGE_JPEG)
				.cacheControl(CacheControl.noCache().cachePrivate())
				.body(profilePictureService.load(authentication));
	}

	@PostMapping("/logout")
	public ResponseEntity<Void> logout(
			Authentication authentication,
			HttpServletRequest servletRequest,
			HttpServletResponse servletResponse) {
		new SecurityContextLogoutHandler().logout(servletRequest, servletResponse, authentication);
		return ResponseEntity.noContent().build();
	}

	private AppUserEntity findAccount(Authentication authentication) {
		String email = ((UserDetails) authentication.getPrincipal()).getUsername();
		return userRepository.findByEmailIgnoreCase(email).orElseThrow();
	}
}
