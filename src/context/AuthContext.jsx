import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase/client';
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
    const unsub = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        setUser({
          uid: fbUser.uid,
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
          email: fbUser.email || '',
          photoUrl: fbUser.photoURL || '',
          role: 'User',
          plan: 'Free',
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });
    return () => unsub();
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