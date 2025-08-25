import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase/client";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile as fbUpdateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let unsubProfile = null;

    const unsub = onAuthStateChanged(auth, (fbUser) => {
      if (unsubProfile) {
        try {
          unsubProfile();
        } catch (_) {}
        unsubProfile = null;
      }

      if (fbUser) {
        // Base user from Firebase Auth
        const baseUser = {
          uid: fbUser.uid,
          name: fbUser.displayName || fbUser.email?.split("@")[0] || "User",
          email: fbUser.email || "",
          photoUrl: fbUser.photoURL || "",
          role: "User", // default role
          plan: "Free", // default plan
        };

        setUser(baseUser);

        // Merge Firestore profile (role, settings, etc.)
        const userRef = doc(db, "users", fbUser.uid);
        unsubProfile = onSnapshot(
          userRef,
          (snap) => {
            if (snap.exists()) {
              const data = snap.data();
              setUser({
                ...baseUser,
                ...data,
                role: data.role || (data.admin ? "Admin" : "User"), // backward compatibility
              });
            } else {
              // If no Firestore doc exists, create one
              setDoc(userRef, baseUser);
              setUser(baseUser);
            }
            setIsLoading(false);
          },
          () => setIsLoading(false)
        );
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => {
      if (unsubProfile)
        try {
          unsubProfile();
        } catch (_) {}
      unsub();
    };
  }, []);

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const signup = async (email, password, displayName) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);

    // Set display name if provided
    if (displayName) {
      await fbUpdateProfile(cred.user, { displayName });
    }

    // Create Firestore user profile
    const userRef = doc(db, "users", cred.user.uid);
    await setDoc(userRef, {
      uid: cred.user.uid,
      name: displayName || email.split("@")[0],
      email,
      photoUrl: cred.user.photoURL || "",
      role: "User", // Default role
      plan: "Free",
      createdAt: new Date(),
    });
  };

  const logout = () => signOut(auth);

  const updateProfile = async (updates) => {
    if (!auth.currentUser) return null;
    await fbUpdateProfile(auth.currentUser, updates);
    setUser((u) => (u ? { ...u, ...updates } : u));

    // Also update Firestore profile
    const userRef = doc(db, "users", auth.currentUser.uid);
    await setDoc(userRef, updates, { merge: true });

    return auth.currentUser;
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    // Ensure Firestore doc exists for Google users
    const userRef = doc(db, "users", result.user.uid);
    const baseUser = {
      uid: result.user.uid,
      name: result.user.displayName || result.user.email.split("@")[0],
      email: result.user.email,
      photoUrl: result.user.photoURL || "",
      role: "User",
      plan: "Free",
      createdAt: new Date(),
    };
    await setDoc(userRef, baseUser, { merge: true });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        updateProfile,
        loginWithGoogle,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
