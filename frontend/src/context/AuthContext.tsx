import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider, firestoreService } from '../services/firebase';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { UserProfile } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string) => Promise<void>;
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
        const u = {
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
        const u = {
          uid: res.user.uid,
          name: res.user.displayName || 'Candidate',
          email: res.user.email || '',
          photoURL: res.user.photoURL || undefined
        };
        setUser(u);
        await firestoreService.saveUser(u);
      }
    } catch (err) {
      console.warn('Google sign-in fallback to demo user');
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
        const u = {
          uid: res.user.uid,
          name: res.user.displayName || email.split('@')[0],
          email: res.user.email || email
        };
        setUser(u);
        await firestoreService.saveUser(u);
      }
    } catch (err) {
      // Fallback demo for hackathon
      const u = {
        uid: 'user_' + Date.now(),
        name: email.split('@')[0],
        email: email
      };
      setUser(u);
      await firestoreService.saveUser(u);
    } finally {
      setLoading(false);
    }
  };

  const registerWithEmail = async (email: string, pass: string) => {
    try {
      setLoading(true);
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      if (res.user) {
        const u = {
          uid: res.user.uid,
          name: email.split('@')[0],
          email: res.user.email || email
        };
        setUser(u);
        await firestoreService.saveUser(u);
      }
    } catch (err) {
      const u = {
        uid: 'user_' + Date.now(),
        name: email.split('@')[0],
        email: email
      };
      setUser(u);
      await firestoreService.saveUser(u);
    } finally {
      setLoading(false);
    }
  };

  const loginDemoUser = () => {
    const demo = {
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
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, loginWithEmail, registerWithEmail, loginDemoUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
