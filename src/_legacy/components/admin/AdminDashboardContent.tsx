'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminDashboardContent() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'semua' | 'anomali'>('semua');
  const [showWarningBanner, setShowWarningBanner] = useState(true);
  const [metricMode, setMetricMode] = useState<'volume' | 'nilai'>('volume');
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState<string | null>(null);

  // Queue items state
  const [queueList, setQueueList] = useState([
    {
      id: '#ING-20241024-001',
      sender: 'RT 04 / RW 02 Tebet Barat',
      desc: 'Titik Kumpul Kolektif Warga',
      material: 'Plastik PET Bening',
      materialClass: 'badge-green',
      grossWeight: '42,50 kg',
      estTokens: '1.275 TK',
      aiConf: '[98,8% PET]',
      isAnomaly: false,
    },
    {
      id: '#ING-20241024-002',
      sender: 'PT Mahakam Digital Solusi',
      desc: 'Penjemputan Mitra Perusahaan',
      material: 'Limbah Elektronik (PCB & Kabel)',
      materialClass: 'badge-yellow',
      grossWeight: '18,20 kg',
      estTokens: '4.550 TK',
      aiConf: '[94,2% CAMPURAN]',
      isAnomaly: true,
    },
    {
      id: '#ING-20241024-003',
      sender: 'Siti Nurhaliza (Individu)',
      desc: 'Setor Mandiri Gudang TPS',
      material: 'Kardus & Kertas Bekas',
      materialClass: 'badge-green',
      grossWeight: '8,40 kg',
      estTokens: '168 TK',
      aiConf: '[99,1% KARDUS]',
      isAnomaly: false,
    },
    {
      id: '#ING-20241024-004',
      sender: 'Restoran Sedap Rasa',
      desc: 'Minyak Jelantah & Organik',
      material: 'Organik Basah (Anomali Kadar Air)',
      materialClass: 'badge-red',
      grossWeight: '31,00 kg',
      estTokens: '310 TK',
      aiConf: '[81,5% ANOMALI]',
      isAnomaly: true,
    },
  ]);

  const [trucks, setTrucks] = useState([
    {
      plate: 'B-3891-TXE',
      type: 'Kurir Roda 3',
      route: 'Rute Tebet Barat Dalam (5 Titik Jemput)',
      status: 'DALAM PERJALANAN',
      statusClass: 'badge-green',
      load: '140 / 200 kg',
      percentage: 70,
    },
    {
      plate: 'B-4412-TXF',
      type: 'Kurir Roda 3',
      route: 'TPS Tebet 3R Dok Verifikasi #2',
      status: 'TIMBANG DI TPS',
      statusClass: 'badge-yellow',
      load: '195 / 200 kg',
      percentage: 97,
    },
    {
      plate: 'B-9102-SQU',
      type: 'Truk Colt Diesel',
      route: 'Ritase Transfer Gudang Induk Pulogadung',
      status: 'DALAM PERJALANAN',
      statusClass: 'badge-green',
      load: '2.400 / 3.000 kg',
      percentage: 80,
    },
    {
      plate: 'B-9204-SQU',
      type: 'Truk Pemadat',
      route: 'Garasi TPS Tebet • Pengemudi: Hendra S.',
      status: 'SIAGA',
      statusClass: 'badge-blue',
      load: '0 / 5.000 kg',
      percentage: 0,
    },
  ]);

  const handleValidate = (id: string) => {
    setQueueList(prev => prev.filter(q => q.id !== id));
    setToast(`Batch ${id} berhasil divalidasi dan dicairkan ke buku besar!`);
    setTimeout(() => setToast(null), 3000);
  };

  const handleReject = (id: string) => {
    setQueueList(prev => prev.filter(q => q.id !== id));
    setToast(`Batch ${id} ditolak dan dikembalikan ke petugas sortir.`);
    setTimeout(() => setToast(null), 3000);
  };

  const filteredQueue = queueList.filter(item => {
    const matchesFilter = activeFilter === 'semua' || (activeFilter === 'anomali' && item.isAnomaly);
    const matchesQuery = item.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.material.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Toast Alert */}
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
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontSize: 13,
          fontWeight: 600,
        }}>
          <span>✔</span>
          <span>{toast}</span>
        </div>
      )}

      {/* Admin Action Sub-bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
        padding: '10px 14px',
        background: '#ffffff',
        border: '1px solid var(--border-color)',
        borderRadius: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'var(--eco-100)',
            color: 'var(--eco-900)',
            padding: '5px 12px',
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 700,
            fontFamily: "'JetBrains Mono', monospace"
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--eco-500)', display: 'inline-block' }} />
            SUPERVISOR TPS TEBET 3R • GILIRAN PAGI
          </div>

          <div style={{ position: 'relative', flex: 1, maxWidth: 380 }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari transaksi nasabah, no kendaraan kurir..."
              style={{
                width: '100%',
                padding: '7px 12px 7px 32px',
                fontSize: 12,
                borderRadius: 6,
                border: '1px solid var(--neutral-300)',
                background: 'var(--neutral-50)',
                outline: 'none'
              }}
            />
            <svg style={{ position: 'absolute', left: 10, top: 9, color: 'var(--text-muted)' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => setShowWarningBanner(!showWarningBanner)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <span>⚠</span>
            <span>3 Peringatan Kapasitas</span>
          </button>
        </div>
      </div>

      {/* Capacity Warning Banner */}
      {showWarningBanner && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(236, 253, 245, 0.9)',
          border: '1px solid var(--eco-400)',
          borderRadius: 10,
          padding: '12px 18px',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: 'var(--eco-100)',
              color: 'var(--eco-700)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18
            }}>
              🔔
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--eco-800)', fontFamily: "'JetBrains Mono', monospace" }}>
                PERINGATAN KAPASITAS GUDANG // PERINGATAN_KRITIS_92_PERSEN
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                Gudang TPS Cilandak mendekati kapasitas maksimal <strong>(92% • 4.600 / 5.000 kg)</strong>. Disarankan pengalihan rute armada ke TPS Menteng.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setShowWarningBanner(false)}
              style={{
                padding: '6px 14px',
                background: '#ffffff',
                border: '1px solid var(--border-color)',
                borderRadius: 6,
                fontSize: 12,
                cursor: 'pointer'
              }}
            >
              Abaikan
            </button>
            <button
              onClick={() => setShowDispatchModal(true)}
              style={{
                padding: '6px 14px',
                background: 'var(--eco-700)',
                border: 'none',
                borderRadius: 6,
                color: '#ffffff',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              🚛 Jadwalkan Truk Pengangkut
            </button>
          </div>
        </div>
      )}

      {/* 4 Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {/* Card 1 */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
              TOTAL SAMPAH MASUK (BULAN INI)
            </div>
            <span style={{ fontSize: 16 }}>⌛</span>
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', marginTop: 8 }}>
            28,45 <span style={{ fontSize: 14, fontWeight: 500 }}>Ton</span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--eco-600)', fontWeight: 600, marginTop: 4 }}>
            ▲ +14,2% dibanding bulan lalu
          </div>
          <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }}>
            <span style={{ color: 'var(--text-muted)' }}>RATA_HARIAN: 948,3 KG</span>
            <span className="badge badge-green" style={{ fontSize: 9 }}>STATUS_BAIK</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
              ANTREAN VERIFIKASI INTAKE
            </div>
            <span style={{ fontSize: 16 }}>⏳</span>
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', marginTop: 8 }}>
            {queueList.length} <span style={{ fontSize: 14, fontWeight: 500 }}>Menunggu</span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>
            ⏱ Rata-rata respon: 12 menit
          </div>
          <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }}>
            <span style={{ color: 'var(--text-muted)' }}>KAPASITAS: 15 MAKS</span>
            <span className="badge badge-green" style={{ fontSize: 9 }}>STABIL</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
              KAPASITAS GUDANG SAAT INI
            </div>
            <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-muted)' }}>3.900 / 5.000 kg</span>
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', marginTop: 8 }}>
            78% <span style={{ fontSize: 14, fontWeight: 500 }}>Terisi</span>
          </div>
          <div className="progress-bar" style={{ marginTop: 8 }}>
            <div className="progress-fill green" style={{ width: '78%' }} />
          </div>
          <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }}>
            <span style={{ color: 'var(--text-muted)' }}>SISA: 1.100 KG</span>
            <span className="badge badge-green" style={{ fontSize: 9 }}>NORMAL</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
              TOTAL ECOTOKEN BEREDAR
            </div>
            <span style={{ fontSize: 16 }}>🪙</span>
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', marginTop: 8 }}>
            412.850 <span style={{ fontSize: 14, fontWeight: 500 }}>TK</span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>
            🪙 Rasio penebusan: 64%
          </div>
          <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }}>
            <span style={{ color: 'var(--text-muted)' }}>NILAI: RP 41,2 JT</span>
            <span className="badge badge-green" style={{ fontSize: 9 }}>CADANGAN_AMAN</span>
          </div>
        </div>
      </div>

      {/* Middle Row: Volume Breakdown Chart & Truck Status */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
        {/* Breakdown Chart Card */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
                Breakdown Volume Harian Berdasarkan Fraksi Sampah
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>
                RENTANG_WAKTU: 7_HARI_TERAKHIR // METRIK_TERAGREGASI
              </div>
            </div>

            <div style={{ display: 'flex', background: 'var(--neutral-100)', borderRadius: 6, padding: 2 }}>
              <button
                onClick={() => setMetricMode('volume')}
                style={{
                  padding: '4px 10px',
                  fontSize: 11,
                  fontWeight: 600,
                  border: 'none',
                  borderRadius: 4,
                  background: metricMode === 'volume' ? 'var(--eco-700)' : 'transparent',
                  color: metricMode === 'volume' ? '#fff' : 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                Volume (Kg)
              </button>
              <button
                onClick={() => setMetricMode('nilai')}
                style={{
                  padding: '4px 10px',
                  fontSize: 11,
                  fontWeight: 600,
                  border: 'none',
                  borderRadius: 4,
                  background: metricMode === 'nilai' ? 'var(--eco-700)' : 'transparent',
                  color: metricMode === 'nilai' ? '#fff' : 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                Nilai TK
              </button>
            </div>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, fontSize: 11, marginBottom: 16 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: '#047857' }} />
              Plastik PET (42%)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: '#10b981' }} />
              Logam & Kaleng (24%)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: '#6ee7b7' }} />
              Kertas & Karton (20%)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: '#a7f3d0' }} />
              Limbah Elektronik (14%)
            </span>
          </div>

          {/* Stacked Bars Graphic */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: 180, padding: '10px 0', borderBottom: '1px solid #e2e8f0' }}>
            {[
              { day: '18/10', val: 780, p1: 40, p2: 25, p3: 20, p4: 15 },
              { day: '19/10', val: 920, p1: 45, p2: 25, p3: 20, p4: 10 },
              { day: '20/10', val: 710, p1: 38, p2: 26, p3: 22, p4: 14 },
              { day: '21/10', val: 1020, p1: 42, p2: 24, p3: 20, p4: 14 },
              { day: '22/10', val: 990, p1: 42, p2: 24, p3: 20, p4: 14 },
              { day: '23/10', val: 840, p1: 40, p2: 25, p3: 20, p4: 15 },
              { day: 'Hari Ini', val: 1140, p1: 44, p2: 26, p3: 18, p4: 12 },
            ].map((col, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 44, height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ width: 34, height: `${(col.val / 1200) * 140}px`, display: 'flex', flexDirection: 'column-reverse', borderRadius: '4px 4px 0 0', overflow: 'hidden' }}>
                  <div style={{ height: `${col.p1}%`, background: '#047857' }} />
                  <div style={{ height: `${col.p2}%`, background: '#10b981' }} />
                  <div style={{ height: `${col.p3}%`, background: '#6ee7b7' }} />
                  <div style={{ height: `${col.p4}%`, background: '#a7f3d0' }} />
                </div>
                <div style={{ fontSize: 10, marginTop: 8, color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
                  {col.day}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: 'var(--eco-800)', fontWeight: 600 }}>
            <span>VOLUME_TERTINGGI: 1.140 KG (HARI INI)</span>
            <span>EFISIENSI_PEMILAHAN: 96,4%</span>
          </div>
        </div>

        {/* Truck Fleet Telemetry */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
                Status Armada & Ritase Truk
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>
                PANTAUAN_TELEMETRI // ARMADA_AKTIF (4 UNIT)
              </div>
            </div>
            <button
              onClick={() => {
                setToast('Data telemetri armada GPS disinkronkan!');
                setTimeout(() => setToast(null), 2500);
              }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}
              title="Perbarui Telemetri"
            >
              🔄
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {trucks.map((truck, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 12px',
                  background: 'var(--neutral-50)',
                  border: '1px solid var(--neutral-200)',
                  borderRadius: 8
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: 12, color: 'var(--text-primary)' }}>
                    {truck.plate} • <span style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>{truck.type}</span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                    {truck.route}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span className={`badge ${truck.statusClass}`} style={{ fontSize: 9 }}>
                    {truck.status}
                  </span>
                  <div style={{ fontSize: 11, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", marginTop: 4 }}>
                    {truck.load}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, paddingTop: 10, borderTop: '1px solid #f1f5f9', fontSize: 11 }}>
            <span style={{ color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>PENGEMUDI_AKTIF: 4/5 SIAP</span>
            <Link href="/admin/master-data" style={{ color: 'var(--eco-700)', fontWeight: 600, textDecoration: 'none' }}>
              Lihat Log Lengkap Ritase →
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Table: Antrean Penimbangan & Klasifikasi Terkini */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>📋</span>
              <span>Antrean Penimbangan & Klasifikasi Terkini</span>
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>
              ALIRAN_MASUK_LANGSUNG // PRIORITAS_TINGGI_DAHULU
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>PENYARING:</span>
            <button
              onClick={() => setActiveFilter('semua')}
              style={{
                padding: '4px 10px',
                borderRadius: 4,
                border: 'none',
                background: activeFilter === 'semua' ? 'var(--eco-700)' : 'var(--neutral-100)',
                color: activeFilter === 'semua' ? '#fff' : 'var(--text-secondary)',
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              SEMUA ({queueList.length})
            </button>
            <button
              onClick={() => setActiveFilter('anomali')}
              style={{
                padding: '4px 10px',
                borderRadius: 4,
                border: 'none',
                background: activeFilter === 'anomali' ? '#dc2626' : 'var(--neutral-100)',
                color: activeFilter === 'anomali' ? '#fff' : 'var(--text-secondary)',
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              ANOMALI (2)
            </button>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ width: '100%', fontSize: 12 }}>
            <thead>
              <tr>
                <th>ID BATCH</th>
                <th>NASABAH / PENGIRIM</th>
                <th>MATERIAL UTAMA</th>
                <th>BOBOT KOTOR</th>
                <th>ESTIMASI TK</th>
                <th>TINGKAT KEYAKINAN AI</th>
                <th style={{ textAlign: 'right' }}>AKSI VERIFIKASI</th>
              </tr>
            </thead>
            <tbody>
              {filteredQueue.map((row) => (
                <tr key={row.id}>
                  <td style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: 'var(--eco-800)' }}>
                    {row.id}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{row.sender}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{row.desc}</div>
                  </td>
                  <td>
                    <span className={`badge ${row.materialClass}`}>{row.material}</span>
                  </td>
                  <td style={{ fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>
                    {row.grossWeight}
                  </td>
                  <td style={{ fontWeight: 700, color: 'var(--eco-600)', fontFamily: "'JetBrains Mono', monospace" }}>
                    {row.estTokens}
                  </td>
                  <td>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--eco-700)', fontWeight: 600 }}>
                      {row.aiConf}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 6 }}>
                      <button
                        onClick={() => handleValidate(row.id)}
                        className="btn btn-primary"
                        style={{ padding: '4px 10px', fontSize: 11 }}
                      >
                        Validasi
                      </button>
                      <button
                        onClick={() => handleReject(row.id)}
                        className="btn btn-secondary"
                        style={{ padding: '4px 10px', fontSize: 11, color: '#dc2626' }}
                      >
                        Tolak
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Pagination */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, paddingTop: 12, borderTop: '1px solid #e2e8f0', fontSize: 11 }}>
          <span style={{ color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
            MENAMPILKAN {filteredQueue.length} DARI 8 ANTREAN PENERIMAAN
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              style={{ padding: '4px 8px', borderRadius: 4, border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}
            >
              ← Sebelumnya
            </button>
            <span style={{ fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>{page} / 3</span>
            <button
              onClick={() => setPage(Math.min(3, page + 1))}
              disabled={page === 3}
              style={{ padding: '4px 8px', borderRadius: 4, border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}
            >
              Selanjutnya →
            </button>
          </div>
        </div>
      </div>

      {/* Dispatch Truck Modal */}
      {showDispatchModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: 12,
            padding: 24,
            width: '100%',
            maxWidth: 420,
            boxShadow: 'var(--shadow-lg)'
          }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, marginBottom: 8 }}>
              Jadwalkan Ritase Truk Pengangkut
            </h3>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 16 }}>
              Armada B-9204-SQU (Truk Pemadat 5 Ton) akan ditugaskan untuk mengangkut limbah padat ke TPST Bantar Gebang.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>Armada Tersedia:</label>
                <div style={{ fontSize: 12, fontWeight: 700, marginTop: 2 }}>B-9204-SQU (Siaga di TPS Tebet)</div>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>Target Destinasi:</label>
                <div style={{ fontSize: 12, fontWeight: 700, marginTop: 2 }}>Gudang Induk Pulogadung / TPST</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                onClick={() => setShowDispatchModal(false)}
                className="btn btn-secondary"
                style={{ fontSize: 12 }}
              >
                Batal
              </button>
              <button
                onClick={() => {
                  setShowDispatchModal(false);
                  setToast('Armada B-9204-SQU berhasil dijadwalkan dispatch!');
                  setTimeout(() => setToast(null), 3000);
                }}
                className="btn btn-primary"
                style={{ fontSize: 12 }}
              >
                Konfirmasi Dispatch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
