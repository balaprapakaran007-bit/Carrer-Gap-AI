import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCHdujd6mg__RBGz8g3HMqO3teulE2keZA",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "careergap-ai.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "careergap-ai",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "careergap-ai.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "36703100614",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:36703100614:web:a5026c348f488bd1da01c7",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-W4BNQRYY1Y"
};

// Initialize Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Firebase Services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics if supported in environment
export const initAnalytics = async () => {
  if (typeof window !== 'undefined' && await isSupported()) {
    return getAnalytics(app);
  }
  return null;
};
initAnalytics();

// Firestore Helper Functions for database persistence
export const firestoreService = {
  async saveUser(user: { uid: string; name: string; email: string; photoURL?: string }) {
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        ...user,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.warn('Firestore user save notice:', err);
    }
  },

  async saveAnalysis(analysis: any) {
    try {
      const analysisRef = doc(db, 'analyses', analysis.id);
      await setDoc(analysisRef, {
        ...analysis,
        savedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.warn('Firestore analysis save notice:', err);
    }
  },

  async getAnalysis(id: string) {
    try {
      const analysisRef = doc(db, 'analyses', id);
      const snap = await getDoc(analysisRef);
      if (snap.exists()) {
        return snap.data();
      }
    } catch (err) {
      console.warn('Firestore analysis fetch notice:', err);
    }
    return null;
  }
};
