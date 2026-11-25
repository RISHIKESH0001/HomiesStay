package com.homiesstay.api.application;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentApplicationRepository extends JpaRepository<StudentApplicationEntity, Long> {
	@EntityGraph(attributePaths = "property")
	Page<StudentApplicationEntity> findByStudent_IdOrderByCreatedAtDescIdDesc(Long studentId, Pageable pageable);

	@EntityGraph(attributePaths = { "student", "property" })
	Page<StudentApplicationEntity> findByProperty_OwnerIdOrderByCreatedAtDescIdDesc(Long ownerId, Pageable pageable);

	Optional<StudentApplicationEntity> findByIdAndStudent_Id(Long id, Long studentId);

	Optional<StudentApplicationEntity> findByIdAndProperty_OwnerId(Long id, Long ownerId);

	boolean existsByStudent_IdAndProperty_Id(Long studentId, Long propertyId);
}
