import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { ProfileChangeRequest } from '../../types/index.ts';
import { VerificationBadge } from '../../components/ui/VerificationBadge.tsx';
import { useToast } from '../../context/ToastContext.tsx';
import {
  ShieldAlert,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Building2,
  Briefcase,
  GraduationCap,
  FileText,
} from 'lucide-react';

interface AdminVerificationsPageProps {
  navigate: (path: string) => void;
}

export const AdminVerificationsPage: React.FC<AdminVerificationsPageProps> = ({ navigate }) => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [requests, setRequests] = useState<ProfileChangeRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [adminRemarks, setAdminRemarks] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const fetchVerifications = async () => {
    try {
      setIsLoading(true);
      const res = await api.getAdminVerifications();
      if (res.success) {
        setRequests(res.requests);
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifications();
  }, []);

  const handleReview = async (
    requestId: string,
    decision: 'APPROVED' | 'REJECTED'
  ) => {
    try {
      setIsProcessing(requestId);
      const remarks = adminRemarks[requestId] || (decision === 'APPROVED' ? 'Verified by Alumni Affairs Office.' : 'Supporting documentation insufficient.');
      const res = await api.reviewVerification(requestId, decision, remarks);
      if (res.success) {
        success(
          `Request ${decision}`,
          `Alumni profile has been updated and notification dispatched.`
        );
        fetchVerifications();
      }
    } catch (err: any) {
      error('Review failed', err.message);
    } finally {
      setIsProcessing(null);
    }
  };

  const pendingRequests = requests.filter((r) => r.status === 'PENDING');
  const pastRequests = requests.filter((r) => r.status !== 'PENDING');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <button
        onClick={() => navigate('/admin')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Admin Control Suite</span>
      </button>

      {/* Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 font-display">
              Alumni Profile Verification Queue
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
              {pendingRequests.length} Pending Actions
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Audit sensitive career progressions, company transfers, and higher degree credentials before verification badge endorsement.
          </p>
        </div>
      </div>

      {/* Active Pending Requests */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-500" />
          <span>Pending Verification Requests ({pendingRequests.length})</span>
        </h2>

        {isLoading ? (
          <div className="py-20 text-center text-xs text-slate-400">Loading audit queue...</div>
        ) : pendingRequests.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="text-sm font-bold text-slate-900">All Verification Requests Cleared</h3>
            <p className="text-xs text-slate-500">
              No pending profile changes currently in queue.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 font-display">
                      {req.alumniName}
                    </h3>
                    <p className="text-xs text-slate-500 font-mono">
                      Enrollment: {req.alumniEnrollment} • Submitted on {new Date(req.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <VerificationBadge status={req.status} size="sm" />
                </div>

                {/* Diff table */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Current / Old */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      Currently Verified Record
                    </span>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Company</span>
                      <strong className="text-slate-800">{req.currentCompany || 'None recorded'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Job Role</span>
                      <strong className="text-slate-800">{req.currentJobRole || 'None recorded'}</strong>
                    </div>
                    {req.currentHigherStudies && (
                      <div>
                        <span className="text-slate-400 block text-[10px]">Higher Studies</span>
                        <strong className="text-slate-800">{req.currentHigherStudies}</strong>
                      </div>
                    )}
                  </div>

                  {/* Proposed / New */}
                  <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
                      Proposed Update (Pending Verification)
                    </span>
                    <div>
                      <span className="text-amber-800/70 block text-[10px]">Proposed Company</span>
                      <strong className="text-amber-950 font-bold text-sm">{req.proposedCompany || 'No change'}</strong>
                    </div>
                    <div>
                      <span className="text-amber-800/70 block text-[10px]">Proposed Role</span>
                      <strong className="text-amber-950 font-bold">{req.proposedJobRole || 'No change'}</strong>
                    </div>
                    {req.proposedHigherStudies && (
                      <div>
                        <span className="text-amber-800/70 block text-[10px]">Proposed Higher Studies</span>
                        <strong className="text-amber-950">{req.proposedHigherStudies}</strong>
                      </div>
                    )}
                  </div>
                </div>

                {req.reason && (
                  <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <strong>Alumni Note:</strong> "{req.reason}"
                  </p>
                )}

                {/* Admin Action & Remarks */}
                <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                  <div className="flex-1">
                    <input
                      id={`admin-remarks-${req.id}`}
                      type="text"
                      placeholder="Admin remarks (e.g. Verified via LinkedIn / Offer Letter)"
                      value={adminRemarks[req.id] || ''}
                      onChange={(e) =>
                        setAdminRemarks({ ...adminRemarks, [req.id]: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      id={`reject-btn-${req.id}`}
                      onClick={() => handleReview(req.id, 'REJECTED')}
                      disabled={isProcessing === req.id}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 font-semibold text-xs transition-colors"
                    >
                      Reject
                    </button>
                    <button
                      id={`approve-btn-${req.id}`}
                      onClick={() => handleReview(req.id, 'APPROVED')}
                      disabled={isProcessing === req.id}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all active:scale-95 flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isProcessing === req.id ? 'Processing...' : 'Approve & Re-Verify Profile'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Historical Audit Log */}
      {pastRequests.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-slate-200">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Past Moderation History ({pastRequests.length})
          </h2>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100 text-xs">
            {pastRequests.map((req) => (
              <div key={req.id} className="p-4 flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-slate-900">{req.alumniName} ({req.alumniEnrollment})</h4>
                  <p className="text-slate-500 text-[11px]">
                    Proposed: {req.proposedJobRole} @ {req.proposedCompany}
                  </p>
                  {req.adminRemarks && (
                    <p className="text-slate-400 text-[10px] mt-0.5">Remarks: {req.adminRemarks}</p>
                  )}
                </div>
                <VerificationBadge status={req.status} size="sm" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
