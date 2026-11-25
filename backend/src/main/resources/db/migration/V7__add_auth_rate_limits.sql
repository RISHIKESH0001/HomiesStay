CREATE TABLE auth_rate_limits (
    bucket_key CHAR(64) NOT NULL,
    window_started_at TIMESTAMP(6) NOT NULL,
    request_count INT NOT NULL,
    updated_at TIMESTAMP(6) NOT NULL,
    PRIMARY KEY (bucket_key),
    INDEX idx_auth_rate_limits_updated_at (updated_at)
) ENGINE=InnoDB;
