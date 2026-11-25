package com.homiesstay.api.notification;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class NotificationService {
	private static final int MAX_PAGE_SIZE = 50;
	private final JdbcTemplate jdbcTemplate;

	public NotificationService(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	public void create(long recipientId, String eventType, String title, String message, String targetUrl) {
		jdbcTemplate.update("INSERT INTO user_notifications (recipient_user_id, event_type, title, message, target_url) VALUES (?, ?, ?, ?, ?)",
			recipientId, eventType, title, message, targetUrl);
	}

	public void createForAllAdmins(String eventType, String title, String message, String targetUrl) {
		jdbcTemplate.update("INSERT INTO user_notifications (recipient_user_id, event_type, title, message, target_url) SELECT id, ?, ?, ?, ? FROM app_users WHERE role = 'ADMIN' AND account_status = 'ACTIVE'",
			eventType, title, message, targetUrl);
	}

	@Transactional(readOnly = true)
	public NotificationPageResponse list(Authentication authentication, int page, int size) {
		validatePage(page, size);
		long userId = getUserId(authentication);
		Long total = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM user_notifications WHERE recipient_user_id = ?", Long.class, userId);
		Long unread = unreadCount(userId);
		List<NotificationResponse> content = jdbcTemplate.query(
			"SELECT id, event_type, title, message, target_url, is_read, created_at, read_at FROM user_notifications WHERE recipient_user_id = ? ORDER BY created_at DESC, id DESC LIMIT ? OFFSET ?",
			(rs, row) -> new NotificationResponse(rs.getLong("id"), rs.getString("event_type"), rs.getString("title"),
				rs.getString("message"), rs.getString("target_url"), rs.getBoolean("is_read"),
				rs.getTimestamp("created_at").toLocalDateTime(), rs.getTimestamp("read_at") == null ? null : rs.getTimestamp("read_at").toLocalDateTime()),
			userId, size, (long) page * size);
		int pages = (int) Math.ceil((total == null ? 0 : total) / (double) size);
		return new NotificationPageResponse(content, page, size, total == null ? 0 : total, pages, unread == null ? 0 : unread);
	}

	@Transactional(readOnly = true)
	public long unreadCount(Authentication authentication) {
		return unreadCount(getUserId(authentication));
	}

	@Transactional
	public void markRead(Authentication authentication, long notificationId) {
		int changed = jdbcTemplate.update("UPDATE user_notifications SET is_read = TRUE, read_at = CURRENT_TIMESTAMP(6) WHERE id = ? AND recipient_user_id = ? AND is_read = FALSE",
			notificationId, getUserId(authentication));
		if (changed == 0 && !exists(authentication, notificationId)) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Notification not found.");
		}
	}

	@Transactional
	public void markAllRead(Authentication authentication) {
		jdbcTemplate.update("UPDATE user_notifications SET is_read = TRUE, read_at = CURRENT_TIMESTAMP(6) WHERE recipient_user_id = ? AND is_read = FALSE",
			getUserId(authentication));
	}

	private boolean exists(Authentication authentication, long notificationId) {
		Integer count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM user_notifications WHERE id = ? AND recipient_user_id = ?",
			Integer.class, notificationId, getUserId(authentication));
		return count != null && count > 0;
	}

	private long getUserId(Authentication authentication) {
		List<Long> userIds = jdbcTemplate.query("SELECT id FROM app_users WHERE LOWER(email) = LOWER(?)", (rs, row) -> rs.getLong(1), authentication.getName());
		if (userIds.isEmpty()) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Account not found.");
		return userIds.get(0);
	}

	private long unreadCount(long userId) {
		Long count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM user_notifications WHERE recipient_user_id = ? AND is_read = FALSE", Long.class, userId);
		return count == null ? 0 : count;
	}

	private void validatePage(int page, int size) {
		if (page < 0 || size < 1 || size > MAX_PAGE_SIZE) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Page must be non-negative and size must be between 1 and " + MAX_PAGE_SIZE);
	}
}
