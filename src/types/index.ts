export type UserRole = 'STUDENT' | 'ALUMNI' | 'ADMIN';

export type GraduationStatus = 'COMPLETE' | 'IN_PROGRESS' | 'BACKLOG_PENDING';

export type VerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type ConnectionStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export type MentorshipStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED';

export type JobType = 'FULL_TIME' | 'INTERNSHIP' | 'REFERRAL' | 'CONTRACT';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  avatarUrl?: string;
  studentId?: string;
  alumniId?: string;
  createdAt: string;
}

export interface Student {
  id: string;
  enrollmentNo: string;
  name: string;
  branch: string;
  degree: string;
  graduationYear: number;
  collegeEmail: string;
  personalEmail?: string;
  phone?: string;
  cgpa: number;
  graduationStatus: GraduationStatus;
  convocationDate?: string;
  isAlumniActivated: boolean;
  alumniId?: string;
  createdAt: string;
}

export interface Achievement {
  id: string;
  alumniId: string;
  alumniName: string;
  alumniEnrollment: string;
  title: string;
  category: 'CAREER' | 'ACADEMIC' | 'ENTREPRENEURSHIP' | 'COMMUNITY' | 'RESEARCH' | 'AWARDS';
  description: string;
  year: number;
  certificateUrl?: string;
  proofUrl?: string;
  status: VerificationStatus;
  adminRemark?: string;
  verifiedAt?: string;
  createdAt: string;
}

export interface AlumniProfile {
  id: string;
  userId: string;
  studentId: string;
  enrollmentNo: string;
  name: string;
  branch: string;
  degree: string;
  graduationYear: number;
  collegeEmail: string;
  personalEmail: string;
  phone?: string;
  avatarUrl: string;
  
  // Professional & Current Details
  currentCompany?: string;
  jobRole?: string;
  industry?: string;
  experienceYears?: number;
  city?: string;
  country?: string;
  higherStudies?: string; // e.g. "MS in CS @ Stanford University"
  skills: string[];
  bio?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  websiteUrl?: string;
  
  // Mentorship
  isAvailableForMentorship: boolean;
  mentorshipAreas: string[];
  maxMentees: number;
  
  // Verification State
  verificationStatus: VerificationStatus;
  verifiedAt?: string;
  verifiedBy?: string;

  // Privacy & Sharing Settings
  privacySettings?: {
    shareEmailWithConnections: boolean;
    sharePhoneWithConnections: boolean;
    allowDirectMessaging: boolean;
    preferredContactMethod?: 'EMAIL' | 'PHONE' | 'WHATSAPP' | 'LINKEDIN';
    profileVisibility?: 'PUBLIC' | 'COMMUNITY_ONLY' | 'CONNECTIONS_ONLY';
  };
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface ConnectionPrivacyDetails {
  shareEmail: boolean;
  sharePhone: boolean;
  personalEmail?: string;
  phone?: string;
  preferredChannel?: 'EMAIL' | 'PHONE' | 'WHATSAPP' | 'LINKEDIN';
  privateNote?: string;
}

export interface PrivateConnectionMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole?: string;
  message: string;
  timestamp: string;
}

export interface ProfileChangeRequest {
  id: string;
  alumniId: string;
  alumniName: string;
  alumniEnrollment: string;
  currentCompany?: string;
  proposedCompany?: string;
  currentJobRole?: string;
  proposedJobRole?: string;
  currentHigherStudies?: string;
  proposedHigherStudies?: string;
  currentSkills?: string[];
  proposedSkills?: string[];
  reason?: string;
  supportingDocUrl?: string;
  status: VerificationStatus;
  adminRemarks?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
}

export interface Connection {
  id: string;
  senderId: string;
  senderName: string;
  senderRole?: string;
  senderCompany?: string;
  senderAvatar?: string;
  receiverId: string;
  receiverName: string;
  receiverRole?: string;
  receiverCompany?: string;
  receiverAvatar?: string;
  status: ConnectionStatus;
  note?: string;
  createdAt: string;
  updatedAt: string;

  // Mutual Privacy & Sharing Vault
  privacyConsentAccepted?: boolean;
  senderPrivacy?: ConnectionPrivacyDetails;
  receiverPrivacy?: ConnectionPrivacyDetails;
  privateMessages?: PrivateConnectionMessage[];
}

export interface MentorshipRequest {
  id: string;
  mentorId: string; // alumniId
  mentorName: string;
  mentorCompany?: string;
  mentorRole?: string;
  mentorAvatar?: string;
  menteeId: string; // studentId or alumniId
  menteeName: string;
  menteeEnrollment?: string;
  menteeBranch?: string;
  menteeYear?: number;
  menteeRole: UserRole;
  menteeAvatar?: string;
  mentorshipTopic: string;
  message: string;
  status: MentorshipStatus;
  mentorNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobPost {
  id: string;
  title: string;
  company: string;
  companyLogoUrl?: string;
  location: string;
  isRemote: boolean;
  jobType: JobType;
  experienceLevel: 'ENTRY' | 'MID' | 'SENIOR' | 'LEAD';
  description: string;
  requirements: string[];
  skills: string[];
  applyUrl?: string;
  contactEmail?: string;
  deadline: string;
  postedByAlumniId: string;
  postedByName: string;
  postedByCompany: string;
  status: VerificationStatus;
  adminRemark?: string;
  createdAt: string;
}

export interface CollegeEvent {
  id: string;
  title: string;
  category: 'REUNION' | 'TECH_TALK' | 'CONVOCATION' | 'WORKSHOP' | 'CAREER_FAIR' | 'NETWORKING';
  description: string;
  date: string;
  time: string;
  location: string;
  isVirtual: boolean;
  meetingLink?: string;
  bannerUrl?: string;
  organizer: string;
  capacity?: number;
  registrationCount: number;
  registeredUserIds: string[];
  isRegistrationsOpen: boolean;
  createdAt: string;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: UserRole;
  registeredAt: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'VERIFICATION' | 'CONNECTION' | 'MENTORSHIP' | 'EVENT' | 'JOB' | 'ACHIEVEMENT';
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface AdminMetrics {
  totalStudents: number;
  eligibleGraduates: number;
  totalAlumni: number;
  verifiedAlumni: number;
  pendingVerifications: number;
  pendingProfileChanges: number;
  pendingAchievements: number;
  pendingJobs: number;
  totalEvents: number;
  totalRegistrations: number;
  activeMentorshipRequests: number;
  totalConnections: number;
}
