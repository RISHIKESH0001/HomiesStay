package com.homiesstay.api.application;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.homiesstay.api.property.PropertyEntity;
import com.homiesstay.api.property.PropertyListingStatus;
import com.homiesstay.api.property.PropertyRepository;
import com.homiesstay.api.property.PropertyReviewStatus;
import com.homiesstay.api.user.AppUserEntity;
import com.homiesstay.api.user.AppUserRepository;
import com.homiesstay.api.user.UserRole;
import com.homiesstay.api.notification.NotificationService;

@Service
public class StudentApplicationService {
	private static final int MAX_PAGE_SIZE = 50;
	private final StudentApplicationRepository applicationRepository;
	private final AppUserRepository userRepository;
	private final PropertyRepository propertyRepository;
	private final NotificationService notificationService;

	public StudentApplicationService(
			StudentApplicationRepository applicationRepository,
			AppUserRepository userRepository,
			PropertyRepository propertyRepository,
			NotificationService notificationService) {
		this.applicationRepository = applicationRepository;
		this.userRepository = userRepository;
		this.propertyRepository = propertyRepository;
		this.notificationService = notificationService;
	}

	@Transactional
	public StudentApplicationResponse apply(Authentication authentication, Long propertyId, StudentApplicationRequest request) {
		AppUserEntity student = getAccount(authentication, UserRole.STUDENT);
		PropertyEntity property = propertyRepository.findByIdAndListingStatusAndReviewStatus(
				propertyId, PropertyListingStatus.LIVE, PropertyReviewStatus.APPROVED)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Property not found."));
		if (property.getOwnerId().equals(student.getId())) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "You cannot apply to your own property.");
		}
		if (property.getAvailableBeds() == 0) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "This property has no available beds.");
		}
		if (applicationRepository.existsByStudent_IdAndProperty_Id(student.getId(), propertyId)) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "You have already applied to this property.");
		}
		StudentApplicationEntity application = StudentApplicationEntity.create(student, property, request);
		try {
			StudentApplicationEntity saved = applicationRepository.saveAndFlush(application);
			notificationService.create(property.getOwnerId(), "APPLICATION_RECEIVED", "New stay application",
				student.getDisplayName() + " applied to " + property.getName() + ".", "/owner/applications");
			return StudentApplicationResponse.from(saved);
		} catch (DataIntegrityViolationException exception) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "An application for this property already exists.");
		}
	}

	@Transactional(readOnly = true)
	public ApplicationPageResponse<StudentApplicationResponse> listStudentApplications(Authentication authentication, int page, int size) {
		validatePage(page, size);
		AppUserEntity student = getAccount(authentication, UserRole.STUDENT);
		Page<StudentApplicationResponse> results = applicationRepository
				.findByStudent_IdOrderByCreatedAtDescIdDesc(student.getId(), PageRequest.of(page, size))
				.map(StudentApplicationResponse::from);
		return ApplicationPageResponse.from(results);
	}

	@Transactional
	public StudentApplicationResponse withdraw(Authentication authentication, Long applicationId) {
		AppUserEntity student = getAccount(authentication, UserRole.STUDENT);
		StudentApplicationEntity application = applicationRepository.findByIdAndStudent_Id(applicationId, student.getId())
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found."));
		if (application.getStatus() != ApplicationStatus.SUBMITTED && application.getStatus() != ApplicationStatus.REVIEWING) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "This application can no longer be withdrawn.");
		}
		application.changeStatus(ApplicationStatus.WITHDRAWN);
		notificationService.create(application.getProperty().getOwnerId(), "APPLICATION_WITHDRAWN", "Application withdrawn",
			application.getStudent().getDisplayName() + " withdrew their application for " + application.getProperty().getName() + ".",
			"/owner/applications");
		return StudentApplicationResponse.from(application);
	}

	@Transactional(readOnly = true)
	public ApplicationPageResponse<OwnerApplicationResponse> listOwnerApplications(Authentication authentication, int page, int size) {
		validatePage(page, size);
		AppUserEntity owner = getAccount(authentication, UserRole.OWNER);
		Page<OwnerApplicationResponse> results = applicationRepository
				.findByProperty_OwnerIdOrderByCreatedAtDescIdDesc(owner.getId(), PageRequest.of(page, size))
				.map(OwnerApplicationResponse::from);
		return ApplicationPageResponse.from(results);
	}

	@Transactional
	public OwnerApplicationResponse updateOwnerStatus(
			Authentication authentication,
			Long applicationId,
			ApplicationStatus requestedStatus) {
		AppUserEntity owner = getAccount(authentication, UserRole.OWNER);
		StudentApplicationEntity application = applicationRepository.findByIdAndProperty_OwnerId(applicationId, owner.getId())
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found."));
		ApplicationStatus currentStatus = application.getStatus();
		if (currentStatus == requestedStatus) {
			return OwnerApplicationResponse.from(application);
		}
		boolean validTransition = switch (currentStatus) {
			case SUBMITTED -> requestedStatus == ApplicationStatus.REVIEWING
					|| requestedStatus == ApplicationStatus.ACCEPTED
					|| requestedStatus == ApplicationStatus.DECLINED;
			case REVIEWING -> requestedStatus == ApplicationStatus.ACCEPTED
					|| requestedStatus == ApplicationStatus.DECLINED;
			default -> false;
		};
		if (!validTransition) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "This application status cannot be changed to the requested status.");
		}
		application.changeStatus(requestedStatus);
		notificationService.create(application.getStudent().getId(), "APPLICATION_STATUS_UPDATED", "Application update",
			"Your application for " + application.getProperty().getName() + " is now " + requestedStatus.name().toLowerCase() + ".",
			"/dashboard/applications");
		return OwnerApplicationResponse.from(application);
	}

	private AppUserEntity getAccount(Authentication authentication, UserRole requiredRole) {
		return userRepository.findByEmailIgnoreCase(authentication.getName())
				.filter(user -> user.getRole() == requiredRole)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, requiredRole + " account required."));
	}

	private void validatePage(int page, int size) {
		if (page < 0 || size < 1 || size > MAX_PAGE_SIZE) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
					"Page must be non-negative and size must be between 1 and " + MAX_PAGE_SIZE);
		}
	}
}
