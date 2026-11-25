package com.homiesstay.api.property;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.ResponseStatusException;

import com.homiesstay.api.user.AppUserEntity;
import com.homiesstay.api.user.AppUserRepository;
import com.homiesstay.api.user.UserRole;

@ExtendWith(MockitoExtension.class)
class StudentSavedPropertyServiceTest {
	@Mock
	private JdbcTemplate jdbcTemplate;
	@Mock
	private AppUserRepository userRepository;
	@Mock
	private PropertyRepository propertyRepository;
	@Mock
	private PropertyMediaService mediaService;
	@Mock
	private Authentication authentication;
	@Mock
	private PropertyEntity property;

	private StudentSavedPropertyService service;

	@BeforeEach
	void setUp() {
		service = new StudentSavedPropertyService(jdbcTemplate, userRepository, propertyRepository, mediaService);
	}

	@Test
	void savesLiveApprovedPropertyWithAuthenticatedStudentId() {
		AppUserEntity student = AppUserEntity.create("student@example.com", "student1", "hash", "Student", null, UserRole.STUDENT);
		ReflectionTestUtils.setField(student, "id", 9L);
		when(authentication.getName()).thenReturn("student@example.com");
		when(userRepository.findByEmailIgnoreCase("student@example.com")).thenReturn(Optional.of(student));
		when(propertyRepository.findByIdAndListingStatusAndReviewStatus(42L, PropertyListingStatus.LIVE, PropertyReviewStatus.APPROVED))
				.thenReturn(Optional.of(property));

		service.save(authentication, 42L);

		verify(jdbcTemplate).update(eq("INSERT IGNORE INTO student_saved_properties (student_id, property_id) VALUES (?, ?)"),
				eq(9L), eq(42L));
	}

	@Test
	void doesNotSaveUnpublishedProperty() {
		AppUserEntity student = AppUserEntity.create("student@example.com", "student1", "hash", "Student", null, UserRole.STUDENT);
		when(authentication.getName()).thenReturn("student@example.com");
		when(userRepository.findByEmailIgnoreCase("student@example.com")).thenReturn(Optional.of(student));
		when(propertyRepository.findByIdAndListingStatusAndReviewStatus(42L, PropertyListingStatus.LIVE, PropertyReviewStatus.APPROVED))
				.thenReturn(Optional.empty());

		ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> service.save(authentication, 42L));

		assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
	}

	@Test
	void rejectsNonStudentAccounts() {
		AppUserEntity owner = AppUserEntity.create("student@example.com", "owner1", "hash", "Owner", null, UserRole.OWNER);
		when(authentication.getName()).thenReturn("student@example.com");
		when(userRepository.findByEmailIgnoreCase("student@example.com")).thenReturn(Optional.of(owner));

		ResponseStatusException exception = assertThrows(ResponseStatusException.class,
				() -> service.list(authentication, 0, 20));

		assertEquals(HttpStatus.FORBIDDEN, exception.getStatusCode());
	}

	@Test
	void rejectsInvalidPagination() {
		ResponseStatusException exception = assertThrows(ResponseStatusException.class,
				() -> service.list(authentication, -1, 20));

		assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
	}
}
