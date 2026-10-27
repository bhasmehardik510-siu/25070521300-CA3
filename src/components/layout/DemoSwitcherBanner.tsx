import React, { useState } from 'react';
import { useAuth, DemoPersona } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { useToast } from '../../context/ToastContext.tsx';
import {
  ShieldAlert,
  GraduationCap,
  Sparkles,
  UserCheck,
  RotateCcw,
  BookOpen,
  ChevronDown,
  Layers,
} from 'lucide-react';

export const DemoSwitcherBanner: React.FC = () => {
  const { user, switchQuickDemoUser, setVivaModalOpen, refreshProfile } = useAuth();
  const { success, error } = useToast();
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = async () => {
    try {
      setIsResetting(true);
      await api.resetDemo();
      await refreshProfile();
      success('Database Reset', 'Demo database restored to initial state.');
    } catch (err: any) {
      error('Reset Failed', err.message);
    } finally {
      setIsResetting(false);
    }
  };

  const getActiveRolePill = () => {
    if (!user) return <span className="text-xs text-slate-400">Guest Visitor</span>;
    if (user.role === 'ADMIN') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-purple-900/60 text-purple-200 border border-purple-700">
          <ShieldAlert className="w-3 h-3" /> Admin (Dean)
        </span>
      );
    }
    if (user.role === 'ALUMNI') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-emerald-900/60 text-emerald-200 border border-emerald-700">
          <UserCheck className="w-3 h-3" /> Verified Alumni
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-blue-900/60 text-blue-200 border border-blue-700">
        <GraduationCap className="w-3 h-3" /> College Student
      </span>
    );
  };

  return (
    <div
      id="demo-switcher-bar"
      className="bg-slate-900 text-slate-200 border-b border-slate-800 text-xs px-4 py-2 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-50 shadow-sm"
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 font-semibold text-slate-300">
          <Layers className="w-4 h-4 text-sky-400" />
          <span className="hidden sm:inline">PBL Viva Quick Switcher:</span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            id="switch-admin-btn"
            onClick={() => switchQuickDemoUser('ADMIN')}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 font-medium ${
              user?.role === 'ADMIN'
                ? 'bg-purple-600 text-white shadow-sm ring-1 ring-purple-400'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
            title="Login as Admin / Alumni Affairs Officer"
          >
            <ShieldAlert className="w-3 h-3 text-purple-300" />
            <span>Admin</span>
          </button>

          <button
            id="switch-eligible-student-btn"
            onClick={() => switchQuickDemoUser('ELIGIBLE_STUDENT')}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 font-medium ${
              user?.email === 'rahul.sharma@college.edu'
                ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-400'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
            title="Login as Rahul Sharma (Eligible 2027 Graduating Student)"
          >
            <GraduationCap className="w-3 h-3 text-blue-300" />
            <span>Eligible Student (Rahul)</span>
          </button>

          <button
            id="switch-ineligible-student-btn"
            onClick={() => switchQuickDemoUser('INELIGIBLE_STUDENT')}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 font-medium ${
              user?.email === 'priya.verma@college.edu'
                ? 'bg-amber-600 text-white shadow-sm ring-1 ring-amber-400'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
            title="Login as Priya Verma (Ineligible - 6th Sem In Progress)"
          >
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>Ineligible (Priya)</span>
          </button>

          <button
            id="switch-verified-alumni-btn"
            onClick={() => switchQuickDemoUser('VERIFIED_ALUMNI')}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 font-medium ${
              user?.email === 'vikram.rao.alumni@college.edu'
                ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
            title="Login as Vikram Rao (Senior Staff SWE @ Google)"
          >
            <Sparkles className="w-3 h-3 text-emerald-300" />
            <span>Alumni (Vikram @ Google)</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden lg:flex items-center gap-2 pr-2 border-r border-slate-700">
          <span className="text-slate-400">Current Persona:</span>
          {getActiveRolePill()}
        </div>

        <button
          id="btn-open-viva-modal"
          onClick={() => setVivaModalOpen(true)}
          className="px-2.5 py-1 rounded-md bg-sky-950 hover:bg-sky-900 text-sky-200 border border-sky-700 flex items-center gap-1.5 font-semibold transition-colors"
        >
          <BookOpen className="w-3.5 h-3.5 text-sky-400" />
          <span>Viva Architecture Guide</span>
        </button>

        <button
          id="btn-reset-demo-db"
          onClick={handleReset}
          disabled={isResetting}
          className="p-1 text-slate-400 hover:text-white transition-colors"
          title="Reset Database to Seed State"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </div>
  );
};
