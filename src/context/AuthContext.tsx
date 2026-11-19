'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * Dua role:
 * - admin: konsol operasional mesin & bank sampah (/admin)
 * - warga: dashboard warga (/warga)
 * Layar kiosk mesin (/) tetap terbuka tanpa login.
 */
export type UserRole = 'admin' | 'warga';

export interface User {
  username: string;
  name: string;
  role: UserRole;
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

const STORAGE_KEY = 'ecosort_user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function isValidUser(value: Partial<User>): value is User {
  return (
    (value.role === 'admin' || value.role === 'warga') &&
    typeof value.username === 'string' &&
    typeof value.name === 'string' &&
    typeof value.node === 'string' &&
    typeof value.balance === 'number'
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<User>;
        // Sesi dengan bentuk data lama/tidak valid dibuang.
        if (isValidUser(parsed)) {
          // Baca localStorage hanya di client setelah mount agar tidak terjadi hydration mismatch.
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setUser(parsed);
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(adminUser));
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wargaUser));
      window.location.href = '/warga';
      return true;
    }

    return false;
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    window.location.href = '/login';
  };

  const updateBalance = (delta: number) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, balance: Math.max(0, prev.balance + delta) };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
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
