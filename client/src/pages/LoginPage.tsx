import React, { useState } from 'react';
import { useAuth, DemoPersona } from '../context/AuthContext.tsx';
import {
  GraduationCap,
  Lock,
  Mail,
  ArrowRight,
  ShieldAlert,
  UserCheck,
  Sparkles,
  Info,
} from 'lucide-react';

interface LoginPageProps {
  navigate: (path: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ navigate }) => {
  const { login, signInWithGoogle, switchQuickDemoUser, isLoading, user } = useAuth();
  const [email, setEmail] = useState('rahul.sharma@college.edu');
  const [password, setPassword] = useState('student123');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await login(email, password);
    if (ok) {
      navigate('/dashboard');
    }
  };

  const handleGoogleSignIn = async () => {
    const ok = await signInWithGoogle();
    if (ok) {
      navigate('/dashboard');
    }
  };

  const handleQuickLogin = async (persona: DemoPersona) => {
    await switchQuickDemoUser(persona);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white mx-auto flex items-center justify-center shadow-md">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">
            Alumni Connect Portal
          </h1>
          <p className="text-xs text-slate-500">
            Sign in to access your verified alumni account or student dashboard
          </p>
        </div>

        {/* Quick Demo Fillers for Viva Examiners */}
        <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-400">
            <Sparkles className="w-4 h-4" />
            <span>Instant Demo Logins (Viva 1-Click):</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleQuickLogin('ELIGIBLE_STUDENT')}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-left border border-slate-700 transition-colors flex flex-col"
            >
              <span className="font-bold text-blue-300">Rahul Sharma</span>
              <span className="text-[10px] text-slate-400">Eligible Student (CSE '27)</span>
            </button>

            <button
              onClick={() => handleQuickLogin('VERIFIED_ALUMNI')}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-left border border-slate-700 transition-colors flex flex-col"
            >
              <span className="font-bold text-emerald-300">Vikram Rao</span>
              <span className="text-[10px] text-slate-400">Verified Alumni @ Google</span>
            </button>

            <button
              onClick={() => handleQuickLogin('ADMIN')}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-left border border-slate-700 transition-colors flex flex-col"
            >
              <span className="font-bold text-purple-300">Dr. Venkatesh</span>
              <span className="text-[10px] text-slate-400">Alumni Cell Admin</span>
            </button>

            <button
              onClick={() => handleQuickLogin('INELIGIBLE_STUDENT')}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-left border border-slate-700 transition-colors flex flex-col"
            >
              <span className="font-bold text-amber-300">Priya Verma</span>
              <span className="text-[10px] text-slate-400">In-Progress Student</span>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Sign in with Google (OAuth)</span>
          </button>

          <div className="relative flex items-center justify-center my-2">
            <div className="border-t border-slate-200 w-full"></div>
            <span className="bg-white px-2 text-[10px] text-slate-400 uppercase tracking-wider">or email password</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                College or Personal Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="login-email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="name@college.edu or name@company.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="login-password-input"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <span>{isLoading ? 'Signing In...' : 'Sign In to Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-3 border-t border-slate-100 text-center space-y-2">
            <p className="text-xs text-slate-500">
              New graduate from class of 2027?
            </p>
            <button
              onClick={() => navigate('/activate')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
            >
              Verify Convocation & Activate Alumni ID →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
