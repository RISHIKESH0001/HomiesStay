package com.homiesstay.api.enquiry;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PropertyEnquiryRepository extends JpaRepository<PropertyEnquiryEntity, Long> {
	@EntityGraph(attributePaths = { "student", "property" })
	Page<PropertyEnquiryEntity> findByStudent_IdOrderByUpdatedAtDescIdDesc(Long studentId, Pageable pageable);

	@EntityGraph(attributePaths = { "student", "property" })
	Page<PropertyEnquiryEntity> findByProperty_OwnerIdOrderByUpdatedAtDescIdDesc(Long ownerId, Pageable pageable);

	@EntityGraph(attributePaths = { "student", "property" })
	Optional<PropertyEnquiryEntity> findByIdAndStudent_Id(Long id, Long studentId);

	@EntityGraph(attributePaths = { "student", "property" })
	Optional<PropertyEnquiryEntity> findByIdAndProperty_OwnerId(Long id, Long ownerId);

	@EntityGraph(attributePaths = { "student", "property" })
	Optional<PropertyEnquiryEntity> findByStudent_IdAndProperty_Id(Long studentId, Long propertyId);
}
