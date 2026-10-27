import mongoose, { Schema, Document, Model } from 'mongoose';
import {
  INITIAL_STUDENTS,
  INITIAL_ALUMNI,
  INITIAL_JOBS,
  INITIAL_EVENTS,
  INITIAL_ACHIEVEMENTS,
  INITIAL_PROFILE_CHANGES,
  INITIAL_CONNECTIONS,
  INITIAL_MENTORSHIP_REQUESTS,
} from './data/seedData.ts';
import { db } from './db.ts';

// ==========================================
// MONGOOSE SCHEMAS & MODELS FOR MONGODB
// ==========================================

// 1. Student Schema
export interface IStudentDoc extends Document {
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
  graduationStatus: 'COMPLETE' | 'IN_PROGRESS' | 'BACKLOG_PENDING';
  convocationDate?: string;
  isAlumniActivated: boolean;
  alumniId?: string;
  createdAt: string;
}

const StudentSchema = new Schema<IStudentDoc>({
  id: { type: String, required: true, unique: true },
  enrollmentNo: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  branch: { type: String, required: true, index: true },
  degree: { type: String, required: true },
  graduationYear: { type: Number, required: true, index: true },
  collegeEmail: { type: String, required: true },
  personalEmail: { type: String },
  phone: { type: String },
  cgpa: { type: Number, required: true },
  graduationStatus: { type: String, enum: ['COMPLETE', 'IN_PROGRESS', 'BACKLOG_PENDING'], required: true },
  convocationDate: { type: String },
  isAlumniActivated: { type: Boolean, default: false },
  alumniId: { type: String },
  createdAt: { type: String },
}, { timestamps: true });

// 2. Alumni Schema
export interface IAlumniDoc extends Document {
  id: string;
  studentId: string;
  userId?: string;
  name: string;
  enrollmentNo: string;
  branch: string;
  degree: string;
  graduationYear: number;
  collegeEmail: string;
  currentCompany?: string;
  jobRole?: string;
  industry?: string;
  experienceYears?: number;
  city?: string;
  country?: string;
  higherStudies?: string;
  skills: string[];
  bio?: string;
  avatarUrl: string;
  phone?: string;
  personalEmail?: string;
  websiteUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  isAvailableForMentorship: boolean;
  mentorshipAreas: string[];
  maxMentees: number;
  verificationStatus: 'VERIFIED' | 'PENDING' | 'REJECTED';
  isClaimed?: boolean;
  privacySettings?: {
    shareEmailWithConnections: boolean;
    sharePhoneWithConnections: boolean;
    allowDirectMessaging: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

const AlumniSchema = new Schema<IAlumniDoc>({
  id: { type: String, required: true, unique: true },
  studentId: { type: String, required: true, index: true },
  userId: { type: String },
  name: { type: String, required: true, index: true },
  enrollmentNo: { type: String, required: true },
  branch: { type: String, required: true, index: true },
  degree: { type: String, default: 'B.Tech' },
  graduationYear: { type: Number, required: true, index: true },
  collegeEmail: { type: String, required: true },
  currentCompany: { type: String, index: true },
  jobRole: { type: String },
  industry: { type: String },
  experienceYears: { type: Number, default: 0 },
  city: { type: String },
  country: { type: String },
  higherStudies: { type: String },
  skills: [{ type: String }],
  bio: { type: String },
  avatarUrl: { type: String },
  phone: { type: String },
  personalEmail: { type: String },
  websiteUrl: { type: String },
  linkedinUrl: { type: String },
  githubUrl: { type: String },
  isAvailableForMentorship: { type: Boolean, default: false },
  mentorshipAreas: [{ type: String }],
  maxMentees: { type: Number, default: 2 },
  verificationStatus: { type: String, default: 'APPROVED' },
  isClaimed: { type: Boolean, default: false },
  privacySettings: {
    shareEmailWithConnections: { type: Boolean, default: true },
    sharePhoneWithConnections: { type: Boolean, default: false },
    allowDirectMessaging: { type: Boolean, default: true },
  },
  createdAt: { type: String },
  updatedAt: { type: String },
}, { timestamps: true });

// 3. User Credentials & Auth Schema
export interface IUserDoc extends Document {
  id: string;
  email: string;
  passwordHash: string;
  role: 'STUDENT' | 'ALUMNI' | 'ADMIN';
  name: string;
  avatarUrl?: string;
  studentId?: string;
  alumniId?: string;
  createdAt: string;
}

const UserSchema = new Schema<IUserDoc>({
  id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['STUDENT', 'ALUMNI', 'ADMIN'], required: true },
  name: { type: String, required: true },
  avatarUrl: { type: String },
  studentId: { type: String },
  alumniId: { type: String },
  createdAt: { type: String },
}, { timestamps: true });

// 4. Job Post Schema
export interface IJobDoc extends Document {
  id: string;
  title: string;
  company: string;
  companyLogoUrl?: string;
  location: string;
  isRemote: boolean;
  jobType: string;
  experienceLevel: string;
  description: string;
  requirements: string[];
  skills: string[];
  applyUrl?: string;
  contactEmail: string;
  deadline: string;
  status: string;
  postedByAlumniId: string;
  postedByName: string;
  postedByCompany: string;
  applicantCount?: number;
  createdAt: string;
}

const JobSchema = new Schema<IJobDoc>({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  company: { type: String, required: true },
  companyLogoUrl: { type: String },
  location: { type: String, default: 'Hybrid' },
  isRemote: { type: Boolean, default: false },
  jobType: { type: String, default: 'FULL_TIME' },
  experienceLevel: { type: String, default: 'ENTRY' },
  description: { type: String, required: true },
  requirements: [{ type: String }],
  skills: [{ type: String }],
  applyUrl: { type: String },
  contactEmail: { type: String, required: true },
  deadline: { type: String, required: true },
  status: { type: String, default: 'APPROVED' },
  postedByAlumniId: { type: String },
  postedByName: { type: String },
  postedByCompany: { type: String },
  applicantCount: { type: Number, default: 0 },
  createdAt: { type: String },
}, { timestamps: true });

// 5. College Event Schema
export interface IEventDoc extends Document {
  id: string;
  title: string;
  category: string;
  description: string;
  date: string;
  time: string;
  location: string;
  isVirtual: boolean;
  meetingLink?: string;
  bannerUrl: string;
  organizer: string;
  capacity: number;
  registrationCount?: number;
  registeredUserIds: string[];
  isRegistrationsOpen: boolean;
  createdAt: string;
}

const EventSchema = new Schema<IEventDoc>({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  category: { type: String, default: 'NETWORKING' },
  description: { type: String },
  date: { type: String, required: true },
  time: { type: String },
  location: { type: String, required: true },
  isVirtual: { type: Boolean, default: false },
  meetingLink: { type: String },
  bannerUrl: { type: String },
  organizer: { type: String, default: 'Alumni Affairs Cell' },
  capacity: { type: Number, default: 500 },
  registrationCount: { type: Number, default: 0 },
  registeredUserIds: [{ type: String }],
  isRegistrationsOpen: { type: Boolean, default: true },
  createdAt: { type: String },
}, { timestamps: true });

// 6. Achievement Schema
export interface IAchievementDoc extends Document {
  id: string;
  alumniId: string;
  alumniName: string;
  alumniEnrollment: string;
  title: string;
  category: string;
  description: string;
  year: number;
  certificateUrl?: string;
  proofUrl?: string;
  status: string;
  adminRemark?: string;
  verifiedAt?: string;
  createdAt: string;
}

const AchievementSchema = new Schema<IAchievementDoc>({
  id: { type: String, required: true, unique: true },
  alumniId: { type: String, required: true, index: true },
  alumniName: { type: String, required: true },
  alumniEnrollment: { type: String, required: true },
  title: { type: String, required: true },
  category: { type: String, default: 'CAREER' },
  description: { type: String },
  year: { type: Number, required: true },
  certificateUrl: { type: String },
  proofUrl: { type: String },
  status: { type: String, default: 'APPROVED' },
  adminRemark: { type: String },
  verifiedAt: { type: String },
  createdAt: { type: String },
}, { timestamps: true });

// 7. Profile Change Request Schema
export interface IProfileChangeDoc extends Document {
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
  status: string;
  adminRemarks?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
}

const ProfileChangeSchema = new Schema<IProfileChangeDoc>({
  id: { type: String, required: true, unique: true },
  alumniId: { type: String, required: true, index: true },
  alumniName: { type: String, required: true },
  alumniEnrollment: { type: String, required: true },
  currentCompany: { type: String },
  proposedCompany: { type: String },
  currentJobRole: { type: String },
  proposedJobRole: { type: String },
  currentHigherStudies: { type: String },
  proposedHigherStudies: { type: String },
  currentSkills: [{ type: String }],
  proposedSkills: [{ type: String }],
  reason: { type: String },
  supportingDocUrl: { type: String },
  status: { type: String, default: 'PENDING', index: true },
  adminRemarks: { type: String },
  reviewedBy: { type: String },
  reviewedAt: { type: String },
  createdAt: { type: String },
}, { timestamps: true });

// 8. Connection Schema
export interface IConnectionDoc extends Document {
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
  status: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

const ConnectionSchema = new Schema<IConnectionDoc>({
  id: { type: String, required: true, unique: true },
  senderId: { type: String, required: true, index: true },
  senderName: { type: String, required: true },
  senderRole: { type: String },
  senderCompany: { type: String },
  senderAvatar: { type: String },
  receiverId: { type: String, required: true, index: true },
  receiverName: { type: String, required: true },
  receiverRole: { type: String },
  receiverCompany: { type: String },
  receiverAvatar: { type: String },
  status: { type: String, default: 'PENDING', index: true },
  note: { type: String },
  createdAt: { type: String },
  updatedAt: { type: String },
}, { timestamps: true });

// 9. Mentorship Request Schema
export interface IMentorshipDoc extends Document {
  id: string;
  mentorId: string;
  mentorName: string;
  mentorCompany?: string;
  mentorRole?: string;
  mentorAvatar?: string;
  menteeId: string;
  menteeName: string;
  menteeEnrollment?: string;
  menteeBranch?: string;
  menteeYear?: number;
  menteeRole: string;
  menteeAvatar?: string;
  mentorshipTopic: string;
  message: string;
  status: string;
  mentorNotes?: string;
  createdAt: string;
  updatedAt: string;
}

const MentorshipSchema = new Schema<IMentorshipDoc>({
  id: { type: String, required: true, unique: true },
  mentorId: { type: String, required: true, index: true },
  mentorName: { type: String, required: true },
  mentorCompany: { type: String },
  mentorRole: { type: String },
  mentorAvatar: { type: String },
  menteeId: { type: String, required: true, index: true },
  menteeName: { type: String, required: true },
  menteeEnrollment: { type: String },
  menteeBranch: { type: String },
  menteeYear: { type: Number },
  menteeRole: { type: String, default: 'STUDENT' },
  menteeAvatar: { type: String },
  mentorshipTopic: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, default: 'PENDING', index: true },
  mentorNotes: { type: String },
  createdAt: { type: String },
  updatedAt: { type: String },
}, { timestamps: true });

// 10. Notification Schema
export interface INotificationDoc extends Document {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  actionUrl?: string;
  createdAt: string;
}

const NotificationSchema = new Schema<INotificationDoc>({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, default: 'SYSTEM' },
  read: { type: Boolean, default: false },
  actionUrl: { type: String },
  createdAt: { type: String },
}, { timestamps: true });

// Export Models
export const MongoStudent: Model<IStudentDoc> = mongoose.models.Student || mongoose.model<IStudentDoc>('Student', StudentSchema);
export const MongoAlumni: Model<IAlumniDoc> = mongoose.models.Alumni || mongoose.model<IAlumniDoc>('Alumni', AlumniSchema);
export const MongoUser: Model<IUserDoc> = mongoose.models.User || mongoose.model<IUserDoc>('User', UserSchema);
export const MongoJob: Model<IJobDoc> = mongoose.models.Job || mongoose.model<IJobDoc>('Job', JobSchema);
export const MongoEvent: Model<IEventDoc> = mongoose.models.Event || mongoose.model<IEventDoc>('Event', EventSchema);
export const MongoAchievement: Model<IAchievementDoc> = mongoose.models.Achievement || mongoose.model<IAchievementDoc>('Achievement', AchievementSchema);
export const MongoProfileChange: Model<IProfileChangeDoc> = mongoose.models.ProfileChange || mongoose.model<IProfileChangeDoc>('ProfileChange', ProfileChangeSchema);
export const MongoConnection: Model<IConnectionDoc> = mongoose.models.Connection || mongoose.model<IConnectionDoc>('Connection', ConnectionSchema);
export const MongoMentorship: Model<IMentorshipDoc> = mongoose.models.Mentorship || mongoose.model<IMentorshipDoc>('Mentorship', MentorshipSchema);
export const MongoNotification: Model<INotificationDoc> = mongoose.models.Notification || mongoose.model<INotificationDoc>('Notification', NotificationSchema);

// ==========================================
// MONGODB CONNECTION & SYNCHRONIZATION MANAGER
// ==========================================

class MongoManager {
  private isConnected: boolean = false;
  private connectionError: string | null = null;
  private uri: string | null = null;
  private memoryServer: any = null;

  constructor() {
    this.uri = process.env.MONGODB_URI || process.env.MONGO_URL || null;
  }

  public getStatus() {
    return {
      configured: true,
      connected: this.isConnected,
      database: 'MongoDB (Compass Compatible)',
      uriMasked: this.uri ? this.uri.replace(/:([^@]+)@/, ':****@') : 'mongodb://127.0.0.1:27017/alumni_connect',
      state: mongoose.connection.readyState,
      error: this.connectionError,
    };
  }

  public async connect(): Promise<boolean> {
    let mongoUri = process.env.MONGODB_URI || process.env.MONGO_URL;

    // If an external or local URI is defined, attempt to connect first
    if (mongoUri) {
      try {
        console.log(`[MongoDB] Connecting to specified URI: ${mongoUri.replace(/:([^@]+)@/, ':****@')}...`);
        await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 4000 });
        this.isConnected = true;
        this.uri = mongoUri;
        this.connectionError = null;
        console.log('[MongoDB] Connected successfully via Mongoose to configured URI!');
        await this.seedMongoIfEmpty();
        return true;
      } catch (err: any) {
        console.warn('[MongoDB] Configured URI not reachable. Initializing local MongoDB engine...');
      }
    }

    // Try connecting to default local port 27017 (if MongoDB standalone service is already running)
    const localUri = 'mongodb://127.0.0.1:27017/alumni_connect';
    try {
      await mongoose.connect(localUri, { serverSelectionTimeoutMS: 2000 });
      this.isConnected = true;
      this.uri = localUri;
      this.connectionError = null;
      console.log(`[MongoDB] Connected directly to local MongoDB on ${localUri}!`);
      await this.seedMongoIfEmpty();
      return true;
    } catch {
      // Local port 27017 service is not running; spin up our integrated MongoDB engine on port 27017
    }

    // Spawn integrated MongoDB server on port 27017 for 100% seamless MongoDB Compass connectivity
    try {
      console.log('[MongoDB Engine] Starting local MongoDB server on port 27017 for MongoDB Compass...');
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      this.memoryServer = await MongoMemoryServer.create({
        instance: {
          port: 27017,
          dbName: 'alumni_connect',
        },
      });
      const activeUri = this.memoryServer.getUri() + 'alumni_connect';
      this.uri = activeUri;

      await mongoose.connect(activeUri);
      this.isConnected = true;
      this.connectionError = null;

      console.log('--------------------------------------------------------------------------');
      console.log('🍃 [MongoDB Engine] LIVE & ACTIVE ON PORT 27017!');
      console.log('🍃 [MongoDB Compass Connection String]: mongodb://127.0.0.1:27017/alumni_connect');
      console.log('🍃 [Database Name]: alumni_connect');
      console.log('--------------------------------------------------------------------------');

      await this.seedMongoIfEmpty();
      return true;
    } catch (err: any) {
      this.isConnected = false;
      this.connectionError = err?.message || 'Failed to start MongoDB server';
      console.error('[MongoDB Error]:', this.connectionError);
      return false;
    }
  }

  public async seedMongoIfEmpty() {
    try {
      // 1. Seed Students
      const studentCount = await MongoStudent.countDocuments();
      if (studentCount === 0) {
        console.log('[MongoDB] Populating "students" collection...');
        await MongoStudent.insertMany(INITIAL_STUDENTS);
      }

      // 2. Seed Alumni Profiles
      const alumniCount = await MongoAlumni.countDocuments();
      if (alumniCount === 0) {
        console.log('[MongoDB] Populating "alumni" collection...');
        await MongoAlumni.insertMany(INITIAL_ALUMNI);
      }

      // 3. Seed Users (Authentication collection)
      const userCount = await MongoUser.countDocuments();
      if (userCount === 0) {
        console.log('[MongoDB] Populating "users" (authentication) collection...');
        const allUsers = db.getAllUsers().map((u) => ({
          id: u.id,
          email: u.email,
          passwordHash: (u as any).passwordHash || 'password123',
          role: u.role,
          name: u.name,
          avatarUrl: u.avatarUrl,
          studentId: u.studentId,
          alumniId: u.alumniId,
          createdAt: u.createdAt,
        }));
        if (allUsers.length > 0) {
          await MongoUser.insertMany(allUsers);
        }
      }

      // 4. Seed Jobs
      const jobCount = await MongoJob.countDocuments();
      if (jobCount === 0) {
        console.log('[MongoDB] Populating "jobs" collection...');
        await MongoJob.insertMany(INITIAL_JOBS);
      }

      // 5. Seed Events
      const eventCount = await MongoEvent.countDocuments();
      if (eventCount === 0) {
        console.log('[MongoDB] Populating "events" collection...');
        await MongoEvent.insertMany(INITIAL_EVENTS);
      }

      // 6. Seed Achievements
      const achCount = await MongoAchievement.countDocuments();
      if (achCount === 0) {
        console.log('[MongoDB] Populating "achievements" collection...');
        await MongoAchievement.insertMany(INITIAL_ACHIEVEMENTS);
      }

      // 7. Seed Profile Change Requests
      const pcCount = await MongoProfileChange.countDocuments();
      if (pcCount === 0) {
        console.log('[MongoDB] Populating "profilechangerequests" collection...');
        await MongoProfileChange.insertMany(INITIAL_PROFILE_CHANGES);
      }

      // 8. Seed Connections
      const connCount = await MongoConnection.countDocuments();
      if (connCount === 0) {
        console.log('[MongoDB] Populating "connections" collection...');
        await MongoConnection.insertMany(INITIAL_CONNECTIONS);
      }

      // 9. Seed Mentorship Requests
      const mentorCount = await MongoMentorship.countDocuments();
      if (mentorCount === 0) {
        console.log('[MongoDB] Populating "mentorshiprequests" collection...');
        await MongoMentorship.insertMany(INITIAL_MENTORSHIP_REQUESTS);
      }

      console.log('✅ [MongoDB Compass] All 9 collections initialized and synchronized!');
    } catch (err: any) {
      console.warn('[MongoDB Seeding Warning]:', err?.message || err);
    }
  }

  // Live database persistence helpers
  public async syncUser(user: any) {
    if (!this.isConnected) return;
    try {
      await MongoUser.findOneAndUpdate({ id: user.id }, user, { upsert: true, new: true });
    } catch (e: any) {
      console.warn('[MongoDB Sync] User write warning:', e.message);
    }
  }

  public async syncStudent(student: any) {
    if (!this.isConnected) return;
    try {
      await MongoStudent.findOneAndUpdate({ id: student.id }, student, { upsert: true, new: true });
    } catch (e: any) {
      console.warn('[MongoDB Sync] Student write warning:', e.message);
    }
  }

  public async syncAlumni(alumni: any) {
    if (!this.isConnected) return;
    try {
      await MongoAlumni.findOneAndUpdate({ id: alumni.id }, alumni, { upsert: true, new: true });
    } catch (e: any) {
      console.warn('[MongoDB Sync] Alumni write warning:', e.message);
    }
  }

  public async syncJob(job: any) {
    if (!this.isConnected) return;
    try {
      await MongoJob.findOneAndUpdate({ id: job.id }, job, { upsert: true, new: true });
    } catch (e: any) {
      console.warn('[MongoDB Sync] Job write warning:', e.message);
    }
  }

  public async deleteJob(jobId: string) {
    if (!this.isConnected) return;
    try {
      await MongoJob.deleteOne({ id: jobId });
    } catch (e: any) {
      console.warn('[MongoDB Sync] Delete Job warning:', e.message);
    }
  }

  public async syncEvent(event: any) {
    if (!this.isConnected) return;
    try {
      await MongoEvent.findOneAndUpdate({ id: event.id }, event, { upsert: true, new: true });
    } catch (e: any) {
      console.warn('[MongoDB Sync] Event write warning:', e.message);
    }
  }

  public async syncAchievement(achievement: any) {
    if (!this.isConnected) return;
    try {
      await MongoAchievement.findOneAndUpdate({ id: achievement.id }, achievement, { upsert: true, new: true });
    } catch (e: any) {
      console.warn('[MongoDB Sync] Achievement write warning:', e.message);
    }
  }

  public async syncProfileChange(change: any) {
    if (!this.isConnected) return;
    try {
      await MongoProfileChange.findOneAndUpdate({ id: change.id }, change, { upsert: true, new: true });
    } catch (e: any) {
      console.warn('[MongoDB Sync] Profile change write warning:', e.message);
    }
  }

  public async syncConnection(conn: any) {
    if (!this.isConnected) return;
    try {
      await MongoConnection.findOneAndUpdate({ id: conn.id }, conn, { upsert: true, new: true });
    } catch (e: any) {
      console.warn('[MongoDB Sync] Connection write warning:', e.message);
    }
  }

  public async syncMentorship(mentorReq: any) {
    if (!this.isConnected) return;
    try {
      await MongoMentorship.findOneAndUpdate({ id: mentorReq.id }, mentorReq, { upsert: true, new: true });
    } catch (e: any) {
      console.warn('[MongoDB Sync] Mentorship write warning:', e.message);
    }
  }

  public async syncNotification(notif: any) {
    if (!this.isConnected) return;
    try {
      await MongoNotification.findOneAndUpdate({ id: notif.id }, notif, { upsert: true, new: true });
    } catch (e: any) {
      console.warn('[MongoDB Sync] Notification write warning:', e.message);
    }
  }
}

export const mongoManager = new MongoManager();
