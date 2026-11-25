package com.homiesstay.api.property;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Locale;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;


@Entity
@Table(name = "properties")
public class PropertyEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "owner_id", nullable = false)
	private Long ownerId;

	@Column(nullable = false, length = 180)
	private String slug;

	@Column(nullable = false, length = 160)
	private String name;

	@Column(name = "property_type", nullable = false, length = 60)
	private String propertyType;

	@Column(name = "gender_policy", nullable = false, length = 20)
	private String genderPolicy;

	@Column(columnDefinition = "TEXT")
	private String description;

	@Column(name = "address_line")
	private String addressLine;

	@Column(nullable = false, length = 120)
	private String area;

	@Column(nullable = false, length = 120)
	private String city;

	@Column(length = 120)
	private String state;

	@Column(name = "postal_code", length = 20)
	private String postalCode;

	@Column(precision = 10, scale = 7)
	private BigDecimal latitude;

	@Column(precision = 10, scale = 7)
	private BigDecimal longitude;

	@Column(name = "nearby_institution", length = 180)
	private String nearbyInstitution;

	@Column(name = "distance_km", precision = 7, scale = 2)
	private BigDecimal distanceKm;

	@Column(name = "monthly_rent", nullable = false, precision = 12, scale = 2)
	private BigDecimal monthlyRent;

	@Column(nullable = false)
	private Integer capacity;

	@Column(name = "available_beds", nullable = false)
	private Integer availableBeds;

	@Enumerated(EnumType.STRING)
	@Column(name = "listing_status", nullable = false, length = 24)
	private PropertyListingStatus listingStatus;

	@Enumerated(EnumType.STRING)
	@Column(name = "review_status", nullable = false, length = 24)
	private PropertyReviewStatus reviewStatus;

	@Column(name = "review_note", length = 1000)
	private String reviewNote;

	@Column(name = "created_at", nullable = false, insertable = false, updatable = false)
	private LocalDateTime createdAt;

	@Column(name = "updated_at", nullable = false, insertable = false, updatable = false)
	private LocalDateTime updatedAt;

	protected PropertyEntity() {
	}

	public static PropertyEntity create(Long ownerId, PropertyRequest request) {
		PropertyEntity property = new PropertyEntity();
		property.ownerId = ownerId;
		property.updateDetails(request);
		property.slug = createSlug(request.name());
		property.listingStatus = PropertyListingStatus.DRAFT;
		property.reviewStatus = PropertyReviewStatus.PENDING;
		return property;
	}

	public void updateDetails(PropertyRequest request) {
		name = request.name().trim();
		propertyType = request.propertyType().trim();
		genderPolicy = request.genderPolicy().trim().toUpperCase(Locale.ROOT);
		description = request.description();
		addressLine = request.addressLine();
		area = request.area().trim();
		city = request.city().trim();
		state = request.state();
		postalCode = request.postalCode();
		latitude = request.latitude();
		longitude = request.longitude();
		nearbyInstitution = request.nearbyInstitution();
		distanceKm = request.distanceKm();
		monthlyRent = request.monthlyRent();
		capacity = request.capacity();
		availableBeds = request.availableBeds();
		if (listingStatus != PropertyListingStatus.DRAFT) {
			listingStatus = PropertyListingStatus.PENDING_REVIEW;
			reviewStatus = PropertyReviewStatus.PENDING;
			reviewNote = null;
		}
	}

	public void submitForReview() {
		if (listingStatus != PropertyListingStatus.DRAFT) {
			throw new org.springframework.web.server.ResponseStatusException(
					org.springframework.http.HttpStatus.CONFLICT, "Only draft listings can be submitted for review.");
		}
		listingStatus = PropertyListingStatus.PENDING_REVIEW;
		reviewStatus = PropertyReviewStatus.PENDING;
		reviewNote = null;
	}

	public void approve() {
		if (listingStatus != PropertyListingStatus.PENDING_REVIEW || reviewStatus != PropertyReviewStatus.PENDING) {
			throw new org.springframework.web.server.ResponseStatusException(
					org.springframework.http.HttpStatus.CONFLICT, "Only pending listings can be approved.");
		}
		listingStatus = PropertyListingStatus.LIVE;
		reviewStatus = PropertyReviewStatus.APPROVED;
		reviewNote = null;
	}

	public void requestChanges(String note) {
		if (listingStatus != PropertyListingStatus.PENDING_REVIEW || reviewStatus != PropertyReviewStatus.PENDING) {
			throw new org.springframework.web.server.ResponseStatusException(
					org.springframework.http.HttpStatus.CONFLICT, "Only pending listings can be sent back for changes.");
		}
		listingStatus = PropertyListingStatus.DRAFT;
		reviewStatus = PropertyReviewStatus.CHANGES_REQUESTED;
		reviewNote = note.trim();
	}

	private static String createSlug(String name) {
		String normalizedName = name.toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("(^-|-$)", "");
		String suffix = UUID.randomUUID().toString().substring(0, 8);
		return (normalizedName.isBlank() ? "property" : normalizedName) + "-" + suffix;
	}

	public Long getId() {
		return id;
	}

	public Long getOwnerId() {
		return ownerId;
	}

	public PropertyListingStatus getListingStatus() {
		return listingStatus;
	}

	public PropertyReviewStatus getReviewStatus() {
		return reviewStatus;
	}

	public String getReviewNote() {
		return reviewNote;
	}

	public String getSlug() {
		return slug;
	}

	public String getName() {
		return name;
	}

	public String getPropertyType() {
		return propertyType;
	}

	public String getGenderPolicy() {
		return genderPolicy;
	}

	public String getDescription() {
		return description;
	}

	public String getAddressLine() {
		return addressLine;
	}

	public String getArea() {
		return area;
	}

	public String getCity() {
		return city;
	}

	public String getState() {
		return state;
	}

	public String getPostalCode() {
		return postalCode;
	}

	public BigDecimal getLatitude() {
		return latitude;
	}

	public BigDecimal getLongitude() {
		return longitude;
	}

	public String getNearbyInstitution() {
		return nearbyInstitution;
	}

	public BigDecimal getDistanceKm() {
		return distanceKm;
	}

	public BigDecimal getMonthlyRent() {
		return monthlyRent;
	}

	public Integer getCapacity() {
		return capacity;
	}

	public Integer getAvailableBeds() {
		return availableBeds;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}
}
