package com.homiesstay.api.auth;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PasswordResetCodeRepository extends JpaRepository<PasswordResetCodeEntity, Long> {
	Optional<PasswordResetCodeEntity> findByUserId(Long userId);

	void deleteByUserId(Long userId);
}
