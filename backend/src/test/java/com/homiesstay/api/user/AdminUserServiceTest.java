package com.homiesstay.api.user;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;
import java.time.Instant;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.Authentication;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.test.util.ReflectionTestUtils;

class AdminUserServiceTest {
	private AppUserRepository appUserRepository;
	private JdbcTemplate jdbcTemplate;
	private ApplicationEventPublisher eventPublisher;
	private AdminUserService adminUserService;

	@BeforeEach
	void setUp() {
		appUserRepository = mock(AppUserRepository.class);
		jdbcTemplate = mock(JdbcTemplate.class);
		eventPublisher = mock(ApplicationEventPublisher.class);
		adminUserService = new AdminUserService(appUserRepository, jdbcTemplate, eventPublisher);
	}

	@Test
	void listsSafeAccountSummariesAndNormalizesSearch() {
		AppUserEntity account = AppUserEntity.create("student@example.com", "student1", "secret-hash", "Student",
				"9876543210", UserRole.STUDENT);
		when(appUserRepository.searchAdminAccounts(eq("student"), eq(UserRole.STUDENT), eq(AccountStatus.ACTIVE),
				eq(PageRequest.of(0, 20)))).thenReturn(new PageImpl<>(List.of(account)));

		AdminUserPageResponse response = adminUserService.listAccounts(0, 20, " student ", UserRole.STUDENT,
				AccountStatus.ACTIVE);

		assertEquals(1, response.totalElements());
		assertEquals("student@example.com", response.content().getFirst().email());
		assertEquals("STUDENT", response.content().getFirst().role());
		verify(appUserRepository).searchAdminAccounts("student", UserRole.STUDENT, AccountStatus.ACTIVE,
				PageRequest.of(0, 20));
	}

	@Test
	void suspensionRevokesSessionsAndPublishesNoticeAfterCommit() {
		AppUserEntity admin = account(1L, "admin@example.com", "admin", UserRole.ADMIN);
		AppUserEntity target = account(2L, "student@example.com", "student", UserRole.STUDENT);
		when(appUserRepository.findByEmailIgnoreCase("admin@example.com")).thenReturn(Optional.of(admin));
		when(appUserRepository.findByIdForUpdate(2L)).thenReturn(Optional.of(target));
		when(appUserRepository.save(target)).thenReturn(target);

		AdminUserResponse response = adminUserService.suspendAccount(2L,
				new AdminUserSuspensionRequest(Instant.now().plusSeconds(3600), "Repeated policy violations."),
				authentication("admin@example.com"));

		assertEquals("SUSPENDED", response.accountStatus());
		assertEquals(2L, response.id());
		verify(jdbcTemplate).update(eq("DELETE FROM SPRING_SESSION WHERE LOWER(PRINCIPAL_NAME) = ?"), eq("student@example.com"));
		verify(eventPublisher).publishEvent(any(AdminAccountSuspendedEvent.class));
	}

	@Test
	void terminationDeletesLinkedListingsAndApplicationsAndRevokesSessions() {
		AppUserEntity admin = account(1L, "admin@example.com", "admin", UserRole.ADMIN);
		AppUserEntity target = account(2L, "owner@example.com", "owner", UserRole.OWNER);
		when(appUserRepository.findByEmailIgnoreCase("admin@example.com")).thenReturn(Optional.of(admin));
		when(appUserRepository.findByIdForUpdate(2L)).thenReturn(Optional.of(target));

		adminUserService.terminateAccount(2L, new AdminUserTerminationRequest("owner", "Owner requested account removal."),
				authentication("admin@example.com"));

		verify(jdbcTemplate).update(eq("DELETE FROM SPRING_SESSION WHERE LOWER(PRINCIPAL_NAME) = ?"), eq("owner@example.com"));
		verify(jdbcTemplate).update(eq("DELETE FROM student_applications WHERE student_id = ? OR property_id IN "
				+ "(SELECT id FROM properties WHERE owner_id = ?)"), eq(2L), eq(2L));
		verify(jdbcTemplate).update(eq("DELETE FROM properties WHERE owner_id = ?"), eq(2L));
		verify(appUserRepository).delete(target);
	}

	@Test
	void administratorCannotTerminateTheirOwnAccount() {
		AppUserEntity admin = account(1L, "admin@example.com", "admin", UserRole.ADMIN);
		when(appUserRepository.findByEmailIgnoreCase("admin@example.com")).thenReturn(Optional.of(admin));
		when(appUserRepository.findByIdForUpdate(1L)).thenReturn(Optional.of(admin));

		assertThrows(org.springframework.web.server.ResponseStatusException.class,
				() -> adminUserService.terminateAccount(1L,
						new AdminUserTerminationRequest("admin", "Testing protection."), authentication("admin@example.com")));
		verify(jdbcTemplate, never()).update(any(String.class), any(Object[].class));
	}

	private AppUserEntity account(Long id, String email, String username, UserRole role) {
		AppUserEntity account = AppUserEntity.create(email, username, "hash", "Display Name", null, role);
		ReflectionTestUtils.setField(account, "id", id);
		account.activate();
		return account;
	}

	private Authentication authentication(String name) {
		Authentication authentication = mock(Authentication.class);
		when(authentication.getName()).thenReturn(name);
		return authentication;
	}
}
