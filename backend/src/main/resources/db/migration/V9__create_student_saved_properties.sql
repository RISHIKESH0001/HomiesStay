CREATE TABLE student_saved_properties (
    student_id BIGINT NOT NULL,
    property_id BIGINT NOT NULL,
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (student_id, property_id),
    CONSTRAINT fk_student_saved_properties_student FOREIGN KEY (student_id) REFERENCES app_users (id) ON DELETE CASCADE,
    CONSTRAINT fk_student_saved_properties_property FOREIGN KEY (property_id) REFERENCES properties (id) ON DELETE CASCADE,
    INDEX idx_student_saved_properties_property_created (property_id, created_at)
) ENGINE=InnoDB;
