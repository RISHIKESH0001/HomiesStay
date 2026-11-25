package com.homiesstay.api.property;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/v1/properties")
public class PublicPropertyController {
	private static final int MAX_PAGE_SIZE = 50;
	private final PropertyRepository propertyRepository;
	private final PropertyMediaService mediaService;

	public PublicPropertyController(PropertyRepository propertyRepository, PropertyMediaService mediaService) {
		this.propertyRepository = propertyRepository;
		this.mediaService = mediaService;
	}

	@GetMapping
	public PropertyPageResponse listPublicProperties(
			@RequestParam(required = false) String city,
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "20") int size) {
		if (page < 0 || size < 1 || size > MAX_PAGE_SIZE) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
					"Page must be non-negative and size must be between 1 and " + MAX_PAGE_SIZE);
		}

		PageRequest pageRequest = PageRequest.of(page, size);
		Page<PropertyEntity> result = StringUtils.hasText(city)
				? propertyRepository.findByListingStatusAndReviewStatusAndCityIgnoreCaseOrderByCreatedAtDescIdDesc(
						PropertyListingStatus.LIVE, PropertyReviewStatus.APPROVED, city.trim(), pageRequest)
				: propertyRepository.findByListingStatusAndReviewStatusOrderByCreatedAtDescIdDesc(
						PropertyListingStatus.LIVE, PropertyReviewStatus.APPROVED, pageRequest);

		List<Long> ids = result.getContent().stream().map(PropertyEntity::getId).toList();
		var media = mediaService.forProperties(ids);
		List<PropertyResponse> content = result.getContent().stream()
				.map(property -> PropertyResponse.from(property, media.get(property.getId()))).toList();
		return new PropertyPageResponse(content, result.getNumber(), result.getSize(),
				result.getTotalElements(), result.getTotalPages());
	}

	@GetMapping("/{slug}")
	public PropertyResponse getPublicProperty(@PathVariable String slug) {
		PropertyEntity property = propertyRepository.findBySlugAndListingStatusAndReviewStatus(
				 slug, PropertyListingStatus.LIVE, PropertyReviewStatus.APPROVED)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Property not found"));
		return PropertyResponse.from(property, mediaService.forProperty(property.getId()));
	}
}
