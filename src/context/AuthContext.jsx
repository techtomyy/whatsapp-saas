import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // hydrate from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('wb_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        const photo = localStorage.getItem('wb_profile_photo');
        setUser(photo ? { ...parsed, photoUrl: photo } : parsed);
      }
    } catch (_) {
      // ignore storage errors
    }
  }, []);

  const login = async (identifier, password) => {
    setIsLoading(true);
    try {
      // Replace with actual API call
      if ((identifier === "demo@example.com" || identifier === "demo") && password === "demo123") {
        const loggedInUser = {
          id: 1,
          name: "Demo User",
          email: "demo@example.com",
          role: "Admin",
          plan: "Pro"
        };
        setUser(loggedInUser);
        try { localStorage.setItem('wb_user', JSON.stringify(loggedInUser)); } catch (_) {}
        return true;
      }
      throw new Error("Invalid credentials");
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    try { localStorage.removeItem('wb_user'); } catch (_) {}
  };

  const updateProfile = async (updates) => {
    // Simulate API call
    const updated = { ...user, ...updates };
    setUser(updated);
    try { localStorage.setItem('wb_user', JSON.stringify(updated)); } catch (_) {}
    return updated;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);