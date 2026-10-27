import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import { AlumniProfile, JobPost, CollegeEvent, MentorshipRequest, ProfileChangeRequest } from '../types/index.ts';
import { VerificationBadge } from '../components/ui/VerificationBadge.tsx';
import {
  GraduationCap,
  Users,
  Briefcase,
  Calendar,
  Award,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  ArrowRight,
  HeartHandshake,
  TrendingUp,
  Link as LinkIcon,
  HelpCircle,
  Building2,
  MapPin,
  Mail,
  Search,
} from 'lucide-react';

interface DashboardPageProps {
  navigate: (path: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ navigate }) => {
  const { user, student, alumni, refreshProfile, setVivaModalOpen } = useAuth();
  const [recentJobs, setRecentJobs] = useState<JobPost[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<CollegeEvent[]>([]);
  const [mentorshipRequests, setMentorshipRequests] = useState<MentorshipRequest[]>([]);
  const [adminRequests, setAdminRequests] = useState<ProfileChangeRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    api.getJobs().then((res) => {
      if (res.success) setRecentJobs(res.jobs.slice(0, 3));
    }).catch(() => {});

    api.getEvents().then((res) => {
      if (res.success) setUpcomingEvents(res.events.slice(0, 3));
    }).catch(() => {});

    if (user?.role === 'ALUMNI') {
      api.getMentorshipRequests().then((res) => {
        if (res.success) setMentorshipRequests(res.requests);
      }).catch(() => {});
    }

    if (user?.role === 'ADMIN') {
      api.getAdminVerifications().then((res) => {
        if (res.success) setAdminRequests(res.requests);
      }).catch(() => {});
    }
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Please Sign In</h2>
        <p className="text-xs text-slate-500">You must be logged in to view your dashboard.</p>
        <button
          onClick={() => navigate('/login')}
          className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-sm"
        >
          Go to Sign In
        </button>
      </div>
    );
  }

  const handleHeaderSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/directory?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.06,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Bar */}
      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white border border-slate-200 rounded-2xl px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
      >
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-slate-800">Alumni Dashboard</h1>
          <div className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase tracking-widest">
            {user.role === 'ADMIN' ? 'Admin Portal' : user.role === 'ALUMNI' ? 'v1.0-Verified' : 'Student Mode'}
          </div>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <form onSubmit={handleHeaderSearch} className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full text-slate-600 text-xs font-medium focus-within:ring-2 focus-within:ring-indigo-500">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Alumni Directory..."
              className="bg-transparent focus:outline-none text-slate-800 placeholder-slate-400 text-xs w-44 sm:w-56"
            />
          </form>

          <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-slate-800">{user.name}</div>
              <div className="text-[10px] text-slate-500 font-mono">
                {student?.enrollmentNo || alumni?.enrollmentNo || user.email.split('@')[0]}
              </div>
            </div>
            <motion.img
              whileHover={{ scale: 1.08 }}
              src={
                user.avatarUrl ||
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80'
              }
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-200"
            />
          </div>
        </div>
      </motion.div>

      {/* Top 4 Metrics Row */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {/* Metric 1: Verification Status */}
        <motion.div
          variants={itemVariants}
          whileHover={shouldReduceMotion ? {} : { y: -3, transition: { duration: 0.15 } }}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between"
        >
          <div className="text-slate-500 text-xs font-semibold mb-1 uppercase tracking-wide">Verification Status</div>
          <div className="flex items-center gap-2 text-emerald-600 mt-1">
            {user.role === 'ALUMNI' && alumni?.verificationStatus === 'APPROVED' ? (
              <>
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <span className="text-xl font-bold">Verified Alumni</span>
              </>
            ) : user.role === 'ALUMNI' && alumni?.verificationStatus === 'PENDING' ? (
              <>
                <Clock className="w-6 h-6 text-amber-500 shrink-0 animate-spin" />
                <span className="text-xl font-bold text-amber-600">Pending Review</span>
              </>
            ) : user.role === 'STUDENT' && student?.graduationStatus === 'COMPLETE' ? (
              <>
                <Sparkles className="w-6 h-6 text-emerald-600 shrink-0" />
                <span className="text-xl font-bold text-emerald-700">Eligible Alumni</span>
              </>
            ) : user.role === 'ADMIN' ? (
              <>
                <ShieldCheck className="w-6 h-6 text-purple-600 shrink-0" />
                <span className="text-xl font-bold text-purple-700">Dean / Admin</span>
              </>
            ) : (
              <>
                <Clock className="w-6 h-6 text-slate-400 shrink-0" />
                <span className="text-xl font-bold text-slate-700">Undergraduate</span>
              </>
            )}
          </div>
          <div className="text-[10px] text-slate-400 font-medium mt-1">
            {user.role === 'ALUMNI' ? 'College Convocation Record Active' : user.role === 'STUDENT' ? 'Academic Enrollment Verified' : 'Full Administrative Access'}
          </div>
        </motion.div>

        {/* Metric 2: Connections */}
        <motion.div
          variants={itemVariants}
          whileHover={shouldReduceMotion ? {} : { y: -3, transition: { duration: 0.15 } }}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between"
        >
          <div className="text-slate-500 text-xs font-semibold mb-1 uppercase tracking-wide">Connections</div>
          <div className="text-2xl font-bold text-slate-800">124</div>
          <div className="text-[10px] text-emerald-500 font-medium">+12 this week</div>
        </motion.div>

        {/* Metric 3: Mentorships */}
        <motion.div
          variants={itemVariants}
          whileHover={shouldReduceMotion ? {} : { y: -3, transition: { duration: 0.15 } }}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between"
        >
          <div className="text-slate-500 text-xs font-semibold mb-1 uppercase tracking-wide">Mentorships</div>
          <div className="text-2xl font-bold text-slate-800">08</div>
          <div className="text-[10px] text-slate-400 font-medium">
            Active Requests: {mentorshipRequests.length > 0 ? mentorshipRequests.length : 2}
          </div>
        </motion.div>

        {/* Metric 4: Jobs Posted */}
        <motion.div
          variants={itemVariants}
          whileHover={shouldReduceMotion ? {} : { y: -3, transition: { duration: 0.15 } }}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between"
        >
          <div className="text-slate-500 text-xs font-semibold mb-1 uppercase tracking-wide">Jobs Posted</div>
          <div className="text-2xl font-bold text-slate-800">03</div>
          <div className="text-[10px] text-indigo-500 font-medium">Last: 2 days ago</div>
        </motion.div>
      </motion.section>

      {/* Main 12-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 8-Column Left Section */}
        <div className="lg:col-span-8 space-y-6">
          {/* Profile Details Card (Professional vs Academic Identity) */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h2 className="font-bold text-slate-700 text-sm sm:text-base">Profile Details</h2>
              {user.role === 'ALUMNI' && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/profile')}
                  className="text-xs bg-indigo-600 text-white px-4 py-1.5 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  Edit Professional Info
                </motion.button>
              )}
              {user.role === 'STUDENT' && student?.graduationStatus === 'COMPLETE' && !student.isAlumniActivated && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/activate')}
                  className="text-xs bg-emerald-600 text-white px-4 py-1.5 rounded-lg font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
                >
                  Claim Alumni ID
                </motion.button>
              )}
            </div>

            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
              {/* Academic Identity */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Academic Identity (College Verified)
                </label>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-slate-50 text-xs sm:text-sm">
                    <span className="text-slate-500">Branch</span>
                    <span className="font-semibold text-slate-900 text-right">
                      {alumni?.branch || student?.branch || 'Computer Science & Engineering'}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-50 text-xs sm:text-sm">
                    <span className="text-slate-500">Graduation Year</span>
                    <span className="font-semibold text-slate-900">
                      {alumni?.graduationYear || student?.graduationYear || '2027'}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-50 text-xs sm:text-sm">
                    <span className="text-slate-500">Academic Email</span>
                    <span className="font-semibold text-indigo-600 truncate max-w-[180px]">
                      {alumni?.collegeEmail || `${user.email.split('@')[0]}@sit.edu.in`}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-50 text-xs sm:text-sm">
                    <span className="text-slate-500">Enrollment No</span>
                    <span className="font-mono font-semibold text-slate-800">
                      {alumni?.enrollmentNo || student?.enrollmentNo || 'SIT2027CSE001'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Professional Identity */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Professional Identity (Alumni Input)
                </label>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-slate-50 text-xs sm:text-sm">
                    <span className="text-slate-500">Current Company</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900">
                        {alumni?.currentCompany || 'Google Inc.'}
                      </span>
                      <span
                        className={`w-2 h-2 rounded-full ${
                          alumni?.verificationStatus === 'PENDING' ? 'bg-amber-400' : 'bg-emerald-400'
                        }`}
                        title={alumni?.verificationStatus === 'PENDING' ? 'Pending Verification' : 'Verified'}
                      ></span>
                    </div>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-50 text-xs sm:text-sm">
                    <span className="text-slate-500">Job Role</span>
                    <span className="font-semibold text-slate-900">
                      {alumni?.jobRole || 'Senior Cloud Architect'}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-50 text-xs sm:text-sm">
                    <span className="text-slate-500">Location</span>
                    <span className="font-semibold text-slate-900">
                      {alumni?.city ? `${alumni.city}, ${alumni.country}` : 'Mountain View, CA'}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-50 text-xs sm:text-sm">
                    <span className="text-slate-500">Higher Studies</span>
                    <span className="font-semibold text-slate-900 truncate max-w-[180px]">
                      {alumni?.higherStudies || 'MS in AI @ Stanford'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Recent Achievements Card */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-700 text-sm sm:text-base">Recent Achievements & Honors</h2>
              <button
                onClick={() => navigate('/achievements')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                View All
              </button>
            </div>

            <motion.div
              whileHover={shouldReduceMotion ? {} : { scale: 1.01 }}
              className="flex items-center gap-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100 transition-all"
            >
              <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm">
                <Award className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-slate-800 text-xs sm:text-sm truncate">
                  Winner - National Web3 Hackathon 2028
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Verified by Alumni Affairs Admin • March 12, 2028
                </div>
              </div>
              <div className="px-3 py-1 bg-emerald-600 text-white text-[10px] font-bold rounded-full uppercase tracking-tighter shrink-0">
                Verified
              </div>
            </motion.div>
          </motion.div>

          {/* Quick Action Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <motion.div
              whileHover={shouldReduceMotion ? {} : { y: -3, scale: 1.01 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
              onClick={() => navigate('/directory')}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer space-y-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm">Alumni Directory</h3>
              <p className="text-[11px] text-slate-500">
                Search verified graduates by branch, batch, skills, and company.
              </p>
            </motion.div>

            <motion.div
              whileHover={shouldReduceMotion ? {} : { y: -3, scale: 1.01 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
              onClick={() => navigate('/mentorship')}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer space-y-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm">Mentorship Hub</h3>
              <p className="text-[11px] text-slate-500">
                Connect 1-on-1 with industry veterans for resume reviews & prep.
              </p>
            </motion.div>

            <motion.div
              whileHover={shouldReduceMotion ? {} : { y: -3, scale: 1.01 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
              onClick={() => navigate('/jobs')}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-purple-300 transition-all cursor-pointer space-y-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm">Jobs & Referrals</h3>
              <p className="text-[11px] text-slate-500">
                Discover internal alumni job openings, internships, and referrals.
              </p>
            </motion.div>
          </div>
        </div>

        {/* 4-Column Right Section */}
        <div className="lg:col-span-4 space-y-6">
          {/* Mentorship Availability Card (Dark Card) */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-slate-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden"
          >
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full pointer-events-none"></div>
            <h3 className="font-bold text-sm sm:text-base mb-4 relative z-10 font-display">
              Mentorship Availability
            </h3>
            <div className="flex items-center justify-between mb-6 relative z-10">
              <span className="text-xs text-slate-400">Available for Guidance</span>
              <motion.div
                whileTap={{ scale: 0.92 }}
                onClick={() => user.role === 'ALUMNI' && navigate('/mentorship')}
                className={`w-12 h-6 rounded-full relative p-1 cursor-pointer transition-colors ${
                  alumni?.isAvailableForMentorship ? 'bg-indigo-500' : 'bg-slate-700'
                }`}
              >
                <motion.div
                  layout
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className={`w-4 h-4 bg-white rounded-full ${
                    alumni?.isAvailableForMentorship ? 'ml-auto' : 'ml-0'
                  }`}
                ></motion.div>
              </motion.div>
            </div>
            <div className="space-y-2 relative z-10">
              <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wide">
                Active Areas
              </div>
              <div className="flex flex-wrap gap-2">
                {(alumni?.mentorshipAreas && alumni.mentorshipAreas.length > 0
                  ? alumni.mentorshipAreas
                  : ['Cloud Arch', 'Career Coaching', 'Backend Scaling']
                ).map((area, idx) => (
                  <span key={idx} className="px-2 py-1 bg-white/10 rounded text-[10px] font-medium">
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* System Notifications Card */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.25 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-700 text-sm">System Notifications</h3>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Live</span>
            </div>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-indigo-500 shrink-0"></div>
                <div>
                  <p className="text-xs text-slate-700 font-medium">Profile Update Requested</p>
                  <p className="text-[10px] text-slate-500">
                    Your job role updates at {alumni?.currentCompany || 'Google Inc.'} are verified in system.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-amber-500 shrink-0"></div>
                <div>
                  <p className="text-xs text-slate-700 font-medium">Convocation Registration</p>
                  <p className="text-[10px] text-slate-500">
                    Admin verified document clearance for SIT-2027 convocation batch.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-slate-300 shrink-0"></div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">No new mentorship inquiries</p>
                  <p className="text-[10px] text-slate-400">
                    Check back later for student resume reviews.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Need Help Box */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-indigo-50 rounded-2xl border border-indigo-100 p-6 flex flex-col items-center text-center"
          >
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
              <HelpCircle className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="text-xs font-bold text-indigo-900">Need Help?</div>
            <p className="text-[10px] text-indigo-700 mt-1 mb-4">
              Contact Alumni Cell & Dean for identity verification issues or technical viva queries.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setVivaModalOpen(true)}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
            >
              Open Technical Guide
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};


