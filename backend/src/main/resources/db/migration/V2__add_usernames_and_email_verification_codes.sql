ALTER TABLE app_users
    ADD COLUMN username VARCHAR(30) NULL AFTER email;

UPDATE app_users
SET username = CONCAT('user', id)
WHERE username IS NULL;

ALTER TABLE app_users
    MODIFY COLUMN username VARCHAR(30) NOT NULL,
    ADD CONSTRAINT uk_app_users_username UNIQUE (username);

CREATE TABLE email_verification_codes (
    id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    otp_hash VARCHAR(100) NOT NULL,
    expires_at TIMESTAMP(6) NOT NULL,
    last_sent_at TIMESTAMP(6) NOT NULL,
    failed_attempts INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    CONSTRAINT uk_email_verification_codes_user UNIQUE (user_id),
    CONSTRAINT fk_email_verification_codes_user FOREIGN KEY (user_id) REFERENCES app_users (id) ON DELETE CASCADE,
    CONSTRAINT chk_email_verification_failed_attempts CHECK (failed_attempts >= 0 AND failed_attempts <= 5)
) ENGINE=InnoDB;
