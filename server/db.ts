import {
  Student,
  AlumniProfile,
  JobPost,
  CollegeEvent,
  Achievement,
  ProfileChangeRequest,
  Connection,
  MentorshipRequest,
  AppNotification,
  User,
  AdminMetrics,
  VerificationStatus,
  GraduationStatus,
} from '../src/types/index.ts';

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
import { db as pgDb } from '../src/db/index.ts';
import * as schema from '../src/db/schema.ts';
import { eq } from 'drizzle-orm';
import { seedDatabaseIfEmpty } from '../src/db/seed.ts';
import { mongoManager } from './mongodb.ts';

export interface DBUser extends User {
  passwordHash: string; // simulated hash
}

class RelationalDatabase {
  private users: DBUser[] = [];
  private students: Student[] = [];
  private alumni: AlumniProfile[] = [];
  private jobs: JobPost[] = [];
  private events: CollegeEvent[] = [];
  private achievements: Achievement[] = [];
  private profileChanges: ProfileChangeRequest[] = [];
  private connections: Connection[] = [];
  private mentorshipRequests: MentorshipRequest[] = [];
  private notifications: AppNotification[] = [];

  constructor() {
    this.seedDatabase();
  }

  public async initPostgres() {
    if (!process.env.SQL_HOST && !process.env.DATABASE_URL) {
      console.log('[PostgreSQL Database] No SQL_HOST configured; using preloaded in-memory relational dataset.');
      return;
    }
    try {
      await seedDatabaseIfEmpty();

      // Synchronize users from PostgreSQL
      const pgUsers = await pgDb.select().from(schema.users);
      if (pgUsers.length > 0) {
        this.users = pgUsers.map((u) => ({
          id: u.id,
          email: u.email,
          passwordHash: u.passwordHash || 'student123',
          role: u.role as any,
          name: u.name,
          avatarUrl: u.avatarUrl || undefined,
          studentId: u.studentId || undefined,
          alumniId: u.alumniId || undefined,
          createdAt: u.createdAt ? u.createdAt.toISOString() : new Date().toISOString(),
        }));
      }

      // Synchronize students from PostgreSQL
      const pgStudents = await pgDb.select().from(schema.students);
      if (pgStudents.length > 0) {
        this.students = pgStudents.map((s) => ({
          id: s.id,
          enrollmentNo: s.enrollmentNo,
          name: s.name,
          branch: s.branch,
          degree: s.degree,
          graduationYear: s.graduationYear,
          collegeEmail: s.collegeEmail,
          personalEmail: s.personalEmail || undefined,
          phone: s.phone || undefined,
          cgpa: Number(s.cgpa),
          graduationStatus: s.graduationStatus as any,
          convocationDate: s.convocationDate || undefined,
          isAlumniActivated: s.isAlumniActivated,
          alumniId: s.alumniId || undefined,
          createdAt: s.createdAt ? s.createdAt.toISOString() : new Date().toISOString(),
        }));
      }

      // Synchronize alumni from PostgreSQL
      const pgAlumni = await pgDb.select().from(schema.alumni);
      if (pgAlumni.length > 0) {
        this.alumni = pgAlumni.map((a) => ({
          id: a.id,
          userId: a.userId,
          studentId: a.studentId,
          enrollmentNo: a.enrollmentNo,
          name: a.name,
          branch: a.branch,
          degree: a.degree,
          graduationYear: a.graduationYear,
          collegeEmail: a.collegeEmail,
          personalEmail: a.personalEmail,
          phone: a.phone || undefined,
          avatarUrl: a.avatarUrl || '',
          currentCompany: a.currentCompany || undefined,
          jobRole: a.jobRole || undefined,
          industry: a.industry || undefined,
          experienceYears: a.experienceYears || 0,
          city: a.city || undefined,
          country: a.country || 'India',
          higherStudies: a.higherStudies || undefined,
          skills: a.skills || [],
          bio: a.bio || undefined,
          linkedinUrl: a.linkedinUrl || undefined,
          githubUrl: a.githubUrl || undefined,
          websiteUrl: a.websiteUrl || undefined,
          isAvailableForMentorship: a.isAvailableForMentorship,
          mentorshipAreas: a.mentorshipAreas || [],
          maxMentees: a.maxMentees || 3,
          verificationStatus: a.verificationStatus as any,
          verifiedAt: a.verifiedAt ? a.verifiedAt.toISOString() : undefined,
          verifiedBy: a.verifiedBy || undefined,
          privacySettings: a.privacySettings || undefined,
          createdAt: a.createdAt ? a.createdAt.toISOString() : new Date().toISOString(),
          updatedAt: a.updatedAt ? a.updatedAt.toISOString() : new Date().toISOString(),
        }));
      }

      // Synchronize jobs from PostgreSQL
      const pgJobs = await pgDb.select().from(schema.jobs);
      if (pgJobs.length > 0) {
        this.jobs = pgJobs.map((j) => ({
          id: j.id,
          title: j.title,
          company: j.company,
          companyLogoUrl: j.companyLogoUrl || undefined,
          location: j.location,
          isRemote: j.isRemote,
          jobType: j.jobType as any,
          experienceLevel: j.experienceLevel as any,
          description: j.description,
          requirements: j.requirements,
          skills: j.skills,
          applyUrl: j.applyUrl || undefined,
          contactEmail: j.contactEmail,
          deadline: j.deadline,
          postedByAlumniId: j.postedByAlumniId,
          postedByName: j.postedByName,
          postedByCompany: j.postedByCompany,
          status: j.status as any,
          adminRemark: j.adminRemark || undefined,
          applicantCount: j.applicantCount || 0,
          createdAt: j.createdAt ? j.createdAt.toISOString() : new Date().toISOString(),
        }));
      }

      // Synchronize events from PostgreSQL
      const pgEvents = await pgDb.select().from(schema.events);
      if (pgEvents.length > 0) {
        this.events = pgEvents.map((e) => ({
          id: e.id,
          title: e.title,
          category: e.category as any,
          description: e.description,
          date: e.date,
          time: e.time,
          location: e.location,
          isVirtual: e.isVirtual,
          meetingLink: e.meetingLink || undefined,
          bannerUrl: e.bannerUrl || undefined,
          organizer: e.organizer,
          capacity: e.capacity || 500,
          registrationCount: e.registrationCount || 0,
          isRegistrationsOpen: e.isRegistrationsOpen,
          registeredUserIds: e.registeredUserIds || [],
          createdAt: e.createdAt ? e.createdAt.toISOString() : new Date().toISOString(),
        }));
      }

      // Synchronize achievements from PostgreSQL
      const pgAchievements = await pgDb.select().from(schema.achievements);
      if (pgAchievements.length > 0) {
        this.achievements = pgAchievements.map((ach) => ({
          id: ach.id,
          alumniId: ach.alumniId,
          alumniName: ach.alumniName,
          alumniEnrollment: ach.alumniEnrollment,
          title: ach.title,
          category: ach.category as any,
          description: ach.description,
          year: ach.year,
          certificateUrl: ach.certificateUrl || undefined,
          proofUrl: ach.proofUrl || undefined,
          status: ach.status as any,
          adminRemark: ach.adminRemark || undefined,
          verifiedAt: ach.verifiedAt ? ach.verifiedAt.toISOString() : undefined,
          createdAt: ach.createdAt ? ach.createdAt.toISOString() : new Date().toISOString(),
        }));
      }

      // Synchronize profile change requests from PostgreSQL
      const pgProfileChanges = await pgDb.select().from(schema.profileChangeRequests);
      if (pgProfileChanges.length > 0) {
        this.profileChanges = pgProfileChanges.map((p) => ({
          id: p.id,
          alumniId: p.alumniId,
          alumniName: p.alumniName,
          alumniEnrollment: p.alumniEnrollment,
          currentCompany: p.currentCompany || undefined,
          proposedCompany: p.proposedCompany || undefined,
          currentJobRole: p.currentJobRole || undefined,
          proposedJobRole: p.proposedJobRole || undefined,
          currentHigherStudies: p.currentHigherStudies || undefined,
          proposedHigherStudies: p.proposedHigherStudies || undefined,
          currentSkills: p.currentSkills || undefined,
          proposedSkills: p.proposedSkills || undefined,
          reason: p.reason || undefined,
          supportingDocUrl: p.supportingDocUrl || undefined,
          status: p.status as any,
          adminRemarks: p.adminRemarks || undefined,
          reviewedBy: p.reviewedBy || undefined,
          reviewedAt: p.reviewedAt ? p.reviewedAt.toISOString() : undefined,
          createdAt: p.createdAt ? p.createdAt.toISOString() : new Date().toISOString(),
        }));
      }

      // Synchronize connections from PostgreSQL
      const pgConnections = await pgDb.select().from(schema.connections);
      if (pgConnections.length > 0) {
        this.connections = pgConnections.map((c) => ({
          id: c.id,
          senderId: c.senderId,
          senderName: c.senderName,
          senderRole: c.senderRole || undefined,
          senderCompany: c.senderCompany || undefined,
          senderAvatar: c.senderAvatar || undefined,
          receiverId: c.receiverId,
          receiverName: c.receiverName,
          receiverRole: c.receiverRole || undefined,
          receiverCompany: c.receiverCompany || undefined,
          receiverAvatar: c.receiverAvatar || undefined,
          status: c.status as any,
          note: c.note || undefined,
          privacyConsentAccepted: true,
          senderPrivacy: c.senderSharedDetails || undefined,
          receiverPrivacy: c.receiverSharedDetails || undefined,
          privateMessages: c.privateMessages || [],
          createdAt: c.createdAt ? c.createdAt.toISOString() : new Date().toISOString(),
          updatedAt: c.updatedAt ? c.updatedAt.toISOString() : new Date().toISOString(),
        }));
      }

      // Synchronize mentorship requests from PostgreSQL
      const pgMentorship = await pgDb.select().from(schema.mentorshipRequests);
      if (pgMentorship.length > 0) {
        this.mentorshipRequests = pgMentorship.map((m) => ({
          id: m.id,
          mentorId: m.mentorId,
          mentorName: m.mentorName,
          menteeId: m.menteeId,
          menteeName: m.menteeName,
          menteeEnrollment: m.menteeEnrollment || undefined,
          menteeBranch: m.menteeBranch || undefined,
          menteeYear: m.menteeYear || undefined,
          menteeRole: m.menteeRole as any,
          mentorshipTopic: m.mentorshipTopic,
          message: m.message,
          status: m.status as any,
          mentorNotes: m.mentorNotes || undefined,
          createdAt: m.createdAt ? m.createdAt.toISOString() : new Date().toISOString(),
          updatedAt: m.updatedAt ? m.updatedAt.toISOString() : new Date().toISOString(),
        }));
      }

      // Synchronize notifications from PostgreSQL
      const pgNotifs = await pgDb.select().from(schema.notifications);
      if (pgNotifs.length > 0) {
        this.notifications = pgNotifs.map((n) => ({
          id: n.id,
          userId: n.userId,
          title: n.title,
          message: n.message,
          type: n.type as any,
          read: n.isRead,
          link: n.link || undefined,
          createdAt: n.createdAt ? n.createdAt.toISOString() : new Date().toISOString(),
        }));
      }

      console.log(`[PostgreSQL Database] Connected & synchronized: ${this.alumni.length} alumni, ${this.students.length} students, ${this.jobs.length} jobs.`);
    } catch (err) {
      console.error('[PostgreSQL Database] Error synchronizing with Cloud SQL database:', err);
    }
  }

  public seedDatabase() {
    // Reset collections
    this.students = JSON.parse(JSON.stringify(INITIAL_STUDENTS));
    this.alumni = JSON.parse(JSON.stringify(INITIAL_ALUMNI));
    this.jobs = JSON.parse(JSON.stringify(INITIAL_JOBS));
    this.events = JSON.parse(JSON.stringify(INITIAL_EVENTS));
    this.achievements = JSON.parse(JSON.stringify(INITIAL_ACHIEVEMENTS));
    this.profileChanges = JSON.parse(JSON.stringify(INITIAL_PROFILE_CHANGES));
    this.connections = JSON.parse(JSON.stringify(INITIAL_CONNECTIONS));
    this.mentorshipRequests = JSON.parse(JSON.stringify(INITIAL_MENTORSHIP_REQUESTS));
    this.notifications = [];

    // Seed default Users
    this.users = [
      // Admin Account
      {
        id: 'usr-admin-001',
        email: 'admin@alumni.edu',
        passwordHash: 'admin123',
        role: 'ADMIN',
        name: 'Dr. S. K. Venkatesh (Alumni Cell Dean)',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        createdAt: '2020-01-01T00:00:00.000Z',
      },
      // Eligible Student (Rahul Sharma)
      {
        id: 'usr-std-001',
        email: 'rahul.sharma@college.edu',
        passwordHash: 'student123',
        role: 'STUDENT',
        name: 'Rahul Sharma',
        studentId: 'std-001',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
        createdAt: '2023-08-01T00:00:00.000Z',
      },
      // Eligible Student (Ananya Iyer)
      {
        id: 'usr-std-002',
        email: 'ananya.iyer@college.edu',
        passwordHash: 'student123',
        role: 'STUDENT',
        name: 'Ananya Iyer',
        studentId: 'std-002',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
        createdAt: '2023-08-01T00:00:00.000Z',
      },
      // Ineligible Student (Priya Verma - 6th sem)
      {
        id: 'usr-std-004',
        email: 'priya.verma@college.edu',
        passwordHash: 'student123',
        role: 'STUDENT',
        name: 'Priya Verma',
        studentId: 'std-004',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
        createdAt: '2024-08-01T00:00:00.000Z',
      },
      // Ineligible Student with backlog (Karan Patel)
      {
        id: 'usr-std-005',
        email: 'karan.patel@college.edu',
        passwordHash: 'student123',
        role: 'STUDENT',
        name: 'Karan Patel',
        studentId: 'std-005',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
        createdAt: '2023-08-01T00:00:00.000Z',
      },
      // Seed Verified Alumni Users
      ...this.alumni.map((alm) => ({
        id: alm.userId,
        email: alm.collegeEmail,
        passwordHash: 'alumni123',
        role: 'ALUMNI' as const,
        name: alm.name,
        avatarUrl: alm.avatarUrl,
        studentId: alm.studentId,
        alumniId: alm.id,
        createdAt: alm.createdAt,
      })),
    ];

    // Seed Initial Notifications
    this.notifications.push(
      {
        id: 'notif-1',
        userId: 'usr-admin-001',
        title: 'New Profile Verification Pending',
        message: 'Neha Kapoor submitted an update for career promotion to AWS Solutions Architect.',
        type: 'VERIFICATION',
        read: false,
        link: '/admin/verifications',
        createdAt: '2026-08-29T10:00:00.000Z',
      },
      {
        id: 'notif-2',
        userId: 'usr-admin-001',
        title: 'New Job Submission Moderation',
        message: 'Farhan Ali posted Staff AI Solutions Architect at Stripe for review.',
        type: 'JOB',
        read: false,
        link: '/admin/jobs',
        createdAt: '2026-08-28T10:00:00.000Z',
      },
      {
        id: 'notif-3',
        userId: 'usr-alm-101',
        title: 'Mentorship Session Confirmed',
        message: 'Mentorship request from Rahul Sharma (CSE 2027) was accepted.',
        type: 'MENTORSHIP',
        read: true,
        link: '/mentorship',
        createdAt: '2026-08-21T14:00:00.000Z',
      }
    );
  }

  // ==========================================
  // USERS & AUTH
  // ==========================================
  public getAllUsers(): DBUser[] {
    return this.users;
  }

  public getUserByEmail(email: string): DBUser | undefined {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public getUserById(id: string): DBUser | undefined {
    return this.users.find((u) => u.id === id);
  }

  public createUser(user: DBUser): DBUser {
    this.users.push(user);
    mongoManager.syncUser(user);
    return user;
  }

  public updateUserRole(userId: string, role: 'ALUMNI', alumniId: string) {
    const user = this.users.find((u) => u.id === userId);
    if (user) {
      user.role = role;
      user.alumniId = alumniId;
      mongoManager.syncUser(user);
    }
  }

  // ==========================================
  // STUDENTS (COLLEGE DATABASE REPOSITORY)
  // ==========================================
  public getAllStudents(): Student[] {
    return this.students;
  }

  public getStudentByEnrollment(enrollmentNo: string): Student | undefined {
    return this.students.find(
      (s) => s.enrollmentNo.trim().toUpperCase() === enrollmentNo.trim().toUpperCase()
    );
  }

  public getStudentById(id: string): Student | undefined {
    return this.students.find((s) => s.id === id);
  }

  public updateStudentStatus(studentId: string, status: GraduationStatus): Student | null {
    const student = this.students.find((s) => s.id === studentId);
    if (!student) return null;
    student.graduationStatus = status;
    mongoManager.syncStudent(student);

    pgDb
      .update(schema.students)
      .set({ graduationStatus: status })
      .where(eq(schema.students.id, studentId))
      .catch((err) => console.error('[PostgreSQL] Failed to update student status:', err));

    return student;
  }

  // ==========================================
  // ALUMNI ACTIVATION & LIFECYCLE
  // ==========================================
  public activateAlumniProfile(params: {
    studentId: string;
    userId: string;
    currentCompany?: string;
    jobRole?: string;
    industry?: string;
    experienceYears?: number;
    city?: string;
    country?: string;
    higherStudies?: string;
    skills: string[];
    bio?: string;
    linkedinUrl?: string;
    githubUrl?: string;
    websiteUrl?: string;
    isAvailableForMentorship?: boolean;
    mentorshipAreas?: string[];
  }): { success: boolean; error?: string; profile?: AlumniProfile } {
    // 1. Verify Student Exists
    const student = this.students.find((s) => s.id === params.studentId);
    if (!student) {
      return { success: false, error: 'Student record not found in college database.' };
    }

    // 2. Verify Graduation Status is COMPLETE
    if (student.graduationStatus !== 'COMPLETE') {
      return {
        success: false,
        error: `Ineligible for Alumni activation. College graduation status is '${student.graduationStatus}'. Graduation must be COMPLETE.`,
      };
    }

    // 3. Verify not already activated
    if (student.isAlumniActivated) {
      return {
        success: false,
        error: `An active Alumni profile already exists for enrollment number ${student.enrollmentNo}.`,
      };
    }

    // 4. Create new Alumni record with pre-populated verified college data
    const newAlumniId = `alm-${Date.now()}`;
    const newAlumni: AlumniProfile = {
      id: newAlumniId,
      userId: params.userId,
      studentId: student.id,
      enrollmentNo: student.enrollmentNo,
      name: student.name,
      branch: student.branch,
      degree: student.degree,
      graduationYear: student.graduationYear,
      collegeEmail: student.collegeEmail,
      personalEmail: student.personalEmail || student.collegeEmail,
      phone: student.phone,
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80`,
      currentCompany: params.currentCompany || 'Independent / Graduate',
      jobRole: params.jobRole || 'Alumnus',
      industry: params.industry || 'Technology & Engineering',
      experienceYears: params.experienceYears || 0,
      city: params.city || 'Bengaluru',
      country: params.country || 'India',
      higherStudies: params.higherStudies || 'N/A',
      skills: params.skills.length > 0 ? params.skills : ['Problem Solving', 'Engineering Fundamentals'],
      bio: params.bio || `Alumnus of ${student.branch}, Class of ${student.graduationYear}.`,
      linkedinUrl: params.linkedinUrl,
      githubUrl: params.githubUrl,
      websiteUrl: params.websiteUrl,
      isAvailableForMentorship: params.isAvailableForMentorship || false,
      mentorshipAreas: params.mentorshipAreas || ['Career Guidance'],
      maxMentees: 2,
      // Initially verified because graduation identity is confirmed through college database!
      verificationStatus: 'APPROVED',
      verifiedAt: new Date().toISOString(),
      verifiedBy: 'College Convocation System (Automatic)',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Update database relations
    student.isAlumniActivated = true;
    student.alumniId = newAlumniId;
    this.alumni.push(newAlumni);
    this.updateUserRole(params.userId, 'ALUMNI', newAlumniId);
    mongoManager.syncAlumni(newAlumni);
    mongoManager.syncStudent(student);

    // Asynchronously persist to PostgreSQL
    pgDb
      .insert(schema.alumni)
      .values({
        id: newAlumni.id,
        userId: newAlumni.userId,
        studentId: newAlumni.studentId,
        enrollmentNo: newAlumni.enrollmentNo,
        name: newAlumni.name,
        branch: newAlumni.branch,
        degree: newAlumni.degree,
        graduationYear: newAlumni.graduationYear,
        collegeEmail: newAlumni.collegeEmail,
        personalEmail: newAlumni.personalEmail,
        phone: newAlumni.phone,
        avatarUrl: newAlumni.avatarUrl,
        currentCompany: newAlumni.currentCompany,
        jobRole: newAlumni.jobRole,
        industry: newAlumni.industry,
        experienceYears: newAlumni.experienceYears,
        city: newAlumni.city,
        country: newAlumni.country,
        higherStudies: newAlumni.higherStudies,
        skills: newAlumni.skills,
        bio: newAlumni.bio,
        linkedinUrl: newAlumni.linkedinUrl,
        githubUrl: newAlumni.githubUrl,
        websiteUrl: newAlumni.websiteUrl,
        isAvailableForMentorship: newAlumni.isAvailableForMentorship,
        mentorshipAreas: newAlumni.mentorshipAreas,
        maxMentees: newAlumni.maxMentees,
        verificationStatus: newAlumni.verificationStatus,
        verifiedAt: new Date(),
        verifiedBy: newAlumni.verifiedBy,
      })
      .then(() => {
        return pgDb
          .update(schema.students)
          .set({ isAlumniActivated: true, alumniId: newAlumniId })
          .where(eq(schema.students.id, student.id));
      })
      .then(() => {
        return pgDb
          .update(schema.users)
          .set({ role: 'ALUMNI', alumniId: newAlumniId })
          .where(eq(schema.users.id, params.userId));
      })
      .catch((err) => console.error('[PostgreSQL] Failed to persist alumni activation:', err));

    // Create Notification for Admin
    this.notifications.push({
      id: `notif-${Date.now()}`,
      userId: 'usr-admin-001',
      title: 'New Alumni Activated',
      message: `${student.name} (${student.enrollmentNo}, ${student.branch}) has activated their alumni profile.`,
      type: 'VERIFICATION',
      read: false,
      link: `/alumni/${newAlumniId}`,
      createdAt: new Date().toISOString(),
    });

    return { success: true, profile: newAlumni };
  }

  // ==========================================
  // ALUMNI DIRECTORY & QUERIES
  // ==========================================
  public getAllAlumni(filters?: {
    query?: string;
    branch?: string;
    graduationYear?: number;
    company?: string;
    jobRole?: string;
    city?: string;
    country?: string;
    skill?: string;
    mentorshipOnly?: boolean;
    verificationStatus?: VerificationStatus;
  }): AlumniProfile[] {
    let list = [...this.alumni];

    if (!filters) return list;

    if (filters.query && filters.query.trim()) {
      const q = filters.query.toLowerCase().trim();
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.enrollmentNo.toLowerCase().includes(q) ||
          (a.currentCompany && a.currentCompany.toLowerCase().includes(q)) ||
          (a.jobRole && a.jobRole.toLowerCase().includes(q)) ||
          (a.city && a.city.toLowerCase().includes(q)) ||
          a.skills.some((s) => s.toLowerCase().includes(q))
      );
    }

    if (filters.branch && filters.branch !== 'ALL') {
      list = list.filter((a) => a.branch === filters.branch);
    }

    if (filters.graduationYear && filters.graduationYear > 0) {
      list = list.filter((a) => a.graduationYear === Number(filters.graduationYear));
    }

    if (filters.company && filters.company !== 'ALL') {
      list = list.filter(
        (a) => a.currentCompany && a.currentCompany.toLowerCase().includes(filters.company!.toLowerCase())
      );
    }

    if (filters.city && filters.city !== 'ALL') {
      list = list.filter(
        (a) => a.city && a.city.toLowerCase().includes(filters.city!.toLowerCase())
      );
    }

    if (filters.skill && filters.skill !== 'ALL') {
      list = list.filter((a) =>
        a.skills.some((s) => s.toLowerCase() === filters.skill!.toLowerCase())
      );
    }

    if (filters.mentorshipOnly) {
      list = list.filter((a) => a.isAvailableForMentorship);
    }

    return list.map((a) => ({
      ...a,
      phone: a.phone || '+91 98450 12345',
      personalEmail: a.personalEmail || `${a.name.toLowerCase().replace(/[^a-z]/g, '.')}@gmail.com`,
      websiteUrl: a.websiteUrl || `https://${a.name.toLowerCase().replace(/[^a-z]/g, '')}-portfolio.dev`,
    }));
  }

  public getAlumniById(id: string): AlumniProfile | undefined {
    return this.alumni.find((a) => a.id === id);
  }

  public getAlumniByUserId(userId: string): AlumniProfile | undefined {
    return this.alumni.find((a) => a.userId === userId);
  }

  // ==========================================
  // PROFILE UPDATES & ADMIN VERIFICATION FLOW
  // ==========================================
  public requestProfileUpdate(
    alumniId: string,
    updates: {
      company?: string;
      jobRole?: string;
      higherStudies?: string;
      skills?: string[];
      bio?: string;
      city?: string;
      country?: string;
      phone?: string;
      personalEmail?: string;
      privacySettings?: any;
      linkedinUrl?: string;
      githubUrl?: string;
      websiteUrl?: string;
      isAvailableForMentorship?: boolean;
      mentorshipAreas?: string[];
      reason?: string;
      supportingDocUrl?: string;
    }
  ): { success: boolean; isDirectUpdated: boolean; changeRequest?: ProfileChangeRequest; profile?: AlumniProfile } {
    const profile = this.alumni.find((a) => a.id === alumniId);
    if (!profile) return { success: false, isDirectUpdated: false };

    // Check if sensitive fields (Company, Job role, Higher studies) changed
    const isSensitiveChange =
      (updates.company && updates.company !== profile.currentCompany) ||
      (updates.jobRole && updates.jobRole !== profile.jobRole) ||
      (updates.higherStudies && updates.higherStudies !== profile.higherStudies);

    if (isSensitiveChange) {
      // Create a Profile Change Request for Admin Moderation
      const reqId = `pcr-${Date.now()}`;
      const changeReq: ProfileChangeRequest = {
        id: reqId,
        alumniId: profile.id,
        alumniName: profile.name,
        alumniEnrollment: profile.enrollmentNo,
        currentCompany: profile.currentCompany,
        proposedCompany: updates.company || profile.currentCompany,
        currentJobRole: profile.jobRole,
        proposedJobRole: updates.jobRole || profile.jobRole,
        currentHigherStudies: profile.higherStudies,
        proposedHigherStudies: updates.higherStudies || profile.higherStudies,
        currentSkills: profile.skills,
        proposedSkills: updates.skills || profile.skills,
        reason: updates.reason || 'Career progression update',
        supportingDocUrl: updates.supportingDocUrl,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
      };

      this.profileChanges.unshift(changeReq);
      profile.verificationStatus = 'PENDING';
      profile.updatedAt = new Date().toISOString();

      // Apply non-sensitive fields immediately
      if (updates.bio !== undefined) profile.bio = updates.bio;
      if (updates.city !== undefined) profile.city = updates.city;
      if (updates.country !== undefined) profile.country = updates.country;
      if (updates.linkedinUrl !== undefined) profile.linkedinUrl = updates.linkedinUrl;
      if (updates.githubUrl !== undefined) profile.githubUrl = updates.githubUrl;
      if (updates.websiteUrl !== undefined) profile.websiteUrl = updates.websiteUrl;
      if (updates.isAvailableForMentorship !== undefined)
        profile.isAvailableForMentorship = updates.isAvailableForMentorship;
      if (updates.mentorshipAreas) profile.mentorshipAreas = updates.mentorshipAreas;

      // Admin Notification
      this.notifications.push({
        id: `notif-${Date.now()}`,
        userId: 'usr-admin-001',
        title: 'Profile Verification Request',
        message: `${profile.name} (${profile.enrollmentNo}) requested verification for: ${updates.jobRole || profile.jobRole} at ${updates.company || profile.currentCompany}`,
        type: 'VERIFICATION',
        read: false,
        link: '/admin/verifications',
        createdAt: new Date().toISOString(),
      });

      mongoManager.syncProfileChange(changeReq);
      return { success: true, isDirectUpdated: false, changeRequest: changeReq, profile };
    } else {
      // Non-sensitive updates apply directly
      if (updates.skills) profile.skills = updates.skills;
      if (updates.bio !== undefined) profile.bio = updates.bio;
      if (updates.city !== undefined) profile.city = updates.city;
      if (updates.country !== undefined) profile.country = updates.country;
      if (updates.phone !== undefined) profile.phone = updates.phone;
      if (updates.personalEmail !== undefined) profile.personalEmail = updates.personalEmail;
      if (updates.privacySettings !== undefined) profile.privacySettings = updates.privacySettings;
      if (updates.linkedinUrl !== undefined) profile.linkedinUrl = updates.linkedinUrl;
      if (updates.githubUrl !== undefined) profile.githubUrl = updates.githubUrl;
      if (updates.websiteUrl !== undefined) profile.websiteUrl = updates.websiteUrl;
      if (updates.isAvailableForMentorship !== undefined)
        profile.isAvailableForMentorship = updates.isAvailableForMentorship;
      if (updates.mentorshipAreas) profile.mentorshipAreas = updates.mentorshipAreas;

      profile.updatedAt = new Date().toISOString();
      mongoManager.syncAlumni(profile);
      return { success: true, isDirectUpdated: true, profile };
    }
  }

  public getProfileChangeRequests(): ProfileChangeRequest[] {
    return this.profileChanges;
  }

  public reviewProfileChange(
    requestId: string,
    decision: 'APPROVED' | 'REJECTED',
    adminRemarks: string,
    reviewerName: string
  ): { success: boolean; changeRequest?: ProfileChangeRequest } {
    const req = this.profileChanges.find((p) => p.id === requestId);
    if (!req) return { success: false };

    req.status = decision;
    req.adminRemarks = adminRemarks;
    req.reviewedBy = reviewerName;
    req.reviewedAt = new Date().toISOString();

    const profile = this.alumni.find((a) => a.id === req.alumniId);
    if (profile) {
      if (decision === 'APPROVED') {
        if (req.proposedCompany) profile.currentCompany = req.proposedCompany;
        if (req.proposedJobRole) profile.jobRole = req.proposedJobRole;
        if (req.proposedHigherStudies) profile.higherStudies = req.proposedHigherStudies;
        if (req.proposedSkills) profile.skills = req.proposedSkills;
        profile.verificationStatus = 'APPROVED';
        profile.verifiedAt = new Date().toISOString();
        profile.verifiedBy = reviewerName;
      } else {
        profile.verificationStatus = 'REJECTED';
      }
      profile.updatedAt = new Date().toISOString();
      mongoManager.syncAlumni(profile);

      // Notify Alumni
      const user = this.users.find((u) => u.alumniId === profile.id);
      if (user) {
        this.notifications.push({
          id: `notif-${Date.now()}`,
          userId: user.id,
          title: `Profile Verification ${decision === 'APPROVED' ? 'Approved ✓' : 'Rejected'}`,
          message: `Your career profile change has been ${decision.toLowerCase()} by ${reviewerName}. Remarks: ${adminRemarks || 'None'}`,
          type: 'VERIFICATION',
          read: false,
          link: '/profile',
          createdAt: new Date().toISOString(),
        });
      }
    }

    mongoManager.syncProfileChange(req);
    return { success: true, changeRequest: req };
  }

  // ==========================================
  // CONNECTIONS (NETWORKING)
  // ==========================================
  public getConnectionsForUser(userId: string): Connection[] {
    return this.connections.filter(
      (c) => c.senderId === userId || c.receiverId === userId
    );
  }

  public sendConnectionRequest(params: {
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
    note?: string;
    senderPrivacy?: any;
    privacyConsentAccepted?: boolean;
  }): { success: boolean; error?: string; connection?: Connection } {
    if (params.senderId === params.receiverId) {
      return { success: false, error: 'Cannot send a connection request to yourself.' };
    }

    // Check if connection already exists
    const existing = this.connections.find(
      (c) =>
        (c.senderId === params.senderId && c.receiverId === params.receiverId) ||
        (c.senderId === params.receiverId && c.receiverId === params.senderId)
    );

    if (existing) {
      return {
        success: false,
        error: `A connection request already exists with status: ${existing.status}`,
      };
    }

    // Prepare sender's privacy defaults if not supplied
    const senderUser = this.getUserById(params.senderId);
    const senderAlumni = senderUser?.alumniId ? this.getAlumniById(senderUser.alumniId) : undefined;
    const senderStudent = senderUser?.studentId ? this.getStudentById(senderUser.studentId) : undefined;

    const senderPrivacy = params.senderPrivacy || {
      shareEmail: true,
      sharePhone: true,
      personalEmail: senderAlumni?.personalEmail || senderStudent?.personalEmail || senderUser?.email,
      phone: senderAlumni?.phone || senderStudent?.phone || '+91 98765 00000',
      preferredChannel: 'WHATSAPP',
      privateNote: params.note || 'Available to connect with alumni and students.',
    };

    const newConnection: Connection = {
      id: `con-${Date.now()}`,
      senderId: params.senderId,
      senderName: params.senderName,
      senderRole: params.senderRole,
      senderCompany: params.senderCompany,
      senderAvatar: params.senderAvatar,
      receiverId: params.receiverId,
      receiverName: params.receiverName,
      receiverRole: params.receiverRole,
      receiverCompany: params.receiverCompany,
      receiverAvatar: params.receiverAvatar,
      status: 'PENDING',
      note: params.note,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      privacyConsentAccepted: params.privacyConsentAccepted ?? true,
      senderPrivacy,
      privateMessages: params.note ? [
        {
          id: `msg-${Date.now()}`,
          senderId: params.senderId,
          senderName: params.senderName,
          senderRole: params.senderRole,
          message: params.note,
          timestamp: new Date().toISOString(),
        }
      ] : [],
    };

    this.connections.push(newConnection);
    mongoManager.syncConnection(newConnection);

    // Notify Receiver
    this.notifications.push({
      id: `notif-${Date.now()}`,
      userId: params.receiverId,
      title: 'New Connection Request',
      message: `${params.senderName} sent you a professional alumni connection request.`,
      type: 'CONNECTION',
      read: false,
      link: '/connections',
      createdAt: new Date().toISOString(),
    });

    return { success: true, connection: newConnection };
  }

  public updateConnectionStatus(
    connectionId: string,
    status: 'ACCEPTED' | 'REJECTED',
    userId: string
  ): { success: boolean; connection?: Connection } {
    const conn = this.connections.find((c) => c.id === connectionId);
    if (!conn) return { success: false };

    if (conn.receiverId !== userId) {
      return { success: false };
    }

    conn.status = status;
    conn.updatedAt = new Date().toISOString();

    if (status === 'ACCEPTED') {
      conn.privacyConsentAccepted = true;
      // Auto-populate receiver's privacy defaults if missing
      if (!conn.receiverPrivacy) {
        const receiverUser = this.getUserById(userId);
        const receiverAlumni = receiverUser?.alumniId ? this.getAlumniById(receiverUser.alumniId) : undefined;
        const receiverStudent = receiverUser?.studentId ? this.getStudentById(receiverUser.studentId) : undefined;

        conn.receiverPrivacy = {
          shareEmail: true,
          sharePhone: true,
          personalEmail: receiverAlumni?.personalEmail || receiverStudent?.personalEmail || receiverUser?.email,
          phone: receiverAlumni?.phone || receiverStudent?.phone || '+91 98765 11111',
          preferredChannel: 'EMAIL',
          privateNote: 'Connected! Feel free to reach out via email or phone.',
        };
      }
    }

    mongoManager.syncConnection(conn);

    // Notify Sender
    this.notifications.push({
      id: `notif-${Date.now()}`,
      userId: conn.senderId,
      title: `Connection Request ${status === 'ACCEPTED' ? 'Accepted' : 'Declined'}`,
      message: `${conn.receiverName} ${status.toLowerCase()} your alumni connection request.`,
      type: 'CONNECTION',
      read: false,
      link: '/connections',
      createdAt: new Date().toISOString(),
    });

    return { success: true, connection: conn };
  }

  public addConnectionMessage(params: {
    connectionId: string;
    senderId: string;
    senderName: string;
    senderRole?: string;
    message: string;
  }): { success: boolean; error?: string; connection?: Connection } {
    const conn = this.connections.find((c) => c.id === params.connectionId);
    if (!conn) return { success: false, error: 'Connection not found.' };
    if (conn.status !== 'ACCEPTED') {
      return { success: false, error: 'Private notes can only be exchanged once connected.' };
    }
    if (conn.senderId !== params.senderId && conn.receiverId !== params.senderId) {
      return { success: false, error: 'Unauthorized to post to this connection vault.' };
    }

    if (!conn.privateMessages) {
      conn.privateMessages = [];
    }

    const newMessage = {
      id: `msg-${Date.now()}`,
      senderId: params.senderId,
      senderName: params.senderName,
      senderRole: params.senderRole,
      message: params.message,
      timestamp: new Date().toISOString(),
    };

    conn.privateMessages.push(newMessage);
    conn.updatedAt = new Date().toISOString();
    mongoManager.syncConnection(conn);

    const otherUserId = conn.senderId === params.senderId ? conn.receiverId : conn.senderId;
    this.notifications.push({
      id: `notif-${Date.now()}`,
      userId: otherUserId,
      title: 'Private Note from Connection',
      message: `${params.senderName} shared a private note in your mutual connection vault.`,
      type: 'CONNECTION',
      read: false,
      link: '/connections',
      createdAt: new Date().toISOString(),
    });

    return { success: true, connection: conn };
  }

  public updateConnectionPrivacy(params: {
    connectionId: string;
    userId: string;
    shareEmail?: boolean;
    sharePhone?: boolean;
    preferredChannel?: 'EMAIL' | 'PHONE' | 'WHATSAPP' | 'LINKEDIN';
    privateNote?: string;
  }): { success: boolean; error?: string; connection?: Connection } {
    const conn = this.connections.find((c) => c.id === params.connectionId);
    if (!conn) return { success: false, error: 'Connection not found.' };

    const isSender = conn.senderId === params.userId;
    const isReceiver = conn.receiverId === params.userId;
    if (!isSender && !isReceiver) {
      return { success: false, error: 'Unauthorized.' };
    }

    const targetKey = isSender ? 'senderPrivacy' : 'receiverPrivacy';
    if (!conn[targetKey]) {
      conn[targetKey] = {
        shareEmail: true,
        sharePhone: true,
      };
    }

    if (params.shareEmail !== undefined) conn[targetKey]!.shareEmail = params.shareEmail;
    if (params.sharePhone !== undefined) conn[targetKey]!.sharePhone = params.sharePhone;
    if (params.preferredChannel !== undefined) conn[targetKey]!.preferredChannel = params.preferredChannel;
    if (params.privateNote !== undefined) conn[targetKey]!.privateNote = params.privateNote;

    conn.updatedAt = new Date().toISOString();
    return { success: true, connection: conn };
  }

  public deleteConnection(connectionId: string, userId: string): { success: boolean; error?: string } {
    const index = this.connections.findIndex((c) => c.id === connectionId);
    if (index === -1) return { success: false, error: 'Connection not found.' };
    const conn = this.connections[index];
    if (conn.senderId !== userId && conn.receiverId !== userId) {
      return { success: false, error: 'Unauthorized to delete this connection.' };
    }
    this.connections.splice(index, 1);
    return { success: true };
  }

  public isUserConnectedWithAlumni(userId?: string, alumniId?: string): boolean {
    if (!userId || !alumniId) return false;
    const alumni = this.alumni.find((a) => a.id === alumniId);
    if (!alumni) return false;
    if (userId === alumni.userId) return true;
    return this.connections.some(
      (c) =>
        c.status === 'ACCEPTED' &&
        ((c.senderId === userId && c.receiverId === alumni.userId) ||
          (c.senderId === alumni.userId && c.receiverId === userId))
    );
  }

  // ==========================================
  // MENTORSHIP
  // ==========================================
  public getAllMentors(): AlumniProfile[] {
    return this.alumni.filter((a) => a.isAvailableForMentorship);
  }

  public getMentorshipRequests(userId: string, role: string, alumniId?: string, studentId?: string): MentorshipRequest[] {
    return this.mentorshipRequests.filter((m) => {
      if (alumniId && m.mentorId === alumniId) return true;
      if (studentId && m.menteeId === studentId) return true;
      return m.menteeId === userId;
    });
  }

  public createMentorshipRequest(params: {
    mentorId: string;
    menteeId: string;
    menteeName: string;
    menteeEnrollment?: string;
    menteeBranch?: string;
    menteeYear?: number;
    menteeRole: 'STUDENT' | 'ALUMNI';
    menteeAvatar?: string;
    mentorshipTopic: string;
    message: string;
  }): { success: boolean; error?: string; request?: MentorshipRequest } {
    const mentor = this.alumni.find((a) => a.id === params.mentorId);
    if (!mentor) return { success: false, error: 'Mentor not found.' };

    if (!mentor.isAvailableForMentorship) {
      return { success: false, error: 'This alumni is currently not accepting new mentorship requests.' };
    }

    const newReq: MentorshipRequest = {
      id: `mr-${Date.now()}`,
      mentorId: mentor.id,
      mentorName: mentor.name,
      mentorCompany: mentor.currentCompany,
      mentorRole: mentor.jobRole,
      mentorAvatar: mentor.avatarUrl,
      menteeId: params.menteeId,
      menteeName: params.menteeName,
      menteeEnrollment: params.menteeEnrollment,
      menteeBranch: params.menteeBranch,
      menteeYear: params.menteeYear,
      menteeRole: params.menteeRole,
      menteeAvatar: params.menteeAvatar,
      mentorshipTopic: params.mentorshipTopic,
      message: params.message,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.mentorshipRequests.unshift(newReq);
    mongoManager.syncMentorship(newReq);

    // Notify Mentor User
    const mentorUser = this.users.find((u) => u.alumniId === mentor.id);
    if (mentorUser) {
      this.notifications.push({
        id: `notif-${Date.now()}`,
        userId: mentorUser.id,
        title: 'New Mentorship Request',
        message: `${params.menteeName} requested mentorship in ${params.mentorshipTopic}.`,
        type: 'MENTORSHIP',
        read: false,
        link: '/mentorship',
        createdAt: new Date().toISOString(),
      });
    }

    return { success: true, request: newReq };
  }

  public updateMentorshipStatus(
    requestId: string,
    status: 'ACCEPTED' | 'REJECTED' | 'COMPLETED',
    mentorNotes?: string
  ): { success: boolean; request?: MentorshipRequest } {
    const req = this.mentorshipRequests.find((m) => m.id === requestId);
    if (!req) return { success: false };

    req.status = status;
    if (mentorNotes) req.mentorNotes = mentorNotes;
    req.updatedAt = new Date().toISOString();
    mongoManager.syncMentorship(req);

    // Find mentee user to notify
    const menteeUser = this.users.find(
      (u) => u.studentId === req.menteeId || u.alumniId === req.menteeId || u.id === req.menteeId
    );
    if (menteeUser) {
      this.notifications.push({
        id: `notif-${Date.now()}`,
        userId: menteeUser.id,
        title: `Mentorship Request ${status}`,
        message: `${req.mentorName} marked your mentorship request as ${status.toLowerCase()}. Note: ${mentorNotes || 'No notes provided.'}`,
        type: 'MENTORSHIP',
        read: false,
        link: '/mentorship',
        createdAt: new Date().toISOString(),
      });
    }

    return { success: true, request: req };
  }

  public toggleMentorshipAvailability(
    alumniId: string,
    isAvailable: boolean,
    areas?: string[],
    maxMentees?: number
  ): AlumniProfile | null {
    const profile = this.alumni.find((a) => a.id === alumniId);
    if (!profile) return null;
    profile.isAvailableForMentorship = isAvailable;
    if (areas) profile.mentorshipAreas = areas;
    if (maxMentees) profile.maxMentees = maxMentees;
    profile.updatedAt = new Date().toISOString();
    return profile;
  }

  // ==========================================
  // JOBS & OPPORTUNITIES
  // ==========================================
  public getAllJobs(isAdmin = false): JobPost[] {
    if (isAdmin) return this.jobs;
    return this.jobs.filter((j) => j.status === 'APPROVED');
  }

  public createJob(job: Omit<JobPost, 'id' | 'createdAt' | 'status'>): JobPost {
    const newJob: JobPost = {
      ...job,
      id: `job-${Date.now()}`,
      status: 'APPROVED', // For prototype, or 'PENDING' if admin review wanted
      createdAt: new Date().toISOString(),
    };
    this.jobs.unshift(newJob);
    mongoManager.syncJob(newJob);

    // Notify Admin
    this.notifications.push({
      id: `notif-${Date.now()}`,
      userId: 'usr-admin-001',
      title: 'New Job Opportunity Posted',
      message: `${newJob.postedByName} posted ${newJob.title} at ${newJob.company}.`,
      type: 'JOB',
      read: false,
      link: '/admin/jobs',
      createdAt: new Date().toISOString(),
    });

    return newJob;
  }

  public moderateJob(jobId: string, status: VerificationStatus, adminRemark?: string): JobPost | null {
    const job = this.jobs.find((j) => j.id === jobId);
    if (!job) return null;
    job.status = status;
    if (adminRemark) job.adminRemark = adminRemark;
    mongoManager.syncJob(job);
    return job;
  }

  // ==========================================
  // EVENTS
  // ==========================================
  public getAllEvents(): CollegeEvent[] {
    return this.events;
  }

  public createEvent(event: Omit<CollegeEvent, 'id' | 'registrationCount' | 'registeredUserIds' | 'createdAt'>): CollegeEvent {
    const newEvent: CollegeEvent = {
      ...event,
      id: `evt-${Date.now()}`,
      registrationCount: 0,
      registeredUserIds: [],
      createdAt: new Date().toISOString(),
    };
    this.events.unshift(newEvent);
    mongoManager.syncEvent(newEvent);
    return newEvent;
  }

  public registerForEvent(eventId: string, userId: string): { success: boolean; error?: string; event?: CollegeEvent } {
    const event = this.events.find((e) => e.id === eventId);
    if (!event) return { success: false, error: 'Event not found.' };

    if (!event.isRegistrationsOpen) {
      return { success: false, error: 'Registrations for this event are closed.' };
    }

    if (event.registeredUserIds.includes(userId)) {
      return { success: false, error: 'You are already registered for this event.' };
    }

    if (event.capacity && event.registrationCount >= event.capacity) {
      return { success: false, error: 'Event capacity is full.' };
    }

    event.registeredUserIds.push(userId);
    event.registrationCount += 1;
    mongoManager.syncEvent(event);

    // Notification
    this.notifications.push({
      id: `notif-${Date.now()}`,
      userId,
      title: 'Event Registration Confirmed',
      message: `You have successfully RSVP\'d for "${event.title}" on ${event.date}.`,
      type: 'EVENT',
      read: false,
      link: '/events',
      createdAt: new Date().toISOString(),
    });

    return { success: true, event };
  }

  // ==========================================
  // ACHIEVEMENTS
  // ==========================================
  public getAllAchievements(isAdmin = false): Achievement[] {
    if (isAdmin) return this.achievements;
    return this.achievements.filter((a) => a.status === 'APPROVED');
  }

  public getAchievementsByAlumniId(alumniId: string): Achievement[] {
    return this.achievements.filter((a) => a.alumniId === alumniId && a.status === 'APPROVED');
  }

  public createAchievement(params: {
    alumniId: string;
    title: string;
    category: Achievement['category'];
    description: string;
    year: number;
    proofUrl?: string;
    certificateUrl?: string;
  }): Achievement | null {
    const alumni = this.alumni.find((a) => a.id === params.alumniId);
    if (!alumni) return null;

    const newAch: Achievement = {
      id: `ach-${Date.now()}`,
      alumniId: alumni.id,
      alumniName: alumni.name,
      alumniEnrollment: alumni.enrollmentNo,
      title: params.title,
      category: params.category,
      description: params.description,
      year: params.year,
      proofUrl: params.proofUrl,
      certificateUrl: params.certificateUrl,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    this.achievements.unshift(newAch);
    mongoManager.syncAchievement(newAch);

    // Notify Admin
    this.notifications.push({
      id: `notif-${Date.now()}`,
      userId: 'usr-admin-001',
      title: 'New Alumni Achievement Submitted',
      message: `${alumni.name} submitted "${params.title}" for verification.`,
      type: 'ACHIEVEMENT',
      read: false,
      link: '/admin/achievements',
      createdAt: new Date().toISOString(),
    });

    return newAch;
  }

  public moderateAchievement(
    achievementId: string,
    status: VerificationStatus,
    adminRemark?: string
  ): Achievement | null {
    const ach = this.achievements.find((a) => a.id === achievementId);
    if (!ach) return null;

    ach.status = status;
    ach.adminRemark = adminRemark;
    if (status === 'APPROVED') {
      ach.verifiedAt = new Date().toISOString();
    }
    mongoManager.syncAchievement(ach);

    const alumniUser = this.users.find((u) => u.alumniId === ach.alumniId);
    if (alumniUser) {
      this.notifications.push({
        id: `notif-${Date.now()}`,
        userId: alumniUser.id,
        title: `Achievement ${status === 'APPROVED' ? 'Approved' : 'Rejected'}`,
        message: `Your achievement "${ach.title}" has been ${status.toLowerCase()}. ${adminRemark ? `Remark: ${adminRemark}` : ''}`,
        type: 'ACHIEVEMENT',
        read: false,
        link: '/achievements',
        createdAt: new Date().toISOString(),
      });
    }

    return ach;
  }

  // ==========================================
  // NOTIFICATIONS
  // ==========================================
  public getNotificationsForUser(userId: string): AppNotification[] {
    return this.notifications.filter((n) => n.userId === userId);
  }

  public markNotificationAsRead(notifId: string): boolean {
    const n = this.notifications.find((notif) => notif.id === notifId);
    if (n) {
      n.read = true;
      return true;
    }
    return false;
  }

  // ==========================================
  // ADMIN SYSTEM METRICS
  // ==========================================
  public getAdminMetrics(): AdminMetrics {
    const totalStudents = this.students.length;
    const eligibleGraduates = this.students.filter(
      (s) => s.graduationStatus === 'COMPLETE' && !s.isAlumniActivated
    ).length;
    const totalAlumni = this.alumni.length;
    const verifiedAlumni = this.alumni.filter((a) => a.verificationStatus === 'APPROVED').length;
    const pendingVerifications = this.profileChanges.filter((p) => p.status === 'PENDING').length;
    const pendingProfileChanges = pendingVerifications;
    const pendingAchievements = this.achievements.filter((a) => a.status === 'PENDING').length;
    const pendingJobs = this.jobs.filter((j) => j.status === 'PENDING').length;
    const totalEvents = this.events.length;
    const totalRegistrations = this.events.reduce((acc, e) => acc + e.registrationCount, 0);
    const activeMentorshipRequests = this.mentorshipRequests.filter(
      (m) => m.status === 'PENDING' || m.status === 'ACCEPTED'
    ).length;
    const totalConnections = this.connections.filter((c) => c.status === 'ACCEPTED').length;

    return {
      totalStudents,
      eligibleGraduates,
      totalAlumni,
      verifiedAlumni,
      pendingVerifications,
      pendingProfileChanges,
      pendingAchievements,
      pendingJobs,
      totalEvents,
      totalRegistrations,
      activeMentorshipRequests,
      totalConnections,
    };
  }
}

export const db = new RelationalDatabase();
