package com.homiesstay.api.auth;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.boot.autoconfigure.ImportAutoConfiguration;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.boot.security.autoconfigure.SecurityAutoConfiguration;
import org.springframework.boot.security.autoconfigure.web.servlet.SecurityFilterAutoConfiguration;
import org.springframework.boot.security.autoconfigure.web.servlet.ServletWebSecurityAutoConfiguration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.homiesstay.api.security.SecurityConfiguration;
import com.homiesstay.api.user.AppUserRepository;

@WebMvcTest(AuthController.class)
@Import(SecurityConfiguration.class)
@ImportAutoConfiguration({
		SecurityAutoConfiguration.class,
		SecurityFilterAutoConfiguration.class,
		ServletWebSecurityAutoConfiguration.class
})
class AuthControllerSecurityTest {
	@Autowired
	private MockMvc mockMvc;

	@MockitoBean
	private AuthService authService;

	@MockitoBean
	private AuthRateLimitService authRateLimitService;

	@MockitoBean
	private PasswordResetService passwordResetService;

	@MockitoBean
	private ProfilePictureService profilePictureService;

	@MockitoBean
	private EmailVerificationService emailVerificationService;

	@MockitoBean
	private AuthenticationManager authenticationManager;

	@MockitoBean
	private AppUserRepository userRepository;

	@Test
	void csrfEndpointIsPublicAndProvidesHeaderNameAndToken() throws Exception {
		mockMvc.perform(get("/api/v1/auth/csrf"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.headerName").value("X-XSRF-TOKEN"))
				.andExpect(jsonPath("$.token").isNotEmpty());
	}

	@Test
	void registrationRequiresCsrfProtection() throws Exception {
		mockMvc.perform(post("/api/v1/auth/register")
					.contentType(MediaType.APPLICATION_JSON)
					.content("{\"name\":\"Riya Shah\",\"email\":\"riya@example.com\",\"username\":\"riya\",\"phone\":\"9876543210\",\"password\":\"StrongPass1\",\"role\":\"student\"}"))
				.andExpect(status().isForbidden());

		verify(authService, never()).register(any(RegisterRequest.class));
	}

	@Test
	void registrationIsPublicWhenCsrfTokenIsValid() throws Exception {
		when(authService.register(any(RegisterRequest.class)))
				.thenReturn(new AccountResponse(1L, "riya@example.com", "riya", "Riya Shah", "9876543210", "student", null));

		mockMvc.perform(post("/api/v1/auth/register")
					.with(csrf())
					.contentType(MediaType.APPLICATION_JSON)
					.content("{\"name\":\"Riya Shah\",\"email\":\"riya@example.com\",\"username\":\"riya\",\"phone\":\"9876543210\",\"password\":\"StrongPass1\",\"role\":\"student\"}"))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.email").value("riya@example.com"))
				.andExpect(jsonPath("$.role").value("student"));

		verify(authService).register(any(RegisterRequest.class));
	}


	@Test
	void currentAccountRequiresAuthentication() throws Exception {
		mockMvc.perform(get("/api/v1/auth/me"))
				.andExpect(status().isForbidden());
	}

	@Test
	void ownerRoutesRejectAuthenticatedStudents() throws Exception {
		mockMvc.perform(get("/api/v1/owner/properties").with(user("student@example.com").roles("STUDENT")))
				.andExpect(status().isForbidden());
	}

	@Test
	void studentEnquiryRoutesRejectOwners() throws Exception {
		mockMvc.perform(get("/api/v1/student/enquiries").with(user("owner@example.com").roles("OWNER")))
				.andExpect(status().isForbidden());
	}

	@Test
	void ownerEnquiryRoutesRejectStudents() throws Exception {
		mockMvc.perform(get("/api/v1/owner/enquiries").with(user("student@example.com").roles("STUDENT")))
				.andExpect(status().isForbidden());
	}

	@Test
	void startingEnquiryRequiresCsrfProtection() throws Exception {
		mockMvc.perform(post("/api/v1/student/enquiries/properties/1")
					.with(user("student@example.com").roles("STUDENT"))
					.contentType(MediaType.APPLICATION_JSON)
					.content("{\"message\":\"Is this available?\"}"))
				.andExpect(status().isForbidden());
	}
}
