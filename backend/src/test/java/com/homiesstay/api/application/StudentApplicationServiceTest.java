package com.homiesstay.api.application;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.server.ResponseStatusException;

import com.homiesstay.api.property.PropertyEntity;
import com.homiesstay.api.property.PropertyListingStatus;
import com.homiesstay.api.property.PropertyRepository;
import com.homiesstay.api.property.PropertyReviewStatus;
import com.homiesstay.api.user.AppUserEntity;
import com.homiesstay.api.user.AppUserRepository;
import com.homiesstay.api.user.UserRole;
import com.homiesstay.api.notification.NotificationService;

class StudentApplicationServiceTest {
	private StudentApplicationRepository applicationRepository;
	private AppUserRepository userRepository;
	private PropertyRepository propertyRepository;
	private StudentApplicationService applicationService;
	private Authentication authentication;
	private AppUserEntity student;

	@BeforeEach
	void setUp() {
		applicationRepository = mock(StudentApplicationRepository.class);
		userRepository = mock(AppUserRepository.class);
		propertyRepository = mock(PropertyRepository.class);
		applicationService = new StudentApplicationService(applicationRepository, userRepository, propertyRepository, mock(NotificationService.class));
		authentication = mock(Authentication.class);
		when(authentication.getName()).thenReturn("student@example.com");
		student = mock(AppUserEntity.class);
		when(student.getId()).thenReturn(7L);
		when(student.getRole()).thenReturn(UserRole.STUDENT);
		when(userRepository.findByEmailIgnoreCase("student@example.com")).thenReturn(Optional.of(student));
	}

	@Test
	void applyPersistsAnApplicationForAnApprovedLiveProperty() {
		PropertyEntity property = mock(PropertyEntity.class);
		when(property.getId()).thenReturn(22L);
		when(property.getOwnerId()).thenReturn(12L);
		when(property.getAvailableBeds()).thenReturn(2);
		when(propertyRepository.findByIdAndListingStatusAndReviewStatus(
				22L, PropertyListingStatus.LIVE, PropertyReviewStatus.APPROVED)).thenReturn(Optional.of(property));
		when(applicationRepository.saveAndFlush(any(StudentApplicationEntity.class)))
				.thenAnswer(invocation -> invocation.getArgument(0));

		StudentApplicationResponse response = applicationService.apply(authentication, 22L, validRequest());

		assertEquals(ApplicationStatus.SUBMITTED, response.status());
		assertEquals(22L, response.propertyId());
		verify(applicationRepository).saveAndFlush(any(StudentApplicationEntity.class));
	}

	@Test
	void applyRejectsAPropertyThatIsNotLiveAndApproved() {
		when(propertyRepository.findByIdAndListingStatusAndReviewStatus(
				22L, PropertyListingStatus.LIVE, PropertyReviewStatus.APPROVED)).thenReturn(Optional.empty());

		ResponseStatusException exception = assertThrows(ResponseStatusException.class,
				() -> applicationService.apply(authentication, 22L, validRequest()));

		assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
		verify(applicationRepository, never()).saveAndFlush(any(StudentApplicationEntity.class));
	}

	@Test
	void applyRejectsDuplicateStudentAndPropertyPairs() {
		PropertyEntity property = mock(PropertyEntity.class);
		when(property.getOwnerId()).thenReturn(12L);
		when(property.getAvailableBeds()).thenReturn(1);
		when(propertyRepository.findByIdAndListingStatusAndReviewStatus(
				22L, PropertyListingStatus.LIVE, PropertyReviewStatus.APPROVED)).thenReturn(Optional.of(property));
		when(applicationRepository.existsByStudent_IdAndProperty_Id(7L, 22L)).thenReturn(true);

		ResponseStatusException exception = assertThrows(ResponseStatusException.class,
				() -> applicationService.apply(authentication, 22L, validRequest()));

		assertEquals(HttpStatus.CONFLICT, exception.getStatusCode());
		verify(applicationRepository, never()).saveAndFlush(any(StudentApplicationEntity.class));
	}

	@Test
	void applyRejectsAnOwnersOwnProperty() {
		PropertyEntity property = mock(PropertyEntity.class);
		when(property.getOwnerId()).thenReturn(7L);
		when(propertyRepository.findByIdAndListingStatusAndReviewStatus(
				22L, PropertyListingStatus.LIVE, PropertyReviewStatus.APPROVED)).thenReturn(Optional.of(property));

		ResponseStatusException exception = assertThrows(ResponseStatusException.class,
				() -> applicationService.apply(authentication, 22L, validRequest()));

		assertEquals(HttpStatus.CONFLICT, exception.getStatusCode());
		verify(applicationRepository, never()).saveAndFlush(any(StudentApplicationEntity.class));
	}

	private StudentApplicationRequest validRequest() {
		return new StudentApplicationRequest(LocalDate.now().plusDays(14), "Shared room", "I would like to apply.");
	}
}
