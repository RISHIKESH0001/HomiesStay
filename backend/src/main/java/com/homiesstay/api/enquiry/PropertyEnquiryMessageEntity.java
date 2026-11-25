package com.homiesstay.api.enquiry;

import java.time.LocalDateTime;

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
@Table(name = "property_enquiry_messages")
public class PropertyEnquiryMessageEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "enquiry_id", nullable = false)
	private PropertyEnquiryEntity enquiry;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "sender_id", nullable = false)
	private AppUserEntity sender;

	@Column(nullable = false, length = 2000)
	private String message;

	@Column(name = "created_at", nullable = false, insertable = false, updatable = false)
	private LocalDateTime createdAt;

	protected PropertyEnquiryMessageEntity() {
	}

	public static PropertyEnquiryMessageEntity create(PropertyEnquiryEntity enquiry, AppUserEntity sender, String message) {
		PropertyEnquiryMessageEntity entry = new PropertyEnquiryMessageEntity();
		entry.enquiry = enquiry;
		entry.sender = sender;
		entry.message = message.trim();
		return entry;
	}

	public Long getId() { return id; }
	public AppUserEntity getSender() { return sender; }
	public String getMessage() { return message; }
	public LocalDateTime getCreatedAt() { return createdAt; }
}
