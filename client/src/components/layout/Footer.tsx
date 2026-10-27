import React from 'react';
import { GraduationCap, ShieldCheck, Database, Code, BookOpen, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';

interface FooterProps {
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  const { setVivaModalOpen } = useAuth();

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 text-white">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-sm text-white">
                A
              </div>
              <span className="font-bold text-base tracking-tight font-display">SIT Connect</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Extending the university convocation and graduation verification process into a lifelong, trusted alumni network.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 text-slate-300 text-[11px] font-medium border border-slate-700">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Verified Institutional Identity
              </span>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-slate-200 font-semibold mb-3 text-xs uppercase tracking-wider">
              Platform Features
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => navigate('/directory')} className="hover:text-white transition-colors">
                  Alumni Directory & Search
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/mentorship')} className="hover:text-white transition-colors">
                  Mentorship Program
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/jobs')} className="hover:text-white transition-colors">
                  Alumni Job Board & Referrals
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/events')} className="hover:text-white transition-colors">
                  Reunions & Tech Talks
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/achievements')} className="hover:text-white transition-colors">
                  Hall of Fame Achievements
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/privacy')} className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 transition-colors">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Privacy & Info Sharing Policy</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-slate-200 font-semibold mb-3 text-xs uppercase tracking-wider">
              System Architecture
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setVivaModalOpen(true)}
                  className="text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Technical System Architecture & Docs</span>
                </button>
              </li>
              <li className="flex items-center gap-1.5 text-slate-400">
                <Database className="w-3.5 h-3.5 text-slate-500" />
                <span>PostgreSQL / MySQL Relational Schema</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-400">
                <Code className="w-3.5 h-3.5 text-slate-500" />
                <span>REST API Layer & Auth RBAC</span>
              </li>
              <li>
                <button onClick={() => navigate('/activate')} className="hover:text-white transition-colors">
                  Convocation Verification Engine
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-slate-200 font-semibold mb-3 text-xs uppercase tracking-wider">
              Institutional Admin
            </h4>
            <p className="text-slate-400 text-xs mb-3">
              Office of Alumni Relations & Dean of Student Affairs. Managed through role-based access control.
            </p>
            <button
              onClick={() => navigate('/admin')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
            >
              Access Admin Control Suite
            </button>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2027 College Alumni Connect Portal. University Engineering Flexi Project.</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/privacy')}
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              Privacy Policy & Contact Shield
            </button>
            <span>•</span>
            <span>University Capstone & Technical Reference</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
