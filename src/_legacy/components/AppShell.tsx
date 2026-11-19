'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    // Role Guard: Admin cannot access citizen routes
    if (user.role === 'admin' && !pathname.startsWith('/admin')) {
      router.push('/admin');
      return;
    }

    // Role Guard: Warga cannot access admin routes
    if (user.role === 'warga' && pathname.startsWith('/admin')) {
      router.push('/');
      return;
    }
  }, [user, isLoading, pathname, router]);

  if (isLoading || !user) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#042f24',
        color: '#6ee7b7',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 12
      }}>
        MEMERIKSA HAK AKSES SESI...
      </div>
    );
  }

  // Prevent flash of unauthorized content
  if (user.role === 'admin' && !pathname.startsWith('/admin')) {
    return null;
  }
  if (user.role === 'warga' && pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
}
