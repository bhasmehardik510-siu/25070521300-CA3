import React from 'react';
import { ShieldCheck, Clock, AlertTriangle, XCircle } from 'lucide-react';
import { VerificationStatus } from '../../types/index.ts';

interface VerificationBadgeProps {
  status: VerificationStatus;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  status,
  size = 'md',
  showLabel = true,
}) => {
  if (status === 'APPROVED') {
    return (
      <span
        id="badge-verified-alumni"
        className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 ${
          size === 'sm' ? 'px-2 py-0.5 text-xs' : size === 'lg' ? 'px-3.5 py-1 text-sm' : 'px-2.5 py-0.5 text-xs'
        }`}
        title="Identity officially verified via College Convocation Registry"
      >
        <ShieldCheck className={size === 'sm' ? 'w-3.5 h-3.5 text-emerald-600' : 'w-4 h-4 text-emerald-600'} />
        {showLabel && <span>Verified Alumni</span>}
      </span>
    );
  }

  if (status === 'PENDING') {
    return (
      <span
        id="badge-pending-verification"
        className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-amber-50 text-amber-800 border border-amber-300 ${
          size === 'sm' ? 'px-2 py-0.5 text-xs' : size === 'lg' ? 'px-3.5 py-1 text-sm' : 'px-2.5 py-0.5 text-xs'
        }`}
        title="Update submitted and queued for Admin Verification"
      >
        <Clock className={size === 'sm' ? 'w-3.5 h-3.5 text-amber-600 animate-spin' : 'w-4 h-4 text-amber-600'} />
        {showLabel && <span>Pending Verification</span>}
      </span>
    );
  }

  return (
    <span
      id="badge-rejected-verification"
      className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-rose-50 text-rose-800 border border-rose-300 ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : size === 'lg' ? 'px-3.5 py-1 text-sm' : 'px-2.5 py-0.5 text-xs'
      }`}
    >
      <XCircle className={size === 'sm' ? 'w-3.5 h-3.5 text-rose-600' : 'w-4 h-4 text-rose-600'} />
      {showLabel && <span>Verification Rejected</span>}
    </span>
  );
};
