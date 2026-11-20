'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useMachines } from '@/lib/store';

const BREADCRUMBS: Record<string, string> = {
  '/admin': 'DASHBOARD_ANALITIK',
  '/admin/mesin': 'KELOLA_MESIN_REWARD',
  '/admin/transaksi': 'TRANSAKSI_EXPORT',
};

export default function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const machines = useMachines();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const isAdmin = user?.role === 'admin';
  const activeMachines = machines.filter((m) => m.status === 'aktif').length;
  const crumbs = ['SMART_WASTE_VENDING', BREADCRUMBS[pathname]].filter(Boolean);

  return (
    <>
      <header className="top-header">
        <div className="breadcrumb">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" /><polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span className="breadcrumb-sep">/</span>
          {crumbs.map((c, i) => (
            <span key={c}>
              {c}
              {i < crumbs.length - 1 && <span className="breadcrumb-sep"> / </span>}
            </span>
          ))}
        </div>

        <div className="header-status synced">
          {isAdmin ? `● MESIN AKTIF: ${activeMachines}/${machines.length}` : '● BUS OPTIK: TERSINKRON'}
        </div>

        <div className="header-right">
          {!isAdmin && (
            <div className="header-token-badge">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><path d="M12 6v12M6 12h12" />
              </svg>
              ECOTOKEN: {(user?.balance ?? 0).toLocaleString('id-ID')} TK
            </div>
          )}

          <div style={{
            padding: '4px 10px',
            borderRadius: 6,
            fontSize: 10,
            fontWeight: 800,
            fontFamily: "'JetBrains Mono', monospace",
            background: isAdmin ? 'var(--eco-700)' : '#2563eb',
            color: '#ffffff',
            letterSpacing: '0.5px'
          }}>
            {isAdmin ? 'AKSES: ADMIN' : 'AKSES: WARGA'}
          </div>

          <div style={{ position: 'relative' }}>
            <button
              className="header-icon-btn"
              title="Profil & Logout"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              style={{
                background: isAdmin ? 'rgba(5, 150, 105, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                color: isAdmin ? 'var(--eco-700)' : '#2563eb'
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
            </button>

            {showProfileMenu && (
              <div style={{
                position: 'absolute',
                right: 0,
                top: 36,
                width: 220,
                background: '#ffffff',
                border: '1px solid var(--border-color)',
                borderRadius: 10,
                boxShadow: 'var(--shadow-lg)',
                padding: 14,
                zIndex: 50,
                fontSize: 12
              }}>
                <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: 10, marginBottom: 10 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>
                    {user?.name}
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: 11, fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>
                    ID: {user?.username}{user?.nik ? ` (${user.nik})` : ''}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    background: '#fee2e2',
                    border: '1px solid #fca5a5',
                    borderRadius: 6,
                    color: '#b91c1c',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Keluar / Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="sub-header">
        {!isAdmin && (
          <div className="sub-header-item">
            <span className="label">SESI WARGA TERVERIFIKASI //</span>
            <span>{user?.nik}</span>
          </div>
        )}
        <div className="sub-header-item">
          <span className="label">PENYIMPANAN:</span>
          <span>LOKAL (BROWSER)</span>
        </div>
        <div className="sub-header-item">
          <span className="label">PAYMENT GATEWAY:</span>
          <span>SIMULASI</span>
        </div>
      </div>
    </>
  );
}
