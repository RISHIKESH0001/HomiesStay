package com.homiesstay.api.enquiry;

import java.time.LocalDateTime;

import com.homiesstay.api.property.PropertyEntity;
import com.homiesstay.api.user.AppUserEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "property_enquiries")
public class PropertyEnquiryEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "student_id", nullable = false)
	private AppUserEntity student;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "property_id", nullable = false)
	private PropertyEntity property;

	@Column(name = "created_at", nullable = false, insertable = false, updatable = false)
	private LocalDateTime createdAt;

	@Column(name = "updated_at", nullable = false, insertable = false, updatable = false)
	private LocalDateTime updatedAt;

	protected PropertyEnquiryEntity() {
	}

	public static PropertyEnquiryEntity create(AppUserEntity student, PropertyEntity property) {
		PropertyEnquiryEntity enquiry = new PropertyEnquiryEntity();
		enquiry.student = student;
		enquiry.property = property;
		return enquiry;
	}

	public Long getId() { return id; }
	public AppUserEntity getStudent() { return student; }
	public PropertyEntity getProperty() { return property; }
	public LocalDateTime getCreatedAt() { return createdAt; }
	public LocalDateTime getUpdatedAt() { return updatedAt; }
}
