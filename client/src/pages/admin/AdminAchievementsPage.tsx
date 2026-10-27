import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { Achievement } from '../../types/index.ts';
import { VerificationBadge } from '../../components/ui/VerificationBadge.tsx';
import { useToast } from '../../context/ToastContext.tsx';
import {
  Award,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  ExternalLink,
} from 'lucide-react';

interface AdminAchievementsPageProps {
  navigate: (path: string) => void;
}

export const AdminAchievementsPage: React.FC<AdminAchievementsPageProps> = ({ navigate }) => {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAchievements = async () => {
    try {
      setIsLoading(true);
      const res = await api.getAchievements();
      if (res.success) setAchievements(res.achievements);
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const handleModerate = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      const res = await api.moderateAchievement(id, status);
      if (res.success) {
        success('Status Updated', `Achievement marked as ${status}`);
        fetchAchievements();
      }
    } catch (err: any) {
      error('Action failed', err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <button
        onClick={() => navigate('/admin')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Admin Suite</span>
      </button>

      <div className="border-b border-slate-200 pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">
            Hall of Fame & Achievement Moderation
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review alumni awards, publications, and funding milestones before making them publicly highlighted.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="py-20 text-center text-xs text-slate-400">Loading achievements...</div>
        ) : achievements.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
            No achievement records available.
          </div>
        ) : (
          <div className="space-y-4">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {ach.category} • {ach.year}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm">{ach.title}</h3>
                    <VerificationBadge status={ach.status} size="sm" />
                  </div>
                  <p className="text-slate-600 font-semibold">
                    Honoree: {ach.alumniName} ({ach.alumniEnrollment})
                  </p>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    {ach.description}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {ach.status !== 'APPROVED' && (
                    <button
                      onClick={() => handleModerate(ach.id, 'APPROVED')}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                  )}
                  {ach.status !== 'REJECTED' && (
                    <button
                      onClick={() => handleModerate(ach.id, 'REJECTED')}
                      className="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
