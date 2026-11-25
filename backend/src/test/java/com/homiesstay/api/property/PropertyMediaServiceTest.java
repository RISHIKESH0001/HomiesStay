package com.homiesstay.api.property;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verifyNoInteractions;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.server.ResponseStatusException;

class PropertyMediaServiceTest {
	private final JdbcTemplate jdbcTemplate = mock(JdbcTemplate.class);
	private final PropertyMediaService mediaService = new PropertyMediaService(jdbcTemplate);

	@Test
	void rejectsNonHttpsPhotoUrlsBeforeWritingMedia() {
		ResponseStatusException exception = assertThrows(ResponseStatusException.class,
				() -> mediaService.replace(1L, List.of("http://images.example/photo.jpg"), List.of()));

		assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
		verifyNoInteractions(jdbcTemplate);
	}

	@Test
	void rejectsDuplicateAmenitiesIgnoringCaseAndDiacritics() {
		ResponseStatusException exception = assertThrows(ResponseStatusException.class,
				() -> mediaService.replace(1L, List.of(), List.of("Cafe", "Café")));

		assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
		verifyNoInteractions(jdbcTemplate);
	}
}
