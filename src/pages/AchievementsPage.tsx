import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import { Achievement } from '../types/index.ts';
import { VerificationBadge } from '../components/ui/VerificationBadge.tsx';
import { useToast } from '../context/ToastContext.tsx';
import {
  Award,
  Sparkles,
  Plus,
  X,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Building2,
  Users,
} from 'lucide-react';

interface AchievementsPageProps {
  navigate: (path: string) => void;
}

export const AchievementsPage: React.FC<AchievementsPageProps> = ({ navigate }) => {
  const { user, alumni } = useAuth();
  const { success, error, info } = useToast();
  const shouldReduceMotion = useReducedMotion();

  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Modal
  const [isModalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('CAREER');
  const [description, setDescription] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [proofUrl, setProofUrl] = useState('https://news.ycombinator.com');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAchievements = async () => {
    try {
      setIsLoading(true);
      const res = await api.getAchievements();
      if (res.success) setAchievements(res.achievements);
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const handleCreateAchievement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alumni) {
      error('Alumni Only', 'You must have an active alumni profile to submit an achievement.');
      return;
    }
    try {
      setIsSubmitting(true);
      const res = await api.createAchievement({
        title,
        category,
        description,
        year: Number(year),
        proofUrl,
      });
      if (res.success) {
        setModalOpen(false);
        info(
          'Submitted for Verification',
          'Your achievement is in the verification queue for Dean review.'
        );
        fetchAchievements();
      }
    } catch (err: any) {
      error('Submission Failed', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = achievements.filter(
    (ach) => categoryFilter === 'ALL' || ach.category === categoryFilter
  );

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
              Alumni Hall of Fame & Achievements
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800">
              {achievements.length} Verified Milestones
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Celebrating alumni innovations, startup founding rounds, research papers, and national awards.
          </p>
        </div>

        {user && user.role === 'ALUMNI' && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            id="open-submit-achievement-btn"
            onClick={() => setModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm flex items-center gap-2 transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Submit Achievement for Verification</span>
          </motion.button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto text-xs">
        {['ALL', 'CAREER', 'ACADEMIC', 'ENTREPRENEURSHIP', 'RESEARCH', 'COMMUNITY', 'AWARDS'].map(
          (cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-2 rounded-xl font-semibold transition-colors shrink-0 ${
                categoryFilter === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          )
        )}
      </div>

      {/* Achievements Grid */}
      {isLoading ? (
        <div className="py-20 text-center text-xs text-slate-400">Loading hall of fame...</div>
      ) : filtered.length === 0 ? (
        <div className="py-16 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
          <Award className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">No Achievements Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Explore other categories or submit your own milestone if you are an alumni.
          </p>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filtered.map((ach) => (
            <motion.div
              variants={itemVariants}
              whileHover={shouldReduceMotion ? {} : { y: -3, transition: { duration: 0.15 } }}
              key={ach.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-amber-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                    {ach.category} • {ach.year}
                  </span>
                  <VerificationBadge status={ach.status} size="sm" />
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 font-display">
                    {ach.title}
                  </h3>
                  <p className="text-xs font-semibold text-indigo-600 mt-1">
                    Honoree: {ach.alumniName} ({ach.alumniEnrollment})
                  </p>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {ach.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">
                  Verified by Alumni Cell Dean
                </span>

                {ach.proofUrl && (
                  <a
                    href={ach.proofUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                  >
                    <span>News / Proof</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Submit Achievement Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95, y: shouldReduceMotion ? 0 : 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95, y: shouldReduceMotion ? 0 : 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-slate-900"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-600" />
                  <h3 className="font-bold text-sm text-slate-900">
                    Submit Achievement for Verification
                  </h3>
                </div>
                <button onClick={() => setModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateAchievement} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Achievement Title *</label>
                  <input
                    id="ach-title-input"
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Raised $5M Seed Round for AI Startup"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Category</label>
                    <select
                      id="ach-category-select"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                    >
                      <option value="CAREER">Career Milestone</option>
                      <option value="ACADEMIC">Academic / Higher Studies</option>
                      <option value="ENTREPRENEURSHIP">Entrepreneurship / Startup</option>
                      <option value="RESEARCH">Research Paper / Patent</option>
                      <option value="COMMUNITY">Community Leadership</option>
                      <option value="AWARDS">National Award</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Year of Occurrence</label>
                    <input
                      id="ach-year-input"
                      type="number"
                      required
                      value={year}
                      onChange={(e) => setYear(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Description *</label>
                  <textarea
                    id="ach-desc-input"
                    rows={3}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the achievement, significance, and institution/organization involved..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Proof / News URL (Optional)</label>
                  <input
                    id="ach-proof-input"
                    type="url"
                    value={proofUrl}
                    onChange={(e) => setProofUrl(e.target.value)}
                    placeholder="e.g. Press release, TechCrunch link, or IEEE publication URL"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div className="flex gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    id="submit-create-ach-btn"
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit for Review'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

