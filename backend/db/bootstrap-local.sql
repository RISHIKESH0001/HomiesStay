CREATE DATABASE IF NOT EXISTS homies_stay
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;

CREATE USER 'homies_app'@'localhost' IDENTIFIED BY RANDOM PASSWORD;
GRANT SELECT, INSERT, UPDATE, DELETE
  ON homies_stay.* TO 'homies_app'@'localhost';

CREATE USER 'homies_migrator'@'localhost' IDENTIFIED BY RANDOM PASSWORD;
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, INDEX, REFERENCES
  ON homies_stay.* TO 'homies_migrator'@'localhost';
