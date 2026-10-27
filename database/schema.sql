-- ================================================================
-- ALUMNI CONNECT PORTAL - RELATIONAL DATABASE SCHEMA (MySQL 8.0+)
-- College Flexi Project: Long-Term Alumni Engagement System
-- Architecture: Frontend (React) -> REST API (Flask/Express) -> MySQL
-- ================================================================

CREATE DATABASE IF NOT EXISTS `alumni_connect_db` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `alumni_connect_db`;

-- 1. USERS TABLE (Authentication & Role Base)
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(64) PRIMARY KEY,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('STUDENT', 'ALUMNI', 'ADMIN') NOT NULL DEFAULT 'STUDENT',
  `name` VARCHAR(150) NOT NULL,
  `avatar_url` VARCHAR(500) NULL,
  `student_id` VARCHAR(64) NULL,
  `alumni_id` VARCHAR(64) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_user_email` (`email`),
  INDEX `idx_user_role` (`role`)
) ENGINE=InnoDB;

-- 2. STUDENTS TABLE (Official College Student Registry & Convocation Eligibility)
CREATE TABLE IF NOT EXISTS `students` (
  `id` VARCHAR(64) PRIMARY KEY,
  `enrollment_no` VARCHAR(64) NOT NULL UNIQUE,
  `name` VARCHAR(150) NOT NULL,
  `branch` VARCHAR(100) NOT NULL,
  `degree` VARCHAR(50) NOT NULL DEFAULT 'B.Tech',
  `graduation_year` INT NOT NULL,
  `college_email` VARCHAR(191) NOT NULL UNIQUE,
  `personal_email` VARCHAR(191) NULL,
  `phone` VARCHAR(30) NULL,
  `cgpa` DECIMAL(4,2) NOT NULL,
  `graduation_status` ENUM('COMPLETE', 'IN_PROGRESS', 'BACKLOG_PENDING') NOT NULL DEFAULT 'IN_PROGRESS',
  `convocation_date` DATE NULL,
  `is_alumni_activated` BOOLEAN NOT NULL DEFAULT FALSE,
  `alumni_id` VARCHAR(64) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_student_enrollment` (`enrollment_no`),
  INDEX `idx_grad_status` (`graduation_status`),
  INDEX `idx_grad_year` (`graduation_year`)
) ENGINE=InnoDB;

-- 3. ALUMNI TABLE (Verified Alumni Profiles & Career Information)
CREATE TABLE IF NOT EXISTS `alumni` (
  `id` VARCHAR(64) PRIMARY KEY,
  `user_id` VARCHAR(64) NOT NULL,
  `student_id` VARCHAR(64) NOT NULL UNIQUE,
  `enrollment_no` VARCHAR(64) NOT NULL UNIQUE,
  `name` VARCHAR(150) NOT NULL,
  `branch` VARCHAR(100) NOT NULL,
  `degree` VARCHAR(50) NOT NULL,
  `graduation_year` INT NOT NULL,
  `college_email` VARCHAR(191) NOT NULL,
  `personal_email` VARCHAR(191) NOT NULL,
  `phone` VARCHAR(30) NULL,
  `avatar_url` VARCHAR(500) NULL,
  
  -- Professional & Career Details
  `current_company` VARCHAR(150) NULL,
  `job_role` VARCHAR(150) NULL,
  `industry` VARCHAR(100) NULL,
  `experience_years` INT DEFAULT 0,
  `city` VARCHAR(100) NULL,
  `country` VARCHAR(100) DEFAULT 'India',
  `higher_studies` VARCHAR(255) NULL,
  `skills_json` JSON NULL,
  `bio` TEXT NULL,
  `linkedin_url` VARCHAR(255) NULL,
  `github_url` VARCHAR(255) NULL,
  `website_url` VARCHAR(255) NULL,
  
  -- Mentorship Settings
  `is_available_for_mentorship` BOOLEAN NOT NULL DEFAULT FALSE,
  `mentorship_areas_json` JSON NULL,
  `max_mentees` INT DEFAULT 3,
  
  -- Admin Verification Badge State
  `verification_status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'APPROVED',
  `verified_at` TIMESTAMP NULL,
  `verified_by` VARCHAR(150) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE RESTRICT,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_alumni_branch` (`branch`),
  INDEX `idx_alumni_year` (`graduation_year`),
  INDEX `idx_alumni_company` (`current_company`),
  INDEX `idx_alumni_verification` (`verification_status`)
) ENGINE=InnoDB;

-- 4. PROFILE_CHANGE_REQUESTS TABLE (Audit & Admin Moderation Queue)
CREATE TABLE IF NOT EXISTS `profile_change_requests` (
  `id` VARCHAR(64) PRIMARY KEY,
  `alumni_id` VARCHAR(64) NOT NULL,
  `alumni_name` VARCHAR(150) NOT NULL,
  `alumni_enrollment` VARCHAR(64) NOT NULL,
  `current_company` VARCHAR(150) NULL,
  `proposed_company` VARCHAR(150) NULL,
  `current_job_role` VARCHAR(150) NULL,
  `proposed_job_role` VARCHAR(150) NULL,
  `current_higher_studies` VARCHAR(255) NULL,
  `proposed_higher_studies` VARCHAR(255) NULL,
  `current_skills_json` JSON NULL,
  `proposed_skills_json` JSON NULL,
  `reason` TEXT NULL,
  `supporting_doc_url` VARCHAR(500) NULL,
  `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
  `admin_remarks` TEXT NULL,
  `reviewed_by` VARCHAR(150) NULL,
  `reviewed_at` TIMESTAMP NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`alumni_id`) REFERENCES `alumni`(`id`) ON DELETE CASCADE,
  INDEX `idx_change_status` (`status`)
) ENGINE=InnoDB;

-- 5. CONNECTIONS TABLE (Professional Networking Graph)
CREATE TABLE IF NOT EXISTS `connections` (
  `id` VARCHAR(64) PRIMARY KEY,
  `sender_id` VARCHAR(64) NOT NULL,
  `sender_name` VARCHAR(150) NOT NULL,
  `receiver_id` VARCHAR(64) NOT NULL,
  `receiver_name` VARCHAR(150) NOT NULL,
  `status` ENUM('PENDING', 'ACCEPTED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
  `note` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`receiver_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `uniq_connection_pair` (`sender_id`, `receiver_id`),
  INDEX `idx_connection_status` (`status`)
) ENGINE=InnoDB;

-- 6. MENTORSHIP_REQUESTS TABLE (Mentorship Flow)
CREATE TABLE IF NOT EXISTS `mentorship_requests` (
  `id` VARCHAR(64) PRIMARY KEY,
  `mentor_id` VARCHAR(64) NOT NULL,
  `mentor_name` VARCHAR(150) NOT NULL,
  `mentee_id` VARCHAR(64) NOT NULL,
  `mentee_name` VARCHAR(150) NOT NULL,
  `mentee_enrollment` VARCHAR(64) NULL,
  `mentee_branch` VARCHAR(100) NULL,
  `mentee_year` INT NULL,
  `mentee_role` ENUM('STUDENT', 'ALUMNI') NOT NULL DEFAULT 'STUDENT',
  `mentorship_topic` VARCHAR(200) NOT NULL,
  `message` TEXT NOT NULL,
  `status` ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED') NOT NULL DEFAULT 'PENDING',
  `mentor_notes` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`mentor_id`) REFERENCES `alumni`(`id`) ON DELETE CASCADE,
  INDEX `idx_mentorship_status` (`status`)
) ENGINE=InnoDB;

-- 7. JOBS TABLE (Alumni & Career Opportunities)
CREATE TABLE IF NOT EXISTS `jobs` (
  `id` VARCHAR(64) PRIMARY KEY,
  `title` VARCHAR(200) NOT NULL,
  `company` VARCHAR(150) NOT NULL,
  `company_logo_url` VARCHAR(500) NULL,
  `location` VARCHAR(150) NOT NULL,
  `is_remote` BOOLEAN NOT NULL DEFAULT FALSE,
  `job_type` ENUM('FULL_TIME', 'INTERNSHIP', 'REFERRAL', 'CONTRACT') NOT NULL DEFAULT 'FULL_TIME',
  `experience_level` ENUM('ENTRY', 'MID', 'SENIOR', 'LEAD') NOT NULL DEFAULT 'ENTRY',
  `description` TEXT NOT NULL,
  `requirements_json` JSON NOT NULL,
  `skills_json` JSON NOT NULL,
  `apply_url` VARCHAR(500) NULL,
  `contact_email` VARCHAR(191) NOT NULL,
  `deadline` DATE NOT NULL,
  `posted_by_alumni_id` VARCHAR(64) NOT NULL,
  `posted_by_name` VARCHAR(150) NOT NULL,
  `posted_by_company` VARCHAR(150) NOT NULL,
  `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'APPROVED',
  `admin_remark` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_job_status` (`status`),
  INDEX `idx_job_deadline` (`deadline`)
) ENGINE=InnoDB;

-- 8. EVENTS & REGISTRATIONS TABLES
CREATE TABLE IF NOT EXISTS `events` (
  `id` VARCHAR(64) PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `category` ENUM('REUNION', 'TECH_TALK', 'CONVOCATION', 'WORKSHOP', 'CAREER_FAIR', 'NETWORKING') NOT NULL,
  `description` TEXT NOT NULL,
  `date` DATE NOT NULL,
  `time` VARCHAR(100) NOT NULL,
  `location` VARCHAR(255) NOT NULL,
  `is_virtual` BOOLEAN NOT NULL DEFAULT FALSE,
  `meeting_link` VARCHAR(500) NULL,
  `banner_url` VARCHAR(500) NULL,
  `organizer` VARCHAR(150) NOT NULL,
  `capacity` INT DEFAULT 500,
  `registration_count` INT NOT NULL DEFAULT 0,
  `is_registrations_open` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_event_date` (`date`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `event_registrations` (
  `id` VARCHAR(64) PRIMARY KEY,
  `event_id` VARCHAR(64) NOT NULL,
  `user_id` VARCHAR(64) NOT NULL,
  `registered_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `uniq_event_user` (`event_id`, `user_id`)
) ENGINE=InnoDB;

-- 9. ACHIEVEMENTS TABLE
CREATE TABLE IF NOT EXISTS `achievements` (
  `id` VARCHAR(64) PRIMARY KEY,
  `alumni_id` VARCHAR(64) NOT NULL,
  `alumni_name` VARCHAR(150) NOT NULL,
  `alumni_enrollment` VARCHAR(64) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `category` ENUM('CAREER', 'ACADEMIC', 'ENTREPRENEURSHIP', 'COMMUNITY', 'RESEARCH', 'AWARDS') NOT NULL,
  `description` TEXT NOT NULL,
  `year` INT NOT NULL,
  `certificate_url` VARCHAR(500) NULL,
  `proof_url` VARCHAR(500) NULL,
  `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
  `admin_remark` TEXT NULL,
  `verified_at` TIMESTAMP NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`alumni_id`) REFERENCES `alumni`(`id`) ON DELETE CASCADE,
  INDEX `idx_achievement_status` (`status`)
) ENGINE=InnoDB;

-- 10. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` VARCHAR(64) PRIMARY KEY,
  `user_id` VARCHAR(64) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `type` ENUM('VERIFICATION', 'CONNECTION', 'MENTORSHIP', 'EVENT', 'JOB', 'ACHIEVEMENT') NOT NULL,
  `is_read` BOOLEAN NOT NULL DEFAULT FALSE,
  `link` VARCHAR(255) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_notif_user` (`user_id`, `is_read`)
) ENGINE=InnoDB;
