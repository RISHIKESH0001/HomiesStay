package com.homiesstay.api.user;

import java.util.List;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Locale;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.Authentication;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AdminUserService {
	private static final int MAX_PAGE_SIZE = 50;
	private final AppUserRepository appUserRepository;
	private final JdbcTemplate jdbcTemplate;
	private final ApplicationEventPublisher eventPublisher;

	public AdminUserService(AppUserRepository appUserRepository, JdbcTemplate jdbcTemplate,
			ApplicationEventPublisher eventPublisher) {
		this.appUserRepository = appUserRepository;
		this.jdbcTemplate = jdbcTemplate;
		this.eventPublisher = eventPublisher;
	}

	@Transactional
	public AdminUserPageResponse listAccounts(int page, int size, String search, UserRole role, AccountStatus status) {
		if (page < 0 || size < 1 || size > MAX_PAGE_SIZE) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
					"Page must be non-negative and size must be between 1 and " + MAX_PAGE_SIZE);
		}
		String normalizedSearch = search == null || search.isBlank() ? null : search.trim();
		if (normalizedSearch != null && normalizedSearch.length() > 100) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Search must not exceed 100 characters.");
		}
		appUserRepository.restoreExpiredSuspensions(LocalDateTime.now(ZoneOffset.UTC));
		Page<AppUserEntity> accounts = appUserRepository.searchAdminAccounts(normalizedSearch, role, status,
				PageRequest.of(page, size));
		List<AdminUserResponse> content = accounts.getContent().stream().map(AdminUserResponse::from).toList();
		return new AdminUserPageResponse(content, accounts.getNumber(), accounts.getSize(),
				accounts.getTotalElements(), accounts.getTotalPages());
	}

	@Transactional
	public AdminUserResponse suspendAccount(Long targetId, AdminUserSuspensionRequest request,
			Authentication authentication) {
		AppUserEntity admin = findAdmin(authentication);
		AppUserEntity target = findTarget(targetId);
		ensureManageableTarget(admin, target);
		if (target.getAccountStatus() != AccountStatus.ACTIVE) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Only active accounts can be suspended.");
		}
		LocalDateTime until = LocalDateTime.ofInstant(request.suspendedUntil(), ZoneOffset.UTC);
		if (!until.isAfter(LocalDateTime.now(ZoneOffset.UTC))) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Suspension end time must be in the future.");
		}
		writeAudit(admin, target, "SUSPEND", request.reason().trim(), until);
		target.suspendUntil(until);
		AppUserEntity savedTarget = appUserRepository.save(target);
		revokeSessions(target.getEmail());
		eventPublisher.publishEvent(new AdminAccountSuspendedEvent(target.getEmail(),
				until.toInstant(ZoneOffset.UTC), request.reason().trim()));
		return AdminUserResponse.from(savedTarget);
	}

	@Transactional
	public AdminUserResponse liftSuspension(Long targetId, String reason, Authentication authentication) {
		AppUserEntity admin = findAdmin(authentication);
		AppUserEntity target = findTarget(targetId);
		ensureManageableTarget(admin, target);
		if (target.getAccountStatus() != AccountStatus.SUSPENDED) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "This account is not suspended.");
		}
		writeAudit(admin, target, "LIFT_SUSPENSION", reason.trim(), null);
		target.liftSuspension();
		return AdminUserResponse.from(appUserRepository.save(target));
	}

	@Transactional
	public void terminateAccount(Long targetId, AdminUserTerminationRequest request, Authentication authentication) {
		AppUserEntity admin = findAdmin(authentication);
		AppUserEntity target = findTarget(targetId);
		ensureManageableTarget(admin, target);
		if (!target.getUsername().equals(request.confirmation())) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Type the account username exactly to confirm deletion.");
		}
		writeAudit(admin, target, "TERMINATE", request.reason().trim(), null);
		revokeSessions(target.getEmail());
		jdbcTemplate.update("DELETE FROM student_applications WHERE student_id = ? OR property_id IN "
				+ "(SELECT id FROM properties WHERE owner_id = ?)", targetId, targetId);
		jdbcTemplate.update("DELETE FROM properties WHERE owner_id = ?", targetId);
		appUserRepository.delete(target);
	}

	private AppUserEntity findAdmin(Authentication authentication) {
		return appUserRepository.findByEmailIgnoreCase(authentication.getName())
				.filter(account -> account.getRole() == UserRole.ADMIN && account.getAccountStatus() == AccountStatus.ACTIVE)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "An active administrator account is required."));
	}

	private AppUserEntity findTarget(Long targetId) {
		return appUserRepository.findByIdForUpdate(targetId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Account not found."));
	}

	private void ensureManageableTarget(AppUserEntity admin, AppUserEntity target) {
		if (admin.getId().equals(target.getId())) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Administrators cannot change or delete their own account here.");
		}
		if (target.getRole() == UserRole.ADMIN) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Administrator accounts cannot be managed through this workspace.");
		}
	}

	private void writeAudit(AppUserEntity admin, AppUserEntity target, String action, String reason,
			LocalDateTime suspendedUntil) {
		jdbcTemplate.update("INSERT INTO admin_user_actions "
				+ "(admin_user_id, target_user_id, action, reason, suspended_until) VALUES (?, ?, ?, ?, ?)",
				admin.getId(), target.getId(), action, reason, suspendedUntil);
	}

	private void revokeSessions(String email) {
		jdbcTemplate.update("DELETE FROM SPRING_SESSION WHERE LOWER(PRINCIPAL_NAME) = ?", email.toLowerCase(Locale.ROOT));
	}
}
