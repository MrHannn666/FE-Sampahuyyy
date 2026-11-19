'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export type UserRole = 'admin' | 'warga';

export interface User {
  username: string;
  role: UserRole;
  name: string;
  nik?: string;
  node: string;
  balance: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password?: string) => boolean;
  logout: () => void;
  updateBalance: (delta: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('ecosort_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch {
      // ignore storage errors
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (usernameInput: string, passwordInput?: string): boolean => {
    const u = usernameInput.trim().toLowerCase();
    const p = (passwordInput || '').trim().toLowerCase();

    if (u === 'admin' && p === 'admin') {
      const adminUser: User = {
        username: 'admin',
        role: 'admin',
        name: 'Hendra Setiawan (Supervisor)',
        nik: 'SPV-JKT-04',
        node: 'POS // 04-Jakarta',
        balance: 412850,
      };
      setUser(adminUser);
      localStorage.setItem('ecosort_user', JSON.stringify(adminUser));
      window.location.href = '/admin';
      return true;
    }

    if (u === 'warga' && p === 'warga') {
      const wargaUser: User = {
        username: 'warga',
        role: 'warga',
        name: 'Budi Santoso',
        nik: '3174-88902-1004',
        node: 'NODE // 04-BKK',
        balance: 1450,
      };
      setUser(wargaUser);
      localStorage.setItem('ecosort_user', JSON.stringify(wargaUser));
      window.location.href = '/';
      return true;
    }

    return false;
  };

  const logout = () => {
    localStorage.removeItem('ecosort_user');
    setUser(null);
    window.location.href = '/login';
  };

  const updateBalance = (delta: number) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, balance: Math.max(0, prev.balance + delta) };
      localStorage.setItem('ecosort_user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateBalance }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
