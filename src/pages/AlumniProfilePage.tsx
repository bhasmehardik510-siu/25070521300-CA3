import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import { AlumniProfile, Achievement } from '../types/index.ts';
import { VerificationBadge } from '../components/ui/VerificationBadge.tsx';
import { useToast } from '../context/ToastContext.tsx';
import {
  GraduationCap,
  Building2,
  MapPin,
  Mail,
  Phone,
  Linkedin,
  Github,
  Globe,
  HeartHandshake,
  UserPlus,
  Award,
  ShieldCheck,
  Calendar,
  Lock,
  ArrowLeft,
  X,
  Send,
  CheckCircle2,
  Copy,
  ExternalLink,
  Sliders,
  Sparkles,
  Info,
  Check,
  Eye,
  EyeOff,
} from 'lucide-react';

interface AlumniProfilePageProps {
  alumniId: string;
  navigate: (path: string) => void;
}

export const AlumniProfilePage: React.FC<AlumniProfilePageProps> = ({ alumniId, navigate }) => {
  const { user } = useAuth();
  const { success, error, info } = useToast();

  const [profile, setProfile] = useState<AlumniProfile | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  // Feature: Toggle visibility ON and OFF for contact number, email, and portfolio
  const [isContactVisible, setIsContactVisible] = useState<boolean>(true);
  const [privacyInfo, setPrivacyInfo] = useState<{
    isContactProtected: boolean;
    isConnectedWithViewer: boolean;
    isSelf: boolean;
    sharingPolicy?: string;
  }>({
    isContactProtected: true,
    isConnectedWithViewer: false,
    isSelf: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Helper functions for masking when visibility is OFF
  const maskPhone = (phone?: string) => {
    if (!phone) return '+91 ••••• •••••';
    return phone.replace(/(\+?[0-9]{1,3}\s?)([0-9]{3,})([0-9]{2})$/, (_m, p1, _p2, p3) => `${p1}••••• ••${p3}`);
  };

  const maskEmail = (email?: string) => {
    if (!email) return '••••••@college.edu';
    return email.replace(/^(.{2})(.*)(@.*)$/, '$1••••••$3');
  };

  // Mentorship Modal
  const [isMentorshipModalOpen, setMentorshipModalOpen] = useState(false);
  const [mentorshipTopic, setMentorshipTopic] = useState('Career Roadmap & System Design');
  const [mentorshipMessage, setMentorshipMessage] = useState('Hi! I would love to get your insights on software career preparation.');
  const [isSendingMentorship, setIsSendingMentorship] = useState(false);

  // Connection State & Privacy Modal
  const [isConnectionModalOpen, setIsConnectionModalOpen] = useState(false);
  const [connectionNote, setConnectionNote] = useState('');
  const [shareEmailConsent, setShareEmailConsent] = useState(true);
  const [sharePhoneConsent, setSharePhoneConsent] = useState(true);
  const [preferredChannel, setPreferredChannel] = useState<'EMAIL' | 'PHONE' | 'WHATSAPP' | 'LINKEDIN'>('WHATSAPP');
  const [privacyAgreed, setPrivacyAgreed] = useState(true);
  const [isSendingConnection, setIsSendingConnection] = useState(false);
  const [hasSentConnection, setHasSentConnection] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    api.getAlumniById(alumniId)
      .then((res: any) => {
        if (res.success) {
          setProfile(res.profile);
          setAchievements(res.achievements || []);
          if (res.privacyInfo) {
            setPrivacyInfo(res.privacyInfo);
          }
        }
      })
      .catch((err) => {
        error('Profile Not Found', err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [alumniId, user]);

  const handleOpenConnectionModal = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setConnectionNote(`Hello ${profile?.name}, I would love to connect with you on SIT Alumni Connect.`);
    setIsConnectionModalOpen(true);
  };

  const handleSendConnection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !user) {
      navigate('/login');
      return;
    }

    try {
      setIsSendingConnection(true);
      const res = await api.sendConnectionRequest({
        receiverId: profile.userId,
        receiverName: profile.name,
        receiverRole: profile.jobRole,
        receiverCompany: profile.currentCompany,
        receiverAvatar: profile.avatarUrl,
        note: connectionNote,
        senderPrivacy: {
          shareEmail: shareEmailConsent,
          sharePhone: sharePhoneConsent,
          preferredChannel,
          privateNote: connectionNote,
        },
        privacyConsentAccepted: privacyAgreed,
      });

      if (res.success) {
        setHasSentConnection(true);
        setIsConnectionModalOpen(false);
        success(
          'Connection Request Sent',
          `Invite delivered to ${profile.name}. Your shared contact details will unlock upon acceptance.`
        );
      }
    } catch (err: any) {
      error('Connection Failed', err.message);
    } finally {
      setIsSendingConnection(false);
    }
  };

  const handleMentorshipSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !user) {
      navigate('/login');
      return;
    }
    try {
      setIsSendingMentorship(true);
      const res = await api.requestMentorship({
        mentorId: profile.id,
        mentorshipTopic,
        message: mentorshipMessage,
      });
      if (res.success) {
        setMentorshipModalOpen(false);
        success('Mentorship Request Sent', `Request submitted to ${profile.name}`);
      }
    } catch (err: any) {
      error('Mentorship Request Failed', err.message);
    } finally {
      setIsSendingMentorship(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    info('Copied to Clipboard', `${label}: ${text}`);
  };

  if (isLoading) {
    return <div className="py-20 text-center text-xs text-slate-400">Loading verified alumni profile...</div>;
  }

  if (!profile) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Alumni Profile Not Found</h2>
        <button
          onClick={() => navigate('/directory')}
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
        >
          Return to Directory
        </button>
      </div>
    );
  }

  const isConnected = privacyInfo.isConnectedWithViewer;
  const isProtected = privacyInfo.isContactProtected;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back to directory */}
      <button
        onClick={() => navigate('/directory')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Alumni Directory</span>
      </button>

      {/* Main Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <img
              src={
                profile.avatarUrl ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
              }
              alt={profile.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-indigo-50 shrink-0"
            />
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900 font-display">
                  {profile.name}
                </h1>
                <VerificationBadge status={profile.verificationStatus} size="sm" />
                {isConnected && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <Check className="w-3 h-3" /> Connected
                  </span>
                )}
              </div>

              <p className="text-sm font-semibold text-indigo-600 flex items-center gap-1.5">
                <Building2 className="w-4 h-4" />
                <span>{profile.jobRole || 'Alumnus'} {profile.currentCompany ? `at ${profile.currentCompany}` : ''}</span>
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                  {profile.degree} • Class of {profile.graduationYear}
                </span>
                {profile.city && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {profile.city}{profile.country ? `, ${profile.country}` : ''}
                  </span>
                )}
              </div>

              {/* Instant Contact & Portfolio Badges with ON/OFF Toggle */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                {profile.phone && (
                  isContactVisible ? (
                    <a
                      href={`tel:${profile.phone}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold transition-colors"
                      title="Call Phone Number"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{profile.phone}</span>
                    </a>
                  ) : (
                    <span
                      onClick={() => setIsContactVisible(true)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-500 border border-slate-200 text-xs font-mono font-medium cursor-pointer hover:bg-slate-200"
                      title="Click to reveal phone number"
                    >
                      <Lock className="w-3 h-3 text-slate-400" />
                      <span>{maskPhone(profile.phone)}</span>
                    </span>
                  )
                )}

                {profile.personalEmail && (
                  isContactVisible ? (
                    <a
                      href={`mailto:${profile.personalEmail}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 text-xs font-semibold transition-colors"
                      title="Send Email"
                    >
                      <Mail className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{profile.personalEmail}</span>
                    </a>
                  ) : (
                    <span
                      onClick={() => setIsContactVisible(true)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-500 border border-slate-200 text-xs font-mono font-medium cursor-pointer hover:bg-slate-200"
                      title="Click to reveal email"
                    >
                      <Lock className="w-3 h-3 text-slate-400" />
                      <span>{maskEmail(profile.personalEmail)}</span>
                    </span>
                  )
                )}

                {profile.websiteUrl && (
                  <a
                    href={profile.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 text-xs font-semibold transition-colors"
                    title="Visit Portfolio"
                  >
                    <Globe className="w-3.5 h-3.5 text-sky-600" />
                    <span>Portfolio</span>
                    <ExternalLink className="w-3 h-3 text-sky-500" />
                  </a>
                )}

                {/* ON / OFF Toggle Button in Header */}
                <button
                  type="button"
                  id="header-toggle-contact-visibility"
                  onClick={() => setIsContactVisible(!isContactVisible)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all border shadow-2xs ${
                    isContactVisible
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700'
                      : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300'
                  }`}
                  title={isContactVisible ? 'Click to turn OFF (Hide/Mask details)' : 'Click to turn ON (Reveal details)'}
                >
                  {isContactVisible ? (
                    <>
                      <Eye className="w-3.5 h-3.5 text-emerald-200" />
                      <span>Details: <strong>ON</strong></span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3.5 h-3.5 text-amber-700" />
                      <span>Details: <strong>OFF</strong></span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Connect / Mentorship Buttons */}
          <div className="flex flex-wrap sm:flex-col gap-2 w-full sm:w-auto shrink-0">
            {profile.isAvailableForMentorship && (
              <button
                id="request-mentorship-btn"
                onClick={() => setMentorshipModalOpen(true)}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-colors"
              >
                <HeartHandshake className="w-4 h-4" />
                <span>Request Mentorship</span>
              </button>
            )}

            {user && user.alumniId !== profile.id && !isConnected && (
              <button
                id="send-connection-btn"
                disabled={hasSentConnection || isSendingConnection}
                onClick={handleOpenConnectionModal}
                className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm ${
                  hasSentConnection
                    ? 'bg-slate-100 text-slate-500 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {hasSentConnection ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Invite Sent</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Connect & Share Info</span>
                  </>
                )}
              </button>
            )}

            {isConnected && (
              <button
                id="open-vault-btn"
                onClick={() => navigate('/connections')}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center gap-1.5 border border-indigo-200 transition-colors"
              >
                <Lock className="w-4 h-4 text-indigo-600" />
                <span>View in Mutual Vault</span>
              </button>
            )}
          </div>
        </div>

        {/* Bio */}
        {profile.bio && (
          <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
            {profile.bio}
          </p>
        )}

        {/* ========================================================================= */}
        {/* VERIFIED PORTFOLIO & DIRECT CONTACT HUB (WITH ON/OFF VISIBILITY TOGGLE) */}
        {/* ========================================================================= */}
        <div className={`p-5 sm:p-6 rounded-3xl border transition-all space-y-5 ${
          isContactVisible
            ? 'bg-gradient-to-br from-indigo-50/70 via-white to-emerald-50/40 border-indigo-200/80 shadow-sm'
            : 'bg-gradient-to-br from-slate-50 via-white to-amber-50/30 border-slate-300 shadow-sm'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-slate-200">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl text-white shadow-sm transition-colors ${
                isContactVisible ? 'bg-indigo-600' : 'bg-slate-700'
              }`}>
                {isContactVisible ? <Sparkles className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900 font-display">
                    Verified Portfolio & Direct Contact Hub
                  </h3>
                  {isContactVisible ? (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 border border-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Data Visible: ON
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Lock className="w-3 h-3 text-amber-700" /> Privacy Shield: OFF
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  {isContactVisible
                    ? 'Verified contact coordinates and direct reachout channels are revealed.'
                    : 'Contact numbers and emails are masked. Click the toggle to reveal details.'}
                </p>
              </div>
            </div>

            {/* Prominent ON / OFF Toggle and Portfolio Button */}
            <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
              <button
                type="button"
                id="main-contact-visibility-toggle"
                onClick={() => {
                  const nextState = !isContactVisible;
                  setIsContactVisible(nextState);
                  if (nextState) {
                    info('Visibility ON', 'Full contact phone number and personal email revealed.');
                  } else {
                    info('Visibility OFF', 'Contact data is now masked under privacy shielding.');
                  }
                }}
                className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-sm active:scale-95 border ${
                  isContactVisible
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700'
                    : 'bg-amber-500 hover:bg-amber-600 text-slate-950 border-amber-600'
                }`}
                title="Toggle contact visibility ON or OFF"
              >
                {isContactVisible ? (
                  <>
                    <Eye className="w-4 h-4 text-emerald-100" />
                    <span>Visibility: <strong>ON</strong> (Turn OFF)</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="w-4 h-4 text-slate-950" />
                    <span>Visibility: <strong>OFF</strong> (Turn ON)</span>
                  </>
                )}
              </button>

              {profile.websiteUrl && (
                <a
                  href={profile.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all active:scale-95"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Live Portfolio</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* 1. Direct Phone & WhatsApp */}
            <div className={`p-4 rounded-2xl bg-white border shadow-2xs space-y-2.5 transition-all ${
              isContactVisible ? 'border-slate-200/90' : 'border-amber-200 bg-amber-50/20'
            }`}>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-emerald-600" />
                  Direct Phone & WhatsApp
                </span>
                {isContactVisible ? (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Visible ✓
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-0.5">
                    <Lock className="w-2.5 h-2.5" /> Masked
                  </span>
                )}
              </div>

              <div className="pt-1">
                <div className={`font-mono text-sm font-extrabold tracking-tight ${
                  isContactVisible ? 'text-slate-900' : 'text-slate-400 select-none'
                }`}>
                  {isContactVisible ? (profile.phone || '+91 98450 12345') : maskPhone(profile.phone)}
                </div>

                {isContactVisible ? (
                  <div className="flex flex-wrap items-center gap-2 mt-2.5">
                    <a
                      href={`tel:${profile.phone || '+919845012345'}`}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 font-bold text-xs flex items-center gap-1 transition-colors"
                    >
                      <Phone className="w-3 h-3" />
                      <span>Call</span>
                    </a>
                    <a
                      href={`https://wa.me/${(profile.phone || '919845012345').replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 font-bold text-xs flex items-center gap-1 shadow-2xs transition-colors"
                    >
                      <span>WhatsApp</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(profile.phone || '+91 98450 12345', 'Phone Number')}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                      title="Copy phone number"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="mt-2.5">
                    <button
                      type="button"
                      onClick={() => setIsContactVisible(true)}
                      className="text-[11px] text-indigo-600 font-semibold hover:underline flex items-center gap-1"
                    >
                      <span>Turn Visibility ON to Call or WhatsApp →</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Direct Personal Email */}
            <div className={`p-4 rounded-2xl bg-white border shadow-2xs space-y-2.5 transition-all ${
              isContactVisible ? 'border-slate-200/90' : 'border-amber-200 bg-amber-50/20'
            }`}>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-indigo-600" />
                  Personal Email Address
                </span>
                {isContactVisible ? (
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                    Visible ✓
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-0.5">
                    <Lock className="w-2.5 h-2.5" /> Masked
                  </span>
                )}
              </div>

              <div className="pt-1">
                {isContactVisible ? (
                  <a
                    href={`mailto:${profile.personalEmail}`}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline break-all block"
                  >
                    {profile.personalEmail || `${profile.name.toLowerCase().replace(/[^a-z]/g, '.')}@gmail.com`}
                  </a>
                ) : (
                  <span className="text-xs font-mono font-medium text-slate-400 select-none block">
                    {maskEmail(profile.personalEmail)}
                  </span>
                )}

                {isContactVisible ? (
                  <div className="flex items-center gap-2 mt-2.5">
                    <a
                      href={`mailto:${profile.personalEmail}`}
                      className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 font-bold text-xs flex items-center gap-1 transition-colors"
                    >
                      <Mail className="w-3 h-3" />
                      <span>Send Email</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(profile.personalEmail || `${profile.name.toLowerCase().replace(/[^a-z]/g, '.')}@gmail.com`, 'Email')}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                      title="Copy email address"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="mt-2.5">
                    <button
                      type="button"
                      onClick={() => setIsContactVisible(true)}
                      className="text-[11px] text-indigo-600 font-semibold hover:underline flex items-center gap-1"
                    >
                      <span>Turn Visibility ON to Send Email →</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 3. Official College Email */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-sky-600" />
                  Official College Email
                </span>
                <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                  Academic Verified
                </span>
              </div>

              <div className="pt-1">
                <a
                  href={`mailto:${profile.collegeEmail}`}
                  className="text-xs font-bold text-slate-800 hover:text-indigo-600 hover:underline break-all block"
                >
                  {isContactVisible ? profile.collegeEmail : maskEmail(profile.collegeEmail)}
                </a>
                <div className="flex items-center gap-2 mt-2.5">
                  <a
                    href={`mailto:${profile.collegeEmail}`}
                    className="px-2.5 py-1 rounded-lg bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 font-bold text-xs flex items-center gap-1 transition-colors"
                  >
                    <Mail className="w-3 h-3" />
                    <span>Mail Institutional</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(profile.collegeEmail, 'College Email')}
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                    title="Copy college email"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Portfolio, GitHub, and Professional Social Links */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-purple-600" />
                Portfolio Website & External Profiles
              </span>
              <span className="text-[10px] font-semibold text-slate-400">
                1-Click Public Showcase
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              {profile.websiteUrl && (
                <a
                  href={profile.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200 transition-colors"
                >
                  <Globe className="w-3.5 h-3.5 text-purple-600" />
                  <span>Personal Portfolio Website</span>
                  <ExternalLink className="w-3 h-3 text-purple-500" />
                </a>
              )}

              {profile.linkedinUrl && (
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200 transition-colors"
                >
                  <Linkedin className="w-3.5 h-3.5 text-blue-600" />
                  <span>LinkedIn Profile</span>
                  <ExternalLink className="w-3 h-3 text-blue-500" />
                </a>
              )}

              {profile.githubUrl && (
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors shadow-2xs"
                >
                  <Github className="w-3.5 h-3.5 text-white" />
                  <span>GitHub Repositories</span>
                  <ExternalLink className="w-3 h-3 text-slate-300" />
                </a>
              )}

              {!profile.websiteUrl && !profile.linkedinUrl && !profile.githubUrl && (
                <span className="text-xs text-slate-400 italic">No external web links specified yet</span>
              )}
            </div>
          </div>
        </div>

        {/* Locked Academic Verification Box */}
        <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-indigo-950 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Official Academic Record (Locked via Convocation Registry)</span>
            </span>
            <span className="text-[10px] font-bold text-indigo-700 uppercase bg-indigo-100 px-2 py-0.5 rounded">
              Immutable
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] pt-1">
            <div>
              <span className="text-slate-400 block text-[10px]">Enrollment Number</span>
              <strong className="text-slate-900 font-mono">{profile.enrollmentNo}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Degree & Department</span>
              <strong className="text-slate-900">{profile.degree} ({profile.branch})</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Graduation Class</span>
              <strong className="text-slate-900">Class of {profile.graduationYear}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Alumni Verification</span>
              <strong className="text-emerald-700 font-semibold">Institutional Clearance ✓</strong>
            </div>
          </div>
        </div>

        {/* Skills & Higher Studies */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div>
            <h4 className="text-xs font-bold text-slate-900 mb-2">Technical Skills & Expertise</h4>
            <div className="flex flex-wrap gap-1.5">
              {profile.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {profile.higherStudies && (
            <div>
              <h4 className="text-xs font-bold text-slate-900 mb-2">Higher Education Milestone</h4>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                {profile.higherStudies}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Verified Achievements Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          <h3 className="text-base font-bold text-slate-900">
            Verified Achievements & Honors ({achievements.length})
          </h3>
        </div>

        {achievements.length === 0 ? (
          <p className="text-xs text-slate-400">No public achievements recorded yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                    {ach.category} • {ach.year}
                  </span>
                  <VerificationBadge status={ach.status} size="sm" />
                </div>
                <h4 className="text-xs font-bold text-slate-900">{ach.title}</h4>
                <p className="text-xs text-slate-600">{ach.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* SECURE CONNECTION REQUEST MODAL WITH PRIVACY PREFERENCES */}
      {/* ========================================================================= */}
      {isConnectionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-indigo-600 text-white">
                  <UserPlus className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">
                  Connect & Share Private Information with {profile.name}
                </h3>
              </div>
              <button
                onClick={() => setIsConnectionModalOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendConnection} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Introductory Note *
                </label>
                <textarea
                  rows={3}
                  required
                  value={connectionNote}
                  onChange={(e) => setConnectionNote(e.target.value)}
                  placeholder="Share a short note explaining why you would like to connect..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Private Information Sharing Choices */}
              <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 space-y-3">
                <h4 className="font-bold text-indigo-950 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-indigo-600" />
                  What private information do you agree to share upon mutual acceptance?
                </h4>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={shareEmailConsent}
                    onChange={(e) => setShareEmailConsent(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-slate-700 font-medium">
                    Share my verified personal email
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sharePhoneConsent}
                    onChange={(e) => setSharePhoneConsent(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-slate-700 font-medium">
                    Share my direct phone / WhatsApp number
                  </span>
                </label>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Preferred Communication Channel
                  </label>
                  <select
                    value={preferredChannel}
                    onChange={(e: any) => setPreferredChannel(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-indigo-200 bg-white text-xs font-semibold focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="WHATSAPP">WhatsApp</option>
                    <option value="EMAIL">Email</option>
                    <option value="PHONE">Direct Phone</option>
                    <option value="LINKEDIN">LinkedIn</option>
                  </select>
                </div>
              </div>

              {/* Privacy Policy Consent Acknowledgement */}
              <label className="flex items-start gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={privacyAgreed}
                  onChange={(e) => setPrivacyAgreed(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 mt-0.5"
                />
                <span className="text-slate-600 text-[11px] leading-relaxed">
                  I understand that my shared contact details will remain confidential and only unlock inside {profile.name}’s mutual vault once this connection is accepted.
                </span>
              </label>

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsConnectionModalOpen(false)}
                  className="flex-1 py-2.5 text-xs font-semibold text-slate-600 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  id="submit-connection-req-btn"
                  type="submit"
                  disabled={isSendingConnection || !privacyAgreed}
                  className="flex-1 py-2.5 text-xs font-bold text-white rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSendingConnection ? 'Sending...' : 'Send Request & Share Info'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mentorship Request Modal */}
      {isMentorshipModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-slate-900 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-sm text-slate-900">
                  Request Mentorship with {profile.name}
                </h3>
              </div>
              <button
                onClick={() => setMentorshipModalOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleMentorshipSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mentorship Focus Topic *
                </label>
                <input
                  id="mentorship-topic-input"
                  type="text"
                  required
                  value={mentorshipTopic}
                  onChange={(e) => setMentorshipTopic(e.target.value)}
                  placeholder="e.g. System Design Interview Prep, Resume Feedback"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Introductory Message / Goal *
                </label>
                <textarea
                  id="mentorship-message-input"
                  rows={4}
                  required
                  value={mentorshipMessage}
                  onChange={(e) => setMentorshipMessage(e.target.value)}
                  placeholder="Introduce yourself, your current year/branch, and what guidance you are seeking..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setMentorshipModalOpen(false)}
                  className="flex-1 py-2 text-xs font-semibold text-slate-600 rounded-xl bg-slate-100 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  id="submit-mentorship-req-btn"
                  type="submit"
                  disabled={isSendingMentorship}
                  className="flex-1 py-2 text-xs font-bold text-white rounded-xl bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSendingMentorship ? 'Sending...' : 'Send Request'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
