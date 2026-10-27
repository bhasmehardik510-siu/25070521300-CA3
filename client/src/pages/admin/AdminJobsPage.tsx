import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { JobPost } from '../../types/index.ts';
import { useToast } from '../../context/ToastContext.tsx';
import {
  Briefcase,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Building2,
  MapPin,
  ExternalLink,
} from 'lucide-react';

interface AdminJobsPageProps {
  navigate: (path: string) => void;
}

export const AdminJobsPage: React.FC<AdminJobsPageProps> = ({ navigate }) => {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const res = await api.getJobs();
      if (res.success) setJobs(res.jobs);
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleModerate = async (jobId: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      const res = await api.moderateJob(jobId, status);
      if (res.success) {
        success('Listing Moderated', status === 'APPROVED' ? 'Job approved & live' : 'Job rejected / removed');
        fetchJobs();
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
            Opportunity & Job Board Moderation
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review alumni job postings and verify legitimacy of external applications.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="py-20 text-center text-xs text-slate-400">Loading listings...</div>
        ) : jobs.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
            No job postings available for moderation.
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                      {job.jobType.replace('_', ' ')}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm">{job.title}</h3>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        job.isApproved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {job.isApproved ? 'APPROVED' : 'PENDING'}
                    </span>
                  </div>
                  <p className="text-slate-600 font-semibold flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{job.company} • {job.location}</span>
                  </p>
                  <p className="text-slate-500 text-[11px]">
                    Posted by: <strong>{job.postedByName}</strong> ({job.contactEmail})
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {!job.isApproved && (
                    <button
                      onClick={() => handleModerate(job.id, 'APPROVED')}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleModerate(job.id, 'REJECTED')}
                    className="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs flex items-center gap-1"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
