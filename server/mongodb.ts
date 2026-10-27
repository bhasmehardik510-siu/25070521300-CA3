import mongoose, { Schema, Document, Model } from 'mongoose';
import {
  INITIAL_STUDENTS,
  INITIAL_ALUMNI,
  INITIAL_JOBS,
  INITIAL_EVENTS,
} from './data/seedData.ts';
import { db } from './db.ts';

// ==========================================
// MONGOOSE SCHEMAS & MODELS
// ==========================================

export interface IStudentDoc extends Document {
  id: string;
  enrollmentNo: string;
  name: string;
  branch: string;
  degree: string;
  graduationYear: number;
  collegeEmail: string;
  cgpa: number;
  graduationStatus: 'COMPLETE' | 'IN_PROGRESS' | 'BACKLOG_PENDING';
  convocationDate?: string;
  isAlumniActivated: boolean;
}

const StudentSchema = new Schema<IStudentDoc>({
  id: { type: String, required: true, unique: true },
  enrollmentNo: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  branch: { type: String, required: true, index: true },
  degree: { type: String, required: true },
  graduationYear: { type: Number, required: true, index: true },
  collegeEmail: { type: String, required: true },
  cgpa: { type: Number, required: true },
  graduationStatus: { type: String, enum: ['COMPLETE', 'IN_PROGRESS', 'BACKLOG_PENDING'], required: true },
  convocationDate: { type: String },
  isAlumniActivated: { type: Boolean, default: false },
}, { timestamps: true });

export interface IAlumniDoc extends Document {
  id: string;
  studentId: string;
  userId?: string;
  name: string;
  enrollmentNo: string;
  branch: string;
  graduationYear: number;
  collegeEmail: string;
  currentCompany: string;
  jobRole: string;
  industry: string;
  experienceYears: number;
  city: string;
  country: string;
  higherStudies?: string;
  skills: string[];
  bio: string;
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
  isClaimed: boolean;
}

const AlumniSchema = new Schema<IAlumniDoc>({
  id: { type: String, required: true, unique: true },
  studentId: { type: String, required: true, index: true },
  userId: { type: String },
  name: { type: String, required: true, index: true },
  enrollmentNo: { type: String, required: true },
  branch: { type: String, required: true, index: true },
  graduationYear: { type: Number, required: true, index: true },
  collegeEmail: { type: String, required: true },
  currentCompany: { type: String, required: true, index: true },
  jobRole: { type: String, required: true },
  industry: { type: String, required: true },
  experienceYears: { type: Number, default: 0 },
  city: { type: String, required: true },
  country: { type: String, required: true },
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
  verificationStatus: { type: String, enum: ['VERIFIED', 'PENDING', 'REJECTED'], default: 'VERIFIED' },
  isClaimed: { type: Boolean, default: false },
}, { timestamps: true });

export interface IUserDoc extends Document {
  id: string;
  email: string;
  passwordHash: string;
  role: 'STUDENT' | 'ALUMNI' | 'ADMIN';
  name: string;
  avatarUrl?: string;
  studentId?: string;
  alumniId?: string;
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
}, { timestamps: true });

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
}, { timestamps: true });

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
  registeredUserIds: string[];
  isRegistrationsOpen: boolean;
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
  registeredUserIds: [{ type: String }],
  isRegistrationsOpen: { type: Boolean, default: true },
}, { timestamps: true });

// Avoid model recompilation errors in serverless/HMR environments
export const MongoStudent: Model<IStudentDoc> = mongoose.models.Student || mongoose.model<IStudentDoc>('Student', StudentSchema);
export const MongoAlumni: Model<IAlumniDoc> = mongoose.models.Alumni || mongoose.model<IAlumniDoc>('Alumni', AlumniSchema);
export const MongoUser: Model<IUserDoc> = mongoose.models.User || mongoose.model<IUserDoc>('User', UserSchema);
export const MongoJob: Model<IJobDoc> = mongoose.models.Job || mongoose.model<IJobDoc>('Job', JobSchema);
export const MongoEvent: Model<IEventDoc> = mongoose.models.Event || mongoose.model<IEventDoc>('Event', EventSchema);

// ==========================================
// MONGODB CONNECTION & SYNCHRONIZATION MANAGER
// ==========================================

class MongoManager {
  private isConnected: boolean = false;
  private connectionError: string | null = null;
  private uri: string | null = null;

  constructor() {
    this.uri = process.env.MONGODB_URI || process.env.MONGO_URL || null;
  }

  public getStatus() {
    return {
      configured: Boolean(this.uri),
      connected: this.isConnected,
      database: 'MongoDB / Mongoose ODM',
      uriMasked: this.uri ? this.uri.replace(/:([^@]+)@/, ':****@') : 'Not Configured (Optional)',
      state: mongoose.connection.readyState, // 0 = disconnected, 1 = connected, 2 = connecting
      error: this.connectionError,
    };
  }

  public async connect(): Promise<boolean> {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URL;
    if (!mongoUri) {
      this.connectionError = 'MONGODB_URI environment variable not provided. MongoDB integration is in standby mode.';
      return false;
    }

    try {
      console.log('[MongoDB] Connecting to MongoDB instance via Mongoose...');
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
      });

      this.isConnected = true;
      this.connectionError = null;
      console.log('[MongoDB] Successfully connected to MongoDB!');

      // Populate MongoDB collections if empty
      await this.seedMongoIfEmpty();
      return true;
    } catch (err: any) {
      this.isConnected = false;
      this.connectionError = err?.message || 'Failed to connect to MongoDB';
      console.warn('[MongoDB Notice] MongoDB connection warning:', this.connectionError);
      return false;
    }
  }

  public async seedMongoIfEmpty() {
    try {
      const studentCount = await MongoStudent.countDocuments();
      if (studentCount === 0) {
        console.log('[MongoDB] Seeding initial student records into MongoDB...');
        await MongoStudent.insertMany(INITIAL_STUDENTS);
      }

      const alumniCount = await MongoAlumni.countDocuments();
      if (alumniCount === 0) {
        console.log('[MongoDB] Seeding initial alumni records into MongoDB...');
        await MongoAlumni.insertMany(INITIAL_ALUMNI);
      }

      const userCount = await MongoUser.countDocuments();
      if (userCount === 0) {
        console.log('[MongoDB] Seeding initial user credentials into MongoDB...');
        const users = db.getAllUsers().map((u) => ({
          id: u.id,
          email: u.email,
          passwordHash: (u as any).passwordHash || 'password123',
          role: u.role,
          name: u.name,
          avatarUrl: u.avatarUrl,
          studentId: u.studentId,
          alumniId: u.alumniId,
        }));
        if (users.length > 0) {
          await MongoUser.insertMany(users);
        }
      }

      const jobCount = await MongoJob.countDocuments();
      if (jobCount === 0) {
        console.log('[MongoDB] Seeding initial job listings into MongoDB...');
        await MongoJob.insertMany(INITIAL_JOBS);
      }

      const eventCount = await MongoEvent.countDocuments();
      if (eventCount === 0) {
        console.log('[MongoDB] Seeding initial events into MongoDB...');
        await MongoEvent.insertMany(INITIAL_EVENTS);
      }

      console.log('[MongoDB] MongoDB database records synchronized.');
    } catch (err: any) {
      console.warn('[MongoDB] Seeding notice:', err?.message || err);
    }
  }
}

export const mongoManager = new MongoManager();
