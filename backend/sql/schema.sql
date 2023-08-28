-- SET client_min_messages = warning;
-- -------------------------
-- Database city_center
-- -------------------------
DROP DATABASE IF EXISTS city_center;
--
--
CREATE DATABASE city_center;
-- -------------------------
-- Database city_center_test
-- -------------------------
DROP DATABASE IF EXISTS city_center_test;
--
--
CREATE DATABASE city_center_test;
-- -------------------------
-- Role admin
-- -------------------------
DROP ROLE IF EXISTS admin;
--
--
CREATE ROLE admin WITH PASSWORD 'admin';
-- -------------------------
-- Alter Role admin
-- -------------------------
ALTER ROLE admin WITH SUPERUSER CREATEROLE CREATEDB LOGIN;
-- -------------------------
-- Database GRANT PRIVILEGES
-- -------------------------
GRANT ALL PRIVILEGES ON DATABASE city_center TO admin;
GRANT ALL PRIVILEGES ON DATABASE city_center_test TO admin;
-- -------------------------
-- Connect to city_center database
-- -------------------------
\c city_center;
-- -------------------------
-- Set Timezone
-- -------------------------
SET TIMEZONE = 'UTC';
-- -------------------------
-- Type group_roles
-- -------------------------
CREATE TYPE group_roles AS ENUM('ADMIN', 'SUPER_ADMIN', 'MODERATOR', 'MEMBER');
-- -------------------------
-- Table users
-- -------------------------
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT timezone('UTC', now()),
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP
);
-- -------------------------
-- Table phones
-- -------------------------
CREATE TABLE IF NOT EXISTS phones (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(30) UNIQUE NOT NULL,
  is_default BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  user_id INT NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
);
-- -------------------------
-- Table passwords
-- -------------------------
CREATE TABLE IF NOT EXISTS passwords (
  id SERIAL PRIMARY KEY,
  password TEXT NOT NULL,
  user_id INT NOT NULL UNIQUE REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
);
-- -------------------------
-- Table profile_pictures
-- -------------------------
CREATE TABLE IF NOT EXISTS profile_pictures (
  id SERIAL PRIMARY KEY,
  image_url VARCHAR(200) NOT NULL,
  user_id INT NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT timezone('UTC', now())
);
-- -------------------------
-- Table users_city
-- -------------------------
CREATE TABLE IF NOT EXISTS users_city (
  id SERIAL PRIMARY KEY,
  city VARCHAR(255) NOT NULL,
  user_id INT NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
);
-- -------------------------
-- Table birth_dates
-- -------------------------
CREATE TABLE IF NOT EXISTS birth_dates (
  id SERIAL PRIMARY KEY,
  birth_date DATE NOT NULL,
  user_id INT NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
);
-- -------------------------
-- Table user_payments
-- -------------------------
CREATE TABLE IF NOT EXISTS user_payments (
  id SERIAL PRIMARY KEY,
  payment_type VARCHAR(200) NOT NULL,
  provider VARCHAR(200) NOT NULL,
  account_no VARCHAR(200) NOT NULL,
  expiry VARCHAR(200) NOT NULL,
  user_id INT NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
);
-- -------------------------
-- Table dates
-- -------------------------
CREATE TABLE IF NOT EXISTS dates (
  id SERIAL PRIMARY KEY,
  start_date DATE NOT NULL,
  end_date DATE
);
-- -------------------------
-- Table card_images
-- -------------------------
CREATE TABLE IF NOT EXISTS card_images (
  id SERIAL PRIMARY KEY,
  image_url TEXT NOT NULL,
  user_id INT NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
);
-- -------------------------
-- Table colleges
-- -------------------------
CREATE TABLE IF NOT EXISTS colleges (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  major VARCHAR(200) NOT NULL,
  level VARCHAR(200) NOT NULL,
  user_id INT NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
  date_id INT NOT NULL REFERENCES dates(id) ON UPDATE CASCADE ON DELETE CASCADE,
  card_id INT NOT NULL REFERENCES card_images(id) ON UPDATE CASCADE ON DELETE CASCADE,
  is_verified BOOLEAN NOT NULL DEFAULT false
);
-- -------------------------
-- Table job_documents
-- -------------------------
CREATE TABLE IF NOT EXISTS job_documents (
  id SERIAL PRIMARY KEY,
  image_url TEXT,
  file_url TEXT,
  user_id INT NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
);
-- -------------------------
-- Table jobs
-- -------------------------
CREATE TABLE IF NOT EXISTS jobs (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  title VARCHAR(200) NOT NULL,
  user_id INT NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
  date_id INT NOT NULL REFERENCES dates(id) ON UPDATE CASCADE ON DELETE CASCADE,
  document_id INT NOT NULL REFERENCES card_images(id) ON UPDATE CASCADE ON DELETE CASCADE,
  is_verified BOOLEAN NOT NULL DEFAULT false
);
-- -------------------------
-- Table groups
-- -------------------------
CREATE TABLE IF NOT EXISTS groups (
  id SERIAL PRIMARY KEY,
  created_by INT NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  keywords TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT timezone('UTC', now()),
  updated_at TIMESTAMP
);
-- -------------------------
-- Table groups_members
-- -------------------------
CREATE TABLE IF NOT EXISTS groups_members (
  id SERIAL PRIMARY KEY,
  group_id INT NOT NULL REFERENCES groups(id) ON UPDATE CASCADE ON DELETE CASCADE,
  user_id INT NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
  user_role group_roles NOT NULL DEFAULT 'MEMBER'
);
-- -------------------------
-- Table posts
-- -------------------------
CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  post_caption TEXT,
  user_id INT NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
  group_id INT NOT NULL REFERENCES groups(id) ON UPDATE CASCADE ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT timezone('UTC', now())
);
-- -------------------------
-- Table post_images
-- -------------------------
CREATE TABLE IF NOT EXISTS post_images (
  id SERIAL PRIMARY KEY,
  image_url TEXT NOT NULL,
  post_id INT NOT NULL REFERENCES posts(id) ON UPDATE CASCADE ON DELETE CASCADE
);
-- -------------------------
-- Table post_videos
-- -------------------------
CREATE TABLE IF NOT EXISTS post_videos (
  id SERIAL PRIMARY KEY,
  video_url TEXT NOT NULL,
  post_id INT NOT NULL REFERENCES posts(id) ON UPDATE CASCADE ON DELETE CASCADE
);
-- -------------------------
-- Table post_likes
-- -------------------------
CREATE TABLE IF NOT EXISTS post_likes (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
  post_id INT NOT NULL REFERENCES posts(id) ON UPDATE CASCADE ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT timezone('UTC', now())
);
-- -------------------------
-- Table post_comments
-- -------------------------
CREATE TABLE IF NOT EXISTS post_comments (
  id SERIAL PRIMARY KEY,
  comment TEXT NOT NULL,
  user_id INT NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
  post_id INT NOT NULL REFERENCES posts(id) ON UPDATE CASCADE ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT timezone('UTC', now()),
  updated_at TIMESTAMP
);
-- -------------------------
-- Table conversations
-- -------------------------
CREATE TABLE IF NOT EXISTS conversations (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- -------------------------
-- Table deleted_conversations
-- -------------------------
CREATE TABLE IF NOT EXISTS deleted_conversations (
  id SERIAL PRIMARY KEY,
  conversation_id INT NOT NULL REFERENCES conversations(id) ON UPDATE CASCADE ON DELETE CASCADE,
  user_id INT NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- -------------------------
-- Table conversation_participants
-- -------------------------
CREATE TABLE IF NOT EXISTS conversation_participants (
  id SERIAL PRIMARY KEY,
  conversation_id INT NOT NULL REFERENCES conversations(id) ON UPDATE CASCADE ON DELETE CASCADE,
  participant_id INT NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- -------------------------
-- Table messages
-- -------------------------
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  conversation_id INT NOT NULL REFERENCES conversations(id) ON UPDATE CASCADE ON DELETE CASCADE,
  user_id INT NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
  message TEXT,
  is_seen BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP
);
-- -------------------------
-- Table attachments
-- -------------------------
CREATE TABLE IF NOT EXISTS attachments (
  id SERIAL PRIMARY KEY,
  message_id INT NOT NULL REFERENCES messages(id) ON UPDATE CASCADE ON DELETE CASCADE,
  file_url TEXT,
  image_url TEXT
);
-- -------------------------
-- Table deleted_messages
-- -------------------------
CREATE TABLE IF NOT EXISTS deleted_messages (
  id SERIAL PRIMARY KEY,
  message_id INT NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- -------------------------
-- Table chats
-- -------------------------
CREATE TABLE IF NOT EXISTS chats (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
  conversation_participants_id INT NOT NULL REFERENCES conversation_participants(id) ON UPDATE CASCADE ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);
-- -------------------------
-- Table rooms
-- -------------------------
CREATE TABLE IF NOT EXISTS rooms (
  id SERIAL PRIMARY KEY,
  created_by INT NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  keywords TEXT NOT NULL,
  conversation_participant_id INT NOT NULL REFERENCES conversation_participants(id) ON UPDATE CASCADE ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT timezone('UTC', now())
);
-- -------------------------
-- Table room_members
-- -------------------------
CREATE TABLE IF NOT EXISTS room_members (
  id SERIAL PRIMARY KEY,
  room_id INT NOT NULL REFERENCES rooms(id) ON UPDATE CASCADE ON DELETE CASCADE,
  user_id INT NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
);
