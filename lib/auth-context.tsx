'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User, getUserById } from './mock-auth';

interface AuthContextType {
  user: User | null;
  login: (userId: number) => void;
  loginWithCredentials: (userData: any) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Mock user login (for demo purposes)
  const login = useCallback((userId: number) => {
    const foundUser = getUserById(userId);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
    }
  }, []);

  // Real user login with credentials
  const loginWithCredentials = useCallback((userData: any) => {
    const user: User = {
      id: userData.id,
      name: userData.name,
      role: userData.role as 'student' | 'parent' | 'tutor',
      avatar: userData.avatar,
      subject: userData.subject,
    };
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        loginWithCredentials,
        logout,
        isAuthenticated: user !== null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

