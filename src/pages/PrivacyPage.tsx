import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  KeyRound,
  FileCheck2,
  Mail,
  Phone,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Share2,
  Sliders,
  Award,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface PrivacyPageProps {
  navigate: (path: string) => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ navigate }) => {
  const { user } = useAuth();
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const dataMatrix = [
    {
      category: 'Institutional Identity',
      fields: ['Full Name', 'Convocation Year', 'Branch / Program', 'Degree Awarded', 'Institutional Verification Badge'],
      visibility: 'Public / Directory',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: UserCheck,
      description: 'Used by recruiters, fellow alumni, and students to discover verified graduates.',
    },
    {
      category: 'Professional Background',
      fields: ['Current Company', 'Job Role & Designation', 'Industry & Skills', 'LinkedIn / GitHub / Portfolio URLs', 'Higher Studies'],
      visibility: 'Public / Directory',
      badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: Award,
      description: 'Allows verified alumni to represent their career trajectory and offer industry mentorship.',
    },
    {
      category: 'Private Contact Channels',
      fields: ['Personal Mobile / WhatsApp Number', 'Personal Email Address', 'Private Introductory Notes', 'Direct Connection Messages'],
      visibility: 'Mutual Connections Only',
      badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
      icon: Lock,
      description: 'Protected behind the Mutual Connection Vault. Never shared without explicit bilateral consent.',
    },
    {
      category: 'Academic & Audit Records',
      fields: ['University Enrollment Number', 'Degree Verification Hashes', 'Audit Timestamps', 'Admin Review Notes'],
      visibility: 'Internal & Student Self Only',
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
      icon: KeyRound,
      description: 'Restricted strictly to the Dean of Student Affairs, registrar verification staff, and the user themselves.',
    },
  ];

  const faqs = [
    {
      q: 'How does the Mutual Connection Vault protect my contact information?',
      a: 'When browsing the alumni directory, personal phone numbers and direct email addresses are strictly masked. To see another member’s personal phone or email, you must send a connection request. When they accept, both members mutually exchange access to their preferred private contact channels.',
    },
    {
      q: 'Can I choose which contact details to share when connecting?',
      a: 'Yes! In your Profile Privacy Settings and whenever you send a connection request, you can independently toggle whether you wish to share your personal email, phone/WhatsApp number, or preferred communication platform.',
    },
    {
      q: 'What happens if I disconnect from someone?',
      a: 'Access to your private contact details is revoked immediately. The connection record is permanently removed, and both members revert to standard masked directory visibility.',
    },
    {
      q: 'Are student profiles exposed to external commercial marketing or spam?',
      a: 'No. The platform enforces strict institutional RBAC (Role-Based Access Control). Third-party scrapers, automated indexing bots, and non-verified entities are prevented from accessing contact data. Mentorship queries and connection requests can only be initiated by authenticated students and alumni.',
    },
    {
      q: 'How can I update my privacy preferences?',
      a: 'Go to "My Profile" and look for the "Privacy & Contact Sharing Settings" section. You can toggle email and phone sharing on or off, set your preferred contact method (WhatsApp, Email, or Phone), or adjust who can send you direct connection requests.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 md:p-12 overflow-hidden shadow-xl border border-slate-800">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/4 -bottom-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Institutional Privacy & Secure Information Sharing Policy
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display">
            Connect Confidently. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-sky-200 to-emerald-300">
              Your Private Information is Shielded by Mutual Consent.
            </span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            SIT Alumni Connect balances discoverability with rigorous institutional privacy. Alumni and students can build lifelong professional relationships without exposing personal phone numbers or email addresses to spam or unsolicited scrapers.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              id="privacy-manage-connections-btn"
              onClick={() => navigate('/connections')}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
            >
              <Lock className="w-4 h-4" />
              Open My Connection Vault
            </button>
            <button
              id="privacy-edit-profile-btn"
              onClick={() => navigate('/profile')}
              className="px-5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 text-sm font-semibold transition-all flex items-center gap-2"
            >
              <Sliders className="w-4 h-4" />
              Configure Privacy Settings
            </button>
          </div>
        </div>
      </div>

      {/* 4 Pillars of Information Protection */}
      <div className="space-y-4">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 font-display">
            The 4 Pillars of Institutional Data Protection
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Engineered to adhere to institutional guidelines and modern privacy regulations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <EyeOff className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-slate-900 text-base">1. Masked Public Profiles</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Personal phone numbers and direct emails are never exposed publicly in search results. Only verified alumni credentials, company, and role are visible.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <KeyRound className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-slate-900 text-base">2. Mutual Consent Vault</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Private contact details are unlocked only after both members explicitly accept a connection request. No unilateral sharing or third-party extraction.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
              <Sliders className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-slate-900 text-base">3. Granular Channel Control</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              You choose what you share. Share only WhatsApp, or only professional email, or designate your preferred platform for coffee chats and mentorship.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-slate-900 text-base">4. Instant Revocation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Disconnect at any moment with a single click. Once severed, access to mutual phone numbers, private notes, and direct contact details is revoked immediately.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Step-by-Step Connection Lifecycle Diagram */}
      <div className="bg-gradient-to-br from-slate-50 to-indigo-50/40 rounded-2xl border border-indigo-100 p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-700 mb-1">
              <Share2 className="w-3.5 h-3.5" />
              Interactive Workflow
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-display">
              How Users Connect & Safely Share Private Information
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              A 4-stage secure handshake that safeguards both parties throughout the connection process.
            </p>
          </div>

          <button
            onClick={() => navigate('/directory')}
            className="self-start md:self-auto px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-indigo-600 border border-indigo-200 text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-colors"
          >
            Try in Directory
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {/* Step 1 */}
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2 relative">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
              1
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Discover & Verify</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Find an alumnus by company, domain, or skills. Verified badges guarantee institutional convocation status while contact info is masked.
            </p>
            <div className="pt-2 text-[11px] font-medium text-slate-400 flex items-center gap-1">
              <EyeOff className="w-3 h-3 text-amber-500" />
              Phone & email masked
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2 relative">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
              2
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Propose Connection</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Send a request with a customized introductory note. Choose whether your phone or email will be shared upon their acceptance.
            </p>
            <div className="pt-2 text-[11px] font-medium text-slate-400 flex items-center gap-1">
              <Lock className="w-3 h-3 text-indigo-500" />
              Locked until approved
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2 relative">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
              3
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Mutual Acceptance</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Recipient reviews your profile. When accepted, both parties unlock the bilateral Mutual Private Vault.
            </p>
            <div className="pt-2 text-[11px] font-medium text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Mutual Consent Granted
            </div>
          </div>

          {/* Step 4 */}
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2 relative">
            <div className="w-7 h-7 rounded-lg bg-purple-600 text-white font-bold text-xs flex items-center justify-center">
              4
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Direct Collaboration</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Access verified direct phone numbers, WhatsApp, personal email, and exchange private notes within the secure connection thread.
            </p>
            <div className="pt-2 text-[11px] font-medium text-purple-600 flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              Private Notes & WhatsApp
            </div>
          </div>
        </div>
      </div>

      {/* Data Classification Matrix */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-display">
            Data Classification & Exposure Matrix
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Clear delineation of what is visible publicly, what is restricted to mutual connections, and what remains confidential.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider">
                  <th className="py-3.5 px-5">Data Classification</th>
                  <th className="py-3.5 px-5">Information Included</th>
                  <th className="py-3.5 px-5">Access Tier</th>
                  <th className="py-3.5 px-5">Protection Rationale</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dataMatrix.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-5 font-semibold text-slate-900 flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-slate-100 text-slate-700">
                          <Icon className="w-4 h-4" />
                        </div>
                        {item.category}
                      </td>
                      <td className="py-4 px-5 text-slate-600">
                        <div className="flex flex-wrap gap-1.5">
                          {item.fields.map((f, fIdx) => (
                            <span
                              key={fIdx}
                              className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[11px]"
                            >
                              {f}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border ${item.badgeClass}`}
                        >
                          {item.visibility}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-slate-500 leading-relaxed max-w-xs">
                        {item.description}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-display">
            Privacy & Information Sharing FAQ
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Common questions regarding personal contact details, spam prevention, and connection security.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div
                key={index}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm transition-colors"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full py-4 px-6 text-left flex items-center justify-between gap-4 font-semibold text-slate-900 text-sm hover:bg-slate-50 transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                    {faq.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-6 pb-4 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Access Card */}
      <div className="rounded-2xl bg-indigo-50 border border-indigo-100 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-lg font-bold text-indigo-950 font-display">
            Ready to review your personal sharing controls?
          </h3>
          <p className="text-xs text-indigo-700">
            Check your current connections, manage your shared phone and email, or browse the verified alumni directory.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/connections')}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all"
          >
            Manage Connections
          </button>
          <button
            onClick={() => navigate('/directory')}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-indigo-200 text-xs font-semibold shadow-sm transition-all"
          >
            Find Alumni
          </button>
        </div>
      </div>
    </div>
  );
};
