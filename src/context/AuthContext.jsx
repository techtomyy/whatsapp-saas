import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase/client';
import { doc, onSnapshot } from 'firebase/firestore';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile as fbUpdateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let unsubProfile = null;
    const unsub = onAuthStateChanged(auth, (fbUser) => {
      if (unsubProfile) { try { unsubProfile(); } catch (_) {} unsubProfile = null; }
      if (fbUser) {
        // Base user from Firebase Auth
        const baseUser = {
          uid: fbUser.uid,
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
          email: fbUser.email || '',
          photoUrl: fbUser.photoURL || '',
          role: 'User',
          plan: 'Free',
        };
        setUser(baseUser);
        // Merge Firestore profile (role, settings, etc.)
        const userRef = doc(db, 'users', fbUser.uid);
        unsubProfile = onSnapshot(userRef, (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            setUser((u) => ({
              ...baseUser,
              ...data,
              role: data.role || (data.admin ? 'Admin' : 'User'),
            }));
          } else {
            setUser(baseUser);
          }
          setIsLoading(false);
        }, () => setIsLoading(false));
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });
    return () => { if (unsubProfile) try { unsubProfile(); } catch (_) {}; unsub(); };
  }, []);

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);

  const signup = async (email, password, displayName) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await fbUpdateProfile(cred.user, { displayName });
    }
  };

  const logout = () => signOut(auth);

  const updateProfile = async (updates) => {
    if (!auth.currentUser) return null;
    await fbUpdateProfile(auth.currentUser, updates);
    setUser((u) => (u ? { ...u, ...updates } : u));
    return auth.currentUser;
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateProfile, loginWithGoogle, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);