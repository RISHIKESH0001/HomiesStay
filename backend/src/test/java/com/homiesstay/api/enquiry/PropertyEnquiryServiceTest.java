package com.homiesstay.api.enquiry;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.mock;

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

import com.homiesstay.api.property.PropertyRepository;
import com.homiesstay.api.user.AppUserEntity;
import com.homiesstay.api.user.AppUserRepository;
import com.homiesstay.api.user.UserRole;
import com.homiesstay.api.notification.NotificationService;

@ExtendWith(MockitoExtension.class)
class PropertyEnquiryServiceTest {
	@Mock
	private PropertyEnquiryRepository enquiryRepository;
	@Mock
	private PropertyEnquiryMessageRepository messageRepository;
	@Mock
	private AppUserRepository userRepository;
	@Mock
	private PropertyRepository propertyRepository;
	@Mock
	private JdbcTemplate jdbcTemplate;
	@Mock
	private Authentication authentication;

	private PropertyEnquiryService service;

	@BeforeEach
	void setUp() {
		service = new PropertyEnquiryService(enquiryRepository, messageRepository, userRepository, propertyRepository, jdbcTemplate, mock(NotificationService.class));
	}

	@Test
	void studentRoutesRejectOwnerAccounts() {
		when(authentication.getName()).thenReturn("owner@example.com");
		when(userRepository.findByEmailIgnoreCase("owner@example.com"))
				.thenReturn(Optional.of(AppUserEntity.create("owner@example.com", "owner1", "hash", "Owner", null, UserRole.OWNER)));

		ResponseStatusException exception = assertThrows(ResponseStatusException.class,
				() -> service.start(authentication, 12L, new EnquiryMessageRequest("Is this available?")));

		assertEquals(HttpStatus.FORBIDDEN, exception.getStatusCode());
 	}

	@Test
	void ownerCannotReadConversationsForAnotherOwner() {
		AppUserEntity owner = AppUserEntity.create("owner@example.com", "owner1", "hash", "Owner", null, UserRole.OWNER);
		ReflectionTestUtils.setField(owner, "id", 7L);
		when(authentication.getName()).thenReturn("owner@example.com");
		when(userRepository.findByEmailIgnoreCase("owner@example.com")).thenReturn(Optional.of(owner));
		when(enquiryRepository.findByIdAndProperty_OwnerId(84L, 7L)).thenReturn(Optional.empty());

		ResponseStatusException exception = assertThrows(ResponseStatusException.class,
				() -> service.messages(authentication, UserRole.OWNER, 84L));

		assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
		verify(enquiryRepository).findByIdAndProperty_OwnerId(84L, 7L);
	}

	@Test
	void rejectsInvalidPaginationBeforeDatabaseAccess() {
		ResponseStatusException exception = assertThrows(ResponseStatusException.class,
				() -> service.listStudent(authentication, 0, 51));

		assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
	}
}
