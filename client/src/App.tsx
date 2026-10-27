import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { ToastProvider } from './context/ToastContext.tsx';
import { Navbar } from './components/layout/Navbar.tsx';
import { Footer } from './components/layout/Footer.tsx';
import { DemoSwitcherBanner } from './components/layout/DemoSwitcherBanner.tsx';
import { VivaArchitectureModal } from './components/viva/VivaArchitectureModal.tsx';

// Pages
import { LandingPage } from './pages/LandingPage.tsx';
import { LoginPage } from './pages/LoginPage.tsx';
import { ActivatePage } from './pages/ActivatePage.tsx';
import { DashboardPage } from './pages/DashboardPage.tsx';
import { DirectoryPage } from './pages/DirectoryPage.tsx';
import { AlumniProfilePage } from './pages/AlumniProfilePage.tsx';
import { MyProfilePage } from './pages/MyProfilePage.tsx';
import { ConnectionsPage } from './pages/ConnectionsPage.tsx';
import { MentorshipPage } from './pages/MentorshipPage.tsx';
import { JobsPage } from './pages/JobsPage.tsx';
import { EventsPage } from './pages/EventsPage.tsx';
import { AchievementsPage } from './pages/AchievementsPage.tsx';
import { PrivacyPage } from './pages/PrivacyPage.tsx';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage.tsx';
import { AdminVerificationsPage } from './pages/admin/AdminVerificationsPage.tsx';
import { AdminAlumniPage } from './pages/admin/AdminAlumniPage.tsx';
import { AdminJobsPage } from './pages/admin/AdminJobsPage.tsx';
import { AdminAchievementsPage } from './pages/admin/AdminAchievementsPage.tsx';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  // Sync route with browser history
  const navigate = (path: string) => {
    setCurrentPath(path);
    window.history.pushState({}, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const renderRoute = () => {
    // Dynamic Route: /alumni/:id
    if (currentPath.startsWith('/alumni/')) {
      const alumniId = currentPath.split('/')[2];
      return <AlumniProfilePage alumniId={alumniId} navigate={navigate} />;
    }

    switch (currentPath) {
      case '/':
        return <LandingPage navigate={navigate} />;
      case '/login':
        return <LoginPage navigate={navigate} />;
      case '/activate':
        return <ActivatePage navigate={navigate} />;
      case '/dashboard':
        return <DashboardPage navigate={navigate} />;
      case '/directory':
        return <DirectoryPage navigate={navigate} />;
      case '/profile':
        return <MyProfilePage navigate={navigate} />;
      case '/connections':
        return <ConnectionsPage navigate={navigate} />;
      case '/mentorship':
        return <MentorshipPage navigate={navigate} />;
      case '/jobs':
        return <JobsPage navigate={navigate} />;
      case '/events':
        return <EventsPage navigate={navigate} />;
      case '/achievements':
        return <AchievementsPage navigate={navigate} />;
      case '/privacy':
        return <PrivacyPage navigate={navigate} />;
      case '/admin':
        return <AdminDashboardPage navigate={navigate} />;
      case '/admin/verifications':
        return <AdminVerificationsPage navigate={navigate} />;
      case '/admin/students':
        return <AdminAlumniPage navigate={navigate} />;
      case '/admin/jobs':
        return <AdminJobsPage navigate={navigate} />;
      case '/admin/achievements':
        return <AdminAchievementsPage navigate={navigate} />;
      default:
        return <LandingPage navigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Demo Switcher Banner with Viva helper */}
      <DemoSwitcherBanner navigate={navigate} />

      {/* Main Institution Header */}
      <Navbar currentPath={currentPath} navigate={navigate} />

      {/* Dynamic View Area with smooth page transition */}
      <main className="flex-1 w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPath.split('/')[1] || 'root'}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="w-full h-full"
          >
            {renderRoute()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Institutional Footer */}
      <Footer navigate={navigate} />

      {/* Viva Technical Architecture Guide Modal */}
      <VivaArchitectureModal />
    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ToastProvider>
  );
}
