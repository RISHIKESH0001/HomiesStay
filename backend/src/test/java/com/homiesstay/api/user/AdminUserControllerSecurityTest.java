package com.homiesstay.api.user;

import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.ImportAutoConfiguration;
import org.springframework.boot.security.autoconfigure.SecurityAutoConfiguration;
import org.springframework.boot.security.autoconfigure.web.servlet.SecurityFilterAutoConfiguration;
import org.springframework.boot.security.autoconfigure.web.servlet.ServletWebSecurityAutoConfiguration;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.homiesstay.api.security.SecurityConfiguration;

@WebMvcTest(AdminUserController.class)
@Import(SecurityConfiguration.class)
@ImportAutoConfiguration({
		SecurityAutoConfiguration.class,
		SecurityFilterAutoConfiguration.class,
		ServletWebSecurityAutoConfiguration.class
})
class AdminUserControllerSecurityTest {
	@Autowired
	private MockMvc mockMvc;

	@MockitoBean
	private AdminUserService adminUserService;

	@MockitoBean
	private AppUserRepository appUserRepository;

	@Test
	void userDirectoryRejectsNonAdmins() throws Exception {
		mockMvc.perform(get("/api/v1/admin/users").with(user("student@example.com").roles("STUDENT")))
				.andExpect(status().isForbidden());
	}

	@Test
	void userDirectoryIsAvailableToAdmins() throws Exception {
		when(adminUserService.listAccounts(0, 20, null, null, null))
				.thenReturn(new AdminUserPageResponse(List.of(), 0, 20, 0, 0));

		mockMvc.perform(get("/api/v1/admin/users").with(user("admin@example.com").roles("ADMIN")))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.totalElements").value(0));
}

	@Test
	void nonAdminsCannotSuspendOrDeleteAccounts() throws Exception {
		mockMvc.perform(patch("/api/v1/admin/users/5/suspension")
					.with(user("student@example.com").roles("STUDENT"))
					.with(csrf())
					.contentType(MediaType.APPLICATION_JSON)
					.content("{\"suspendedUntil\":\"2030-01-01T00:00:00Z\",\"reason\":\"Policy issue\"}"))
				.andExpect(status().isForbidden());

		mockMvc.perform(delete("/api/v1/admin/users/5")
					.with(user("student@example.com").roles("STUDENT"))
					.with(csrf())
					.contentType(MediaType.APPLICATION_JSON)
					.content("{\"confirmation\":\"someone\",\"reason\":\"Policy issue\"}"))
				.andExpect(status().isForbidden());
	}
}
