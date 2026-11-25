package com.homiesstay.api.user;

import java.time.Instant;

public record AdminAccountSuspendedEvent(String recipient, Instant suspendedUntil, String reason) {
}
