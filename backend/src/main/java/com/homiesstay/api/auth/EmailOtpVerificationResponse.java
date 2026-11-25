package com.homiesstay.api.auth;

public record EmailOtpVerificationResponse(boolean verified, String message) {
}
