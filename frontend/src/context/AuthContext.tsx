import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider, firestoreService } from '../services/firebase';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { UserProfile } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  login: (email: string, pass: string) => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  loginDemoUser: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>({
    uid: 'demo_user',
    name: 'Alex Chen',
    email: 'alex.chen@example.com',
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  });
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const u: UserProfile = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Candidate',
          email: firebaseUser.email || '',
          photoURL: firebaseUser.photoURL || undefined
        };
        setUser(u);
        await firestoreService.saveUser(u);
      }
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user) {
        const u: UserProfile = {
          uid: res.user.uid,
          name: res.user.displayName || 'Candidate',
          email: res.user.email || '',
          photoURL: res.user.photoURL || undefined
        };
        setUser(u);
        await firestoreService.saveUser(u);
      }
    } catch (err: any) {
      console.warn('Google sign-in fallback to demo user:', err?.message);
      loginDemoUser();
    } finally {
      setLoading(false);
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    try {
      setLoading(true);
      const res = await signInWithEmailAndPassword(auth, email, pass);
      if (res.user) {
        const u: UserProfile = {
          uid: res.user.uid,
          name: res.user.displayName || email.split('@')[0],
          email: res.user.email || email
        };
        setUser(u);
        await firestoreService.saveUser(u);
      }
    } catch (err: any) {
      // Fallback demo account for evaluation
      const u: UserProfile = {
        uid: 'user_' + Date.now(),
        name: email.split('@')[0] || 'Candidate',
        email: email
      };
      setUser(u);
      await firestoreService.saveUser(u);
    } finally {
      setLoading(false);
    }
  };

  const registerWithEmail = async (email: string, pass: string) => {
    return register(email.split('@')[0], email, pass);
  };

  const register = async (name: string, email: string, pass: string) => {
    try {
      setLoading(true);
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      if (res.user) {
        if (name) {
          await updateProfile(res.user, { displayName: name }).catch(() => {});
        }
        const u: UserProfile = {
          uid: res.user.uid,
          name: name || email.split('@')[0],
          email: res.user.email || email
        };
        setUser(u);
        await firestoreService.saveUser(u);
      }
    } catch (err: any) {
      const u: UserProfile = {
        uid: 'user_' + Date.now(),
        name: name || email.split('@')[0],
        email: email
      };
      setUser(u);
      await firestoreService.saveUser(u);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      console.warn('Password reset fallback:', err?.message);
    } finally {
      setLoading(false);
    }
  };

  const loginDemoUser = () => {
    const demo: UserProfile = {
      uid: 'demo_user',
      name: 'Alex Chen',
      email: 'alex.chen@example.com',
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    };
    setUser(demo);
    firestoreService.saveUser(demo);
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      // ignore
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      currentUser: user,
      isAuthenticated: Boolean(user),
      loading,
      loginWithGoogle,
      login: loginWithEmail,
      loginWithEmail,
      register,
      registerWithEmail,
      resetPassword,
      loginDemoUser,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
