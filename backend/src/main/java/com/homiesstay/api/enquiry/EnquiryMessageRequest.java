package com.homiesstay.api.enquiry;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record EnquiryMessageRequest(@NotBlank @Size(max = 2000) String message) {
}
