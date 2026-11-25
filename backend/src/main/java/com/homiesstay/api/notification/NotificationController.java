package com.homiesstay.api.notification;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/notifications")
public class NotificationController {
	private final NotificationService notificationService;

	public NotificationController(NotificationService notificationService) {
		this.notificationService = notificationService;
	}

	@GetMapping
	public NotificationPageResponse list(Authentication authentication, @RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "20") int size) {
		return notificationService.list(authentication, page, size);
	}

	@GetMapping("/unread-count")
	public long unreadCount(Authentication authentication) {
		return notificationService.unreadCount(authentication);
	}

	@PatchMapping("/{notificationId}/read")
	public void markRead(Authentication authentication, @PathVariable long notificationId) {
		notificationService.markRead(authentication, notificationId);
	}

	@PatchMapping("/read-all")
	public void markAllRead(Authentication authentication) {
		notificationService.markAllRead(authentication);
	}
}
