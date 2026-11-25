package com.homiesstay.api.notification;

import java.util.List;

public record NotificationPageResponse(List<NotificationResponse> content, int page, int size,
		long totalElements, int totalPages, long unreadCount) {
}
