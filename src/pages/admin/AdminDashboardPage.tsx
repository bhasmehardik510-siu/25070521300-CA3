import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { AdminMetrics } from '../../types/index.ts';
import {
  ShieldAlert,
  Users,
  GraduationCap,
  Briefcase,
  Calendar,
  Award,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Activity,
  Layers,
} from 'lucide-react';

interface AdminDashboardPageProps {
  navigate: (path: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ navigate }) => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    api.getAdminMetrics()
      .then((res) => {
        if (res.success) setMetrics(res.metrics);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Restricted Admin Suite</h2>
        <p className="text-xs text-slate-500">
          You must be signed in with an Institutional Administrator role to access this control suite.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="px-5 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs"
        >
          Sign In as Admin
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-900/80 text-purple-200 text-xs font-bold border border-purple-700">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Alumni Affairs & Registry Management Suite</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Institutional Admin Control Center
          </h1>
          <p className="text-xs text-slate-300">
            Oversee convocation clearance records, audit sensitive career changes, and manage college-wide engagement.
          </p>
        </div>

        <button
          onClick={() => navigate('/admin/verifications')}
          className="px-5 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-600 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-2 shrink-0"
        >
          <span>Open Verification Queue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Metrics Row */}
      {metrics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Alumni
            </span>
            <div className="text-2xl font-extrabold text-slate-900 font-display">
              {metrics.totalAlumni}
            </div>
            <p className="text-[11px] text-emerald-600 font-semibold">
              {metrics.verifiedAlumni} Verified Profiles
            </p>
          </div>

          <div
            onClick={() => navigate('/admin/verifications')}
            className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm space-y-1 cursor-pointer hover:border-amber-400 transition-colors"
          >
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center justify-between">
              Pending Verifications
              <Clock className="w-4 h-4 text-amber-500" />
            </span>
            <div className="text-2xl font-extrabold text-amber-700 font-display">
              {metrics.pendingVerifications}
            </div>
            <p className="text-[11px] text-amber-600 font-medium">
              Requires Admin Review →
            </p>
          </div>

          <div
            onClick={() => navigate('/admin/students')}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1 cursor-pointer hover:border-indigo-300 transition-colors"
          >
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Students Registry
            </span>
            <div className="text-2xl font-extrabold text-indigo-600 font-display">
              {metrics.totalStudents}
            </div>
            <p className="text-[11px] text-slate-500">
              {metrics.eligibleStudents} Convocation Cleared
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Active Mentors
            </span>
            <div className="text-2xl font-extrabold text-emerald-600 font-display">
              {metrics.mentorsAvailable}
            </div>
            <p className="text-[11px] text-slate-500">
              {metrics.activeJobPosts} Live Job Postings
            </p>
          </div>
        </div>
      )}

      {/* Admin Modules Navigation */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Administrative Modules
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            onClick={() => navigate('/admin/verifications')}
            className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-purple-300 transition-all cursor-pointer space-y-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Profile Change Verification Queue</h4>
            <p className="text-xs text-slate-500">
              Review and approve sensitive alumni career changes, company updates, and higher studies certificates.
            </p>
          </div>

          <div
            onClick={() => navigate('/admin/students')}
            className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-purple-300 transition-all cursor-pointer space-y-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Convocation & Student Registry</h4>
            <p className="text-xs text-slate-500">
              Manage student graduation clearance records. Toggle status to test alumni activation eligibility.
            </p>
          </div>

          <div
            onClick={() => navigate('/admin/jobs')}
            className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-purple-300 transition-all cursor-pointer space-y-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Job Posts & Opportunity Moderation</h4>
            <p className="text-xs text-slate-500">
              Moderate and verify external career postings submitted by alumni and industry partners.
            </p>
          </div>

          <div
            onClick={() => navigate('/admin/achievements')}
            className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-purple-300 transition-all cursor-pointer space-y-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Hall of Fame Moderation</h4>
            <p className="text-xs text-slate-500">
              Verify awards, startups, and research milestones before publishing to the public hall of fame.
            </p>
          </div>

          <div
            onClick={() => navigate('/events')}
            className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-purple-300 transition-all cursor-pointer space-y-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Events & Reunions Scheduler</h4>
            <p className="text-xs text-slate-500">
              Publish convocation dinners, virtual guest lectures, and manage RSVP attendee rosters.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
