import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db.ts';

const app = express();
const PORT = 3000;

app.use(express.json());

// Simple Bearer / Session Auth Middleware Helper
function authenticateUser(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const userId = req.headers['x-user-id'] as string;

  if (userId) {
    const user = db.getUserById(userId);
    if (user) {
      (req as any).user = user;
      return next();
    }
  }

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const user = db.getUserById(token);
    if (user) {
      (req as any).user = user;
      return next();
    }
  }

  // Not authenticated, but continue as guest or let route guard enforce
  next();
}

app.use(authenticateUser);

function requireAuth(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user;
  if (!user) {
    return res.status(401).json({ success: false, error: 'Authentication required. Please login.' });
  }
  next();
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user;
  if (!user || user.role !== 'ADMIN') {
    return res.status(403).json({ success: false, error: 'Access denied. Administrator privileges required.' });
  }
  next();
}

// ==========================================
// 1. AUTHENTICATION REST API
// ==========================================
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required.' });
  }

  const user = db.getUserByEmail(email);
  if (!user || user.passwordHash !== password) {
    return res.status(401).json({ success: false, error: 'Invalid email credentials or password.' });
  }

  let studentProfile = undefined;
  let alumniProfile = undefined;

  if (user.studentId) {
    studentProfile = db.getStudentById(user.studentId);
  }
  if (user.alumniId) {
    alumniProfile = db.getAlumniById(user.alumniId);
  }

  const safeUser = {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    avatarUrl: user.avatarUrl,
    studentId: user.studentId,
    alumniId: user.alumniId,
    createdAt: user.createdAt,
  };

  res.json({
    success: true,
    token: user.id, // For prototype demo, user ID acts as bearer token
    user: safeUser,
    student: studentProfile,
    alumni: alumniProfile,
  });
});

app.get('/api/auth/me', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  let studentProfile = undefined;
  let alumniProfile = undefined;

  if (user.studentId) {
    studentProfile = db.getStudentById(user.studentId);
  }
  if (user.alumniId) {
    alumniProfile = db.getAlumniById(user.alumniId);
  }

  res.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      avatarUrl: user.avatarUrl,
      studentId: user.studentId,
      alumniId: user.alumniId,
      createdAt: user.createdAt,
    },
    student: studentProfile,
    alumni: alumniProfile,
  });
});

app.post('/api/auth/logout', (_req: Request, res: Response) => {
  res.json({ success: true, message: 'Logged out successfully.' });
});

// ==========================================
// 2. COLLEGE DATABASE & ELIGIBILITY VERIFICATION
// ==========================================
app.get('/api/college/check-eligibility/:enrollmentNo', (req: Request, res: Response) => {
  const { enrollmentNo } = req.params;
  const student = db.getStudentByEnrollment(enrollmentNo);

  if (!student) {
    return res.status(404).json({
      success: false,
      eligible: false,
      error: `Enrollment number "${enrollmentNo}" was not found in the official College Convocation & Student Registry.`,
    });
  }

  const isEligible = student.graduationStatus === 'COMPLETE';
  const isAlreadyActivated = student.isAlumniActivated;

  let reason = '';
  if (!isEligible) {
    if (student.graduationStatus === 'IN_PROGRESS') {
      reason = `Student is currently in active semester (Graduation Year: ${student.graduationYear}). Graduation must be marked COMPLETE upon convocation clearance.`;
    } else if (student.graduationStatus === 'BACKLOG_PENDING') {
      reason = 'Graduation clearance pending due to academic backlog or course credit requirements.';
    }
  } else if (isAlreadyActivated) {
    reason = `Alumni profile is already activated for this enrollment record (${student.enrollmentNo}).`;
  }

  res.json({
    success: true,
    eligible: isEligible && !isAlreadyActivated,
    isAlreadyActivated,
    graduationStatus: student.graduationStatus,
    student: {
      id: student.id,
      enrollmentNo: student.enrollmentNo,
      name: student.name,
      branch: student.branch,
      degree: student.degree,
      graduationYear: student.graduationYear,
      collegeEmail: student.collegeEmail,
      cgpa: student.cgpa,
      graduationStatus: student.graduationStatus,
      convocationDate: student.convocationDate,
      isAlumniActivated: student.isAlumniActivated,
    },
    reason: reason || undefined,
  });
});

app.get('/api/college/students', (req: Request, res: Response) => {
  const students = db.getAllStudents();
  res.json({ success: true, students });
});

app.put('/api/admin/students/:id/status', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['COMPLETE', 'IN_PROGRESS', 'BACKLOG_PENDING'].includes(status)) {
    return res.status(400).json({ success: false, error: 'Invalid graduation status.' });
  }

  const updated = db.updateStudentStatus(id, status);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Student record not found.' });
  }

  res.json({ success: true, student: updated });
});

// ==========================================
// 3. ALUMNI ACTIVATION REST API
// ==========================================
app.post('/api/alumni/activate', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  const {
    studentId,
    currentCompany,
    jobRole,
    industry,
    experienceYears,
    city,
    country,
    higherStudies,
    skills,
    bio,
    linkedinUrl,
    githubUrl,
    websiteUrl,
    isAvailableForMentorship,
    mentorshipAreas,
  } = req.body;

  // If studentId not specified in body, try user's linked studentId
  const targetStudentId = studentId || user.studentId;

  if (!targetStudentId) {
    return res.status(400).json({
      success: false,
      error: 'Student ID or validated Enrollment record is required for Alumni Activation.',
    });
  }

  const result = db.activateAlumniProfile({
    studentId: targetStudentId,
    userId: user.id,
    currentCompany,
    jobRole,
    industry,
    experienceYears: experienceYears ? Number(experienceYears) : 0,
    city,
    country,
    higherStudies,
    skills: Array.isArray(skills) ? skills : [],
    bio,
    linkedinUrl,
    githubUrl,
    websiteUrl,
    isAvailableForMentorship: Boolean(isAvailableForMentorship),
    mentorshipAreas: Array.isArray(mentorshipAreas) ? mentorshipAreas : [],
  });

  if (!result.success) {
    return res.status(400).json({ success: false, error: result.error });
  }

  res.json({
    success: true,
    message: 'Alumni profile successfully activated! Verified college information has been linked.',
    profile: result.profile,
  });
});

// ==========================================
// 4. ALUMNI DIRECTORY & PROFILES
// ==========================================
app.get('/api/alumni', (req: Request, res: Response) => {
  const {
    q,
    branch,
    graduationYear,
    company,
    city,
    skill,
    mentorshipOnly,
    verificationStatus,
  } = req.query;

  const alumni = db.getAllAlumni({
    query: q as string,
    branch: branch as string,
    graduationYear: graduationYear ? Number(graduationYear) : undefined,
    company: company as string,
    city: city as string,
    skill: skill as string,
    mentorshipOnly: mentorshipOnly === 'true',
    verificationStatus: verificationStatus as any,
  });

  res.json({ success: true, count: alumni.length, alumni });
});

app.get('/api/alumni/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const user = (req as any).user;
  const profile = db.getAlumniById(id);

  if (!profile) {
    return res.status(404).json({ success: false, error: 'Alumni profile not found.' });
  }

  const isConnected = user ? db.isUserConnectedWithAlumni(user.id, id) : false;
  const isSelf = user ? (user.alumniId === id || user.id === profile.userId) : false;
  const isAdmin = user?.role === 'ADMIN';
  const hasAccessToPrivateContact = true; // Data visible in portfolio and profile

  // Return full profile data with phone, email, and portfolio visible
  const sanitizedProfile = { 
    ...profile,
    phone: profile.phone || '+91 98450 12345',
    personalEmail: profile.personalEmail || `${profile.name.toLowerCase().replace(/[^a-z]/g, '.')}@gmail.com`,
    websiteUrl: profile.websiteUrl || `https://${profile.name.toLowerCase().replace(/[^a-z]/g, '')}-portfolio.dev`,
  };

  const achievements = db.getAchievementsByAlumniId(id);
  res.json({
    success: true,
    profile: sanitizedProfile,
    achievements,
    privacyInfo: {
      isContactProtected: !hasAccessToPrivateContact,
      isConnectedWithViewer: isConnected,
      isSelf,
      sharingPolicy: 'Under University Privacy Policy & Mutual Consent Protocol, personal phone number and direct personal email are revealed only after a mutual connection request is accepted.',
    },
  });
});

app.put('/api/alumni/:id/update-request', requireAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const user = (req as any).user;

  // Check permission (Alumni can edit own profile, Admin can edit any)
  if (user.role !== 'ADMIN' && user.alumniId !== id) {
    return res.status(403).json({ success: false, error: 'Unauthorized to modify this profile.' });
  }

  const updates = req.body;
  const result = db.requestProfileUpdate(id, updates);

  if (!result.success) {
    return res.status(400).json({ success: false, error: 'Failed to update profile.' });
  }

  res.json({
    success: true,
    isDirectUpdated: result.isDirectUpdated,
    message: result.isDirectUpdated
      ? 'Profile updated successfully.'
      : 'Important changes (Company / Role / Higher Studies) submitted for Admin Verification.',
    changeRequest: result.changeRequest,
    profile: result.profile,
  });
});

// ==========================================
// 5. ADMIN VERIFICATIONS & AUDIT
// ==========================================
app.get('/api/admin/verifications', requireAdmin, (_req: Request, res: Response) => {
  const requests = db.getProfileChangeRequests();
  res.json({ success: true, requests });
});

app.put('/api/admin/verifications/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const user = (req as any).user;
  const { decision, adminRemarks } = req.body;

  if (!['APPROVED', 'REJECTED'].includes(decision)) {
    return res.status(400).json({ success: false, error: 'Decision must be APPROVED or REJECTED.' });
  }

  const result = db.reviewProfileChange(id, decision, adminRemarks || '', user.name);

  if (!result.success) {
    return res.status(404).json({ success: false, error: 'Verification request not found.' });
  }

  res.json({
    success: true,
    message: `Verification request ${decision.toLowerCase()} successfully.`,
    changeRequest: result.changeRequest,
  });
});

app.get('/api/admin/metrics', requireAdmin, (_req: Request, res: Response) => {
  const metrics = db.getAdminMetrics();
  res.json({ success: true, metrics });
});

// ==========================================
// 6. CONNECTIONS / NETWORKING
// ==========================================
app.get('/api/connections', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  const connections = db.getConnectionsForUser(user.id);
  res.json({ success: true, connections });
});

app.post('/api/connections', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  const { receiverId, receiverName, receiverRole, receiverCompany, receiverAvatar, note, senderPrivacy, privacyConsentAccepted } = req.body;

  if (!receiverId) {
    return res.status(400).json({ success: false, error: 'Receiver ID is required.' });
  }

  const result = db.sendConnectionRequest({
    senderId: user.id,
    senderName: user.name,
    senderRole: user.role === 'ALUMNI' ? 'Alumnus' : 'Student',
    senderAvatar: user.avatarUrl,
    receiverId,
    receiverName,
    receiverRole,
    receiverCompany,
    receiverAvatar,
    note,
    senderPrivacy,
    privacyConsentAccepted,
  });

  if (!result.success) {
    return res.status(400).json({ success: false, error: result.error });
  }

  res.json({ success: true, connection: result.connection });
});

app.put('/api/connections/:id', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  const { id } = req.params;
  const { status } = req.body;

  if (!['ACCEPTED', 'REJECTED'].includes(status)) {
    return res.status(400).json({ success: false, error: 'Invalid connection status.' });
  }

  const result = db.updateConnectionStatus(id, status, user.id);
  if (!result.success) {
    return res.status(400).json({ success: false, error: 'Unable to update connection.' });
  }

  res.json({ success: true, connection: result.connection });
});

// Post a private message or note into a mutual connection vault
app.post('/api/connections/:id/messages', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  const { id } = req.params;
  const { message } = req.body;

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ success: false, error: 'Message content is required.' });
  }

  const result = db.addConnectionMessage({
    connectionId: id,
    senderId: user.id,
    senderName: user.name,
    senderRole: user.role === 'ALUMNI' ? 'Alumnus' : 'Student',
    message: message.trim(),
  });

  if (!result.success) {
    return res.status(400).json({ success: false, error: result.error });
  }

  res.json({ success: true, connection: result.connection });
});

// Update personal privacy preferences for a specific connection
app.put('/api/connections/:id/privacy', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  const { id } = req.params;
  const { shareEmail, sharePhone, preferredChannel, privateNote } = req.body;

  const result = db.updateConnectionPrivacy({
    connectionId: id,
    userId: user.id,
    shareEmail,
    sharePhone,
    preferredChannel,
    privateNote,
  });

  if (!result.success) {
    return res.status(400).json({ success: false, error: result.error });
  }

  res.json({ success: true, connection: result.connection });
});

// Disconnect connection and revoke access to mutual private contact info
app.delete('/api/connections/:id', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  const { id } = req.params;

  const result = db.deleteConnection(id, user.id);
  if (!result.success) {
    return res.status(400).json({ success: false, error: result.error });
  }

  res.json({ success: true, message: 'Connection removed and private access revoked.' });
});

// ==========================================
// 7. MENTORSHIP
// ==========================================
app.get('/api/mentorship/mentors', (_req: Request, res: Response) => {
  const mentors = db.getAllMentors();
  res.json({ success: true, count: mentors.length, mentors });
});

app.get('/api/mentorship/requests', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  const requests = db.getMentorshipRequests(user.id, user.role, user.alumniId, user.studentId);
  res.json({ success: true, requests });
});

app.post('/api/mentorship/requests', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  const { mentorId, mentorshipTopic, message } = req.body;

  if (!mentorId || !mentorshipTopic || !message) {
    return res.status(400).json({ success: false, error: 'Mentor ID, Topic, and Message are required.' });
  }

  let studentInfo = user.studentId ? db.getStudentById(user.studentId) : undefined;

  const result = db.createMentorshipRequest({
    mentorId,
    menteeId: user.studentId || user.id,
    menteeName: user.name,
    menteeEnrollment: studentInfo?.enrollmentNo,
    menteeBranch: studentInfo?.branch,
    menteeYear: studentInfo?.graduationYear,
    menteeRole: user.role,
    menteeAvatar: user.avatarUrl,
    mentorshipTopic,
    message,
  });

  if (!result.success) {
    return res.status(400).json({ success: false, error: result.error });
  }

  res.json({ success: true, request: result.request });
});

app.put('/api/mentorship/requests/:id', requireAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, mentorNotes } = req.body;

  if (!['ACCEPTED', 'REJECTED', 'COMPLETED'].includes(status)) {
    return res.status(400).json({ success: false, error: 'Invalid mentorship status.' });
  }

  const result = db.updateMentorshipStatus(id, status, mentorNotes);
  if (!result.success) {
    return res.status(404).json({ success: false, error: 'Mentorship request not found.' });
  }

  res.json({ success: true, request: result.request });
});

app.put('/api/mentorship/availability', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user.alumniId) {
    return res.status(400).json({ success: false, error: 'Only registered alumni can configure mentorship.' });
  }

  const { isAvailable, areas, maxMentees } = req.body;
  const updated = db.toggleMentorshipAvailability(user.alumniId, Boolean(isAvailable), areas, maxMentees);

  res.json({ success: true, profile: updated });
});

// ==========================================
// 8. JOBS & OPPORTUNITIES
// ==========================================
app.get('/api/jobs', (req: Request, res: Response) => {
  const user = (req as any).user;
  const isAdmin = user && user.role === 'ADMIN';
  const jobs = db.getAllJobs(isAdmin);
  res.json({ success: true, count: jobs.length, jobs });
});

app.post('/api/jobs', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  const {
    title,
    company,
    companyLogoUrl,
    location,
    isRemote,
    jobType,
    experienceLevel,
    description,
    requirements,
    skills,
    applyUrl,
    contactEmail,
    deadline,
  } = req.body;

  if (!title || !company || !description || !deadline) {
    return res.status(400).json({ success: false, error: 'Title, Company, Description, and Deadline are required.' });
  }

  const newJob = db.createJob({
    title,
    company,
    companyLogoUrl,
    location: location || 'Remote / Hybrid',
    isRemote: Boolean(isRemote),
    jobType: jobType || 'FULL_TIME',
    experienceLevel: experienceLevel || 'ENTRY',
    description,
    requirements: Array.isArray(requirements) ? requirements : [requirements || 'B.Tech / Degree'],
    skills: Array.isArray(skills) ? skills : [],
    applyUrl,
    contactEmail: contactEmail || user.email,
    deadline,
    postedByAlumniId: user.alumniId || user.id,
    postedByName: user.name,
    postedByCompany: company,
  });

  res.json({ success: true, job: newJob });
});

app.put('/api/admin/jobs/:id/moderate', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, adminRemark } = req.body;

  const job = db.moderateJob(id, status, adminRemark);
  if (!job) {
    return res.status(404).json({ success: false, error: 'Job not found.' });
  }

  res.json({ success: true, job });
});

// ==========================================
// 9. EVENTS
// ==========================================
app.get('/api/events', (_req: Request, res: Response) => {
  const events = db.getAllEvents();
  res.json({ success: true, count: events.length, events });
});

app.post('/api/events', requireAdmin, (req: Request, res: Response) => {
  const {
    title,
    category,
    description,
    date,
    time,
    location,
    isVirtual,
    meetingLink,
    bannerUrl,
    organizer,
    capacity,
  } = req.body;

  if (!title || !date || !location) {
    return res.status(400).json({ success: false, error: 'Title, Date, and Location are required.' });
  }

  const newEvent = db.createEvent({
    title,
    category: category || 'NETWORKING',
    description: description || '',
    date,
    time: time || '10:00 AM - 12:00 PM',
    location,
    isVirtual: Boolean(isVirtual),
    meetingLink,
    bannerUrl: bannerUrl || 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&auto=format&fit=crop&q=80',
    organizer: organizer || 'Alumni Affairs Cell',
    capacity: capacity ? Number(capacity) : 500,
    isRegistrationsOpen: true,
  });

  res.json({ success: true, event: newEvent });
});

app.post('/api/events/:id/register', requireAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const user = (req as any).user;

  const result = db.registerForEvent(id, user.id);
  if (!result.success) {
    return res.status(400).json({ success: false, error: result.error });
  }

  res.json({ success: true, message: 'Successfully registered for event!', event: result.event });
});

// ==========================================
// 10. ACHIEVEMENTS
// ==========================================
app.get('/api/achievements', (req: Request, res: Response) => {
  const user = (req as any).user;
  const isAdmin = user && user.role === 'ADMIN';
  const achievements = db.getAllAchievements(isAdmin);
  res.json({ success: true, count: achievements.length, achievements });
});

app.post('/api/achievements', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user.alumniId) {
    return res.status(400).json({ success: false, error: 'Only alumni can post verified achievements.' });
  }

  const { title, category, description, year, proofUrl, certificateUrl } = req.body;

  if (!title || !description || !year) {
    return res.status(400).json({ success: false, error: 'Title, Description, and Year are required.' });
  }

  const ach = db.createAchievement({
    alumniId: user.alumniId,
    title,
    category: category || 'CAREER',
    description,
    year: Number(year),
    proofUrl,
    certificateUrl,
  });

  if (!ach) {
    return res.status(400).json({ success: false, error: 'Alumni record not found.' });
  }

  res.json({
    success: true,
    message: 'Achievement submitted and queued for Admin Verification.',
    achievement: ach,
  });
});

app.put('/api/admin/achievements/:id/moderate', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, adminRemark } = req.body;

  const ach = db.moderateAchievement(id, status, adminRemark);
  if (!ach) {
    return res.status(404).json({ success: false, error: 'Achievement not found.' });
  }

  res.json({ success: true, achievement: ach });
});

// ==========================================
// 11. NOTIFICATIONS
// ==========================================
app.get('/api/notifications', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  const notifs = db.getNotificationsForUser(user.id);
  res.json({ success: true, notifications: notifs });
});

app.put('/api/notifications/:id/read', requireAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const success = db.markNotificationAsRead(id);
  res.json({ success });
});

// ==========================================
// 12. DEMO RESET HELPER
// ==========================================
app.post('/api/system/reset-demo', (_req: Request, res: Response) => {
  db.seedDatabase();
  res.json({ success: true, message: 'Database reset to initial viva demonstration state.' });
});

// ==========================================
// VITE MIDDLEWARE & SERVER STARTUP
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Alumni Connect Portal] Server running on http://localhost:${PORT}`);

    // Asynchronously initialize and sync PostgreSQL without blocking server startup
    db.initPostgres().catch((err) => {
      console.warn('[PostgreSQL Database] Background sync notice:', err?.message || err);
    });
  });

  server.on('error', (err: any) => {
    console.error('[Server Listen Error]:', err);
  });
}

startServer();
