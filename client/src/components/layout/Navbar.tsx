import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { AppNotification } from '../../types/index.ts';
import {
  GraduationCap,
  Users,
  Briefcase,
  Calendar,
  Award,
  Bell,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  Compass,
  Link as LinkIcon,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, navigate }) => {
  const { user, alumni, student, logout, setVivaModalOpen } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (user) {
      api.getNotifications()
        .then((res) => {
          if (res.success) setNotifications(res.notifications);
        })
        .catch(() => {});
    }
  }, [user, currentPath]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markRead = async (id: string, link?: string) => {
    await api.markNotificationRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    if (link) {
      navigate(link);
      setShowNotifMenu(false);
    }
  };

  const navLinks = [
    { label: 'Overview', path: '/' },
    { label: 'Dashboard', path: '/dashboard', authRequired: true },
    { label: 'Directory', path: '/directory' },
    { label: 'Mentorship', path: '/mentorship' },
    { label: 'Opportunities', path: '/jobs' },
    { label: 'Events', path: '/events' },
    { label: 'Achievements', path: '/achievements' },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-9 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-3 group text-left"
            >
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-xl text-white shadow-sm transition-transform group-hover:scale-105">
                A
              </div>
              <div>
                <span className="font-bold text-slate-900 text-lg tracking-tight block leading-tight font-display">
                  SIT Connect
                </span>
                <span className="text-[10px] text-slate-500 font-medium tracking-wide uppercase block">
                  Alumni & Career Portal
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navLinks.map((link) => {
              if (link.authRequired && !user) return null;
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}

            {user?.role === 'ADMIN' && (
              <button
                onClick={() => navigate('/admin')}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                  currentPath.startsWith('/admin')
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-purple-700 hover:bg-purple-50'
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-purple-400" />
                <span>Admin Suite</span>
              </button>
            )}
          </nav>

          {/* Right Action Area */}
          <div className="flex items-center gap-3">
            {/* Activation CTA if Student is Eligible & Not Activated */}
            {user?.role === 'STUDENT' && student?.graduationStatus === 'COMPLETE' && !student?.isAlumniActivated && (
              <button
                id="navbar-activate-btn"
                onClick={() => navigate('/activate')}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-transform active:scale-95 animate-pulse"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Activate Alumni ID</span>
              </button>
            )}

            {/* Notifications Dropdown */}
            {user && (
              <div className="relative">
                <button
                  id="notifications-bell-btn"
                  onClick={() => {
                    setShowNotifMenu(!showNotifMenu);
                    setShowUserMenu(false);
                  }}
                  className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 relative transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifMenu && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                      <span className="font-semibold text-sm text-slate-900">Notifications</span>
                      <span className="text-xs text-slate-500">{unreadCount} unread</span>
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-xs text-slate-400">
                          No notifications yet.
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => markRead(notif.id, notif.link)}
                            className={`p-3.5 hover:bg-slate-50 cursor-pointer transition-colors text-left flex gap-3 ${
                              !notif.read ? 'bg-indigo-50/40' : ''
                            }`}
                          >
                            <div className="mt-0.5">
                              {!notif.read ? (
                                <div className="w-2 h-2 rounded-full bg-indigo-600 mt-1.5"></div>
                              ) : (
                                <CheckCircle2 className="w-4 h-4 text-slate-300" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-slate-900 leading-tight">
                                {notif.title}
                              </p>
                              <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">
                                {notif.message}
                              </p>
                              <span className="text-[10px] text-slate-400 mt-1 block">
                                {new Date(notif.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Account / Profile Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  id="user-profile-menu-btn"
                  onClick={() => {
                    setShowUserMenu(!showUserMenu);
                    setShowNotifMenu(false);
                  }}
                  className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-slate-200 transition-all"
                >
                  <img
                    src={
                      user.avatarUrl ||
                      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80'
                    }
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-300"
                  />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100 text-left">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-sm font-bold text-slate-900 leading-tight">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      <div className="mt-1.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 uppercase">
                          Role: {user.role}
                        </span>
                      </div>
                    </div>

                    <div className="py-1">
                      {user.role === 'ALUMNI' && (
                        <button
                          onClick={() => {
                            navigate('/profile');
                            setShowUserMenu(false);
                          }}
                          className="w-full px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <UserIcon className="w-4 h-4 text-slate-400" />
                          <span>My Alumni Profile</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          navigate('/connections');
                          setShowUserMenu(false);
                        }}
                        className="w-full px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <LinkIcon className="w-4 h-4 text-slate-400" />
                        <span>My Network & Connections</span>
                      </button>

                      <button
                        onClick={() => {
                          navigate('/privacy');
                          setShowUserMenu(false);
                        }}
                        className="w-full px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Privacy & Safe Sharing Policy</span>
                      </button>

                      {user.role === 'ADMIN' && (
                        <button
                          onClick={() => {
                            navigate('/admin');
                            setShowUserMenu(false);
                          }}
                          className="w-full px-4 py-2 text-xs text-purple-800 font-semibold hover:bg-purple-50 flex items-center gap-2"
                        >
                          <ShieldAlert className="w-4 h-4 text-purple-600" />
                          <span>Admin Control Center</span>
                        </button>
                      )}
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                          navigate('/login');
                        }}
                        className="w-full px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/login')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/activate')}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors"
                >
                  Activate Alumni
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            if (link.authRequired && !user) return null;
            return (
              <button
                key={link.path}
                onClick={() => {
                  navigate(link.path);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                  currentPath === link.path ? 'bg-indigo-50 text-indigo-900 font-bold' : 'text-slate-700'
                }`}
              >
                {link.label}
              </button>
            );
          })}
          {user?.role === 'ADMIN' && (
            <button
              onClick={() => {
                navigate('/admin');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-md text-sm font-bold text-purple-700 bg-purple-50"
            >
              Admin Dashboard
            </button>
          )}
          <button
            onClick={() => {
              navigate('/privacy');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            Privacy & Safe Sharing Policy
          </button>
        </div>
      )}
    </header>
  );
};
