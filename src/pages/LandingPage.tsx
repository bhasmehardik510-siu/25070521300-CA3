import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import { AlumniProfile, CollegeEvent, Achievement } from '../types/index.ts';
import { VerificationBadge } from '../components/ui/VerificationBadge.tsx';
import {
  GraduationCap,
  ShieldCheck,
  Users,
  Briefcase,
  Calendar,
  Award,
  Sparkles,
  Search,
  ArrowRight,
  CheckCircle2,
  Building2,
  MapPin,
  HeartHandshake,
  BookOpen,
} from 'lucide-react';

interface LandingPageProps {
  navigate: (path: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ navigate }) => {
  const { user, setVivaModalOpen } = useAuth();
  const [enrollmentInput, setEnrollmentInput] = useState('');
  const [featuredAlumni, setFeaturedAlumni] = useState<AlumniProfile[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<CollegeEvent[]>([]);
  const [recentAchievements, setRecentAchievements] = useState<Achievement[]>([]);
  const shouldReduceMotion = useReducedMotion();
  const [stats, setStats] = useState({
    totalAlumni: 12,
    verifiedRate: 100,
    mentorsAvailable: 8,
    activeOpportunities: 6,
  });

  useEffect(() => {
    // Load preview data
    api.getAlumni({ verificationStatus: 'APPROVED' }).then((res) => {
      if (res.success) setFeaturedAlumni(res.alumni.slice(0, 4));
    }).catch(() => {});

    api.getEvents().then((res) => {
      if (res.success) setUpcomingEvents(res.events.slice(0, 3));
    }).catch(() => {});

    api.getAchievements().then((res) => {
      if (res.success) setRecentAchievements(res.achievements.slice(0, 3));
    }).catch(() => {});
  }, []);

  const handleEligibilitySearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollmentInput.trim()) return;
    navigate(`/activate?enrollment=${encodeURIComponent(enrollmentInput.trim())}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          {/* Institutional Trust Tag */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-900/60 border border-indigo-700/60 text-indigo-200 text-xs font-semibold backdrop-blur-md shadow-sm"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Official University Alumni Engagement Network</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-display text-white leading-tight"
          >
            From Convocation Milestone to <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-300 to-emerald-400">
              Lifelong Verified Engagement
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="max-w-2xl mx-auto text-slate-300 text-sm sm:text-base leading-relaxed"
          >
            Converting college graduation and convocation clearance into a verified institutional alumni identity. Connect with graduates at Google, Microsoft, Tesla, ISRO, and Stanford.
          </motion.p>

          {/* Quick Eligibility Check Bar */}
          <motion.div
            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, delay: 0.15 }}
            className="max-w-xl mx-auto pt-4"
          >
            <form
              onSubmit={handleEligibilitySearch}
              className="bg-white/10 p-2 rounded-2xl border border-white/20 backdrop-blur-md flex flex-col sm:flex-row gap-2 shadow-2xl"
            >
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="landing-enrollment-search-input"
                  type="text"
                  value={enrollmentInput}
                  onChange={(e) => setEnrollmentInput(e.target.value)}
                  placeholder="Enter Student Enrollment No. (e.g. SIT2027CSE001)"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 border border-slate-700"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                id="landing-check-eligibility-btn"
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 shrink-0"
              >
                <span>Check Eligibility</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </form>
            <div className="flex items-center justify-center gap-4 mt-3 text-[11px] text-slate-400">
              <span>Try test ID: <code className="text-sky-300 bg-slate-800 px-1.5 py-0.5 rounded cursor-pointer" onClick={() => setEnrollmentInput('SIT2027CSE001')}>SIT2027CSE001</code> (Eligible)</span>
              <span>•</span>
              <span><code className="text-amber-300 bg-slate-800 px-1.5 py-0.5 rounded cursor-pointer" onClick={() => setEnrollmentInput('SIT2027IT042')}>SIT2027IT042</code> (In-Progress)</span>
            </div>
          </motion.div>

          {/* Quick CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-3 pt-2"
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/directory')}
              className="px-5 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-xs sm:text-sm shadow-md hover:bg-slate-100 transition-all flex items-center gap-2"
            >
              <Users className="w-4 h-4 text-indigo-600" />
              <span>Explore Alumni Directory</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setVivaModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs sm:text-sm transition-all flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-sky-400" />
              <span>System Architecture</span>
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Metrics Banner */}
      <motion.section
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-20px' }}
        transition={{ duration: 0.4 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white rounded-2xl p-6 shadow-xl border border-slate-200 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          <motion.div whileHover={shouldReduceMotion ? {} : { scale: 1.03 }} className="text-center p-2 transition-transform">
            <span className="text-3xl font-extrabold text-slate-900 font-display">100%</span>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mt-1">
              Verified Convocation Identity
            </p>
          </motion.div>
          <motion.div whileHover={shouldReduceMotion ? {} : { scale: 1.03 }} className="text-center p-2 transition-transform">
            <span className="text-3xl font-extrabold text-indigo-600 font-display">12+</span>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mt-1">
              Global Companies & Labs
            </p>
          </motion.div>
          <motion.div whileHover={shouldReduceMotion ? {} : { scale: 1.03 }} className="text-center p-2 transition-transform">
            <span className="text-3xl font-extrabold text-emerald-600 font-display">8+</span>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mt-1">
              Alumni Mentorship Tracks
            </p>
          </motion.div>
          <motion.div whileHover={shouldReduceMotion ? {} : { scale: 1.03 }} className="text-center p-2 transition-transform">
            <span className="text-3xl font-extrabold text-sky-600 font-display">6+</span>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mt-1">
              Active Referral Jobs
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* How It Works: The 4-Step Trust Loop */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            Institutional Trust Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2 font-display">
            How Convocation Turns Into Lifelong Network
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-2">
            We solve the fundamental problem of fraudulent alumni profiles by anchoring registration directly to official college graduation clearance records.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <motion.div
            variants={itemVariants}
            whileHover={shouldReduceMotion ? {} : { y: -4, transition: { duration: 0.15 } }}
            className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-base">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Official College Registry</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Student database contains verified enrollment, department, CGPA, and graduation status.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={shouldReduceMotion ? {} : { y: -4, transition: { duration: 0.15 } }}
            className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-base">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Graduation Clearance</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Only students whose graduation status is marked <code className="text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded font-semibold">COMPLETE</code> can activate an alumni profile.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={shouldReduceMotion ? {} : { y: -4, transition: { duration: 0.15 } }}
            className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-base">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Automatic Data Population</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Verified degree, branch, and graduation year are automatically locked. Alumni adds career info.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={shouldReduceMotion ? {} : { y: -4, transition: { duration: 0.15 } }}
            className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-base">
              4
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Admin Audit & Engagement</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Major career changes undergo Alumni Cell verification, unlocking high-trust mentorship and referrals.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Alumni Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
              Distinguished Alumni Network
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Verified graduates leading innovation across top tech firms and research institutes
            </p>
          </div>
          <button
            onClick={() => navigate('/directory')}
            className="text-xs sm:text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-30px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {featuredAlumni.map((alm) => (
            <motion.div
              variants={itemVariants}
              whileHover={shouldReduceMotion ? {} : { y: -4, transition: { duration: 0.15 } }}
              key={alm.id}
              onClick={() => navigate(`/alumni/${alm.id}`)}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <img
                    src={alm.avatarUrl}
                    alt={alm.name}
                    className="w-14 h-14 rounded-xl object-cover ring-1 ring-slate-200 group-hover:ring-indigo-400 transition-all"
                  />
                  <VerificationBadge status={alm.verificationStatus} size="sm" />
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
                    {alm.name}
                  </h3>
                  <p className="text-xs font-semibold text-slate-700 mt-0.5">
                    {alm.jobRole}
                  </p>
                  <p className="text-xs text-indigo-600 font-medium flex items-center gap-1 mt-0.5">
                    <Building2 className="w-3 h-3" />
                    <span>{alm.currentCompany}</span>
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                  <p>
                    <span className="font-medium text-slate-700">{alm.branch}</span> • Class of {alm.graduationYear}
                  </p>
                  {alm.city && (
                    <p className="flex items-center gap-1 text-slate-400">
                      <MapPin className="w-3 h-3" /> {alm.city}, {alm.country}
                    </p>
                  )}
                </div>
              </div>

              {alm.isAvailableForMentorship && (
                <div className="mt-4 pt-2 border-t border-slate-100">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <HeartHandshake className="w-3 h-3" />
                    Available as Mentor
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Upcoming Events & Achievements Dual Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Events preview */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.35 }}
          className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-base">Upcoming Events & Galas</h3>
            </div>
            <button
              onClick={() => navigate('/events')}
              className="text-xs font-semibold text-indigo-600 hover:underline"
            >
              Explore All
            </button>
          </div>

          <div className="space-y-3">
            {upcomingEvents.map((evt) => (
              <motion.div
                whileHover={shouldReduceMotion ? {} : { scale: 1.01 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.99 }}
                key={evt.id}
                onClick={() => navigate('/events')}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 hover:bg-indigo-50/40 hover:border-indigo-200 transition-all cursor-pointer flex items-start justify-between gap-3"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-100/70 px-2 py-0.5 rounded">
                    {evt.category.replace('_', ' ')}
                  </span>
                  <h4 className="font-bold text-slate-900 text-xs mt-1.5">{evt.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {evt.date} • {evt.time}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-slate-700 block">
                    {evt.registrationCount} RSVPs
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold">Open</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Achievements preview */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-slate-900 text-base">Alumni Hall of Fame</h3>
            </div>
            <button
              onClick={() => navigate('/achievements')}
              className="text-xs font-semibold text-indigo-600 hover:underline"
            >
              View Honors
            </button>
          </div>

          <div className="space-y-3">
            {recentAchievements.map((ach) => (
              <motion.div
                whileHover={shouldReduceMotion ? {} : { scale: 1.01 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.99 }}
                key={ach.id}
                onClick={() => navigate('/achievements')}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 hover:bg-amber-50/40 hover:border-amber-200 transition-all cursor-pointer space-y-1"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                    {ach.category} • {ach.year}
                  </span>
                  <span className="text-[11px] text-slate-600 font-semibold">{ach.alumniName}</span>
                </div>
                <h4 className="font-bold text-slate-900 text-xs">{ach.title}</h4>
                <p className="text-[11px] text-slate-500 line-clamp-2">{ach.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Convocation Activation Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div className="space-y-3 max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 text-xs font-bold border border-emerald-800">
              <Sparkles className="w-3.5 h-3.5" />
              Graduating Class of 2027
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display leading-tight">
              Ready to Claim Your Official Alumni Identity?
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm">
              Your degree and branch credentials are automatically confirmed through the college database. Activate your profile in less than 2 minutes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              id="landing-banner-activate-btn"
              onClick={() => navigate('/activate')}
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Activate Alumni Profile</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/login')}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 transition-all flex items-center justify-center"
            >
              Alumni Sign In
            </motion.button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

