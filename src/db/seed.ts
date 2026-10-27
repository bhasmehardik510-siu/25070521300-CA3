import { db } from './index.ts';
import {
  users,
  students,
  alumni,
  jobs,
  events,
  achievements,
  profileChangeRequests,
  connections,
  mentorshipRequests,
  notifications,
} from './schema.ts';
import {
  INITIAL_STUDENTS,
  INITIAL_ALUMNI,
  INITIAL_JOBS,
  INITIAL_EVENTS,
  INITIAL_ACHIEVEMENTS,
  INITIAL_PROFILE_CHANGES,
  INITIAL_CONNECTIONS,
  INITIAL_MENTORSHIP_REQUESTS,
} from '../../server/data/seedData.ts';

export async function seedDatabaseIfEmpty() {
  try {
    const existingUsers = await db.select().from(users).limit(1);
    if (existingUsers.length > 0) {
      console.log('Database already initialized with records.');
      return;
    }

    console.log('Database is empty. Initializing PostgreSQL tables with seed data...');

    // 1. Seed Students
    for (const std of INITIAL_STUDENTS) {
      await db
        .insert(students)
        .values({
          id: std.id,
          enrollmentNo: std.enrollmentNo,
          name: std.name,
          branch: std.branch,
          degree: std.degree,
          graduationYear: std.graduationYear,
          collegeEmail: std.collegeEmail,
          personalEmail: std.personalEmail,
          phone: std.phone,
          cgpa: std.cgpa.toString(),
          graduationStatus: std.graduationStatus,
          convocationDate: std.convocationDate,
          isAlumniActivated: std.isAlumniActivated,
          alumniId: std.alumniId,
          createdAt: std.createdAt ? new Date(std.createdAt) : new Date(),
        })
        .onConflictDoNothing();
    }

    // 2. Seed Alumni Profiles
    for (const alm of INITIAL_ALUMNI) {
      await db
        .insert(alumni)
        .values({
          id: alm.id,
          userId: alm.userId,
          studentId: alm.studentId,
          enrollmentNo: alm.enrollmentNo,
          name: alm.name,
          branch: alm.branch,
          degree: alm.degree,
          graduationYear: alm.graduationYear,
          collegeEmail: alm.collegeEmail,
          personalEmail: alm.personalEmail,
          phone: alm.phone,
          avatarUrl: alm.avatarUrl,
          currentCompany: alm.currentCompany,
          jobRole: alm.jobRole,
          industry: alm.industry,
          experienceYears: alm.experienceYears || 0,
          city: alm.city,
          country: alm.country || 'India',
          higherStudies: alm.higherStudies,
          skills: alm.skills,
          bio: alm.bio,
          linkedinUrl: alm.linkedinUrl,
          githubUrl: alm.githubUrl,
          websiteUrl: alm.websiteUrl,
          isAvailableForMentorship: alm.isAvailableForMentorship,
          mentorshipAreas: alm.mentorshipAreas,
          maxMentees: alm.maxMentees || 3,
          verificationStatus: alm.verificationStatus,
          verifiedAt: alm.verifiedAt ? new Date(alm.verifiedAt) : new Date(),
          verifiedBy: alm.verifiedBy,
          privacySettings: (alm as any).privacySettings || {
            shareEmailWithConnections: true,
            sharePhoneWithConnections: true,
            allowDirectMessaging: true,
            preferredContactMethod: 'EMAIL',
            profileVisibility: 'PUBLIC',
          },
          createdAt: alm.createdAt ? new Date(alm.createdAt) : new Date(),
          updatedAt: alm.updatedAt ? new Date(alm.updatedAt) : new Date(),
        })
        .onConflictDoNothing();
    }

    // 3. Seed Users
    const seedUsers = [
      {
        id: 'usr-admin-001',
        email: 'admin@alumni.edu',
        passwordHash: 'admin123',
        role: 'ADMIN',
        name: 'Dr. S. K. Venkatesh (Alumni Cell Dean)',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        createdAt: new Date('2020-01-01T00:00:00.000Z'),
      },
      {
        id: 'usr-std-001',
        email: 'rahul.sharma@college.edu',
        passwordHash: 'student123',
        role: 'STUDENT',
        name: 'Rahul Sharma',
        studentId: 'std-001',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
        createdAt: new Date('2023-08-01T00:00:00.000Z'),
      },
      {
        id: 'usr-std-002',
        email: 'ananya.iyer@college.edu',
        passwordHash: 'student123',
        role: 'STUDENT',
        name: 'Ananya Iyer',
        studentId: 'std-002',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
        createdAt: new Date('2023-08-01T00:00:00.000Z'),
      },
      {
        id: 'usr-std-004',
        email: 'priya.verma@college.edu',
        passwordHash: 'student123',
        role: 'STUDENT',
        name: 'Priya Verma',
        studentId: 'std-004',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
        createdAt: new Date('2024-08-01T00:00:00.000Z'),
      },
      {
        id: 'usr-std-005',
        email: 'karan.patel@college.edu',
        passwordHash: 'student123',
        role: 'STUDENT',
        name: 'Karan Patel',
        studentId: 'std-005',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
        createdAt: new Date('2023-08-01T00:00:00.000Z'),
      },
      ...INITIAL_ALUMNI.map((alm) => ({
        id: alm.userId,
        email: alm.collegeEmail,
        passwordHash: 'alumni123',
        role: 'ALUMNI',
        name: alm.name,
        avatarUrl: alm.avatarUrl,
        studentId: alm.studentId,
        alumniId: alm.id,
        createdAt: alm.createdAt ? new Date(alm.createdAt) : new Date(),
      })),
    ];

    for (const u of seedUsers) {
      await db
        .insert(users)
        .values({
          id: u.id,
          email: u.email,
          passwordHash: u.passwordHash,
          role: u.role,
          name: u.name,
          avatarUrl: u.avatarUrl,
          studentId: (u as any).studentId,
          alumniId: (u as any).alumniId,
          createdAt: u.createdAt,
        })
        .onConflictDoNothing();
    }

    // 4. Seed Jobs
    for (const job of INITIAL_JOBS) {
      await db
        .insert(jobs)
        .values({
          id: job.id,
          title: job.title,
          company: job.company,
          companyLogoUrl: job.companyLogoUrl,
          location: job.location,
          isRemote: job.isRemote,
          jobType: job.jobType,
          experienceLevel: job.experienceLevel,
          description: job.description,
          requirements: job.requirements,
          skills: job.skills,
          applyUrl: job.applyUrl,
          contactEmail: job.contactEmail,
          deadline: job.deadline,
          postedByAlumniId: job.postedByAlumniId,
          postedByName: job.postedByName,
          postedByCompany: job.postedByCompany,
          status: job.status,
          adminRemark: job.adminRemark,
          applicantCount: (job as any).applicantCount || 0,
          createdAt: job.createdAt ? new Date(job.createdAt) : new Date(),
        })
        .onConflictDoNothing();
    }

    // 5. Seed Events
    for (const ev of INITIAL_EVENTS) {
      await db
        .insert(events)
        .values({
          id: ev.id,
          title: ev.title,
          category: ev.category,
          description: ev.description,
          date: ev.date,
          time: ev.time,
          location: ev.location,
          isVirtual: ev.isVirtual,
          meetingLink: ev.meetingLink,
          bannerUrl: ev.bannerUrl,
          organizer: ev.organizer,
          capacity: ev.capacity || 500,
          registrationCount: ev.registrationCount || 0,
          isRegistrationsOpen: ev.isRegistrationsOpen,
          registeredUserIds: (ev as any).registeredUserIds || [],
          createdAt: ev.createdAt ? new Date(ev.createdAt) : new Date(),
        })
        .onConflictDoNothing();
    }

    // 6. Seed Achievements
    for (const ach of INITIAL_ACHIEVEMENTS) {
      await db
        .insert(achievements)
        .values({
          id: ach.id,
          alumniId: ach.alumniId,
          alumniName: ach.alumniName,
          alumniEnrollment: ach.alumniEnrollment,
          title: ach.title,
          category: ach.category,
          description: ach.description,
          year: ach.year,
          certificateUrl: ach.certificateUrl,
          proofUrl: ach.proofUrl,
          status: ach.status,
          adminRemark: ach.adminRemark,
          verifiedAt: ach.verifiedAt ? new Date(ach.verifiedAt) : null,
          createdAt: ach.createdAt ? new Date(ach.createdAt) : new Date(),
        })
        .onConflictDoNothing();
    }

    // 7. Seed Profile Change Requests
    for (const req of INITIAL_PROFILE_CHANGES) {
      await db
        .insert(profileChangeRequests)
        .values({
          id: req.id,
          alumniId: req.alumniId,
          alumniName: req.alumniName,
          alumniEnrollment: req.alumniEnrollment,
          currentCompany: req.currentCompany,
          proposedCompany: req.proposedCompany,
          currentJobRole: req.currentJobRole,
          proposedJobRole: req.proposedJobRole,
          currentHigherStudies: req.currentHigherStudies,
          proposedHigherStudies: req.proposedHigherStudies,
          currentSkills: req.currentSkills,
          proposedSkills: req.proposedSkills,
          reason: req.reason,
          supportingDocUrl: req.supportingDocUrl,
          status: req.status,
          adminRemarks: req.adminRemarks,
          reviewedBy: req.reviewedBy,
          reviewedAt: req.reviewedAt ? new Date(req.reviewedAt) : null,
          createdAt: req.createdAt ? new Date(req.createdAt) : new Date(),
        })
        .onConflictDoNothing();
    }

    // 8. Seed Connections
    for (const conn of INITIAL_CONNECTIONS) {
      await db
        .insert(connections)
        .values({
          id: conn.id,
          senderId: conn.senderId,
          senderName: conn.senderName,
          senderRole: conn.senderRole,
          senderCompany: conn.senderCompany,
          senderAvatar: conn.senderAvatar,
          receiverId: conn.receiverId,
          receiverName: conn.receiverName,
          receiverRole: conn.receiverRole,
          receiverCompany: conn.receiverCompany,
          receiverAvatar: conn.receiverAvatar,
          status: conn.status,
          note: conn.note,
          senderSharedDetails: (conn as any).senderSharedDetails || null,
          receiverSharedDetails: (conn as any).receiverSharedDetails || null,
          privateMessages: (conn as any).privateMessages || [],
          createdAt: conn.createdAt ? new Date(conn.createdAt) : new Date(),
          updatedAt: (conn as any).updatedAt ? new Date((conn as any).updatedAt) : new Date(),
        })
        .onConflictDoNothing();
    }

    // 9. Seed Mentorship Requests
    for (const mentorReq of INITIAL_MENTORSHIP_REQUESTS) {
      await db
        .insert(mentorshipRequests)
        .values({
          id: mentorReq.id,
          mentorId: mentorReq.mentorId,
          mentorName: mentorReq.mentorName,
          menteeId: mentorReq.menteeId,
          menteeName: mentorReq.menteeName,
          menteeEnrollment: mentorReq.menteeEnrollment,
          menteeBranch: mentorReq.menteeBranch,
          menteeYear: mentorReq.menteeYear,
          menteeRole: mentorReq.menteeRole,
          mentorshipTopic: mentorReq.mentorshipTopic,
          message: mentorReq.message,
          status: mentorReq.status,
          mentorNotes: mentorReq.mentorNotes,
          createdAt: mentorReq.createdAt ? new Date(mentorReq.createdAt) : new Date(),
          updatedAt: (mentorReq as any).updatedAt ? new Date((mentorReq as any).updatedAt) : new Date(),
        })
        .onConflictDoNothing();
    }

    // 10. Seed Notifications
    const initialNotifs = [
      {
        id: 'notif-1',
        userId: 'usr-admin-001',
        title: 'New Profile Verification Pending',
        message: 'Neha Kapoor submitted an update for career promotion to AWS Solutions Architect.',
        type: 'VERIFICATION',
        isRead: false,
        link: '/admin/verifications',
        createdAt: new Date('2026-08-29T10:00:00.000Z'),
      },
      {
        id: 'notif-2',
        userId: 'usr-admin-001',
        title: 'New Job Submission Moderation',
        message: 'Farhan Ali posted Staff AI Solutions Architect at Stripe for review.',
        type: 'JOB',
        isRead: false,
        link: '/admin/jobs',
        createdAt: new Date('2026-08-28T10:00:00.000Z'),
      },
    ];

    for (const notif of initialNotifs) {
      await db.insert(notifications).values(notif).onConflictDoNothing();
    }

    console.log('Database initialization & seeding completed successfully.');
  } catch (error) {
    console.error('Failed to seed database:', error);
  }
}
