'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const isAdminRoute = pathname.startsWith('/admin');

  const getBreadcrumb = () => {
    if (pathname === '/admin') return ['KONSOL_BANK_SAMPAH', 'RINGKASAN_GUDANG'];
    if (pathname === '/admin/triase') return ['KONSOL_BANK_SAMPAH', 'PANTAUAN_LANGSUNG'];
    if (pathname === '/admin/konfigurasi-warga') return ['BANK_SAMPAH', 'JADWAL_JEMPUT'];
    if (pathname === '/admin/master-data') return ['KONSOL_BANK_SAMPAH', 'ARUS_LANGSUNG'];
    if (pathname === '/admin/buku-besar') return ['KONSOL_BANK_SAMPAH', 'BUKU_BESAR_BATCH'];
    if (pathname === '/') return ['KONSOL_BANK_SAMPAH', 'PANTAUAN_LANGSUNG'];
    if (pathname === '/buku-besar') return ['KONSOL_BANK_SAMPAH', 'BUKU_BESAR_SETORAN'];
    if (pathname === '/pemeriksaan') return ['DIAGNOSTIK', 'PEMERIKSAAN_LANGSUNG'];
    if (pathname === '/hasil-optik') return ['HASIL_OPTIK', 'SPEKTROMETRI_AI'];
    if (pathname === '/pencetakan-token') return ['KONSOL_BANK_SAMPAH', 'PENCETAKAN_TOKEN'];
    return ['KONSOL_BANK_SAMPAH'];
  };

  const crumbs = getBreadcrumb();

  return (
    <>
      <header className="top-header">
        <div className="breadcrumb">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span className="breadcrumb-sep">/</span>
          {crumbs.map((c, i) => (
            <span key={i}>
              {c}
              {i < crumbs.length - 1 && <span className="breadcrumb-sep"> / </span>}
            </span>
          ))}
        </div>

        <div className="header-status synced">
          {isAdminRoute ? '● KAMERA OPTIK: TERSINKRONISASI' : '● BUS OPTIK: TERSINKRON'}
        </div>

        <div className="header-right">
          <div className="header-token-badge">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><path d="M12 6v12M6 12h12" />
            </svg>
            {isAdminRoute ? 'SALDO ECOTOKEN: 412.850 TK' : `ECOTOKEN: ${(user?.balance || 1450).toLocaleString()} TK`}
          </div>

          {/* Static Role Badge (No switching allowed) */}
          <div style={{
            padding: '4px 10px',
            borderRadius: 6,
            fontSize: 10,
            fontWeight: 800,
            fontFamily: "'JetBrains Mono', monospace",
            background: user?.role === 'admin' ? 'var(--eco-700)' : '#2563eb',
            color: '#ffffff',
            letterSpacing: '0.5px'
          }}>
            {user?.role === 'admin' ? 'AKSES: ADMIN' : 'AKSES: WARGA'}
          </div>

          {/* Notification Button */}
          <div style={{ position: 'relative' }}>
            <button
              className="header-icon-btn"
              title="Notifikasi Sistem"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span style={{
                position: 'absolute',
                top: 4,
                right: 4,
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: '#ef4444',
                border: '1px solid #fff'
              }} />
            </button>

            {showNotifications && (
              <div style={{
                position: 'absolute',
                right: 0,
                top: 36,
                width: 280,
                background: '#ffffff',
                border: '1px solid var(--border-color)',
                borderRadius: 8,
                boxShadow: 'var(--shadow-lg)',
                padding: 12,
                zIndex: 50,
                fontSize: 12
              }}>
                <div style={{ fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)', borderBottom: '1px solid #eee', paddingBottom: 6 }}>
                  Notifikasi Sistem Bank Sampah
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ padding: '6px 8px', background: 'var(--eco-50)', borderRadius: 6 }}>
                    <div style={{ fontWeight: 600, color: 'var(--eco-800)' }}>Penyetoran Berhasil</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: 11 }}>Sesi terenkripsi aman</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Profile / Account Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              className="header-icon-btn"
              title="Profil Pengguna & Logout"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              style={{
                background: user?.role === 'admin' ? 'rgba(5, 150, 105, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                color: user?.role === 'admin' ? 'var(--eco-700)' : '#2563eb'
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
                width: 240,
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
                    {user?.name || (isAdminRoute ? 'Hendra Setiawan (Supervisor)' : 'Budi Santoso')}
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: 11, fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>
                    PERAN: {user?.role?.toUpperCase()}
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }}>
                    ID: {user?.username} ({user?.nik || 'TERDAFTAR'})
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

      {/* Sub-Header bar */}
      <div className="sub-header">
        <div className="sub-header-item">
          <span className="label">
            {isAdminRoute ? 'SUPERVISOR TPS TEBET 3R •' : 'SESI WARGA TERVERIFIKASI //'}
          </span>
          <span>{isAdminRoute ? 'GILIRAN PAGI' : (user?.nik || 'NIK-3174-88902-1004')}</span>
        </div>
        <div className="sub-header-item">
          <span className="label">LOKASI GPS NODE:</span>
          <span>-6.2297° S, 106.8457° E (DKI JAKARTA)</span>
        </div>
        <div className="sub-header-item">
          <span className="label">SINKRON:</span>
          <span>14ms</span>
        </div>
        <div className="sub-header-item">
          <span className="label">STATUS:</span>
          <span style={{ color: 'var(--eco-600)', fontWeight: 600 }}>ONLINE // TERENKRIPSI</span>
        </div>
      </div>
    </>
  );
}
