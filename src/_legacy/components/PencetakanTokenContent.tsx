'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

const initialMints = [
  { id: 'MINT-0891', time: '23 Okt 14:20', amount: '+256 TK', txHash: '0x8f92b7c4...ea10c8', type: 'SETORAN', status: 'DIKONFIRMASI' },
  { id: 'MINT-0412', time: '21 Okt 10:15', amount: '+320 TK', txHash: '0xa3f18d02...7b44e2', type: 'SETORAN', status: 'DIKONFIRMASI' },
  { id: 'MINT-1102', time: '19 Okt 16:45', amount: '+186 TK', txHash: '0xd7e29c15...3f88a1', type: 'SETORAN', status: 'DIKONFIRMASI' },
  { id: 'REDEEM-001', time: '17 Okt 09:00', amount: '-500 TK', txHash: '0x1b4c8a39...cd55f7', type: 'PENUKARAN', status: 'SELESAI' },
  { id: 'MINT-0930', time: '18 Okt 09:12', amount: '+150 TK', txHash: '0x6f82d4a7...19bc03', type: 'SETORAN', status: 'PENDING' },
];

const redeemOptions = [
  { name: 'Pulsa Telepon', min: 100, rate: '100 TK = Rp 10.000', icon: '📱' },
  { name: 'Token Listrik PLN', min: 200, rate: '200 TK = Rp 20.000', icon: '⚡' },
  { name: 'Voucher Belanja', min: 300, rate: '300 TK = Rp 25.000', icon: '🛒' },
  { name: 'Donasi Lingkungan', min: 50, rate: '50 TK = 1 Pohon', icon: '🌱' },
  { name: 'Transfer Bank', min: 500, rate: '500 TK = Rp 45.000', icon: '🏦' },
  { name: 'E-Wallet (GoPay/OVO)', min: 100, rate: '100 TK = Rp 9.500', icon: '💳' },
];

export default function PencetakanTokenContent() {
  const { user, updateBalance } = useAuth();
  const [mints, setMints] = useState(initialMints);
  const [toast, setToast] = useState<string | null>(null);

  const balance = user?.balance ?? 1450;

  const handleRedeem = (opt: typeof redeemOptions[0]) => {
    if (balance < opt.min) {
      setToast(`Saldo tidak mencukupi! Minimal ${opt.min} TK untuk ${opt.name}.`);
      setTimeout(() => setToast(null), 3000);
      return;
    }

    updateBalance(-opt.min);
    const newTx = {
      id: `REDEEM-${Math.floor(100 + Math.random() * 900)}`,
      time: 'Baru saja',
      amount: `-${opt.min} TK`,
      txHash: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 8)}`,
      type: 'PENUKARAN',
      status: 'SELESAI'
    };
    setMints(prev => [newTx, ...prev]);
    setToast(`Berhasil menukarkan ${opt.min} TK untuk ${opt.name}!`);
    setTimeout(() => setToast(null), 3000);
  };

  const handleCopyWallet = () => {
    navigator.clipboard?.writeText('0x742d35Cc6634C0532925a3b844Bc9e7595f2bD08a1c');
    setToast('Alamat dompet berhasil disalin ke clipboard!');
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <>
      {toast && (
        <div style={{
          position: 'fixed',
          top: 60,
          right: 20,
          background: 'var(--eco-700)',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: 8,
          boxShadow: 'var(--shadow-lg)',
          zIndex: 100,
          fontSize: 13,
          fontWeight: 600,
        }}>
          ✔ {toast}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace", marginBottom: 4 }}>
            MODUL_TOKEN // PENCETAKAN_DAN_PENUKARAN // BLOCKCHAIN_LEDGER
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px' }}>Pencetakan & Penukaran Token</h2>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
            Kelola EcoToken Anda — dicetak otomatis dari verifikasi sampah, ditukar ke reward nyata.
          </p>
        </div>
      </div>

      {/* Balance overview */}
      <div className="grid-3" style={{ marginBottom: 20 }}>
        <div className="token-reward-card animate-fade-in delay-1">
          <div className="card-title" style={{ marginBottom: 12 }}>Saldo EcoToken Saat Ini</div>
          <div className="token-value-lg">{balance.toLocaleString()}</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--eco-800)' }}>EcoTokens</div>
          <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
            <span className="badge badge-green">AKTIF</span>
            <span className="badge badge-outline" style={{ fontFamily: "'JetBrains Mono', monospace" }}>BLOK #209</span>
          </div>
        </div>

        <div className="card animate-fade-in delay-2" style={{ padding: 20 }}>
          <div className="card-title" style={{ marginBottom: 12 }}>Total Dicetak (All-time)</div>
          <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--eco-700)' }}>3,842 <span className="stat-unit">TK</span></div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>Dari 24 transaksi setoran terverifikasi</div>
          <div className="progress-bar" style={{ marginTop: 12 }}>
            <div className="progress-fill green" style={{ width: '100%' }} />
          </div>
        </div>

        <div className="card animate-fade-in delay-3" style={{ padding: 20 }}>
          <div className="card-title" style={{ marginBottom: 12 }}>Total Ditukar</div>
          <div style={{ fontSize: 36, fontWeight: 800 }}>2,392 <span className="stat-unit">TK</span></div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>Setara Rp 215.000 (Voucher & Pulsa)</div>
          <div style={{ marginTop: 8 }}>
            <span className="badge badge-blue">RASIO: 62%</span>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20 }}>
        {/* LEFT: Recent Mints */}
        <div>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', background: 'var(--eco-50)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700 }}>
                <span>⛓</span>
                <span>Riwayat Pencetakan & Penukaran (On-chain)</span>
              </div>
              <span className="badge badge-green">Polygon POS</span>
            </div>

            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Waktu</th>
                  <th>Tipe</th>
                  <th>Jumlah Token</th>
                  <th>Tx Hash</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {mints.map((m) => (
                  <tr key={m.id}>
                    <td>
                      <span className="font-mono" style={{ fontSize: 11, fontWeight: 700, color: 'var(--eco-700)' }}>
                        {m.id}
                      </span>
                    </td>
                    <td style={{ fontSize: 12 }}>{m.time}</td>
                    <td>
                      <span className={`badge ${m.type === 'SETORAN' ? 'badge-green' : 'badge-blue'}`}>
                        {m.type}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700, color: m.amount.startsWith('+') ? 'var(--eco-700)' : '#dc2626', fontSize: 12 }}>
                      {m.amount}
                    </td>
                    <td>
                      <span className="font-mono" style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                        {m.txHash}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${m.status === 'DIKONFIRMASI' || m.status === 'SELESAI' ? 'badge-green' : 'badge-yellow'}`}>
                        {m.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT: Redeem options */}
        <div>
          <div className="card" style={{ padding: 20, marginBottom: 16 }}>
            <div className="card-title" style={{ marginBottom: 14 }}>Tukarkan EcoToken</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {redeemOptions.map((opt) => (
                <div key={opt.name} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 12px', borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--neutral-50)'
                }}>
                  <div style={{ fontSize: 22 }}>{opt.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 700 }}>{opt.name}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
                      MIN: {opt.min} TK • {opt.rate}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRedeem(opt)}
                    className="btn btn-sm btn-primary"
                    style={{ fontSize: 11, padding: '4px 10px' }}
                  >
                    Tukar
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Wallet address */}
          <div className="card" style={{ padding: 16 }}>
            <div className="card-title" style={{ marginBottom: 8 }}>Dompet Web3 Terhubung</div>
            <div style={{ padding: '8px 12px', background: 'var(--neutral-50)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, wordBreak: 'break-all', color: 'var(--text-secondary)' }}>
              0x742d35Cc6634C0532925a3b844Bc9e7595f2bD08a1c
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <button onClick={handleCopyWallet} className="btn btn-sm btn-outline" style={{ flex: 1, fontSize: 11 }}>
                📋 Salin Alamat
              </button>
              <button
                onClick={() => {
                  setToast('Membuka blok explorer di tab baru...');
                  setTimeout(() => setToast(null), 2000);
                }}
                className="btn btn-sm btn-outline"
                style={{ flex: 1, fontSize: 11 }}
              >
                🔗 Explorer
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
