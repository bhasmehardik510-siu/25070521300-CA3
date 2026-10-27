import {
  User,
  Student,
  AlumniProfile,
  JobPost,
  CollegeEvent,
  Achievement,
  ProfileChangeRequest,
  Connection,
  MentorshipRequest,
  AppNotification,
  AdminMetrics,
  VerificationStatus,
  GraduationStatus,
} from '../types/index.ts';

const API_BASE = '/api';

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('alumni_portal_token');
  }

  public setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('alumni_portal_token', token);
    } else {
      localStorage.removeItem('alumni_portal_token');
    }
  }

  public getToken() {
    return this.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
      headers['x-user-id'] = this.token;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}: Request failed`);
    }

    return data;
  }

  // Auth APIs
  public async login(email: string, password: string): Promise<{
    success: boolean;
    token: string;
    user: User;
    student?: Student;
    alumni?: AlumniProfile;
  }> {
    const data = await this.request<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(data.token);
    return data;
  }

  public async getMe(): Promise<{
    success: boolean;
    user: User;
    student?: Student;
    alumni?: AlumniProfile;
  }> {
    return this.request('/auth/me');
  }

  public async logout() {
    this.setToken(null);
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    }
  }

  // College & Eligibility
  public async checkEligibility(enrollmentNo: string): Promise<{
    success: boolean;
    eligible: boolean;
    isAlreadyActivated: boolean;
    graduationStatus: GraduationStatus;
    student: Student;
    reason?: string;
  }> {
    return this.request(`/college/check-eligibility/${encodeURIComponent(enrollmentNo)}`);
  }

  public async getAllStudents(): Promise<{ success: boolean; students: Student[] }> {
    return this.request('/college/students');
  }

  public async updateStudentStatus(
    studentId: string,
    status: GraduationStatus
  ): Promise<{ success: boolean; student: Student }> {
    return this.request(`/admin/students/${studentId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Alumni Activation
  public async activateAlumni(payload: any): Promise<{
    success: boolean;
    message: string;
    profile: AlumniProfile;
  }> {
    return this.request('/alumni/activate', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Alumni Directory
  public async getAlumni(params?: {
    q?: string;
    branch?: string;
    graduationYear?: number | string;
    company?: string;
    city?: string;
    skill?: string;
    mentorshipOnly?: boolean;
    verificationStatus?: VerificationStatus;
  }): Promise<{ success: boolean; count: number; alumni: AlumniProfile[] }> {
    const searchParams = new URLSearchParams();
    if (params?.q) searchParams.set('q', params.q);
    if (params?.branch && params.branch !== 'ALL') searchParams.set('branch', params.branch);
    if (params?.graduationYear && params.graduationYear !== 'ALL')
      searchParams.set('graduationYear', String(params.graduationYear));
    if (params?.company && params.company !== 'ALL') searchParams.set('company', params.company);
    if (params?.city && params.city !== 'ALL') searchParams.set('city', params.city);
    if (params?.skill && params.skill !== 'ALL') searchParams.set('skill', params.skill);
    if (params?.mentorshipOnly) searchParams.set('mentorshipOnly', 'true');
    if (params?.verificationStatus) searchParams.set('verificationStatus', params.verificationStatus);

    const queryStr = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return this.request(`/alumni${queryStr}`);
  }

  public async getAlumniById(id: string): Promise<{
    success: boolean;
    profile: AlumniProfile;
    achievements: Achievement[];
  }> {
    return this.request(`/alumni/${id}`);
  }

  public async updateProfileRequest(
    id: string,
    updates: any
  ): Promise<{
    success: boolean;
    isDirectUpdated: boolean;
    message: string;
    changeRequest?: ProfileChangeRequest;
    profile?: AlumniProfile;
  }> {
    return this.request(`/alumni/${id}/update-request`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Admin Verifications
  public async getAdminVerifications(): Promise<{
    success: boolean;
    requests: ProfileChangeRequest[];
  }> {
    return this.request('/admin/verifications');
  }

  public async reviewVerification(
    requestId: string,
    decision: 'APPROVED' | 'REJECTED',
    adminRemarks: string
  ): Promise<{ success: boolean; message: string; changeRequest: ProfileChangeRequest }> {
    return this.request(`/admin/verifications/${requestId}`, {
      method: 'PUT',
      body: JSON.stringify({ decision, adminRemarks }),
    });
  }

  public async getAdminMetrics(): Promise<{ success: boolean; metrics: AdminMetrics }> {
    return this.request('/admin/metrics');
  }

  // Connections
  public async getConnections(): Promise<{ success: boolean; connections: Connection[] }> {
    return this.request('/connections');
  }

  public async sendConnectionRequest(payload: {
    receiverId: string;
    receiverName: string;
    receiverRole?: string;
    receiverCompany?: string;
    receiverAvatar?: string;
    note?: string;
    senderPrivacy?: any;
    privacyConsentAccepted?: boolean;
  }): Promise<{ success: boolean; connection: Connection }> {
    return this.request('/connections', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  public async updateConnectionStatus(
    connectionId: string,
    status: 'ACCEPTED' | 'REJECTED'
  ): Promise<{ success: boolean; connection: Connection }> {
    return this.request(`/connections/${connectionId}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  public async addConnectionMessage(
    connectionId: string,
    message: string
  ): Promise<{ success: boolean; connection: Connection }> {
    return this.request(`/connections/${connectionId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  public async updateConnectionPrivacy(
    connectionId: string,
    details: {
      shareEmail?: boolean;
      sharePhone?: boolean;
      preferredChannel?: 'EMAIL' | 'PHONE' | 'WHATSAPP' | 'LINKEDIN';
      privateNote?: string;
    }
  ): Promise<{ success: boolean; connection: Connection }> {
    return this.request(`/connections/${connectionId}/privacy`, {
      method: 'PUT',
      body: JSON.stringify(details),
    });
  }

  public async deleteConnection(
    connectionId: string
  ): Promise<{ success: boolean; message: string }> {
    return this.request(`/connections/${connectionId}`, {
      method: 'DELETE',
    });
  }

  // Mentorship
  public async getMentors(): Promise<{ success: boolean; count: number; mentors: AlumniProfile[] }> {
    return this.request('/mentorship/mentors');
  }

  public async getMentorshipRequests(): Promise<{
    success: boolean;
    requests: MentorshipRequest[];
  }> {
    return this.request('/mentorship/requests');
  }

  public async requestMentorship(payload: {
    mentorId: string;
    mentorshipTopic: string;
    message: string;
  }): Promise<{ success: boolean; request: MentorshipRequest }> {
    return this.request('/mentorship/requests', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  public async updateMentorshipStatus(
    requestId: string,
    status: 'ACCEPTED' | 'REJECTED' | 'COMPLETED',
    mentorNotes?: string
  ): Promise<{ success: boolean; request: MentorshipRequest }> {
    return this.request(`/mentorship/requests/${requestId}`, {
      method: 'PUT',
      body: JSON.stringify({ status, mentorNotes }),
    });
  }

  public async toggleMentorshipAvailability(payload: {
    isAvailable: boolean;
    areas?: string[];
    maxMentees?: number;
  }): Promise<{ success: boolean; profile: AlumniProfile }> {
    return this.request('/mentorship/availability', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  // Jobs
  public async getJobs(): Promise<{ success: boolean; count: number; jobs: JobPost[] }> {
    return this.request('/jobs');
  }

  public async createJob(jobData: any): Promise<{ success: boolean; job: JobPost }> {
    return this.request('/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
  }

  public async moderateJob(
    jobId: string,
    status: VerificationStatus,
    adminRemark?: string
  ): Promise<{ success: boolean; job: JobPost }> {
    return this.request(`/admin/jobs/${jobId}/moderate`, {
      method: 'PUT',
      body: JSON.stringify({ status, adminRemark }),
    });
  }

  // Events
  public async getEvents(): Promise<{ success: boolean; count: number; events: CollegeEvent[] }> {
    return this.request('/events');
  }

  public async createEvent(eventData: any): Promise<{ success: boolean; event: CollegeEvent }> {
    return this.request('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  public async registerForEvent(eventId: string): Promise<{
    success: boolean;
    message: string;
    event: CollegeEvent;
  }> {
    return this.request(`/events/${eventId}/register`, {
      method: 'POST',
    });
  }

  // Achievements
  public async getAchievements(): Promise<{ success: boolean; count: number; achievements: Achievement[] }> {
    return this.request('/achievements');
  }

  public async createAchievement(data: any): Promise<{
    success: boolean;
    message: string;
    achievement: Achievement;
  }> {
    return this.request('/achievements', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  public async moderateAchievement(
    achievementId: string,
    status: VerificationStatus,
    adminRemark?: string
  ): Promise<{ success: boolean; achievement: Achievement }> {
    return this.request(`/admin/achievements/${achievementId}/moderate`, {
      method: 'PUT',
      body: JSON.stringify({ status, adminRemark }),
    });
  }

  // Notifications
  public async getNotifications(): Promise<{
    success: boolean;
    notifications: AppNotification[];
  }> {
    return this.request('/notifications');
  }

  public async markNotificationRead(id: string): Promise<{ success: boolean }> {
    return this.request(`/notifications/${id}/read`, {
      method: 'PUT',
    });
  }

  // Demo Reset
  public async resetDemo(): Promise<{ success: boolean; message: string }> {
    return this.request('/system/reset-demo', {
      method: 'POST',
    });
  }

  // Database Status Diagnostic
  public async getDbStatus(): Promise<{
    success: boolean;
    timestamp: string;
    postgresql: {
      type: string;
      configured: boolean;
      connected: boolean;
      activeDriver: string;
    };
    mongodb: {
      type: string;
      configured: boolean;
      connected: boolean;
      state: string;
      uri: string;
      error?: string;
      odm: string;
      supportedCollections: string[];
    };
  }> {
    return this.request('/system/db-status');
  }
}

export const api = new ApiClient();
