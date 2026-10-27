import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Student, AlumniProfile } from '../types/index.ts';
import { api } from '../services/api.ts';
import { useToast } from './ToastContext.tsx';
import { auth, googleAuthProvider } from '../lib/firebase.ts';
import { signInWithPopup } from 'firebase/auth';

export type DemoPersona = 'ADMIN' | 'ELIGIBLE_STUDENT' | 'INELIGIBLE_STUDENT' | 'VERIFIED_ALUMNI';

interface AuthContextType {
  user: User | null;
  student: Student | null;
  alumni: AlumniProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  signInWithGoogle: () => Promise<boolean>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  switchQuickDemoUser: (persona: DemoPersona) => Promise<void>;
  isVivaModalOpen: boolean;
  setVivaModalOpen: (open: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [alumni, setAlumni] = useState<AlumniProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isVivaModalOpen, setVivaModalOpen] = useState<boolean>(false);
  const { success, error, info } = useToast();

  const refreshProfile = useCallback(async () => {
    try {
      if (!api.getToken()) {
        setUser(null);
        setStudent(null);
        setAlumni(null);
        setIsLoading(false);
        return;
      }
      const data = await api.getMe();
      if (data.success) {
        setUser(data.user);
        setStudent(data.student || null);
        setAlumni(data.alumni || null);
      }
    } catch {
      api.setToken(null);
      setUser(null);
      setStudent(null);
      setAlumni(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // If no token on initial load, auto-login as Admin or prompt user
    const savedToken = api.getToken();
    if (savedToken) {
      refreshProfile();
    } else {
      // Default to Eligible Student (Rahul) or Admin for quick test preview
      api.login('rahul.sharma@college.edu', 'student123').then((res) => {
        if (res.success) {
          setUser(res.user);
          setStudent(res.student || null);
          setAlumni(res.alumni || null);
        }
        setIsLoading(false);
      }).catch(() => {
        setIsLoading(false);
      });
    }
  }, [refreshProfile]);

  const login = async (email: string, pass: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const res = await api.login(email, pass);
      if (res.success) {
        setUser(res.user);
        setStudent(res.student || null);
        setAlumni(res.alumni || null);
        success('Logged In Successfully', `Welcome back, ${res.user.name}`);
        return true;
      }
      return false;
    } catch (err: any) {
      error('Login Failed', err.message || 'Invalid credentials.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      const result = await signInWithPopup(auth, googleAuthProvider);
      const idToken = await result.user.getIdToken();
      api.setToken(idToken);
      const data = await api.getMe();
      if (data.success) {
        setUser(data.user);
        setStudent(data.student || null);
        setAlumni(data.alumni || null);
        success('Signed in with Google', `Welcome, ${data.user.name}`);
        return true;
      }
      return false;
    } catch (err: any) {
      error('Google Sign-In Failed', err.message || 'Could not authenticate with Google.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
    setStudent(null);
    setAlumni(null);
    info('Logged Out', 'You have been signed out from the portal.');
  };

  const switchQuickDemoUser = async (persona: DemoPersona) => {
    let email = '';
    let pass = '';

    switch (persona) {
      case 'ADMIN':
        email = 'admin@alumni.edu';
        pass = 'admin123';
        break;
      case 'ELIGIBLE_STUDENT':
        email = 'rahul.sharma@college.edu';
        pass = 'student123';
        break;
      case 'INELIGIBLE_STUDENT':
        email = 'priya.verma@college.edu';
        pass = 'student123';
        break;
      case 'VERIFIED_ALUMNI':
        email = 'vikram.rao.alumni@college.edu';
        pass = 'alumni123';
        break;
    }

    try {
      setIsLoading(true);
      const res = await api.login(email, pass);
      if (res.success) {
        setUser(res.user);
        setStudent(res.student || null);
        setAlumni(res.alumni || null);
        success(
          `Switched to ${persona.replace('_', ' ')}`,
          `Simulating as ${res.user.name} (${res.user.role})`
        );
      }
    } catch (err: any) {
      error('Switch Failed', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        student,
        alumni,
        isAuthenticated: !!user,
        isLoading,
        login,
        signInWithGoogle,
        logout,
        refreshProfile,
        switchQuickDemoUser,
        isVivaModalOpen,
        setVivaModalOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
