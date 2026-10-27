import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import { Student, AlumniProfile } from '../types/index.ts';
import { useToast } from '../context/ToastContext.tsx';
import { VerificationBadge } from '../components/ui/VerificationBadge.tsx';
import {
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Building2,
  Briefcase,
  MapPin,
  HeartHandshake,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Lock,
  Search,
} from 'lucide-react';

interface ActivatePageProps {
  navigate: (path: string) => void;
}

export const ActivatePage: React.FC<ActivatePageProps> = ({ navigate }) => {
  const { user, student: currentStudent, refreshProfile } = useAuth();
  const { success, error, info } = useToast();

  const [enrollmentNo, setEnrollmentNo] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<{
    eligible: boolean;
    isAlreadyActivated: boolean;
    student: Student | null;
    reason?: string;
  } | null>(null);

  // Form fields for activation
  const [personalEmail, setPersonalEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [currentCompany, setCurrentCompany] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [industry, setIndustry] = useState('Information Technology');
  const [experienceYears, setExperienceYears] = useState(1);
  const [city, setCity] = useState('Bengaluru');
  const [country, setCountry] = useState('India');
  const [higherStudies, setHigherStudies] = useState('');
  const [skillsInput, setSkillsInput] = useState('React, TypeScript, Distributed Systems, Python');
  const [bio, setBio] = useState('Graduated from SIT. Passionate about software architecture and mentorship.');
  const [linkedinUrl, setLinkedinUrl] = useState('https://linkedin.com');
  const [githubUrl, setGithubUrl] = useState('https://github.com');
  const [isAvailableForMentorship, setIsAvailableForMentorship] = useState(true);
  const [mentorshipAreasInput, setMentorshipAreasInput] = useState('System Design, Campus Placements, Resume Review');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activatedProfile, setActivatedProfile] = useState<AlumniProfile | null>(null);

  // Read URL query param if present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const qEnrollment = params.get('enrollment');
    if (qEnrollment) {
      setEnrollmentNo(qEnrollment);
      performCheck(qEnrollment);
    } else if (currentStudent) {
      setEnrollmentNo(currentStudent.enrollmentNo);
      performCheck(currentStudent.enrollmentNo);
    }
  }, [currentStudent]);

  const performCheck = async (enr: string) => {
    if (!enr.trim()) return;
    try {
      setIsChecking(true);
      const res = await api.checkEligibility(enr.trim());
      setCheckResult({
        eligible: res.eligible,
        isAlreadyActivated: res.isAlreadyActivated,
        student: res.student,
        reason: res.reason,
      });

      if (res.student) {
        if (res.student.personalEmail) setPersonalEmail(res.student.personalEmail);
        if (res.student.phone) setPhone(res.student.phone);
      }
    } catch (err: any) {
      error('Eligibility Check Failed', err.message);
      setCheckResult(null);
    } finally {
      setIsChecking(false);
    }
  };

  const handleManualCheck = (e: React.FormEvent) => {
    e.preventDefault();
    performCheck(enrollmentNo);
  };

  const handleActivationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkResult?.student) return;

    try {
      setIsSubmitting(true);
      const skills = skillsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const mentorshipAreas = mentorshipAreasInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        enrollmentNo: checkResult.student.enrollmentNo,
        personalEmail,
        phone,
        currentCompany,
        jobRole,
        industry,
        experienceYears: Number(experienceYears),
        city,
        country,
        higherStudies: higherStudies.trim() || undefined,
        skills,
        bio,
        linkedinUrl: linkedinUrl.trim() || undefined,
        githubUrl: githubUrl.trim() || undefined,
        isAvailableForMentorship,
        mentorshipAreas,
        maxMentees: 3,
      };

      const res = await api.activateAlumni(payload);
      if (res.success) {
        setActivatedProfile(res.profile);
        await refreshProfile();
        success('Alumni Profile Activated!', 'Welcome to the verified Alumni Network.');
      }
    } catch (err: any) {
      error('Activation Failed', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (activatedProfile) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5">
            <VerificationBadge status="APPROVED" size="lg" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">
            Alumni Account Successfully Activated
          </h1>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            Your academic records have been permanently verified against college convocation registry. Your alumni profile is now live in the directory.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-left max-w-md mx-auto space-y-3 text-xs">
          <div className="flex justify-between border-b border-slate-100 pb-2">
            <span className="text-slate-500">Alumni Name:</span>
            <span className="font-bold text-slate-900">{activatedProfile.name}</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-2">
            <span className="text-slate-500">Enrollment No:</span>
            <span className="font-mono text-slate-700">{activatedProfile.enrollmentNo}</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-2">
            <span className="text-slate-500">Degree & Branch:</span>
            <span className="text-slate-800">{activatedProfile.degree} ({activatedProfile.branch})</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-2">
            <span className="text-slate-500">Graduation Year:</span>
            <span className="text-slate-800">{activatedProfile.graduationYear}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Current Role:</span>
            <span className="font-semibold text-indigo-600">{activatedProfile.jobRole} @ {activatedProfile.currentCompany}</span>
          </div>
        </div>

        <div className="flex justify-center gap-3 pt-4">
          <button
            onClick={() => navigate('/directory')}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md hover:bg-indigo-700 transition-all"
          >
            Explore Alumni Directory
          </button>
          <button
            onClick={() => navigate('/profile')}
            className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-800 font-semibold text-xs hover:bg-slate-200 transition-all"
          >
            View My Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">
          <GraduationCap className="w-4 h-4" />
          <span>Convocation to Alumni Transition</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
          Alumni Account Activation
        </h1>
        <p className="text-xs text-slate-500 leading-relaxed">
          Verify your graduation clearance and activate your institutional alumni profile.
        </p>
      </div>

      {/* Step 1: Lookup Box */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-indigo-600" />
          <span>Step 1: Verify Convocation Clearance</span>
        </h3>

        <form onSubmit={handleManualCheck} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="activation-enrollment-input"
              type="text"
              required
              value={enrollmentNo}
              onChange={(e) => setEnrollmentNo(e.target.value)}
              placeholder="Enter College Enrollment No. (e.g. SIT2027CSE001)"
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
            />
          </div>
          <button
            id="activation-check-btn"
            type="submit"
            disabled={isChecking}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all shrink-0 flex items-center justify-center gap-2"
          >
            <span>{isChecking ? 'Verifying Registry...' : 'Verify Status'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Sample IDs for evaluators */}
        <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-2 pt-1">
          <span>Test cases:</span>
          <button
            type="button"
            onClick={() => {
              setEnrollmentNo('SIT2027CSE001');
              performCheck('SIT2027CSE001');
            }}
            className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-mono font-medium border border-emerald-200"
          >
            SIT2027CSE001 (Eligible - Graduated)
          </button>
          <button
            type="button"
            onClick={() => {
              setEnrollmentNo('SIT2027IT042');
              performCheck('SIT2027IT042');
            }}
            className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 hover:bg-amber-100 font-mono font-medium border border-amber-200"
          >
            SIT2027IT042 (Ineligible - 6th Sem)
          </button>
          <button
            type="button"
            onClick={() => {
              setEnrollmentNo('SIT2024CSE015');
              performCheck('SIT2024CSE015');
            }}
            className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 font-mono font-medium"
          >
            SIT2024CSE015 (Already Activated)
          </button>
        </div>

        {/* Check Result Feedback */}
        {checkResult && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            {checkResult.isAlreadyActivated ? (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <h4 className="font-bold text-slate-900">Alumni Profile Already Active</h4>
                  <p className="text-slate-600 mt-1">
                    An alumni account has already been claimed for <strong>{checkResult.student?.name}</strong> ({checkResult.student?.enrollmentNo}).
                  </p>
                  <button
                    onClick={() => navigate('/login')}
                    className="mt-2 text-indigo-600 font-bold hover:underline block"
                  >
                    Proceed to Login →
                  </button>
                </div>
              </div>
            ) : !checkResult.eligible ? (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <h4 className="font-bold text-amber-900">Graduation Clearance Pending</h4>
                  <p className="text-amber-800 mt-1">
                    {checkResult.reason || 'This student is currently in progress and has not received final convocation clearance.'}
                  </p>
                  <div className="mt-2 p-2.5 rounded-lg bg-white/70 border border-amber-200 text-[11px] text-amber-900 space-y-1">
                    <p><strong>Student:</strong> {checkResult.student?.name}</p>
                    <p><strong>Graduation Status:</strong> <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">{checkResult.student?.graduationStatus}</code></p>
                    <p><strong>Expected Graduation:</strong> {checkResult.student?.graduationYear}</p>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2">
                    *Tip for Viva Demo: Switch to Admin Suite to mark this student as <code className="text-purple-700">COMPLETE</code> to test instant eligibility unlock.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <h4 className="font-bold text-emerald-950 text-xs sm:text-sm">
                      Convocation Clearance Confirmed (Class of {checkResult.student?.graduationYear})
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 uppercase bg-emerald-100 px-2 py-0.5 rounded">
                    Eligible for Activation
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-white/80 p-3 rounded-lg border border-emerald-100 text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Student Name</span>
                    <strong className="text-slate-900">{checkResult.student?.name}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Branch & Degree</span>
                    <strong className="text-slate-900">{checkResult.student?.branch} ({checkResult.student?.degree})</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Academic CGPA</span>
                    <strong className="text-emerald-700 font-bold">{checkResult.student?.cgpa} / 10.0</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Convocation Date</span>
                    <strong className="text-slate-900">{checkResult.student?.convocationDate || 'May 2027'}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Step 2: Career & Mentorship Onboarding Form (Only if eligible) */}
      {checkResult?.eligible && !checkResult.isAlreadyActivated && (
        <form onSubmit={handleActivationSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-600" />
              <span>Step 2: Professional Career & Mentorship Setup</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Your academic degree is permanently locked from the college registry. Please provide your current employment and contact info.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Personal Email (For Lifelong Access) *
              </label>
              <input
                id="act-personal-email"
                type="email"
                required
                value={personalEmail}
                onChange={(e) => setPersonalEmail(e.target.value)}
                placeholder="name@gmail.com"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Contact Phone *
              </label>
              <input
                id="act-phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Current Company / Organization *
              </label>
              <input
                id="act-company"
                type="text"
                required
                value={currentCompany}
                onChange={(e) => setCurrentCompany(e.target.value)}
                placeholder="e.g. Google, Microsoft, Adobe, ISRO"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Job Role / Designation *
              </label>
              <input
                id="act-role"
                type="text"
                required
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                placeholder="e.g. Software Development Engineer, Product Manager"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Industry Domain
              </label>
              <select
                id="act-industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
              >
                <option value="Information Technology">Information Technology</option>
                <option value="Software & Cloud">Software & Cloud</option>
                <option value="Semiconductors & VLSI">Semiconductors & VLSI</option>
                <option value="Automotive & Robotics">Automotive & Robotics</option>
                <option value="Finance & FinTech">Finance & FinTech</option>
                <option value="Higher Education & Research">Higher Education & Research</option>
                <option value="Aerospace & Defense">Aerospace & Defense</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                City / Location
              </label>
              <input
                id="act-city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Bengaluru, Seattle, London, Hyderabad"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Higher Studies (Optional - e.g. MS in Computer Science @ Stanford University)
            </label>
            <input
              id="act-higher-studies"
              type="text"
              value={higherStudies}
              onChange={(e) => setHigherStudies(e.target.value)}
              placeholder="Degree, Specialization & Institution"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Core Skills & Technical Domains (Comma separated)
            </label>
            <input
              id="act-skills"
              type="text"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              placeholder="e.g. Distributed Systems, Kubernetes, Go, Machine Learning"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Professional Bio
            </label>
            <textarea
              id="act-bio"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Brief summary of your professional work and campus memories..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Mentorship Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-emerald-600" />
                <label htmlFor="act-mentorship-toggle" className="text-xs font-bold text-slate-900 cursor-pointer">
                  Opt-in for College Mentorship Program
                </label>
              </div>
              <input
                id="act-mentorship-toggle"
                type="checkbox"
                checked={isAvailableForMentorship}
                onChange={(e) => setIsAvailableForMentorship(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
              />
            </div>
            {isAvailableForMentorship && (
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Mentorship Focus Areas (Comma separated)
                </label>
                <input
                  id="act-mentorship-areas"
                  type="text"
                  value={mentorshipAreasInput}
                  onChange={(e) => setMentorshipAreasInput(e.target.value)}
                  placeholder="e.g. System Design, Resume Review, Higher Studies Prep"
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                />
              </div>
            )}
          </div>

          <button
            id="submit-activation-btn"
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isSubmitting ? 'Activating Profile...' : 'Complete Alumni Activation & Lock Verified Identity'}</span>
          </button>
        </form>
      )}
    </div>
  );
};
