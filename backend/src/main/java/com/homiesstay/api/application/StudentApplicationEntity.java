package com.homiesstay.api.application;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.homiesstay.api.property.PropertyEntity;
import com.homiesstay.api.user.AppUserEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "student_applications")
public class StudentApplicationEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "student_id", nullable = false)
	private AppUserEntity student;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "property_id", nullable = false)
	private PropertyEntity property;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 20)
	private ApplicationStatus status;

	@Column(name = "move_in_date", nullable = false)
	private LocalDate moveInDate;

	@Column(name = "room_preference", nullable = false, length = 80)
	private String roomPreference;

	@Column(nullable = false, length = 2000)
	private String message;

	@Column(name = "created_at", nullable = false, insertable = false, updatable = false)
	private LocalDateTime createdAt;

	@Column(name = "updated_at", nullable = false, insertable = false, updatable = false)
	private LocalDateTime updatedAt;

	protected StudentApplicationEntity() {
	}

	public static StudentApplicationEntity create(AppUserEntity student, PropertyEntity property, StudentApplicationRequest request) {
		StudentApplicationEntity application = new StudentApplicationEntity();
		application.student = student;
		application.property = property;
		application.moveInDate = request.moveInDate();
		application.roomPreference = request.roomPreference().trim();
		application.message = request.message().trim();
		application.status = ApplicationStatus.SUBMITTED;
		return application;
	}

	public void changeStatus(ApplicationStatus status) {
		this.status = status;
	}

	public Long getId() {
		return id;
	}

	public AppUserEntity getStudent() {
		return student;
	}

	public PropertyEntity getProperty() {
		return property;
	}

	public ApplicationStatus getStatus() {
		return status;
	}

	public LocalDate getMoveInDate() {
		return moveInDate;
	}

	public String getRoomPreference() {
		return roomPreference;
	}

	public String getMessage() {
		return message;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}
}
