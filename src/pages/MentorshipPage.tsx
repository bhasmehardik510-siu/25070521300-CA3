import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import { AlumniProfile, MentorshipRequest } from '../types/index.ts';
import { VerificationBadge } from '../components/ui/VerificationBadge.tsx';
import { useToast } from '../context/ToastContext.tsx';
import {
  HeartHandshake,
  Users,
  Building2,
  CheckCircle2,
  Clock,
  Check,
  X,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface MentorshipPageProps {
  navigate: (path: string) => void;
}

export const MentorshipPage: React.FC<MentorshipPageProps> = ({ navigate }) => {
  const { user, alumni, refreshProfile } = useAuth();
  const { success, error, info } = useToast();
  const shouldReduceMotion = useReducedMotion();

  const [mentors, setMentors] = useState<AlumniProfile[]>([]);
  const [requests, setRequests] = useState<MentorshipRequest[]>([]);
  const [activeTab, setActiveTab] = useState<'FIND_MENTORS' | 'MY_REQUESTS'>('FIND_MENTORS');
  const [isLoading, setIsLoading] = useState(true);

  // Availability toggle for alumni
  const [isAvailable, setIsAvailable] = useState(alumni?.isAvailableForMentorship || false);
  const [isUpdatingAvailability, setIsUpdatingAvailability] = useState(false);

  const fetchMentorsAndRequests = async () => {
    try {
      setIsLoading(true);
      const mentorRes = await api.getMentors();
      if (mentorRes.success) setMentors(mentorRes.mentors);

      if (user) {
        const reqRes = await api.getMentorshipRequests();
        if (reqRes.success) setRequests(reqRes.requests);
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMentorsAndRequests();
  }, [user]);

  const handleToggleAvailability = async () => {
    try {
      setIsUpdatingAvailability(true);
      const nextState = !isAvailable;
      const res = await api.toggleMentorshipAvailability({
        isAvailable: nextState,
        areas: alumni?.mentorshipAreas || ['Career Guidance', 'System Design'],
        maxMentees: 3,
      });
      if (res.success) {
        setIsAvailable(nextState);
        await refreshProfile();
        success(
          nextState ? 'Mentorship Enabled' : 'Mentorship Paused',
          nextState ? 'Students can now reach out for guidance.' : 'You will not appear in the active mentors list.'
        );
      }
    } catch (err: any) {
      error('Failed to update mentorship', err.message);
    } finally {
      setIsUpdatingAvailability(false);
    }
  };

  const handleUpdateRequestStatus = async (
    requestId: string,
    status: 'ACCEPTED' | 'REJECTED' | 'COMPLETED'
  ) => {
    try {
      const res = await api.updateMentorshipStatus(requestId, status, 'Welcome! Let us schedule our first session.');
      if (res.success) {
        success('Status Updated', `Mentorship request marked as ${status}`);
        fetchMentorsAndRequests();
      }
    } catch (err: any) {
      error('Action failed', err.message);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 font-display">
              Alumni Mentorship Program
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700">
              {mentors.length} Active Mentors
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            1-on-1 industry coaching, resume evaluations, and interview preparations with verified alumni.
          </p>
        </div>

        {/* Alumni Mentorship Toggle */}
        {user?.role === 'ALUMNI' && (
          <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs">
              <p className="font-bold text-slate-900 leading-tight">Offer Mentorship</p>
              <p className="text-[11px] text-slate-500">
                {isAvailable ? 'Currently accepting mentees' : 'Mentorship paused'}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleToggleAvailability}
              disabled={isUpdatingAvailability}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs shadow-sm transition-colors ${
                isAvailable
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
              }`}
            >
              {isAvailable ? 'Enabled ✓' : 'Enable'}
            </motion.button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('FIND_MENTORS')}
          className={`pb-3 px-3 border-b-2 transition-colors ${
            activeTab === 'FIND_MENTORS'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <span>Available Alumni Mentors ({mentors.length})</span>
        </button>

        {user && (
          <button
            onClick={() => setActiveTab('MY_REQUESTS')}
            className={`pb-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'MY_REQUESTS'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <span>My Mentorship Tracks</span>
            {requests.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px]">
                {requests.length}
              </span>
            )}
          </button>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="py-20 text-center text-xs text-slate-400">Loading mentorship network...</div>
      ) : activeTab === 'FIND_MENTORS' ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {mentors.map((mentor) => (
            <motion.div
              variants={itemVariants}
              whileHover={shouldReduceMotion ? {} : { y: -3, transition: { duration: 0.15 } }}
              key={mentor.id}
              onClick={() => navigate(`/alumni/${mentor.id}`)}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer flex flex-col justify-between group space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <img
                    src={mentor.avatarUrl}
                    alt={mentor.name}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-slate-100 group-hover:ring-emerald-300 transition-all"
                  />
                  <VerificationBadge status={mentor.verificationStatus} size="sm" />
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors font-display">
                    {mentor.name}
                  </h3>
                  <p className="text-xs font-semibold text-slate-800 mt-0.5">
                    {mentor.jobRole}
                  </p>
                  <p className="text-xs text-emerald-700 font-medium flex items-center gap-1 mt-0.5">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{mentor.currentCompany}</span>
                  </p>
                </div>

                {/* Mentorship focus areas */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Mentorship Domains:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {mentor.mentorshipAreas.map((area, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-medium border border-emerald-100"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">Class of {mentor.graduationYear}</span>
                <span className="font-bold text-emerald-700 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  Request Mentorship <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        /* My Requests List */
        requests.length === 0 ? (
          <div className="py-16 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
            <HeartHandshake className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-900">No Mentorship Requests</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Find alumni in the directory or above list to initiate a mentorship conversation.
            </p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            {requests.map((req) => (
              <motion.div
                variants={itemVariants}
                key={req.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">
                        Topic: {req.mentorshipTopic}
                      </h4>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          req.status === 'ACCEPTED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : req.status === 'PENDING'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Mentor: <strong>{req.mentorName}</strong> • Mentee: <strong>{req.menteeName}</strong>
                    </p>
                  </div>

                  {/* Actions if current user is mentor and status is PENDING */}
                  {user?.role === 'ALUMNI' && req.status === 'PENDING' && (
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleUpdateRequestStatus(req.id, 'ACCEPTED')}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept Mentee</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleUpdateRequestStatus(req.id, 'REJECTED')}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Decline</span>
                      </motion.button>
                    </div>
                  )}
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 space-y-1">
                  <span className="font-semibold text-slate-900 block text-[11px]">Mentee Message:</span>
                  <p>{req.message}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )
      )}
    </div>
  );
};

