-- RateFlick — MySQL 8+
CREATE DATABASE IF NOT EXISTS rateflick CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE rateflick;

CREATE TABLE IF NOT EXISTS users (
  id         CHAR(36)     NOT NULL DEFAULT (UUID()) PRIMARY KEY,
  email      VARCHAR(255) NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS entries (
  id          CHAR(36)     NOT NULL DEFAULT (UUID()) PRIMARY KEY,
  user_id     CHAR(36)     NOT NULL,
  title       VARCHAR(255) NOT NULL,
  rating      DECIMAL(2,1) NOT NULL CHECK (rating BETWEEN 0 AND 5.0),
  description TEXT,
  poster_url  VARCHAR(500),
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS genres (
  id   INT          AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS entries_genres (
  entry_id CHAR(36) NOT NULL,
  genre_id INT      NOT NULL,
  PRIMARY KEY (entry_id, genre_id),
  FOREIGN KEY (entry_id) REFERENCES entries(id) ON DELETE CASCADE,
  FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE CASCADE
);

INSERT IGNORE INTO genres (name) VALUES 
('Action'), ('Aventure'), ('Animation'), ('Comédie'), ('Crime'), 
('Documentaire'), ('Drame'), ('Famille'), ('Fantastique'), ('Guerre'), 
('Histoire'), ('Horreur'), ('Musique'), ('Mystère'), ('Romance'), 
('Science-Fiction'), ('Thriller'), ('Western'), ('Autre');
