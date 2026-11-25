package com.homiesstay.api.user;

import java.util.Optional;

import jakarta.persistence.LockModeType;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.transaction.annotation.Transactional;

public interface AppUserRepository extends JpaRepository<AppUserEntity, Long> {
	Optional<AppUserEntity> findByEmailIgnoreCase(String email);

	Optional<AppUserEntity> findByEmailIgnoreCaseOrUsernameIgnoreCase(String email, String username);

	boolean existsByEmailIgnoreCase(String email);

	boolean existsByUsernameIgnoreCase(String username);

	@Lock(LockModeType.PESSIMISTIC_WRITE)
	@Query("select account from AppUserEntity account where account.id = :id")
	Optional<AppUserEntity> findByIdForUpdate(@Param("id") Long id);

	@Query("""
			select account from AppUserEntity account
			where (:search is null or lower(account.displayName) like lower(concat('%', :search, '%'))
				or lower(account.username) like lower(concat('%', :search, '%'))
				or lower(account.email) like lower(concat('%', :search, '%')))
			and (:role is null or account.role = :role)
			and (:status is null or account.accountStatus = :status)
			order by account.createdAt desc, account.id desc
			""")
	Page<AppUserEntity> searchAdminAccounts(@Param("search") String search, @Param("role") UserRole role,
			@Param("status") AccountStatus status, Pageable pageable);

	@Modifying
	@Transactional
	@Query(value = "UPDATE app_users SET account_status = 'ACTIVE', suspended_until = NULL "
			+ "WHERE account_status = 'SUSPENDED' AND suspended_until IS NOT NULL AND suspended_until <= :now",
			nativeQuery = true)
	int restoreExpiredSuspensions(@Param("now") java.time.LocalDateTime now);
}
