import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import { CollegeEvent } from '../types/index.ts';
import { useToast } from '../context/ToastContext.tsx';
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Video,
  Plus,
  X,
  CheckCircle2,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface EventsPageProps {
  navigate: (path: string) => void;
}

export const EventsPage: React.FC<EventsPageProps> = ({ navigate }) => {
  const { user } = useAuth();
  const { success, error, info } = useToast();
  const shouldReduceMotion = useReducedMotion();

  const [events, setEvents] = useState<CollegeEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Modal for new event
  const [isModalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('REUNION');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('2027-11-20');
  const [time, setTime] = useState('06:00 PM IST');
  const [location, setLocation] = useState('College Main Auditorium');
  const [isVirtual, setIsVirtual] = useState(false);
  const [meetingLink, setMeetingLink] = useState('');
  const [organizer, setOrganizer] = useState('Office of Alumni Affairs');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const res = await api.getEvents();
      if (res.success) setEvents(res.events);
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleRegister = async (eventId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const res = await api.registerForEvent(eventId);
      if (res.success) {
        success('RSVP Confirmed!', 'Your seat has been reserved. See you there!');
        setEvents((prev) =>
          prev.map((e) => (e.id === eventId ? res.event : e))
        );
      }
    } catch (err: any) {
      error('RSVP Failed', err.message);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const res = await api.createEvent({
        title,
        category,
        description,
        date,
        time,
        location,
        isVirtual,
        meetingLink: isVirtual ? meetingLink : undefined,
        organizer,
      });
      if (res.success) {
        setModalOpen(false);
        success('Event Created', 'The event is now published in the portal.');
        fetchEvents();
      }
    } catch (err: any) {
      error('Creation Failed', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredEvents = events.filter(
    (evt) => categoryFilter === 'ALL' || evt.category === categoryFilter
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
              Alumni Events & Reunions
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700">
              {events.length} Upcoming
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Annual alumni reunions, technical webinars, convocation banquets, and networking mixers.
          </p>
        </div>

        {user && (user.role === 'ADMIN' || user.role === 'ALUMNI') && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            id="open-create-event-btn"
            onClick={() => setModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm flex items-center gap-2 transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Host / Create Event</span>
          </motion.button>
        )}
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto text-xs">
        {['ALL', 'REUNION', 'TECH_TALK', 'CONVOCATION', 'WORKSHOP', 'CAREER_FAIR', 'NETWORKING'].map(
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
              {cat.replace('_', ' ')}
            </button>
          )
        )}
      </div>

      {/* Events Grid */}
      {isLoading ? (
        <div className="py-20 text-center text-xs text-slate-400">Loading events...</div>
      ) : filteredEvents.length === 0 ? (
        <div className="py-16 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
          <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">No Events in this Category</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Check back soon for new announcements from the Alumni Cell.
          </p>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredEvents.map((evt) => (
            <motion.div
              variants={itemVariants}
              whileHover={shouldReduceMotion ? {} : { y: -3, transition: { duration: 0.15 } }}
              key={evt.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md">
                    {evt.category.replace('_', ' ')}
                  </span>
                  {evt.isVirtual ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                      <Video className="w-3 h-3" /> Virtual
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-500">On Campus</span>
                  )}
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 font-display">
                    {evt.title}
                  </h3>
                  <p className="text-xs font-semibold text-indigo-600 flex items-center gap-1 mt-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{evt.date} • {evt.time}</span>
                  </p>
                  <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{evt.location}</span>
                  </p>
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {evt.description}
                </p>

                <div className="text-[11px] text-slate-400">
                  Organizer: <strong>{evt.organizer}</strong>
                </div>
              </div>

              {/* RSVP Action */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span>{evt.registrationCount} Registered</span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  id={`rsvp-btn-${evt.id}`}
                  onClick={() => handleRegister(evt.id)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors"
                >
                  Confirm RSVP
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Host Event Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95, y: shouldReduceMotion ? 0 : 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95, y: shouldReduceMotion ? 0 : 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-slate-900 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-sm text-slate-900">Host / Schedule Alumni Event</h3>
                </div>
                <button onClick={() => setModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateEvent} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Event Title *</label>
                  <input
                    id="event-title-input"
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Annual Alumni Convocation Dinner 2027"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Category</label>
                    <select
                      id="event-category-select"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                    >
                      <option value="REUNION">Reunion</option>
                      <option value="TECH_TALK">Tech Talk</option>
                      <option value="CONVOCATION">Convocation</option>
                      <option value="WORKSHOP">Workshop</option>
                      <option value="CAREER_FAIR">Career Fair</option>
                      <option value="NETWORKING">Networking</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Date *</label>
                    <input
                      id="event-date-input"
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Time *</label>
                    <input
                      id="event-time-input"
                      type="text"
                      required
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      placeholder="e.g. 05:00 PM IST"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Location *</label>
                    <input
                      id="event-location-input"
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Main Auditorium / Zoom"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Description *</label>
                  <textarea
                    id="event-desc-input"
                    rows={3}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Outline the agenda, keynote speakers, and dress code..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    id="event-virtual-toggle"
                    type="checkbox"
                    checked={isVirtual}
                    onChange={(e) => setIsVirtual(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                  />
                  <label htmlFor="event-virtual-toggle" className="font-semibold text-slate-700 cursor-pointer">
                    Is this a Virtual / Hybrid Webinar?
                  </label>
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
                    id="submit-create-event-btn"
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                  >
                    {isSubmitting ? 'Publishing...' : 'Publish Event'}
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

