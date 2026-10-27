import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useAuth } from '../../context/AuthContext.tsx';
import {
  X,
  Layers,
  Database,
  ShieldCheck,
  Code2,
  Workflow,
  HelpCircle,
  CheckCircle2,
  ArrowRight,
  Server,
  Key,
} from 'lucide-react';

export const VivaArchitectureModal: React.FC = () => {
  const { isVivaModalOpen, setVivaModalOpen } = useAuth();
  const [activeTab, setActiveTab] = useState<'WORKFLOW' | 'LAYERS' | 'SCHEMA' | 'API' | 'VIVA_QA'>('WORKFLOW');

  return (
    <AnimatePresence>
      {isVivaModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          onClick={() => setVivaModalOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', duration: 0.35, bounce: 0.15 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-600/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white leading-tight">
                    PBL Architecture & Technical Viva Reference
                  </h2>
                  <p className="text-xs text-slate-400">
                    Core USP: Converting one-time convocation graduation clearance into lifelong verified alumni engagement
                  </p>
                </div>
              </div>
              <button
                onClick={() => setVivaModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-800 px-6 bg-slate-950/40 overflow-x-auto text-xs font-semibold gap-2 py-2">
              <button
                onClick={() => setActiveTab('WORKFLOW')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all ${
                  activeTab === 'WORKFLOW'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Workflow className="w-4 h-4" />
                <span>1. Core Workflow</span>
              </button>

              <button
                onClick={() => setActiveTab('LAYERS')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all ${
                  activeTab === 'LAYERS'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Server className="w-4 h-4" />
                <span>2. Tiered Architecture</span>
              </button>

              <button
                onClick={() => setActiveTab('SCHEMA')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all ${
                  activeTab === 'SCHEMA'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Database className="w-4 h-4" />
                <span>3. Relational Schema</span>
              </button>

              <button
                onClick={() => setActiveTab('API')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all ${
                  activeTab === 'API'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Code2 className="w-4 h-4" />
                <span>4. REST API Spec</span>
              </button>

              <button
                onClick={() => setActiveTab('VIVA_QA')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all ${
                  activeTab === 'VIVA_QA'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-amber-400 hover:text-amber-200 hover:bg-slate-800'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span>5. Examiner Q&A Guide</span>
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto max-h-[68vh] text-slate-300 text-xs leading-relaxed space-y-6">
              {/* TAB 1: WORKFLOW */}
              {activeTab === 'WORKFLOW' && (
                <div className="space-y-4">
                  <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
                    <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                      <Workflow className="w-4 h-4 text-sky-400" />
                      Exact Identity & Activation Flow
                    </h3>
                    <p className="text-slate-300">
                      Unlike traditional social platforms where users fabricate arbitrary credentials, AlumniConnect acts as an institutional trust anchor:
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800">
                      <div className="flex items-center gap-2 text-sky-400 font-bold text-sm mb-2">
                        <span className="w-5 h-5 rounded-full bg-sky-950 border border-sky-600 flex items-center justify-center text-xs">
                          1
                        </span>
                        College Database Verification
                      </div>
                      <p className="text-slate-400">
                        Student record exists in the college repository with <code className="text-sky-300">enrollment_no</code>, <code className="text-sky-300">branch</code>, <code className="text-sky-300">graduation_year</code>, and <code className="text-sky-300">graduation_status</code>.
                      </p>
                    </div>

                    <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800">
                      <div className="flex items-center gap-2 text-sky-400 font-bold text-sm mb-2">
                        <span className="w-5 h-5 rounded-full bg-sky-950 border border-sky-600 flex items-center justify-center text-xs">
                          2
                        </span>
                        Convocation Eligibility Check
                      </div>
                      <p className="text-slate-400">
                        The system verifies that <code className="text-emerald-400">graduation_status === 'COMPLETE'</code>. In-progress students or backlogs are politely prevented with clear feedback.
                      </p>
                    </div>

                    <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800">
                      <div className="flex items-center gap-2 text-sky-400 font-bold text-sm mb-2">
                        <span className="w-5 h-5 rounded-full bg-sky-950 border border-sky-600 flex items-center justify-center text-xs">
                          3
                        </span>
                        Auto-Population & Activation
                      </div>
                      <p className="text-slate-400">
                        Verified degree, branch, and graduation year are automatically locked and imported into the alumni record without requiring redundant re-entry.
                      </p>
                    </div>

                    <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800">
                      <div className="flex items-center gap-2 text-sky-400 font-bold text-sm mb-2">
                        <span className="w-5 h-5 rounded-full bg-sky-950 border border-sky-600 flex items-center justify-center text-xs">
                          4
                        </span>
                        Career Updates & Admin Verification
                      </div>
                      <p className="text-slate-400">
                        When alumni add sensitive updates (Company, Job Role, Higher Studies, Achievements), updates enter <code className="text-amber-400">PENDING</code> status until reviewed by the Alumni Cell Dean.
                      </p>
                    </div>
                  </div>

                  <div className="bg-emerald-950/40 p-4 rounded-xl border border-emerald-800/60">
                    <h4 className="font-bold text-emerald-300 text-xs mb-1 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Outcome: High-Trust Verified Directory
                    </h4>
                    <p className="text-emerald-200/80">
                      Only verified alumni receive the green <span className="font-semibold text-emerald-300">✓ Verified Alumni</span> badge in the directory, jobs board, and mentorship circles.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 2: TIERED ARCHITECTURE */}
              {activeTab === 'LAYERS' && (
                <div className="space-y-4">
                  <div className="bg-slate-950 p-4 rounded-xl font-mono text-[11px] text-slate-300 border border-slate-800 leading-normal overflow-x-auto">
                    <p className="text-sky-400 font-bold mb-2"># Multi-Tiered PBL Architecture Flow</p>
                    <p>User Interaction (Browser / Mobile)</p>
                    <p className="text-slate-500">     │</p>
                    <p className="text-indigo-400">  [React 19 Frontend SPA]</p>
                    <p className="text-slate-500">     │  (Tailwind CSS, Motion Animations, Modular Context)</p>
                    <p className="text-slate-500">     ▼</p>
                    <p className="text-sky-400">  [REST API Gateway / Express / Flask]</p>
                    <p className="text-slate-500">     │  (Authentication Bearer Guard, Request Validation)</p>
                    <p className="text-slate-500">     ▼</p>
                    <p className="text-amber-400">  [Business Logic & Verification Engine]</p>
                    <p className="text-slate-500">     │  (Convocation Checker, Role Progression, Moderation)</p>
                    <p className="text-slate-500">     ▼</p>
                    <p className="text-emerald-400">  [MySQL 8.0 Relational Persistence Engine]</p>
                    <p className="text-slate-400">     └── Tables: users, students, alumni, connections, jobs, events, achievements</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-3.5 bg-slate-800/40 rounded-xl border border-slate-700">
                      <h4 className="font-bold text-white text-xs mb-1">1. Frontend Layer</h4>
                      <p className="text-slate-400 text-[11px]">
                        Pure client-side React with typed API services, toast notifications, responsive Tailwind layout, and Motion springs.
                      </p>
                    </div>
                    <div className="p-3.5 bg-slate-800/40 rounded-xl border border-slate-700">
                      <h4 className="font-bold text-white text-xs mb-1">2. Service / REST Layer</h4>
                      <p className="text-slate-400 text-[11px]">
                        Validates role permissions (RBAC). A student cannot call <code className="text-purple-300">/api/admin/*</code>. Sanitizes payloads.
                      </p>
                    </div>
                    <div className="p-3.5 bg-slate-800/40 rounded-xl border border-slate-700">
                      <h4 className="font-bold text-white text-xs mb-1">3. Relational Database</h4>
                      <p className="text-slate-400 text-[11px]">
                        InnoDB engine with foreign key constraints, indexes, and unique enrollment keys ensuring zero duplicate alumni profiles.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: RELATIONAL SCHEMA */}
              {activeTab === 'SCHEMA' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                    <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                      <h4 className="font-bold text-sky-400 mb-1">Table: `students`</h4>
                      <p className="text-slate-400">
                        <span className="text-white font-semibold">id</span> (PK), <span className="text-white font-semibold">enrollment_no</span> (UNIQUE), name, branch, degree, graduation_year, graduation_status, cgpa, is_alumni_activated
                      </p>
                    </div>

                    <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                      <h4 className="font-bold text-emerald-400 mb-1">Table: `alumni`</h4>
                      <p className="text-slate-400">
                        <span className="text-white font-semibold">id</span> (PK), <span className="text-white font-semibold">student_id</span> (FK UNIQUE), current_company, job_role, higher_studies, skills_json, is_available_for_mentorship, verification_status
                      </p>
                    </div>

                    <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                      <h4 className="font-bold text-amber-400 mb-1">Table: `profile_change_requests`</h4>
                      <p className="text-slate-400">
                        <span className="text-white font-semibold">id</span> (PK), <span className="text-white font-semibold">alumni_id</span> (FK), proposed_company, proposed_job_role, proposed_higher_studies, status (PENDING/APPROVED/REJECTED), admin_remarks
                      </p>
                    </div>

                    <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                      <h4 className="font-bold text-purple-400 mb-1">Table: `connections` & `mentorship`</h4>
                      <p className="text-slate-400">
                        <span className="text-white font-semibold">connections</span>: (sender_id, receiver_id UNIQUE, status)
                        <br />
                        <span className="text-white font-semibold">mentorship_requests</span>: (mentor_id, mentee_id, topic, status)
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-800/50 rounded-xl border border-slate-700">
                    <span className="text-sky-300 font-semibold">Complete DDL Schema file:</span>
                    <p className="text-slate-400 mt-0.5">
                      Available in project root at <code className="text-white bg-slate-900 px-1.5 py-0.5 rounded">/database/schema.sql</code> and ready for MySQL execution.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 4: REST API */}
              {activeTab === 'API' && (
                <div className="space-y-3">
                  <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                        <tr>
                          <th className="p-2.5">Method</th>
                          <th className="p-2.5">Endpoint</th>
                          <th className="p-2.5">Role Guard</th>
                          <th className="p-2.5">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        <tr>
                          <td className="p-2.5 font-mono text-emerald-400 font-bold">POST</td>
                          <td className="p-2.5 font-mono text-slate-200">/api/auth/login</td>
                          <td className="p-2.5 text-slate-400">Public</td>
                          <td className="p-2.5 text-slate-300">Authenticates student/alumni/admin credentials.</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-mono text-sky-400 font-bold">GET</td>
                          <td className="p-2.5 font-mono text-slate-200">/api/college/check-eligibility/:enrollmentNo</td>
                          <td className="p-2.5 text-slate-400">Public/Auth</td>
                          <td className="p-2.5 text-slate-300">Queries student graduationStatus == 'COMPLETE'.</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-mono text-emerald-400 font-bold">POST</td>
                          <td className="p-2.5 font-mono text-slate-200">/api/alumni/activate</td>
                          <td className="p-2.5 text-blue-400">Student (Eligible)</td>
                          <td className="p-2.5 text-slate-300">Creates verified alumni identity linked to student.</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-mono text-amber-400 font-bold">PUT</td>
                          <td className="p-2.5 font-mono text-slate-200">/api/alumni/:id/update-request</td>
                          <td className="p-2.5 text-emerald-400">Alumni Owner</td>
                          <td className="p-2.5 text-slate-300">Updates profile & queues sensitive fields for Admin.</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-mono text-sky-400 font-bold">GET</td>
                          <td className="p-2.5 font-mono text-slate-200">/api/admin/verifications</td>
                          <td className="p-2.5 text-purple-400">Admin</td>
                          <td className="p-2.5 text-slate-300">Lists pending profile change requests.</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-mono text-amber-400 font-bold">PUT</td>
                          <td className="p-2.5 font-mono text-slate-200">/api/admin/verifications/:id</td>
                          <td className="p-2.5 text-purple-400">Admin</td>
                          <td className="p-2.5 text-slate-300">Approves or rejects changes with remarks.</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-mono text-sky-400 font-bold">GET</td>
                          <td className="p-2.5 font-mono text-slate-200">/api/alumni</td>
                          <td className="p-2.5 text-slate-400">Public/Auth</td>
                          <td className="p-2.5 text-slate-300">Multi-criteria search, branch, year, company filters.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 5: VIVA QA */}
              {activeTab === 'VIVA_QA' && (
                <div className="space-y-3">
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                    <h4 className="font-bold text-amber-400 text-xs mb-1">
                      Q1: "Why can't students directly register an alumni profile with arbitrary details?"
                    </h4>
                    <p className="text-slate-300 text-[11px]">
                      <strong className="text-white">Answer:</strong> Trust is the core value proposition of an institutional alumni portal. If anyone could self-claim degrees and companies, fraudulent profiles would destroy credibility. We tie identity creation to official College Convocation Records (`students.graduation_status === 'COMPLETE'`), ensuring every alumni profile is authenticated at the source.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                    <h4 className="font-bold text-amber-400 text-xs mb-1">
                      Q2: "How do you prevent multiple alumni accounts for the same student?"
                    </h4>
                    <p className="text-slate-300 text-[11px]">
                      <strong className="text-white">Answer:</strong> In the database, <code className="text-sky-300">alumni.student_id</code> has a <code className="text-sky-300">UNIQUE FOREIGN KEY</code> constraint, and <code className="text-sky-300">students.enrollment_no</code> is strictly unique. In the application layer, the activation controller asserts <code className="text-emerald-400">!student.isAlumniActivated</code> before issuing an alumni profile.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                    <h4 className="font-bold text-amber-400 text-xs mb-1">
                      Q3: "What happens when an alumni changes their company or job title?"
                    </h4>
                    <p className="text-slate-300 text-[11px]">
                      <strong className="text-white">Answer:</strong> To prevent false claims of high-profile employment, sensitive updates enter an asynchronous audit pipeline (`profile_change_requests` with status `PENDING`). The Alumni Cell Admin reviews the request, verifies corporate proof, and approves or rejects with audit remarks.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                    <h4 className="font-bold text-amber-400 text-xs mb-1">
                      Q4: "How could this architecture scale to real institutional SSO (like Google Workspace / SAML)?"
                    </h4>
                    <p className="text-slate-300 text-[11px]">
                      <strong className="text-white">Answer:</strong> The authentication layer is decoupled into the `/api/auth` middleware. When transitioning to production, the local password hash check is simply swapped with a SAML/OAuth2 token verification against the university Identity Provider (IdP) returning the student's institutional email address.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                College PBL Project • Alumni Engagement Platform
              </span>
              <button
                onClick={() => setVivaModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-colors"
              >
                Close Guide
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

