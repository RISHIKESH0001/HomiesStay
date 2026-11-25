ALTER TABLE app_users
    ADD COLUMN profile_image_version BIGINT NOT NULL DEFAULT 0;

CREATE TABLE app_user_profile_pictures (
    user_id BIGINT NOT NULL,
    image_data MEDIUMBLOB NOT NULL,
    updated_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (user_id),
    CONSTRAINT fk_app_user_profile_pictures_user FOREIGN KEY (user_id) REFERENCES app_users (id) ON DELETE CASCADE
) ENGINE=InnoDB;
