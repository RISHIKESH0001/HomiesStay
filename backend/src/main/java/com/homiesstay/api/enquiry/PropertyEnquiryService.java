package com.homiesstay.api.enquiry;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
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
public class PropertyEnquiryService {
	private static final int MAX_PAGE_SIZE = 50;
	private final PropertyEnquiryRepository enquiryRepository;
	private final PropertyEnquiryMessageRepository messageRepository;
	private final AppUserRepository userRepository;
	private final PropertyRepository propertyRepository;
	private final JdbcTemplate jdbcTemplate;
	private final NotificationService notificationService;

	public PropertyEnquiryService(PropertyEnquiryRepository enquiryRepository,
			PropertyEnquiryMessageRepository messageRepository, AppUserRepository userRepository,
			PropertyRepository propertyRepository, JdbcTemplate jdbcTemplate, NotificationService notificationService) {
		this.enquiryRepository = enquiryRepository;
		this.messageRepository = messageRepository;
		this.userRepository = userRepository;
		this.propertyRepository = propertyRepository;
		this.jdbcTemplate = jdbcTemplate;
		this.notificationService = notificationService;
	}

	@Transactional
	public EnquirySummaryResponse start(Authentication authentication, Long propertyId, EnquiryMessageRequest request) {
		AppUserEntity student = getAccount(authentication, UserRole.STUDENT);
		PropertyEntity property = propertyRepository.findByIdAndListingStatusAndReviewStatus(
				propertyId, PropertyListingStatus.LIVE, PropertyReviewStatus.APPROVED)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Property not found."));
		if (property.getOwnerId().equals(student.getId())) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "You cannot enquire about your own property.");
		}
		int newEnquiry = jdbcTemplate.update("INSERT IGNORE INTO property_enquiries (student_id, property_id) VALUES (?, ?)",
				student.getId(), propertyId);
		PropertyEnquiryEntity enquiry = enquiryRepository.findByStudent_IdAndProperty_Id(student.getId(), propertyId)
				.orElseThrow(() -> new IllegalStateException("The enquiry thread could not be loaded."));
		appendMessage(enquiry, student, request.message());
		notificationService.create(property.getOwnerId(), newEnquiry > 0 ? "ENQUIRY_RECEIVED" : "ENQUIRY_MESSAGE_RECEIVED",
			newEnquiry > 0 ? "New property enquiry" : "New enquiry message",
			student.getDisplayName() + " sent a message about " + property.getName() + ".", "/owner/enquiries");
		return EnquirySummaryResponse.from(enquiry, false);
	}

	@Transactional(readOnly = true)
	public EnquiryPageResponse<EnquirySummaryResponse> listStudent(Authentication authentication, int page, int size) {
		validatePage(page, size);
		AppUserEntity student = getAccount(authentication, UserRole.STUDENT);
		Page<EnquirySummaryResponse> results = enquiryRepository
				.findByStudent_IdOrderByUpdatedAtDescIdDesc(student.getId(), PageRequest.of(page, size))
				.map(enquiry -> EnquirySummaryResponse.from(enquiry, false));
		return EnquiryPageResponse.from(results);
	}

	@Transactional(readOnly = true)
	public EnquiryPageResponse<EnquirySummaryResponse> listOwner(Authentication authentication, int page, int size) {
		validatePage(page, size);
		AppUserEntity owner = getAccount(authentication, UserRole.OWNER);
		Page<EnquirySummaryResponse> results = enquiryRepository
				.findByProperty_OwnerIdOrderByUpdatedAtDescIdDesc(owner.getId(), PageRequest.of(page, size))
				.map(enquiry -> EnquirySummaryResponse.from(enquiry, true));
		return EnquiryPageResponse.from(results);
	}

	@Transactional(readOnly = true)
	public List<EnquiryMessageResponse> messages(Authentication authentication, UserRole role, Long enquiryId) {
		PropertyEnquiryEntity enquiry = getEnquiry(authentication, role, enquiryId);
		return messageRepository.findByEnquiry_IdOrderByCreatedAtAscIdAsc(enquiry.getId())
				.stream().map(EnquiryMessageResponse::from).toList();
	}

	@Transactional
	public EnquiryMessageResponse reply(Authentication authentication, UserRole role, Long enquiryId,
			EnquiryMessageRequest request) {
		AppUserEntity sender = getAccount(authentication, role);
		PropertyEnquiryEntity enquiry = getEnquiry(sender, role, enquiryId);
		PropertyEnquiryMessageEntity saved = appendMessage(enquiry, sender, request.message());
		boolean ownerReply = role == UserRole.OWNER;
		long recipientId = ownerReply ? enquiry.getStudent().getId() : enquiry.getProperty().getOwnerId();
		String recipientPath = ownerReply ? "/dashboard/enquiries" : "/owner/enquiries";
		notificationService.create(recipientId, "ENQUIRY_MESSAGE_RECEIVED", "New enquiry message",
			sender.getDisplayName() + " replied about " + enquiry.getProperty().getName() + ".", recipientPath);
		return EnquiryMessageResponse.from(saved);
	}

	private PropertyEnquiryMessageEntity appendMessage(PropertyEnquiryEntity enquiry, AppUserEntity sender, String message) {
		PropertyEnquiryMessageEntity saved = messageRepository.saveAndFlush(
				PropertyEnquiryMessageEntity.create(enquiry, sender, message));
		jdbcTemplate.update("UPDATE property_enquiries SET updated_at = CURRENT_TIMESTAMP(6) WHERE id = ?", enquiry.getId());
		return saved;
	}

	private PropertyEnquiryEntity getEnquiry(Authentication authentication, UserRole role, Long enquiryId) {
		return getEnquiry(getAccount(authentication, role), role, enquiryId);
	}

	private PropertyEnquiryEntity getEnquiry(AppUserEntity user, UserRole role, Long enquiryId) {
		var enquiry = role == UserRole.STUDENT
				? enquiryRepository.findByIdAndStudent_Id(enquiryId, user.getId())
				: enquiryRepository.findByIdAndProperty_OwnerId(enquiryId, user.getId());
		return enquiry.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Enquiry not found."));
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
