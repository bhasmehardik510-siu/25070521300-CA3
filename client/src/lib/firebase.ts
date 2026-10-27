import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const fallbackConfig = {
  apiKey: "demo-api-key",
  authDomain: "alumni-portal.firebaseapp.com",
  projectId: "alumni-portal",
  storageBucket: "alumni-portal.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

const app = getApps().length === 0 ? initializeApp(fallbackConfig) : getApps()[0];
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();
