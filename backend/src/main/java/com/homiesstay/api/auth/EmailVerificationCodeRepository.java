package com.homiesstay.api.auth;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface EmailVerificationCodeRepository extends JpaRepository<EmailVerificationCodeEntity, Long> {
	Optional<EmailVerificationCodeEntity> findByUserId(Long userId);

	void deleteByUserId(Long userId);
}
