CREATE TABLE student_applications (
    id BIGINT NOT NULL AUTO_INCREMENT,
    student_id BIGINT NOT NULL,
    property_id BIGINT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'SUBMITTED',
    move_in_date DATE NOT NULL,
    room_preference VARCHAR(80) NOT NULL,
    message VARCHAR(2000) NOT NULL,
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    CONSTRAINT uk_student_applications_student_property UNIQUE (student_id, property_id),
    CONSTRAINT fk_student_applications_student FOREIGN KEY (student_id) REFERENCES app_users (id),
    CONSTRAINT fk_student_applications_property FOREIGN KEY (property_id) REFERENCES properties (id),
    CONSTRAINT chk_student_applications_status CHECK (status IN ('SUBMITTED', 'REVIEWING', 'ACCEPTED', 'DECLINED', 'WITHDRAWN')),
    INDEX idx_student_applications_property_status (property_id, status, created_at),
    INDEX idx_student_applications_student_created (student_id, created_at)
) ENGINE=InnoDB;
