package com.homiesstay.api.auth;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.util.HexFormat;
import java.util.Locale;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@Service
public class AuthRateLimitService {
	private final JdbcTemplate jdbcTemplate;

	public AuthRateLimitService(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	@Transactional
	public void enforce(String action, String clientAddress, String subject, int limit, Duration window) {
		String key = hash(action + "|" + clientAddress + "|" + subject.trim().toLowerCase(Locale.ROOT));
		long windowSeconds = window.toSeconds();
		jdbcTemplate.update("""
				INSERT INTO auth_rate_limits (bucket_key, window_started_at, request_count, updated_at)
				VALUES (?, UTC_TIMESTAMP(6), 1, UTC_TIMESTAMP(6))
				ON DUPLICATE KEY UPDATE
				request_count = IF(window_started_at <= DATE_SUB(UTC_TIMESTAMP(6), INTERVAL ? SECOND), 1, request_count + 1),
				window_started_at = IF(window_started_at <= DATE_SUB(UTC_TIMESTAMP(6), INTERVAL ? SECOND), UTC_TIMESTAMP(6), window_started_at),
				updated_at = UTC_TIMESTAMP(6)
				""", key, windowSeconds, windowSeconds);
		Integer count = jdbcTemplate.queryForObject(
				"SELECT request_count FROM auth_rate_limits WHERE bucket_key = ?", Integer.class, key);
		if (count != null && count > limit) {
			throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS,
					"Too many attempts. Wait before trying again.");
		}
	}

	@Scheduled(cron = "0 17 3 * * *", zone = "UTC")
	public void removeExpiredBuckets() {
		jdbcTemplate.update("DELETE FROM auth_rate_limits WHERE updated_at < DATE_SUB(UTC_TIMESTAMP(6), INTERVAL 48 HOUR)");
	}

	private String hash(String value) {
		try {
			return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(value.getBytes(StandardCharsets.UTF_8)));
		} catch (NoSuchAlgorithmException exception) {
			throw new IllegalStateException("SHA-256 is unavailable", exception);
		}
	}
}
