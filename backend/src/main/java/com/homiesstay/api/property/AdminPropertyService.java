package com.homiesstay.api.property;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import com.homiesstay.api.user.AppUserEntity;
import com.homiesstay.api.user.AppUserRepository;
import com.homiesstay.api.notification.NotificationService;

@Service
public class AdminPropertyService {
	private static final int MAX_PAGE_SIZE = 50;
	private final PropertyRepository propertyRepository;
	private final PropertyMediaService mediaService;
	private final AppUserRepository appUserRepository;
	private final NotificationService notificationService;

	public AdminPropertyService(PropertyRepository propertyRepository, PropertyMediaService mediaService,
			AppUserRepository appUserRepository, NotificationService notificationService) {
		this.propertyRepository = propertyRepository;
		this.mediaService = mediaService;
		this.appUserRepository = appUserRepository;
		this.notificationService = notificationService;
	}

	@Transactional(readOnly = true)
	public AdminPropertyPageResponse listPendingProperties(int page, int size) {
		validatePage(page, size);
		Page<PropertyEntity> properties = propertyRepository.findByListingStatusAndReviewStatusOrderByCreatedAtDescIdDesc(
				PropertyListingStatus.PENDING_REVIEW, PropertyReviewStatus.PENDING, PageRequest.of(page, size));
		List<Long> ids = properties.getContent().stream().map(PropertyEntity::getId).toList();
		var media = mediaService.forProperties(ids);
		var ownerIds = properties.getContent().stream().map(PropertyEntity::getOwnerId).distinct().toList();
		var owners = appUserRepository.findAllById(ownerIds).stream()
				.collect(java.util.stream.Collectors.toMap(AppUserEntity::getId, owner -> owner));
		List<AdminPropertyResponse> content = properties.getContent().stream().map(property -> {
			AppUserEntity owner = owners.get(property.getOwnerId());
			PropertyMedia propertyMedia = media.getOrDefault(property.getId(), PropertyMedia.empty());
			return new AdminPropertyResponse(property.getId(), property.getSlug(), property.getName(),
					property.getPropertyType(), property.getGenderPolicy(), property.getDescription(),
					property.getAddressLine(), property.getArea(), property.getCity(), property.getState(),
					property.getPostalCode(), property.getLatitude(), property.getLongitude(),
					property.getNearbyInstitution(), property.getDistanceKm(), property.getMonthlyRent(),
					property.getCapacity(), property.getAvailableBeds(), property.getListingStatus().name(),
					property.getReviewStatus().name(), property.getReviewNote(), propertyMedia.images(),
					propertyMedia.amenities(), property.getCreatedAt(), property.getOwnerId(),
					owner == null ? null : owner.getDisplayName(), owner == null ? null : owner.getEmail(),
					owner == null ? null : owner.getPhone());
		}).toList();
		return new AdminPropertyPageResponse(content, properties.getNumber(), properties.getSize(),
				properties.getTotalElements(), properties.getTotalPages());
	}

	@Transactional
	public OwnerPropertyResponse reviewProperty(Long propertyId, PropertyReviewRequest request) {
		PropertyEntity property = propertyRepository.findById(propertyId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Property not found."));
		if (request.decision() == PropertyReviewDecision.APPROVE) {
			property.approve();
			notificationService.create(property.getOwnerId(), "LISTING_APPROVED", "Your listing is approved",
				property.getName() + " is now live and visible to students.", "/owner/properties");
		} else {
			property.requestChanges(request.note());
			notificationService.create(property.getOwnerId(), "LISTING_CHANGES_REQUESTED", "Changes requested for your listing",
				"Please review the administrator's feedback for " + property.getName() + ".", "/owner/properties");
		}
		return OwnerPropertyResponse.from(property, mediaService.forProperty(property.getId()));
	}

	private void validatePage(int page, int size) {
		if (page < 0 || size < 1 || size > MAX_PAGE_SIZE) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
					"Page must be non-negative and size must be between 1 and " + MAX_PAGE_SIZE);
		}
	}
}
