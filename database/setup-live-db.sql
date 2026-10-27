-- ================================================================
-- COLLEGE ALUMNI ENGAGEMENT PORTAL
-- Complete Live PostgreSQL & Supabase Database Setup Script
-- Compatible with: Supabase SQL Editor, Neon, Cloud SQL, Local PostgreSQL
-- ================================================================

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. STUDENTS TABLE (Official College Registry & Convocation Clearance)
CREATE TABLE IF NOT EXISTS students (
  id VARCHAR(64) PRIMARY KEY,
  enrollment_no VARCHAR(32) UNIQUE NOT NULL,
  name VARCHAR(128) NOT NULL,
  branch VARCHAR(64) NOT NULL,
  degree VARCHAR(32) NOT NULL,
  graduation_year INTEGER NOT NULL,
  college_email VARCHAR(128) UNIQUE NOT NULL,
  personal_email VARCHAR(128),
  phone VARCHAR(32),
  cgpa NUMERIC(4, 2) NOT NULL,
  graduation_status VARCHAR(32) NOT NULL DEFAULT 'COMPLETE',
  convocation_date VARCHAR(64),
  is_alumni_activated BOOLEAN DEFAULT FALSE,
  alumni_id VARCHAR(64),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. USERS TABLE (Authentication & Role Base)
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  email VARCHAR(128) UNIQUE NOT NULL,
  password_hash VARCHAR(256) NOT NULL,
  role VARCHAR(32) NOT NULL DEFAULT 'STUDENT',
  name VARCHAR(128) NOT NULL,
  avatar_url TEXT,
  student_id VARCHAR(64) REFERENCES students(id) ON DELETE SET NULL,
  alumni_id VARCHAR(64),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. ALUMNI TABLE (Verified Alumni Profiles)
CREATE TABLE IF NOT EXISTS alumni (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
  student_id VARCHAR(64) UNIQUE REFERENCES students(id) ON DELETE CASCADE,
  enrollment_no VARCHAR(32) NOT NULL,
  name VARCHAR(128) NOT NULL,
  branch VARCHAR(64) NOT NULL,
  degree VARCHAR(32) NOT NULL,
  graduation_year INTEGER NOT NULL,
  college_email VARCHAR(128) NOT NULL,
  personal_email VARCHAR(128) NOT NULL,
  phone VARCHAR(32),
  avatar_url TEXT NOT NULL,
  current_company VARCHAR(128),
  job_role VARCHAR(128),
  industry VARCHAR(64),
  experience_years INTEGER DEFAULT 0,
  city VARCHAR(64),
  country VARCHAR(64) DEFAULT 'India',
  higher_studies VARCHAR(128),
  skills TEXT[] DEFAULT '{}',
  bio TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  website_url TEXT,
  is_available_for_mentorship BOOLEAN DEFAULT FALSE,
  mentorship_areas TEXT[] DEFAULT '{}',
  max_mentees INTEGER DEFAULT 3,
  verification_status VARCHAR(32) NOT NULL DEFAULT 'APPROVED',
  verified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  verified_by VARCHAR(128) DEFAULT 'College Convocation System',
  privacy_settings JSONB DEFAULT '{"shareEmailWithConnections": true, "sharePhoneWithConnections": true, "allowDirectMessaging": true, "preferredContactMethod": "EMAIL", "profileVisibility": "PUBLIC"}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. JOBS TABLE (Alumni & College Opportunities)
CREATE TABLE IF NOT EXISTS jobs (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(128) NOT NULL,
  company VARCHAR(128) NOT NULL,
  company_logo_url TEXT,
  location VARCHAR(128) NOT NULL,
  is_remote BOOLEAN DEFAULT FALSE,
  job_type VARCHAR(32) NOT NULL DEFAULT 'FULL_TIME',
  experience_level VARCHAR(32) NOT NULL DEFAULT 'ENTRY',
  description TEXT NOT NULL,
  requirements TEXT[] DEFAULT '{}',
  skills TEXT[] DEFAULT '{}',
  apply_url TEXT,
  contact_email VARCHAR(128) NOT NULL,
  deadline VARCHAR(32) NOT NULL,
  posted_by_alumni_id VARCHAR(64) NOT NULL,
  posted_by_name VARCHAR(128) NOT NULL,
  posted_by_company VARCHAR(128) NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
  admin_remark TEXT,
  applicant_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. EVENTS TABLE (Alumni Galas & Networking)
CREATE TABLE IF NOT EXISTS events (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(128) NOT NULL,
  category VARCHAR(32) NOT NULL DEFAULT 'NETWORKING',
  description TEXT NOT NULL,
  date VARCHAR(64) NOT NULL,
  time VARCHAR(64) NOT NULL,
  location VARCHAR(128) NOT NULL,
  is_virtual BOOLEAN DEFAULT FALSE,
  meeting_link TEXT,
  banner_url TEXT,
  organizer VARCHAR(128) NOT NULL,
  capacity INTEGER DEFAULT 500,
  registration_count INTEGER DEFAULT 0,
  is_registrations_open BOOLEAN DEFAULT TRUE,
  registered_user_ids TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. ACHIEVEMENTS TABLE
CREATE TABLE IF NOT EXISTS achievements (
  id VARCHAR(64) PRIMARY KEY,
  alumni_id VARCHAR(64) REFERENCES alumni(id) ON DELETE CASCADE,
  alumni_name VARCHAR(128) NOT NULL,
  alumni_enrollment VARCHAR(32) NOT NULL,
  title VARCHAR(128) NOT NULL,
  category VARCHAR(32) NOT NULL DEFAULT 'CAREER',
  description TEXT NOT NULL,
  year INTEGER NOT NULL,
  certificate_url TEXT,
  proof_url TEXT,
  status VARCHAR(32) NOT NULL DEFAULT 'APPROVED',
  admin_remark TEXT,
  verified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. PROFILE CHANGE REQUESTS (Admin Audit Trail)
CREATE TABLE IF NOT EXISTS profile_change_requests (
  id VARCHAR(64) PRIMARY KEY,
  alumni_id VARCHAR(64) REFERENCES alumni(id) ON DELETE CASCADE,
  alumni_name VARCHAR(128) NOT NULL,
  alumni_enrollment VARCHAR(32) NOT NULL,
  current_company VARCHAR(128),
  proposed_company VARCHAR(128),
  current_job_role VARCHAR(128),
  proposed_job_role VARCHAR(128),
  current_higher_studies VARCHAR(128),
  proposed_higher_studies VARCHAR(128),
  current_skills TEXT[],
  proposed_skills TEXT[],
  reason TEXT,
  supporting_doc_url TEXT,
  status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
  admin_remarks TEXT,
  reviewed_by VARCHAR(128),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. CONNECTIONS TABLE (Mutual Privacy & Networking Vault)
CREATE TABLE IF NOT EXISTS connections (
  id VARCHAR(64) PRIMARY KEY,
  sender_id VARCHAR(64) NOT NULL,
  sender_name VARCHAR(128) NOT NULL,
  sender_role VARCHAR(64),
  sender_company VARCHAR(128),
  sender_avatar TEXT,
  receiver_id VARCHAR(64) NOT NULL,
  receiver_name VARCHAR(128) NOT NULL,
  receiver_role VARCHAR(64),
  receiver_company VARCHAR(128),
  receiver_avatar TEXT,
  status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
  note TEXT,
  sender_shared_details JSONB,
  receiver_shared_details JSONB,
  private_messages JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_connection_pair UNIQUE(sender_id, receiver_id)
);

-- 9. MENTORSHIP REQUESTS TABLE
CREATE TABLE IF NOT EXISTS mentorship_requests (
  id VARCHAR(64) PRIMARY KEY,
  mentor_id VARCHAR(64) NOT NULL,
  mentor_name VARCHAR(128) NOT NULL,
  mentee_id VARCHAR(64) NOT NULL,
  mentee_name VARCHAR(128) NOT NULL,
  mentee_enrollment VARCHAR(32),
  mentee_branch VARCHAR(64),
  mentee_year INTEGER,
  mentee_role VARCHAR(32) NOT NULL DEFAULT 'STUDENT',
  mentorship_topic VARCHAR(128) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
  mentor_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  title VARCHAR(128) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(32) NOT NULL DEFAULT 'SYSTEM',
  is_read BOOLEAN DEFAULT FALSE,
  link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Helpful Indexes
CREATE INDEX IF NOT EXISTS idx_students_enrollment ON students(enrollment_no);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_alumni_branch ON alumni(branch);
CREATE INDEX IF NOT EXISTS idx_alumni_company ON alumni(current_company);
CREATE INDEX IF NOT EXISTS idx_connections_users ON connections(sender_id, receiver_id);

-- Success message
SELECT 'Live PostgreSQL / Supabase schema setup completed successfully!' AS status;
