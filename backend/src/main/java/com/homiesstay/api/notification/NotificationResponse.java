package com.homiesstay.api.notification;

import java.time.LocalDateTime;

public record NotificationResponse(Long id, String eventType, String title, String message,
		String targetUrl, boolean read, LocalDateTime createdAt, LocalDateTime readAt) {
}
