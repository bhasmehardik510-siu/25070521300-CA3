import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import { AlumniProfile } from '../types/index.ts';
import { VerificationBadge } from '../components/ui/VerificationBadge.tsx';
import {
  Users,
  Search,
  Filter,
  Building2,
  MapPin,
  GraduationCap,
  HeartHandshake,
  ArrowRight,
  Sparkles,
  RotateCcw,
  Briefcase,
  ExternalLink,
  Phone,
  Mail,
  Globe,
  Linkedin,
  Github,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react';

interface DirectoryPageProps {
  navigate: (path: string) => void;
}

export const DirectoryPage: React.FC<DirectoryPageProps> = ({ navigate }) => {
  const { user } = useAuth();
  const [alumniList, setAlumniList] = useState<AlumniProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const shouldReduceMotion = useReducedMotion();

  // Contact details visibility toggle: ON / OFF
  const [showContactDetails, setShowContactDetails] = useState<boolean>(true);

  // Filters
  const [query, setQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('ALL');
  const [selectedYear, setSelectedYear] = useState('ALL');
  const [selectedCompany, setSelectedCompany] = useState('ALL');
  const [mentorshipOnly, setMentorshipOnly] = useState(false);

  // Helper mask functions
  const maskPhone = (phone?: string) => {
    if (!phone) return '+91 ••••• •••••';
    return phone.replace(/(\+?[0-9]{1,3}\s?)([0-9]{3,})([0-9]{2})$/, (_m, p1, _p2, p3) => `${p1}••••• ••${p3}`);
  };

  const maskEmail = (email?: string) => {
    if (!email) return '••••••@college.edu';
    return email.replace(/^(.{2})(.*)(@.*)$/, '$1••••••$3');
  };

  const fetchAlumni = async () => {
    try {
      setIsLoading(true);
      const res = await api.getAlumni({
        q: query,
        branch: selectedBranch,
        graduationYear: selectedYear,
        company: selectedCompany,
        mentorshipOnly,
      });
      if (res.success) {
        setAlumniList(res.alumni);
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchAlumni();
    }, 200);
    return () => clearTimeout(timeout);
  }, [query, selectedBranch, selectedYear, selectedCompany, mentorshipOnly]);

  const resetFilters = () => {
    setQuery('');
    setSelectedBranch('ALL');
    setSelectedYear('ALL');
    setSelectedCompany('ALL');
    setMentorshipOnly(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 font-display">
              Alumni Directory
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700">
              {alumniList.length} Verified Profiles
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Search verified graduates across batches, companies, and specialization domains.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {user?.role === 'STUDENT' && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/activate')}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-sm hover:bg-emerald-700 transition-colors"
            >
              Activate Your Alumni Profile
            </motion.button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Keyword Search */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="directory-search-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, skill, role, or company..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Branch Filter */}
          <div>
            <select
              id="directory-branch-filter"
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
            >
              <option value="ALL">All Branches</option>
              <option value="Computer Science and Engineering">Computer Science & Engg</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Electronics and Communication">Electronics & Comm</option>
              <option value="Mechanical Engineering">Mechanical Engg</option>
              <option value="Electrical Engineering">Electrical Engg</option>
            </select>
          </div>

          {/* Graduation Year */}
          <div>
            <select
              id="directory-year-filter"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
            >
              <option value="ALL">All Graduation Years</option>
              <option value="2027">Class of 2027</option>
              <option value="2024">Class of 2024</option>
              <option value="2023">Class of 2023</option>
              <option value="2022">Class of 2022</option>
              <option value="2021">Class of 2021</option>
              <option value="2020">Class of 2020</option>
              <option value="2019">Class of 2019</option>
            </select>
          </div>

          {/* Company Filter */}
          <div>
            <select
              id="directory-company-filter"
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
            >
              <option value="ALL">All Organizations</option>
              <option value="Google">Google</option>
              <option value="Microsoft">Microsoft</option>
              <option value="Adobe">Adobe</option>
              <option value="Amazon AWS">Amazon AWS</option>
              <option value="ISRO">ISRO</option>
              <option value="Tesla">Tesla</option>
              <option value="NVIDIA">NVIDIA</option>
              <option value="Stanford University">Stanford University</option>
            </select>
          </div>
        </div>

        {/* Secondary options & Clear button */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
            <input
              id="directory-mentorship-filter"
              type="checkbox"
              checked={mentorshipOnly}
              onChange={(e) => setMentorshipOnly(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
            />
            <HeartHandshake className="w-4 h-4 text-emerald-600" />
            <span>Show Only Mentors Available for 1-on-1 Guidance</span>
          </label>

          <div className="flex items-center gap-2">
            {/* ON / OFF Contact Visibility Toggle */}
            <button
              type="button"
              id="directory-contact-visibility-toggle"
              onClick={() => setShowContactDetails(!showContactDetails)}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all border shadow-2xs ${
                showContactDetails
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
              }`}
              title="Toggle contact visibility ON or OFF"
            >
              {showContactDetails ? (
                <>
                  <Eye className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Visibility: <strong>ON</strong></span>
                </>
              ) : (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-amber-700" />
                  <span>Visibility: <strong>OFF</strong></span>
                </>
              )}
            </button>

            <button
              onClick={resetFilters}
              className="text-slate-500 hover:text-slate-900 flex items-center gap-1 font-medium px-2 py-1 rounded-lg hover:bg-slate-100"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Alumni Cards */}
      {isLoading ? (
        <div className="py-20 text-center text-xs text-slate-400">Loading verified alumni profiles...</div>
      ) : alumniList.length === 0 ? (
        <div className="py-16 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
          <Users className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">No Alumni Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try loosening your search query or reset the branch and company filters.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {alumniList.map((alm) => (
            <motion.div
              variants={itemVariants}
              whileHover={shouldReduceMotion ? {} : { y: -3, transition: { duration: 0.15 } }}
              key={alm.id}
              onClick={() => navigate(`/alumni/${alm.id}`)}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer flex flex-col justify-between group space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <img
                    src={alm.avatarUrl}
                    alt={alm.name}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-slate-100 group-hover:ring-indigo-300 transition-all"
                  />
                  <VerificationBadge status={alm.verificationStatus} size="sm" />
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors font-display">
                    {alm.name}
                  </h3>
                  <p className="text-xs font-semibold text-slate-800 mt-0.5">
                    {alm.jobRole}
                  </p>
                  <p className="text-xs text-indigo-600 font-medium flex items-center gap-1 mt-0.5">
                    <Building2 className="w-3.5 h-3.5 shrink-0" />
                    <span>{alm.currentCompany}</span>
                  </p>
                </div>

                {alm.higherStudies && (
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-[11px] text-slate-700">
                    <span className="font-semibold text-indigo-900 block text-[10px] uppercase tracking-wider">
                      Academic Milestone
                    </span>
                    {alm.higherStudies}
                  </div>
                )}

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {alm.skills.slice(0, 3).map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                  {alm.skills.length > 3 && (
                    <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-400 text-[10px]">
                      +{alm.skills.length - 3}
                    </span>
                  )}
                </div>

                {/* Direct Contact & Portfolio Strip */}
                <div 
                  onClick={(e) => e.stopPropagation()} 
                  className="pt-2 border-t border-slate-100/80 space-y-1.5 text-[11px]"
                >
                  <div className="flex items-center justify-between text-slate-700">
                    {showContactDetails ? (
                      <a
                        href={`tel:${alm.phone || '+919845012345'}`}
                        className="hover:text-emerald-600 flex items-center gap-1 font-mono font-medium truncate"
                        title="Call Phone Number"
                      >
                        <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="truncate">{alm.phone || '+91 98450 12345'}</span>
                      </a>
                    ) : (
                      <span
                        onClick={() => setShowContactDetails(true)}
                        className="text-slate-400 flex items-center gap-1 font-mono cursor-pointer hover:text-slate-600 truncate"
                        title="Click to reveal details"
                      >
                        <Lock className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                        <span className="truncate">{maskPhone(alm.phone)}</span>
                      </span>
                    )}

                    {showContactDetails ? (
                      <a
                        href={`mailto:${alm.personalEmail || alm.collegeEmail}`}
                        className="hover:text-indigo-600 flex items-center gap-1 truncate ml-2 text-slate-600"
                        title="Send Email"
                      >
                        <Mail className="w-3 h-3 text-indigo-500 shrink-0" />
                        <span className="truncate max-w-[120px]">{alm.personalEmail || alm.collegeEmail}</span>
                      </a>
                    ) : (
                      <span
                        onClick={() => setShowContactDetails(true)}
                        className="text-slate-400 flex items-center gap-1 font-mono cursor-pointer hover:text-slate-600 truncate ml-2"
                        title="Click to reveal details"
                      >
                        <Lock className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[100px]">{maskEmail(alm.personalEmail || alm.collegeEmail)}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-0.5">
                    {alm.websiteUrl && (
                      <a
                        href={alm.websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-50 hover:bg-purple-100 text-purple-700 text-[10px] font-semibold border border-purple-200 transition-colors"
                      >
                        <Globe className="w-2.5 h-2.5 text-purple-600" />
                        <span>Portfolio</span>
                        <ExternalLink className="w-2 h-2" />
                      </a>
                    )}
                    {alm.linkedinUrl && (
                      <a
                        href={alm.linkedinUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 text-[10px] font-semibold border border-blue-200 transition-colors"
                      >
                        <Linkedin className="w-2.5 h-2.5 text-blue-600" />
                        <span>LinkedIn</span>
                      </a>
                    )}
                    {alm.githubUrl && (
                      <a
                        href={alm.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-semibold transition-colors"
                      >
                        <Github className="w-2.5 h-2.5" />
                        <span>GitHub</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <div className="text-slate-500">
                  <span>{alm.branch.split(' ')[0]}</span> • <span>Class of {alm.graduationYear}</span>
                </div>

                {alm.isAvailableForMentorship ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <HeartHandshake className="w-3 h-3" />
                    Mentor
                  </span>
                ) : (
                  <span className="text-indigo-600 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                    Profile <ArrowRight className="w-3 h-3" />
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

