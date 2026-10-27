import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import { VerificationBadge } from '../components/ui/VerificationBadge.tsx';
import { useToast } from '../context/ToastContext.tsx';
import {
  User,
  Building2,
  Briefcase,
  MapPin,
  HeartHandshake,
  ShieldCheck,
  Clock,
  Sparkles,
  Save,
  CheckCircle2,
  AlertCircle,
  Lock,
  Mail,
  Phone,
  MessageSquare,
  ExternalLink,
  Globe,
  Linkedin,
  Github,
  Eye,
  EyeOff,
} from 'lucide-react';

interface MyProfilePageProps {
  navigate: (path: string) => void;
}

export const MyProfilePage: React.FC<MyProfilePageProps> = ({ navigate }) => {
  const { user, alumni, refreshProfile } = useAuth();
  const { success, error, info } = useToast();

  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [higherStudies, setHigherStudies] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('India');
  const [phone, setPhone] = useState('');
  const [personalEmail, setPersonalEmail] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [bio, setBio] = useState('');
  const [skillsInput, setSkillsInput] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [isAvailableForMentorship, setIsAvailableForMentorship] = useState(false);
  const [mentorshipAreasInput, setMentorshipAreasInput] = useState('');
  const [changeReason, setChangeReason] = useState('Promoted / Switched Organization');

  // Preview toggle: ON (Visible) / OFF (Masked)
  const [previewMode, setPreviewMode] = useState<boolean>(true);

  const maskPhone = (num?: string) => {
    if (!num) return '+91 ••••• •••••';
    return num.replace(/(\+?[0-9]{1,3}\s?)([0-9]{3,})([0-9]{2})$/, (_m, p1, _p2, p3) => `${p1}••••• ••${p3}`);
  };

  const maskEmail = (em?: string) => {
    if (!em) return '••••••@college.edu';
    return em.replace(/^(.{2})(.*)(@.*)$/, '$1••••••$3');
  };

  // Privacy & Sharing Settings
  const [shareEmailWithConnections, setShareEmailWithConnections] = useState(true);
  const [sharePhoneWithConnections, setSharePhoneWithConnections] = useState(true);
  const [allowDirectMessaging, setAllowDirectMessaging] = useState(true);
  const [preferredContactMethod, setPreferredContactMethod] = useState<'EMAIL' | 'PHONE' | 'WHATSAPP' | 'LINKEDIN'>('WHATSAPP');

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (alumni) {
      setCompany(alumni.currentCompany || '');
      setRole(alumni.jobRole || '');
      setHigherStudies(alumni.higherStudies || '');
      setCity(alumni.city || '');
      setCountry(alumni.country || 'India');
      setPhone(alumni.phone || '');
      setPersonalEmail(alumni.personalEmail || '');
      setWebsiteUrl(alumni.websiteUrl || '');
      setBio(alumni.bio || '');
      setSkillsInput(alumni.skills.join(', '));
      setLinkedinUrl(alumni.linkedinUrl || '');
      setGithubUrl(alumni.githubUrl || '');
      setIsAvailableForMentorship(alumni.isAvailableForMentorship);
      setMentorshipAreasInput(alumni.mentorshipAreas.join(', '));

      if (alumni.privacySettings) {
        setShareEmailWithConnections(alumni.privacySettings.shareEmailWithConnections ?? true);
        setSharePhoneWithConnections(alumni.privacySettings.sharePhoneWithConnections ?? true);
        setAllowDirectMessaging(alumni.privacySettings.allowDirectMessaging ?? true);
        setPreferredContactMethod(alumni.privacySettings.preferredContactMethod ?? 'WHATSAPP');
      }
    }
  }, [alumni]);

  if (!user || user.role !== 'ALUMNI' || !alumni) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Alumni Profile Not Found</h2>
        <p className="text-xs text-slate-500">
          Only users with an active Alumni role can access this profile editor.
        </p>
        <button
          onClick={() => navigate('/activate')}
          className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
        >
          Activate Alumni Profile
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

      const updates = {
        currentCompany: company,
        jobRole: role,
        higherStudies,
        city,
        country,
        phone,
        personalEmail,
        websiteUrl,
        bio,
        skills,
        linkedinUrl,
        githubUrl,
        isAvailableForMentorship,
        mentorshipAreas,
        reason: changeReason,
        privacySettings: {
          shareEmailWithConnections,
          sharePhoneWithConnections,
          allowDirectMessaging,
          preferredContactMethod,
        },
      };

      const res = await api.updateProfileRequest(alumni.id, updates);
      await refreshProfile();

      if (res.isDirectUpdated) {
        success('Profile Updated', 'Your profile details have been saved.');
      } else {
        info(
          'Verification Queued',
          'Sensitive career updates submitted to Alumni Affairs Dean for verification.'
        );
      }
    } catch (err: any) {
      error('Update Failed', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 font-display">
              Manage Alumni Profile
            </h1>
            <VerificationBadge status={alumni.verificationStatus} size="sm" />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Maintain your verified career achievements, skills, and mentorship availability.
          </p>
        </div>

        <button
          onClick={() => navigate(`/alumni/${alumni.id}`)}
          className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
        >
          View Public Profile →
        </button>
      </div>

      {/* Pending status banner if queued */}
      {alumni.verificationStatus === 'PENDING' && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 flex items-start gap-3">
          <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 animate-spin" />
          <div className="text-xs">
            <h4 className="font-bold text-amber-900">Career Changes Under Admin Review</h4>
            <p className="text-amber-800 mt-0.5">
              Your company/designation update is currently in the verification queue. The Alumni Dean will verify the credentials before re-issuing full verification.
            </p>
          </div>
        </div>
      )}

      {/* Immutable Academic Record Box */}
      <div className="bg-indigo-50/60 p-6 rounded-2xl border border-indigo-100 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-950 font-bold text-xs sm:text-sm">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            <span>Institutional Academic Credentials (Locked via College Database)</span>
          </div>
          <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
            Verified Record
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-1">
          <div>
            <span className="text-slate-400 block text-[10px]">Enrollment Number</span>
            <strong className="text-slate-900 font-mono">{alumni.enrollmentNo}</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Degree & Department</span>
            <strong className="text-slate-900">{alumni.degree} ({alumni.branch})</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Graduation Class</span>
            <strong className="text-slate-900">Class of {alumni.graduationYear}</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Institutional Email</span>
            <strong className="text-slate-900">{alumni.collegeEmail}</strong>
          </div>
        </div>
      </div>

      {/* Live Portfolio Contact Card (Instant Visibility Preview) */}
      <div className={`p-5 sm:p-6 rounded-2xl border shadow-sm space-y-4 transition-all ${
        previewMode
          ? 'bg-gradient-to-br from-indigo-50/70 via-white to-emerald-50/50 border-indigo-200'
          : 'bg-gradient-to-br from-slate-50 via-white to-amber-50/40 border-amber-200'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl text-white shadow-2xs transition-colors ${
              previewMode ? 'bg-indigo-600' : 'bg-slate-700'
            }`}>
              {previewMode ? <Sparkles className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm">
                  Your Live Portfolio Contact Preview
                </h3>
                {previewMode ? (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                    Visible Mode: ON
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full">
                    Privacy Shield: OFF
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500">
                {previewMode
                  ? 'Previewing how your unmasked phone number and email look to peers and recruiters.'
                  : 'Previewing how your details look when privacy shielding is active.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="myprof-preview-toggle-btn"
              onClick={() => setPreviewMode(!previewMode)}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all border shadow-2xs active:scale-95 ${
                previewMode
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700'
                  : 'bg-amber-500 hover:bg-amber-600 text-slate-950 border-amber-600'
              }`}
              title="Toggle preview between Visible (ON) and Shielded (OFF)"
            >
              {previewMode ? (
                <>
                  <Eye className="w-3.5 h-3.5 text-emerald-100" />
                  <span>Preview: <strong>ON</strong> (Visible)</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-slate-950" />
                  <span>Preview: <strong>OFF</strong> (Masked)</span>
                </>
              )}
            </button>

            {websiteUrl && (
              <a
                href={websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 shrink-0 px-2 py-1 rounded-lg hover:bg-indigo-50"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Visit Portfolio</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1">
              <Phone className="w-3 h-3 text-emerald-600" /> Phone & WhatsApp
            </span>
            <div className={`font-mono font-bold text-sm ${previewMode ? 'text-slate-900' : 'text-slate-400 select-none'}`}>
              {previewMode ? (phone || alumni.phone || '+91 98450 12345') : maskPhone(phone || alumni.phone)}
            </div>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1">
              <Mail className="w-3 h-3 text-indigo-600" /> Personal Email
            </span>
            <div className={`font-bold text-xs truncate ${previewMode ? 'text-indigo-600' : 'text-slate-400 font-mono select-none'}`}>
              {previewMode
                ? (personalEmail || alumni.personalEmail || `${alumni.name.toLowerCase().replace(/[^a-z]/g, '.')}@gmail.com`)
                : maskEmail(personalEmail || alumni.personalEmail)}
            </div>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1">
              <Globe className="w-3 h-3 text-purple-600" /> Portfolio Website
            </span>
            <div className="font-semibold text-purple-700 text-xs truncate">
              {websiteUrl || alumni.websiteUrl || 'https://portfolio.dev'}
            </div>
          </div>
        </div>
      </div>

      {/* Editable Career Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-indigo-600" />
            <span>Professional Career & Role (Triggers Admin Verification)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Changes to your organization or job role will be verified by the Alumni Affairs Office to prevent false claims.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Current Company / Organization
            </label>
            <input
              id="myprof-company"
              type="text"
              required
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Job Role / Designation
            </label>
            <input
              id="myprof-role"
              type="text"
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              City / Location
            </label>
            <input
              id="myprof-city"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Contact Phone Number
            </label>
            <input
              id="myprof-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +91 98450 12345"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Personal Email Address
            </label>
            <input
              id="myprof-personal-email"
              type="email"
              value={personalEmail}
              onChange={(e) => setPersonalEmail(e.target.value)}
              placeholder="e.g. yourname@gmail.com"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Portfolio & External Web Links */}
        <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-200/80 space-y-3">
          <div className="flex items-center gap-2 text-purple-950 font-bold text-xs">
            <Globe className="w-4 h-4 text-purple-600" />
            <span>Portfolio Website & Social Showcase (Visible on Portfolio)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Portfolio Website URL
              </label>
              <input
                id="myprof-website-url"
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://yourname.dev"
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                LinkedIn Profile URL
              </label>
              <input
                id="myprof-linkedin-url"
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/yourname"
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                GitHub Profile URL
              </label>
              <input
                id="myprof-github-url"
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/yourname"
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Higher Studies / Research Institution (Optional)
          </label>
          <input
            id="myprof-higher-studies"
            type="text"
            value={higherStudies}
            onChange={(e) => setHigherStudies(e.target.value)}
            placeholder="e.g. MS in Computer Science @ Stanford University"
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Core Skills (Comma separated)
          </label>
          <input
            id="myprof-skills"
            type="text"
            value={skillsInput}
            onChange={(e) => setSkillsInput(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Professional Bio
          </label>
          <textarea
            id="myprof-bio"
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {/* Mentorship Settings */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-emerald-600" />
              <label htmlFor="myprof-mentorship-optin" className="text-xs font-bold text-slate-900 cursor-pointer">
                Available for Student Mentorship
              </label>
            </div>
            <input
              id="myprof-mentorship-optin"
              type="checkbox"
              checked={isAvailableForMentorship}
              onChange={(e) => setIsAvailableForMentorship(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
            />
          </div>
          {isAvailableForMentorship && (
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Mentorship Topics
              </label>
              <input
                id="myprof-mentorship-areas"
                type="text"
                value={mentorshipAreasInput}
                onChange={(e) => setMentorshipAreasInput(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
              />
            </div>
          )}
        </div>

        {/* Privacy & Safe Contact Sharing Controls */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/40 border border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-600 text-white">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  Institutional Privacy & Mutual Contact Sharing Controls
                </h4>
                <p className="text-[11px] text-slate-500">
                  Control how your private phone, personal email, and notes are revealed to peers.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/privacy')}
              className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 self-start sm:self-auto"
            >
              <span>View Privacy Policy</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <label className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-200 cursor-pointer">
              <input
                id="pref-share-email"
                type="checkbox"
                checked={shareEmailWithConnections}
                onChange={(e) => setShareEmailWithConnections(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 mt-0.5"
              />
              <div className="space-y-0.5">
                <span className="font-bold text-slate-900 block flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-indigo-500" /> Share Personal Email
                </span>
                <span className="text-slate-500 text-[11px] leading-relaxed">
                  Revealed inside the mutual vault once a connection is accepted.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-200 cursor-pointer">
              <input
                id="pref-share-phone"
                type="checkbox"
                checked={sharePhoneWithConnections}
                onChange={(e) => setSharePhoneWithConnections(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 mt-0.5"
              />
              <div className="space-y-0.5">
                <span className="font-bold text-slate-900 block flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-500" /> Share Phone / WhatsApp
                </span>
                <span className="text-slate-500 text-[11px] leading-relaxed">
                  Allows connected peers to call or reach out via direct WhatsApp.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-200 cursor-pointer">
              <input
                id="pref-allow-messaging"
                type="checkbox"
                checked={allowDirectMessaging}
                onChange={(e) => setAllowDirectMessaging(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 mt-0.5"
              />
              <div className="space-y-0.5">
                <span className="font-bold text-slate-900 block flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-500" /> Enable Mutual Vault Notes
                </span>
                <span className="text-slate-500 text-[11px] leading-relaxed">
                  Allows connected peers to exchange confidential private notes.
                </span>
              </div>
            </label>

            <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
              <label htmlFor="pref-preferred-channel" className="font-bold text-slate-900 block text-xs">
                Preferred Reachout Channel
              </label>
              <select
                id="pref-preferred-channel"
                value={preferredContactMethod}
                onChange={(e: any) => setPreferredContactMethod(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold focus:ring-2 focus:ring-indigo-500"
              >
                <option value="WHATSAPP">WhatsApp</option>
                <option value="EMAIL">Email</option>
                <option value="PHONE">Direct Phone</option>
                <option value="LINKEDIN">LinkedIn</option>
              </select>
              <span className="text-[10px] text-slate-400 block">
                Highlighted as your recommended contact method to accepted peers.
              </span>
            </div>
          </div>
        </div>

        <button
          id="save-my-profile-btn"
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>{isSubmitting ? 'Saving Updates...' : 'Save Profile & Submit Updates for Verification'}</span>
        </button>
      </form>
    </div>
  );
};
