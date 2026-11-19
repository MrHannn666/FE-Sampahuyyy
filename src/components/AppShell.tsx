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

  const inAdminArea = pathname.startsWith('/admin');
  // Role guard: admin hanya di /admin, warga hanya di /warga.
  const allowed = !!user && (user.role === 'admin' ? inAdminArea : !inAdminArea);

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    if (!allowed) {
      router.push(user.role === 'admin' ? '/admin' : '/warga');
    }
  }, [user, isLoading, allowed, router]);

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

  // Cegah flash konten yang tidak boleh diakses role ini.
  if (!allowed) return null;

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
