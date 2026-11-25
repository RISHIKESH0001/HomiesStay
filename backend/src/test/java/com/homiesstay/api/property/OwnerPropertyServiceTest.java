package com.homiesstay.api.property;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.server.ResponseStatusException;

import com.homiesstay.api.user.AppUserEntity;
import com.homiesstay.api.user.AppUserRepository;
import com.homiesstay.api.user.UserRole;
import com.homiesstay.api.notification.NotificationService;

class OwnerPropertyServiceTest {
	private PropertyRepository propertyRepository;
	private PropertyMediaService mediaService;
	private AppUserRepository userRepository;
	private OwnerPropertyService propertyService;
	private Authentication authentication;

	@BeforeEach
	void setUp() {
		propertyRepository = mock(PropertyRepository.class);
		mediaService = mock(PropertyMediaService.class);
		when(mediaService.forProperty(any())).thenReturn(PropertyMedia.empty());
		userRepository = mock(AppUserRepository.class);
		propertyService = new OwnerPropertyService(propertyRepository, mediaService, userRepository, mock(NotificationService.class));
		authentication = mock(Authentication.class);
		when(authentication.getName()).thenReturn("owner@example.com");
		AppUserEntity owner = mock(AppUserEntity.class);
		when(owner.getId()).thenReturn(12L);
		when(owner.getRole()).thenReturn(UserRole.OWNER);
		when(userRepository.findByEmailIgnoreCase("owner@example.com")).thenReturn(Optional.of(owner));
	}

	@Test
	void createPropertyPersistsAnOwnerBoundDraft() {
		PropertyRequest request = validRequest(8, 5);
		when(propertyRepository.save(any(PropertyEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));

		OwnerPropertyResponse response = propertyService.createProperty(authentication, request);

		assertEquals("DRAFT", response.listingStatus());
		assertEquals("PENDING", response.reviewStatus());
		assertEquals("Owner Property", response.name());
		verify(propertyRepository).save(any(PropertyEntity.class));
	}

	@Test
	void createPropertyRejectsAvailableBedsAboveCapacity() {
		assertThrows(ResponseStatusException.class,
				() -> propertyService.createProperty(authentication, validRequest(4, 5)));

		verify(propertyRepository, never()).save(any(PropertyEntity.class));
	}

	@Test
	void ownerCanSubmitAnOwnedDraftForReview() {
		PropertyEntity property = PropertyEntity.create(12L, validRequest(8, 5));
		when(propertyRepository.findByIdAndOwnerId(31L, 12L)).thenReturn(Optional.of(property));

		OwnerPropertyResponse response = propertyService.submitForReview(authentication, 31L);

		assertEquals("PENDING_REVIEW", response.listingStatus());
		assertEquals("PENDING", response.reviewStatus());
	}

	@Test
	void propertyLookupDoesNotExposeListingsOwnedByAnotherUser() {
		when(propertyRepository.findByIdAndOwnerId(99L, 12L)).thenReturn(Optional.empty());

		ResponseStatusException exception = assertThrows(ResponseStatusException.class,
				() -> propertyService.getOwnedProperty(authentication, 99L));

		assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
	}

	private PropertyRequest validRequest(int capacity, int availableBeds) {
		return new PropertyRequest(
				"Owner Property", "Student Hostel", "UNISEX", "A real owner listing", null,
				"Central Area", "Bengaluru", "Karnataka", "560001", null, null,
				null, null, new BigDecimal("12500.00"), capacity, availableBeds, java.util.List.of(), java.util.List.of());
	}
}
