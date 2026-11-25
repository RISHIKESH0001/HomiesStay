CREATE TABLE property_enquiries (
    id BIGINT NOT NULL AUTO_INCREMENT,
    student_id BIGINT NOT NULL,
    property_id BIGINT NOT NULL,
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    CONSTRAINT uk_property_enquiries_student_property UNIQUE (student_id, property_id),
    CONSTRAINT fk_property_enquiries_student FOREIGN KEY (student_id) REFERENCES app_users (id) ON DELETE CASCADE,
    CONSTRAINT fk_property_enquiries_property FOREIGN KEY (property_id) REFERENCES properties (id) ON DELETE CASCADE,
    INDEX idx_property_enquiries_property_updated (property_id, updated_at),
    INDEX idx_property_enquiries_student_updated (student_id, updated_at)
) ENGINE=InnoDB;

CREATE TABLE property_enquiry_messages (
    id BIGINT NOT NULL AUTO_INCREMENT,
    enquiry_id BIGINT NOT NULL,
    sender_id BIGINT NOT NULL,
    message VARCHAR(2000) NOT NULL,
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    CONSTRAINT fk_property_enquiry_messages_enquiry FOREIGN KEY (enquiry_id) REFERENCES property_enquiries (id) ON DELETE CASCADE,
    CONSTRAINT fk_property_enquiry_messages_sender FOREIGN KEY (sender_id) REFERENCES app_users (id) ON DELETE CASCADE,
    INDEX idx_property_enquiry_messages_thread_created (enquiry_id, created_at, id)
) ENGINE=InnoDB;
