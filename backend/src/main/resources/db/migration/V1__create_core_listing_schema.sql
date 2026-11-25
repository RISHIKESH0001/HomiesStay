CREATE TABLE app_users (
    id BIGINT NOT NULL AUTO_INCREMENT,
    email VARCHAR(254) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(120) NOT NULL,
    phone VARCHAR(32),
    role VARCHAR(20) NOT NULL,
    account_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    CONSTRAINT uk_app_users_email UNIQUE (email),
    CONSTRAINT chk_app_users_role CHECK (role IN ('STUDENT', 'OWNER', 'ADMIN')),
    CONSTRAINT chk_app_users_status CHECK (account_status IN ('PENDING', 'ACTIVE', 'SUSPENDED'))
) ENGINE=InnoDB;

CREATE TABLE properties (
    id BIGINT NOT NULL AUTO_INCREMENT,
    owner_id BIGINT NOT NULL,
    slug VARCHAR(180) NOT NULL,
    name VARCHAR(160) NOT NULL,
    property_type VARCHAR(60) NOT NULL,
    gender_policy VARCHAR(20) NOT NULL DEFAULT 'UNISEX',
    description TEXT,
    address_line VARCHAR(255),
    area VARCHAR(120) NOT NULL,
    city VARCHAR(120) NOT NULL,
    state VARCHAR(120),
    postal_code VARCHAR(20),
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    nearby_institution VARCHAR(180),
    distance_km DECIMAL(7, 2),
    monthly_rent DECIMAL(12, 2) NOT NULL,
    capacity INT NOT NULL,
    available_beds INT NOT NULL,
    listing_status VARCHAR(24) NOT NULL DEFAULT 'DRAFT',
    review_status VARCHAR(24) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    CONSTRAINT uk_properties_slug UNIQUE (slug),
    CONSTRAINT fk_properties_owner FOREIGN KEY (owner_id) REFERENCES app_users (id),
    CONSTRAINT chk_properties_gender CHECK (gender_policy IN ('MEN', 'WOMEN', 'UNISEX')),
    CONSTRAINT chk_properties_rent CHECK (monthly_rent >= 0),
    CONSTRAINT chk_properties_capacity CHECK (capacity > 0 AND available_beds >= 0 AND available_beds <= capacity),
    CONSTRAINT chk_properties_listing_status CHECK (listing_status IN ('DRAFT', 'PENDING_REVIEW', 'LIVE', 'PAUSED', 'ARCHIVED')),
    CONSTRAINT chk_properties_review_status CHECK (review_status IN ('PENDING', 'APPROVED', 'CHANGES_REQUESTED')),
    INDEX idx_properties_city_status (city, listing_status),
    INDEX idx_properties_owner (owner_id)
) ENGINE=InnoDB;

CREATE TABLE property_images (
    id BIGINT NOT NULL AUTO_INCREMENT,
    property_id BIGINT NOT NULL,
    image_url VARCHAR(2048) NOT NULL,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    CONSTRAINT fk_property_images_property FOREIGN KEY (property_id) REFERENCES properties (id) ON DELETE CASCADE,
    INDEX idx_property_images_order (property_id, display_order)
) ENGINE=InnoDB;

CREATE TABLE amenities (
    id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(80) NOT NULL,
    normalized_name VARCHAR(80) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT uk_amenities_normalized_name UNIQUE (normalized_name)
) ENGINE=InnoDB;

CREATE TABLE property_amenities (
    property_id BIGINT NOT NULL,
    amenity_id BIGINT NOT NULL,
    PRIMARY KEY (property_id, amenity_id),
    CONSTRAINT fk_property_amenities_property FOREIGN KEY (property_id) REFERENCES properties (id) ON DELETE CASCADE,
    CONSTRAINT fk_property_amenities_amenity FOREIGN KEY (amenity_id) REFERENCES amenities (id)
) ENGINE=InnoDB;
