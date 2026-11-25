package com.homiesstay.api.auth;

import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Iterator;

import javax.imageio.ImageIO;
import javax.imageio.ImageReader;
import javax.imageio.stream.ImageInputStream;

import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.homiesstay.api.user.AppUserEntity;
import com.homiesstay.api.user.AppUserRepository;

@Service
public class ProfilePictureService {
	private static final int MAX_FILE_SIZE = 5 * 1024 * 1024;
	private static final int MAX_IMAGE_DIMENSION = 4096;
	private static final int MAX_IMAGE_PIXELS = 16_000_000;
	private static final int OUTPUT_DIMENSION = 1024;

	private final AppUserRepository userRepository;
	private final JdbcTemplate jdbcTemplate;

	public ProfilePictureService(AppUserRepository userRepository, JdbcTemplate jdbcTemplate) {
		this.userRepository = userRepository;
		this.jdbcTemplate = jdbcTemplate;
	}

	@Transactional
	public AccountResponse save(Authentication authentication, MultipartFile file) {
		byte[] imageData = normalizeImage(file);
		AppUserEntity user = findAccount(authentication);
		jdbcTemplate.update("""
				INSERT INTO app_user_profile_pictures (user_id, image_data) VALUES (?, ?)
				ON DUPLICATE KEY UPDATE image_data = ?, updated_at = CURRENT_TIMESTAMP(6)
				""", user.getId(), imageData, imageData);
		user.updateProfileImageVersion(Math.max(System.currentTimeMillis(), user.getProfileImageVersion() + 1));
		return AccountResponse.from(userRepository.save(user));
	}

	@Transactional(readOnly = true)
	public byte[] load(Authentication authentication) {
		AppUserEntity user = findAccount(authentication);
		try {
			return jdbcTemplate.queryForObject(
					"SELECT image_data FROM app_user_profile_pictures WHERE user_id = ?", byte[].class, user.getId());
		} catch (org.springframework.dao.EmptyResultDataAccessException exception) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile picture not found.");
		}
	}

	private AppUserEntity findAccount(Authentication authentication) {
		return userRepository.findByEmailIgnoreCase(authentication.getName())
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Account not found."));
	}

	private byte[] normalizeImage(MultipartFile file) {
		if (file == null || file.isEmpty() || file.getSize() > MAX_FILE_SIZE) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Choose an image no larger than 5 MB.");
		}

		try (ImageInputStream input = ImageIO.createImageInputStream(new ByteArrayInputStream(file.getBytes()))) {
			if (input == null) {
				throw invalidImage();
			}
			Iterator<ImageReader> readers = ImageIO.getImageReaders(input);
			if (!readers.hasNext()) {
				throw invalidImage();
			}

			ImageReader reader = readers.next();
			try {
				reader.setInput(input, true, true);
				String format = reader.getFormatName();
				if (!format.equalsIgnoreCase("JPEG") && !format.equalsIgnoreCase("PNG")) {
					throw invalidImage();
				}
				int width = reader.getWidth(0);
				int height = reader.getHeight(0);
				if (width < 1 || height < 1 || width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION
						|| (long) width * height > MAX_IMAGE_PIXELS) {
					throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Image dimensions must not exceed 4096 by 4096 pixels.");
				}

				BufferedImage source = reader.read(0);
				double scale = Math.min(1, (double) OUTPUT_DIMENSION / Math.max(width, height));
				int scaledWidth = Math.max(1, (int) Math.round(width * scale));
				int scaledHeight = Math.max(1, (int) Math.round(height * scale));
				BufferedImage normalized = new BufferedImage(scaledWidth, scaledHeight, BufferedImage.TYPE_INT_RGB);
				Graphics2D graphics = normalized.createGraphics();
				graphics.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BICUBIC);
				graphics.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);
				graphics.setColor(java.awt.Color.WHITE);
				graphics.fillRect(0, 0, scaledWidth, scaledHeight);
				graphics.drawImage(source, 0, 0, scaledWidth, scaledHeight, null);
				graphics.dispose();
				ByteArrayOutputStream output = new ByteArrayOutputStream();
				ImageIO.write(normalized, "JPEG", output);
				return output.toByteArray();
			} finally {
				reader.dispose();
			}
		} catch (IOException exception) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The selected file is not a valid JPEG or PNG image.");
		}
	}

	private ResponseStatusException invalidImage() {
		return new ResponseStatusException(HttpStatus.BAD_REQUEST, "The selected file must be a valid JPEG or PNG image.");
	}
}
