import { pgTable, text, integer, boolean, timestamp, json } from 'drizzle-orm/pg-core';

// 1. Users Table
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  uid: text('uid').unique(), // Firebase Auth UID
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash'),
  role: text('role').notNull().default('STUDENT'), // STUDENT, ALUMNI, ADMIN
  name: text('name').notNull(),
  avatarUrl: text('avatar_url'),
  studentId: text('student_id'),
  alumniId: text('alumni_id'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 2. Students Table
export const students = pgTable('students', {
  id: text('id').primaryKey(),
  enrollmentNo: text('enrollment_no').notNull().unique(),
  name: text('name').notNull(),
  branch: text('branch').notNull(),
  degree: text('degree').notNull().default('B.Tech'),
  graduationYear: integer('graduation_year').notNull(),
  collegeEmail: text('college_email').notNull().unique(),
  personalEmail: text('personal_email'),
  phone: text('phone'),
  cgpa: text('cgpa').notNull(),
  graduationStatus: text('graduation_status').notNull().default('IN_PROGRESS'),
  convocationDate: text('convocation_date'),
  isAlumniActivated: boolean('is_alumni_activated').notNull().default(false),
  alumniId: text('alumni_id'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 3. Alumni Profiles Table
export const alumni = pgTable('alumni', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  studentId: text('student_id').notNull().unique(),
  enrollmentNo: text('enrollment_no').notNull().unique(),
  name: text('name').notNull(),
  branch: text('branch').notNull(),
  degree: text('degree').notNull(),
  graduationYear: integer('graduation_year').notNull(),
  collegeEmail: text('college_email').notNull(),
  personalEmail: text('personal_email').notNull(),
  phone: text('phone'),
  avatarUrl: text('avatar_url'),
  currentCompany: text('current_company'),
  jobRole: text('job_role'),
  industry: text('industry'),
  experienceYears: integer('experience_years').default(0),
  city: text('city'),
  country: text('country').default('India'),
  higherStudies: text('higher_studies'),
  skills: json('skills').$type<string[]>(),
  bio: text('bio'),
  linkedinUrl: text('linkedin_url'),
  githubUrl: text('github_url'),
  websiteUrl: text('website_url'),
  isAvailableForMentorship: boolean('is_available_for_mentorship').notNull().default(false),
  mentorshipAreas: json('mentorship_areas').$type<string[]>(),
  maxMentees: integer('max_mentees').default(3),
  verificationStatus: text('verification_status').notNull().default('APPROVED'),
  verifiedAt: timestamp('verified_at'),
  verifiedBy: text('verified_by'),
  privacySettings: json('privacy_settings').$type<any>(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 4. Profile Change Requests Table
export const profileChangeRequests = pgTable('profile_change_requests', {
  id: text('id').primaryKey(),
  alumniId: text('alumni_id').notNull(),
  alumniName: text('alumni_name').notNull(),
  alumniEnrollment: text('alumni_enrollment').notNull(),
  currentCompany: text('current_company'),
  proposedCompany: text('proposed_company'),
  currentJobRole: text('current_job_role'),
  proposedJobRole: text('proposed_job_role'),
  currentHigherStudies: text('current_higher_studies'),
  proposedHigherStudies: text('proposed_higher_studies'),
  currentSkills: json('current_skills').$type<string[]>(),
  proposedSkills: json('proposed_skills').$type<string[]>(),
  reason: text('reason'),
  supportingDocUrl: text('supporting_doc_url'),
  status: text('status').notNull().default('PENDING'),
  adminRemarks: text('admin_remarks'),
  reviewedBy: text('reviewed_by'),
  reviewedAt: timestamp('reviewed_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 5. Connections Table
export const connections = pgTable('connections', {
  id: text('id').primaryKey(),
  senderId: text('sender_id').notNull(),
  senderName: text('sender_name').notNull(),
  senderRole: text('sender_role'),
  senderCompany: text('sender_company'),
  senderAvatar: text('sender_avatar'),
  receiverId: text('receiver_id').notNull(),
  receiverName: text('receiver_name').notNull(),
  receiverRole: text('receiver_role'),
  receiverCompany: text('receiver_company'),
  receiverAvatar: text('receiver_avatar'),
  status: text('status').notNull().default('PENDING'),
  note: text('note'),
  senderSharedDetails: json('sender_shared_details').$type<any>(),
  receiverSharedDetails: json('receiver_shared_details').$type<any>(),
  privateMessages: json('private_messages').$type<any[]>(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 6. Mentorship Requests Table
export const mentorshipRequests = pgTable('mentorship_requests', {
  id: text('id').primaryKey(),
  mentorId: text('mentor_id').notNull(),
  mentorName: text('mentor_name').notNull(),
  menteeId: text('mentee_id').notNull(),
  menteeName: text('mentee_name').notNull(),
  menteeEnrollment: text('mentee_enrollment'),
  menteeBranch: text('mentee_branch'),
  menteeYear: integer('mentee_year'),
  menteeRole: text('mentee_role').notNull().default('STUDENT'),
  mentorshipTopic: text('mentorship_topic').notNull(),
  message: text('message').notNull(),
  status: text('status').notNull().default('PENDING'),
  mentorNotes: text('mentor_notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 7. Jobs Table
export const jobs = pgTable('jobs', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  company: text('company').notNull(),
  companyLogoUrl: text('company_logo_url'),
  location: text('location').notNull(),
  isRemote: boolean('is_remote').notNull().default(false),
  jobType: text('job_type').notNull().default('FULL_TIME'),
  experienceLevel: text('experience_level').notNull().default('ENTRY'),
  description: text('description').notNull(),
  requirements: json('requirements').$type<string[]>().notNull(),
  skills: json('skills').$type<string[]>().notNull(),
  applyUrl: text('apply_url'),
  contactEmail: text('contact_email').notNull(),
  deadline: text('deadline').notNull(),
  postedByAlumniId: text('posted_by_alumni_id').notNull(),
  postedByName: text('posted_by_name').notNull(),
  postedByCompany: text('posted_by_company').notNull(),
  status: text('status').notNull().default('APPROVED'),
  adminRemark: text('admin_remark'),
  applicantCount: integer('applicant_count').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

// 8. Events Table
export const events = pgTable('events', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  category: text('category').notNull(),
  description: text('description').notNull(),
  date: text('date').notNull(),
  time: text('time').notNull(),
  location: text('location').notNull(),
  isVirtual: boolean('is_virtual').notNull().default(false),
  meetingLink: text('meeting_link'),
  bannerUrl: text('banner_url'),
  organizer: text('organizer').notNull(),
  capacity: integer('capacity').default(500),
  registrationCount: integer('registration_count').notNull().default(0),
  isRegistrationsOpen: boolean('is_registrations_open').notNull().default(true),
  registeredUserIds: json('registered_user_ids').$type<string[]>(),
  createdAt: timestamp('created_at').defaultNow(),
});

// 9. Achievements Table
export const achievements = pgTable('achievements', {
  id: text('id').primaryKey(),
  alumniId: text('alumni_id').notNull(),
  alumniName: text('alumni_name').notNull(),
  alumniEnrollment: text('alumni_enrollment').notNull(),
  title: text('title').notNull(),
  category: text('category').notNull(),
  description: text('description').notNull(),
  year: integer('year').notNull(),
  certificateUrl: text('certificate_url'),
  proofUrl: text('proof_url'),
  status: text('status').notNull().default('PENDING'),
  adminRemark: text('admin_remark'),
  verifiedAt: timestamp('verified_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 10. Notifications Table
export const notifications = pgTable('notifications', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  type: text('type').notNull(),
  isRead: boolean('is_read').notNull().default(false),
  link: text('link'),
  createdAt: timestamp('created_at').defaultNow(),
});
