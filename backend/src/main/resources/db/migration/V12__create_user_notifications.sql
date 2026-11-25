CREATE TABLE user_notifications (
    id BIGINT NOT NULL AUTO_INCREMENT,
    recipient_user_id BIGINT NOT NULL,
    event_type VARCHAR(48) NOT NULL,
    title VARCHAR(160) NOT NULL,
    message VARCHAR(500) NOT NULL,
    target_url VARCHAR(255) NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    read_at TIMESTAMP(6) NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_user_notifications_recipient FOREIGN KEY (recipient_user_id) REFERENCES app_users (id) ON DELETE CASCADE,
    INDEX idx_user_notifications_inbox (recipient_user_id, created_at, id),
    INDEX idx_user_notifications_unread (recipient_user_id, is_read, created_at)
) ENGINE=InnoDB;
