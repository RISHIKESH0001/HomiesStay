ALTER TABLE app_users
    ADD COLUMN suspended_until TIMESTAMP(6) NULL,
    ADD CONSTRAINT chk_app_users_suspended_until CHECK (suspended_until IS NULL OR account_status = 'SUSPENDED');

CREATE TABLE admin_user_actions (
    id BIGINT NOT NULL AUTO_INCREMENT,
    admin_user_id BIGINT NOT NULL,
    target_user_id BIGINT NOT NULL,
    action VARCHAR(24) NOT NULL,
    reason VARCHAR(500) NOT NULL,
    suspended_until TIMESTAMP(6) NULL,
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    CONSTRAINT fk_admin_user_actions_admin FOREIGN KEY (admin_user_id) REFERENCES app_users (id),
    CONSTRAINT chk_admin_user_actions_action CHECK (action IN ('SUSPEND', 'LIFT_SUSPENSION', 'TERMINATE')),
    INDEX idx_admin_user_actions_target_created (target_user_id, created_at),
    INDEX idx_admin_user_actions_admin_created (admin_user_id, created_at)
) ENGINE=InnoDB;
