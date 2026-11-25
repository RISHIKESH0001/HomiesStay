package com.homiesstay.api.property;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.homiesstay.api.user.AppUserEntity;
import com.homiesstay.api.user.AppUserRepository;
import com.homiesstay.api.user.UserRole;
import com.homiesstay.api.notification.NotificationService;

@Service
public class OwnerPropertyService {
	private static final int MAX_PAGE_SIZE = 50;
	private final PropertyRepository propertyRepository;
	private final PropertyMediaService mediaService;
	private final AppUserRepository userRepository;
	private final NotificationService notificationService;

	public OwnerPropertyService(PropertyRepository propertyRepository, PropertyMediaService mediaService, AppUserRepository userRepository, NotificationService notificationService) {
		this.propertyRepository = propertyRepository;
		this.mediaService = mediaService;
		this.userRepository = userRepository;
		this.notificationService = notificationService;
	}

	@Transactional(readOnly = true)
	public OwnerPropertyPageResponse listOwnedProperties(Authentication authentication, int page, int size) {
		validatePage(page, size);
		Page<PropertyEntity> properties = propertyRepository.findByOwnerIdOrderByCreatedAtDescIdDesc(
				getOwner(authentication).getId(), PageRequest.of(page, size));
		List<Long> ids = properties.getContent().stream().map(PropertyEntity::getId).toList();
		var media = mediaService.forProperties(ids);
		List<OwnerPropertyResponse> content = properties.getContent().stream()
				.map(property -> OwnerPropertyResponse.from(property, media.get(property.getId()))).toList();
		return new OwnerPropertyPageResponse(content, properties.getNumber(), properties.getSize(),
				properties.getTotalElements(), properties.getTotalPages());
	}

	@Transactional
	public OwnerPropertyResponse createProperty(Authentication authentication, PropertyRequest request) {
		validateBedCount(request);
		PropertyEntity property = PropertyEntity.create(getOwner(authentication).getId(), request);
		PropertyEntity saved = propertyRepository.save(property);
		mediaService.replace(saved.getId(), request.images(), request.amenities());
		return response(saved);
	}

	@Transactional(readOnly = true)
	public OwnerPropertyResponse getOwnedProperty(Authentication authentication, Long propertyId) {
		AppUserEntity owner = getOwner(authentication);
		return response(findOwnedProperty(propertyId, owner.getId()));
	}

	@Transactional
	public OwnerPropertyResponse updateProperty(Authentication authentication, Long propertyId, PropertyRequest request) {
		validateBedCount(request);
		AppUserEntity owner = getOwner(authentication);
		PropertyEntity property = findOwnedProperty(propertyId, owner.getId());
		property.updateDetails(request);
		mediaService.replace(property.getId(), request.images(), request.amenities());
		return response(property);
	}

	@Transactional
	public OwnerPropertyResponse submitForReview(Authentication authentication, Long propertyId) {
		AppUserEntity owner = getOwner(authentication);
		PropertyEntity property = findOwnedProperty(propertyId, owner.getId());
		property.submitForReview();
		notificationService.createForAllAdmins("PROPERTY_SUBMITTED_FOR_REVIEW", "Listing submitted for review",
			property.getName() + " is awaiting moderation.", "/admin/approvals");
		return response(property);
	}

	@Transactional
	public void deleteDraft(Authentication authentication, Long propertyId) {
		AppUserEntity owner = getOwner(authentication);
		PropertyEntity property = findOwnedProperty(propertyId, owner.getId());
		if (property.getListingStatus() != PropertyListingStatus.DRAFT) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Only draft listings can be deleted.");
		}
		propertyRepository.delete(property);
	}

	private AppUserEntity getOwner(Authentication authentication) {
		return userRepository.findByEmailIgnoreCase(authentication.getName())
				.filter(user -> user.getRole() == UserRole.OWNER)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Owner account required."));
	}

	private PropertyEntity findOwnedProperty(Long propertyId, Long ownerId) {
		return propertyRepository.findByIdAndOwnerId(propertyId, ownerId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Property not found."));
	}

	private OwnerPropertyResponse response(PropertyEntity property) {
		return OwnerPropertyResponse.from(property, mediaService.forProperty(property.getId()));
	}

	private void validateBedCount(PropertyRequest request) {
		if (request.availableBeds() > request.capacity()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Available beds cannot exceed capacity.");
		}
	}

	private void validatePage(int page, int size) {
		if (page < 0 || size < 1 || size > MAX_PAGE_SIZE) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
					"Page must be non-negative and size must be between 1 and " + MAX_PAGE_SIZE);
		}
	}
}
