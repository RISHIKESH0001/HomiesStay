package com.homiesstay.api.property;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PropertyRepository extends JpaRepository<PropertyEntity, Long> {
	Page<PropertyEntity> findByOwnerIdOrderByCreatedAtDescIdDesc(Long ownerId, Pageable pageable);

	Page<PropertyEntity> findByListingStatusAndReviewStatusOrderByCreatedAtDescIdDesc(
			PropertyListingStatus listingStatus, PropertyReviewStatus reviewStatus, Pageable pageable);

	Optional<PropertyEntity> findByIdAndOwnerId(Long id, Long ownerId);

	Optional<PropertyEntity> findByIdAndListingStatusAndReviewStatus(
			Long id,
			PropertyListingStatus listingStatus,
			PropertyReviewStatus reviewStatus);

	Page<PropertyEntity> findByListingStatusAndReviewStatusAndCityIgnoreCaseOrderByCreatedAtDescIdDesc(
			PropertyListingStatus listingStatus,
			PropertyReviewStatus reviewStatus,
			String city,
			Pageable pageable);

	Optional<PropertyEntity> findBySlugAndListingStatusAndReviewStatus(
			String slug,
			PropertyListingStatus listingStatus,
			PropertyReviewStatus reviewStatus);
}
