'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const ok = login(username, password);
    if (!ok) {
      setError('Kredensial tidak valid. Gunakan admin/admin atau warga/warga.');
      setLoading(false);
    }
  };

  const handleQuickLogin = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setError('');
    setLoading(true);

    const ok = login(u, p);
    if (!ok) {
      setError('Kredensial tidak valid.');
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at 50% 20%, #064e3b 0%, #022c22 45%, #051a14 100%)',
      padding: 20,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Grid Pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'linear-gradient(rgba(16, 185, 129, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.05) 1px, transparent 1px)',
        backgroundSize: '36px 36px',
        pointerEvents: 'none'
      }} />

      {/* Main Login Card */}
      <div style={{
        width: '100%',
        maxWidth: 440,
        background: 'rgba(6, 78, 59, 0.45)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(52, 211, 153, 0.25)',
        borderRadius: 16,
        padding: '36px 32px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 30px rgba(16, 185, 129, 0.15)',
        position: 'relative',
        zIndex: 2,
        color: '#ffffff'
      }}>
        {/* Terminal Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(52, 211, 153, 0.2)',
          paddingBottom: 14,
          marginBottom: 24,
          fontSize: 11,
          fontFamily: "'JetBrains Mono', monospace",
          color: '#6ee7b7'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 8px #10b981' }} />
            AUTH_GATEWAY // v4.2.1
          </span>
          <span>SECURE_SESSION</span>
        </div>

        {/* Logo & Title */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 54,
            height: 54,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #10b981, #047857)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 28,
            boxShadow: '0 8px 16px rgba(16, 185, 129, 0.3)',
            marginBottom: 12
          }}>
            ♻
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>EcoSort AI</h1>
          <p style={{ fontSize: 13, color: '#a7f3d0', marginTop: 4 }}>
            Sistem Manajemen & Konsol Bank Sampah Cerdas
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#fca5a5',
            padding: '10px 14px',
            borderRadius: 8,
            fontSize: 12,
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontFamily: "'JetBrains Mono', monospace"
          }}>
            <span>⚠</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: 11,
              fontFamily: "'JetBrains Mono', monospace",
              color: '#a7f3d0',
              marginBottom: 6,
              textTransform: 'uppercase'
            }}>
              ID Pengguna / Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin atau warga"
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                background: 'rgba(2, 44, 34, 0.7)',
                border: '1px solid rgba(52, 211, 153, 0.3)',
                borderRadius: 8,
                color: '#ffffff',
                fontSize: 14,
                outline: 'none',
                transition: 'border 0.2s',
                fontFamily: "'JetBrains Mono', monospace"
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: 11,
              fontFamily: "'JetBrains Mono', monospace",
              color: '#a7f3d0',
              marginBottom: 6,
              textTransform: 'uppercase'
            }}>
              Kata Sandi / Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                background: 'rgba(2, 44, 34, 0.7)',
                border: '1px solid rgba(52, 211, 153, 0.3)',
                borderRadius: 8,
                color: '#ffffff',
                fontSize: 14,
                outline: 'none',
                transition: 'border 0.2s',
                fontFamily: "'JetBrains Mono', monospace"
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px 20px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              border: 'none',
              borderRadius: 8,
              color: '#ffffff',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              marginTop: 6,
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
              transition: 'transform 0.1s, opacity 0.2s',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'MEMVERIFIKASI...' : 'MASUK KE SISTEM →'}
          </button>
        </form>

        {/* Quick Login Buttons */}
        <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(52, 211, 153, 0.15)' }}>
          <div style={{ fontSize: 11, color: '#6ee7b7', marginBottom: 10, textAlign: 'center', fontFamily: "'JetBrains Mono', monospace" }}>
            AKSES CEPAT SEKALI KLIK:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin', 'admin')}
              style={{
                padding: '10px 8px',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(52, 211, 153, 0.35)',
                borderRadius: 8,
                color: '#a7f3d0',
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'center',
                fontFamily: "'JetBrains Mono', monospace"
              }}
            >
              🛡 ADMIN<br />
              <span style={{ fontSize: 10, opacity: 0.7 }}>admin / admin</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('warga', 'warga')}
              style={{
                padding: '10px 8px',
                background: 'rgba(59, 130, 246, 0.15)',
                border: '1px solid rgba(96, 165, 250, 0.35)',
                borderRadius: 8,
                color: '#bfdbfe',
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'center',
                fontFamily: "'JetBrains Mono', monospace"
              }}
            >
              👤 WARGA<br />
              <span style={{ fontSize: 10, opacity: 0.7 }}>warga / warga</span>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div style={{
          marginTop: 20,
          textAlign: 'center',
          fontSize: 10,
          color: 'rgba(167, 243, 208, 0.6)',
          fontFamily: "'JetBrains Mono', monospace"
        }}>
          NODE TEBET 3R // ENCRYPTED SHA-256 SESSION
        </div>
      </div>
    </div>
  );
}
