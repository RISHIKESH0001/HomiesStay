package com.homiesstay.api.enquiry;

import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PropertyEnquiryMessageRepository extends JpaRepository<PropertyEnquiryMessageEntity, Long> {
	@EntityGraph(attributePaths = "sender")
	List<PropertyEnquiryMessageEntity> findByEnquiry_IdOrderByCreatedAtAscIdAsc(Long enquiryId);
}
