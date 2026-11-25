package com.homiesstay.api.property;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import com.homiesstay.api.user.AppUserRepository;
import com.homiesstay.api.notification.NotificationService;

class AdminPropertyServiceTest {
	private PropertyRepository propertyRepository;
	private PropertyMediaService mediaService;
	private AppUserRepository appUserRepository;
	private AdminPropertyService propertyService;

	@BeforeEach
	void setUp() {
		propertyRepository = mock(PropertyRepository.class);
		mediaService = mock(PropertyMediaService.class);
		appUserRepository = mock(AppUserRepository.class);
		when(mediaService.forProperty(any())).thenReturn(PropertyMedia.empty());
		when(appUserRepository.findAllById(any())).thenReturn(java.util.List.of());
		propertyService = new AdminPropertyService(propertyRepository, mediaService, appUserRepository, mock(NotificationService.class));
	}

	@Test
	void approvalPublishesAPropertyAndClearsReviewNote() {
		PropertyEntity property = pendingProperty();
		when(propertyRepository.findById(31L)).thenReturn(Optional.of(property));

		OwnerPropertyResponse response = propertyService.reviewProperty(31L,
				new PropertyReviewRequest(PropertyReviewDecision.APPROVE, null));

		assertEquals("LIVE", response.listingStatus());
		assertEquals("APPROVED", response.reviewStatus());
	}

	@Test
	void changeRequestReturnsListingToTheOwnerWithAReason() {
		PropertyEntity property = pendingProperty();
		when(propertyRepository.findById(31L)).thenReturn(Optional.of(property));

		OwnerPropertyResponse response = propertyService.reviewProperty(31L,
				new PropertyReviewRequest(PropertyReviewDecision.REQUEST_CHANGES, "Add room photographs."));

		assertEquals("DRAFT", response.listingStatus());
		assertEquals("CHANGES_REQUESTED", response.reviewStatus());
		assertEquals("Add room photographs.", response.reviewNote());
	}

	private PropertyEntity pendingProperty() {
		PropertyRequest request = new PropertyRequest("Reviewed Property", "Student Hostel", "UNISEX",
				"Description", null, "Central Area", "Bengaluru", "Karnataka", "560001", null, null,
				null, null, new BigDecimal("12500.00"), 8, 5, java.util.List.of(), java.util.List.of());
		PropertyEntity property = PropertyEntity.create(12L, request);
		property.submitForReview();
		return property;
	}
}
