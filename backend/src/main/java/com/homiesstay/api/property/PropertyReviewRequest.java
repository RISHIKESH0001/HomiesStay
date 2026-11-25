package com.homiesstay.api.property;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record PropertyReviewRequest(
		@NotNull PropertyReviewDecision decision,
		@Size(max = 1000) String note) {
	@AssertTrue(message = "A note is required when requesting changes.")
	public boolean isNoteValid() {
		return decision != PropertyReviewDecision.REQUEST_CHANGES || (note != null && !note.isBlank());
	}
}
