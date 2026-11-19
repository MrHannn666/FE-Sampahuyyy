'use client';

import React, { useState } from 'react';

export default function AdminWargaContent() {
  const [selectedDate, setSelectedDate] = useState('Jumat, 25 Oktober 2024');
  const [selectedDayNum, setSelectedDayNum] = useState(25);
  const [selectedSlot, setSelectedSlot] = useState<'pagi' | 'siang'>('pagi');

  // Categories for pickup
  const [categories, setCategories] = useState([
    {
      id: 'pet',
      selected: true,
      name: 'Plastik Botol PET (Bening / Warna)',
      code: 'KODE // PLASTIK-PET-01',
      condition: 'Bersih & Dipipihkan',
      weight: 5.0,
      ratePerKg: 30,
    },
    {
      id: 'kardus',
      selected: true,
      name: 'Kertas & Kardus Tebal (Corrugated)',
      code: 'KODE // KERTAS-BOX-04',
      condition: 'Kering & Diikat',
      weight: 12.0,
      ratePerKg: 20,
    },
    {
      id: 'logam',
      selected: false,
      name: 'Logam & Kaleng Aluminium',
      code: 'KODE // LOGAM-ALU-02',
      condition: 'Kosong & Bersih',
      weight: 0.0,
      ratePerKg: 40,
    },
    {
      id: 'b3',
      selected: true,
      name: 'Baterai Bekas & Sampah Elektronik Kecil (B3)',
      code: 'KODE // B3-ELEK-09',
      condition: 'Wadah Tersegel',
      weight: 0.5,
      ratePerKg: 100,
    },
  ]);

  const [notes, setNotes] = useState('Mohon bunyikan bel pagar, kardus sudah diikat tali rafia dengan rapi.');
  const [toast, setToast] = useState<string | null>(null);

  // Notifications toggles
  const [notifWA, setNotifWA] = useState(true);
  const [notifApproval, setNotifApproval] = useState(true);
  const [notifReminder, setNotifReminder] = useState(false);

  // Calculate totals
  const totalWeight = categories.reduce((sum, item) => (item.selected ? sum + item.weight : sum), 0);
  const totalPoints = categories.reduce((sum, item) => (item.selected ? sum + Math.round(item.weight * item.ratePerKg) : sum), 0);
  const isFreeEligible = totalWeight >= 15.0;

  const handleWeightChange = (id: string, val: number) => {
    setCategories(prev =>
      prev.map(c => (c.id === id ? { ...c, weight: Math.max(0, val) } : c))
    );
  };

  const handleToggleCategory = (id: string) => {
    setCategories(prev =>
      prev.map(c => (c.id === id ? { ...c, selected: !c.selected } : c))
    );
  };

  const handleConfirm = () => {
    setToast(`Permintaan Penjemputan Kurir Terjadwal untuk ${selectedDate} (${selectedSlot.toUpperCase()})!`);
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Toast */}
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

      {/* Top Meta Header */}
      <div style={{
        background: '#ffffff',
        border: '1px solid var(--border-color)',
        borderRadius: 10,
        padding: '10px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        fontSize: 11,
        fontFamily: "'JetBrains Mono', monospace",
        color: 'var(--text-secondary)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 700, color: 'var(--eco-800)' }}>MODUL NASABAH // PENGATURAN DISPATCH</span>
          <span>/</span>
          <span>ID NASABAH: <strong>884-JKT-BUDI</strong></span>
          <span className="badge badge-green" style={{ fontSize: 9 }}>STATUS: TERVERIFIKASI</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span>POS BANK: <strong>TEBET-RW08-04</strong></span>
          <span style={{ color: '#b45309', fontWeight: 700 }}>KEANGGOTAAN: WARGA_TELADAN_GOLD</span>
        </div>
      </div>

      {/* Main Grid: Left Citizen Profile & Right Courier Form */}
      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 16 }}>
        {/* LEFT COLUMN: Profile & Location */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Identitas Nasabah Warga */}
          <div className="card" style={{ padding: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span className="card-title" style={{ fontSize: 13 }}>Identitas Nasabah Warga</span>
              <span className="badge badge-green" style={{ fontSize: 9 }}>KYC TINGKAT 3</span>
            </div>

            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{
                width: 52,
                height: 52,
                borderRadius: 10,
                background: 'var(--eco-100)',
                color: 'var(--eco-800)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                fontWeight: 700
              }}>
                👤
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>Budi Santoso</span>
                  <span style={{ color: 'var(--eco-600)', fontSize: 14 }}>✔</span>
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>
                  NIK: 3174092104880004
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
                  WhatsApp: +62 812-3456-7890
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
                  No. Anggota: BS-7749-ID
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 14, paddingTop: 12, borderTop: '1px solid #f1f5f9' }}>
              <div style={{ padding: '8px 10px', background: 'var(--eco-50)', borderRadius: 6, border: '1px solid var(--eco-200)' }}>
                <div style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>TOTAL SETORAN</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--eco-900)', marginTop: 2 }}>142,8 kg</div>
              </div>
              <div style={{ padding: '8px 10px', background: 'var(--eco-50)', borderRadius: 6, border: '1px solid var(--eco-200)' }}>
                <div style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>SKOR PEMILAHAN</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--eco-900)', marginTop: 2 }}>99,2%</div>
              </div>
            </div>
          </div>

          {/* Alamat Titik Jemput Utama */}
          <div className="card" style={{ padding: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>
                <span>📍</span>
                <span>ALAMAT TITIK JEMPUT UTAMA</span>
              </div>
              <span className="badge badge-green" style={{ fontSize: 9 }}>ALAMAT UTAMA</span>
            </div>

            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
              Rumah Utama (Setoran Rutin)
            </div>
            <p style={{ fontSize: 11, color: 'var(--text-secondary)', margin: '4px 0 10px', lineHeight: 1.4 }}>
              Jl. Tebet Timur Dalam VI No. 14, RT 05 / RW 08, Kel. Tebet Timur, Kec. Tebet, Kota Jakarta Selatan, DKI Jakarta 12820
            </p>

            {/* GPS coordinates & Radar box */}
            <div style={{ padding: 10, background: 'var(--neutral-50)', borderRadius: 8, border: '1px solid var(--neutral-200)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontFamily: "'JetBrains Mono', monospace", marginBottom: 6 }}>
                <span style={{ fontWeight: 700 }}>KOORDINAT SATELIT GPS</span>
                <span className="badge badge-green" style={{ fontSize: 8 }}>Akurasi GPS ±5m</span>
              </div>
              <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: 'var(--eco-800)', display: 'flex', gap: 12 }}>
                <span>LAT: -6.229712</span>
                <span>BUJUR: 106.846734</span>
              </div>

              {/* Radar visualization */}
              <div style={{
                marginTop: 8,
                height: 70,
                background: '#042f24',
                borderRadius: 6,
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                <div style={{ position: 'absolute', width: 50, height: 50, borderRadius: '50%', border: '1px dashed #10b981', opacity: 0.6 }} />
                <div style={{ position: 'absolute', width: 30, height: 30, borderRadius: '50%', border: '1px solid #34d399', opacity: 0.8 }} />
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#34d399', boxShadow: '0 0 8px #34d399' }} />
                <span style={{ position: 'absolute', bottom: 4, fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: '#a7f3d0' }}>
                  ZONA JEMPUT // RW-08 TEBET
                </span>
              </div>
            </div>

            {/* Alternatif Lokasi */}
            <div style={{ marginTop: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>
                <span>LOKASI ALTERNATIF (2)</span>
                <button
                  onClick={() => {
                    setToast('Fitur tambah titik kumpul dibuka');
                    setTimeout(() => setToast(null), 2000);
                  }}
                  style={{ background: 'none', border: 'none', color: 'var(--eco-700)', fontSize: 11, cursor: 'pointer', fontWeight: 600 }}
                >
                  + Tambah
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 8px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 11 }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>Toko Kelontong Berkah</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Jl. Tebet Raya No. 42A, Jaksel</div>
                  </div>
                  <button className="btn btn-secondary" style={{ padding: '2px 8px', fontSize: 10 }}>Pilih</button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 8px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 11 }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>Studio Tebet Barat</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Jl. Tebet Barat Dalam IX No. 2</div>
                  </div>
                  <button className="btn btn-secondary" style={{ padding: '2px 8px', fontSize: 10 }}>Pilih</button>
                </div>
              </div>
            </div>
          </div>

          {/* Preferensi Notifikasi */}
          <div className="card" style={{ padding: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>
              PREFERENSI NOTIFIKASI PENJEMPUTAN
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 11, cursor: 'pointer' }}>
                <input type="checkbox" checked={notifWA} onChange={() => setNotifWA(!notifWA)} style={{ marginTop: 2 }} />
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Notifikasi Penjemputan WhatsApp</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Perkiraan waktu tiba armada & kontak kurir</div>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 11, cursor: 'pointer' }}>
                <input type="checkbox" checked={notifApproval} onChange={() => setNotifApproval(!notifApproval)} style={{ marginTop: 2 }} />
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Pemberitahuan Persetujuan Setoran</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Hasil timbangan resmi & verifikasi kualitas</div>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 11, cursor: 'pointer' }}>
                <input type="checkbox" checked={notifReminder} onChange={() => setNotifReminder(!notifReminder)} style={{ marginTop: 2 }} />
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Pengingat Tukar Kupon & Poin Eco</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Pemberitahuan hadiah mingguan nasabah</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Formulir Permintaan Kurir Penjemputan Sampah Terpilah */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card" style={{ padding: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: 'var(--eco-700)', fontWeight: 700 }}>
                  LAYANAN JEMPUT SAMPAH // NOMOR PERMINTAAN: JMP-094
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 800, margin: '4px 0', color: 'var(--text-primary)' }}>
                  Formulir Permintaan Kurir Penjemputan Sampah Terpilah
                </h2>
              </div>

              <span className="badge badge-green" style={{ fontSize: 10, padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>🛵</span>
                <span>ARMADA: MOTOR LISTRIK RODA TIGA</span>
              </span>
            </div>

            {/* 1. Tanggal & 2. Slot Waktu Penjemputan Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16, marginBottom: 18 }}>
              {/* 1. Tanggal Penjemputan */}
              <div style={{ padding: 12, background: 'var(--neutral-50)', borderRadius: 8, border: '1px solid var(--neutral-200)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)' }}>
                    1. TANGGAL PENJEMPUTAN (PILIH JADWAL)
                  </span>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button style={{ padding: '2px 6px', fontSize: 10, border: '1px solid #ccc', background: '#fff', borderRadius: 4, cursor: 'pointer' }}>‹</button>
                    <button style={{ padding: '2px 6px', fontSize: 10, border: '1px solid #ccc', background: '#fff', borderRadius: 4, cursor: 'pointer' }}>›</button>
                  </div>
                </div>

                <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>Oktober 2024 (Wilayah Tebet)</div>

                {/* Day selector row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, textAlign: 'center', fontSize: 10 }}>
                  {['SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB', 'MIN'].map((day, i) => (
                    <div key={i} style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{day}</div>
                  ))}
                  {[20, 21, 22, 23, 24, 25, 26].map((num) => (
                    <button
                      key={num}
                      onClick={() => {
                        setSelectedDayNum(num);
                        setSelectedDate(`${num === 25 ? 'Jumat' : 'Hari'}, ${num} Oktober 2024`);
                      }}
                      style={{
                        padding: '6px 2px',
                        borderRadius: 6,
                        border: 'none',
                        background: selectedDayNum === num ? 'var(--eco-700)' : '#ffffff',
                        color: selectedDayNum === num ? '#ffffff' : 'var(--text-primary)',
                        fontWeight: selectedDayNum === num ? 700 : 500,
                        cursor: 'pointer',
                        boxShadow: 'var(--shadow-sm)'
                      }}
                    >
                      {num}
                    </button>
                  ))}
                </div>

                <div style={{ marginTop: 10, paddingTop: 8, borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11 }}>
                  <span style={{ color: 'var(--text-muted)' }}>Tanggal Terpilih:</span>
                  <span className="badge badge-green" style={{ fontSize: 10, fontWeight: 700 }}>
                    {selectedDate}
                  </span>
                </div>
              </div>

              {/* 2. Slot Waktu Penjemputan */}
              <div style={{ padding: 12, background: 'var(--neutral-50)', borderRadius: 8, border: '1px solid var(--neutral-200)' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>
                  2. SLOT WAKTU PENJEMPUTAN
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {/* Pagi */}
                  <div
                    onClick={() => setSelectedSlot('pagi')}
                    style={{
                      padding: '8px 10px',
                      background: selectedSlot === 'pagi' ? 'var(--eco-50)' : '#ffffff',
                      border: selectedSlot === 'pagi' ? '2px solid var(--eco-500)' : '1px solid var(--neutral-300)',
                      borderRadius: 6,
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: 12, color: 'var(--text-primary)' }}>☼ Pagi (08:30 - 11:30 WIB)</span>
                      <span className={`badge ${selectedSlot === 'pagi' ? 'badge-green' : 'badge-yellow'}`} style={{ fontSize: 8 }}>
                        {selectedSlot === 'pagi' ? 'DIPILIH' : 'TERSEDIA'}
                      </span>
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
                      Kapasitas Kurir: Tersedia 3 Kuota Armada
                    </div>
                  </div>

                  {/* Siang */}
                  <div
                    onClick={() => setSelectedSlot('siang')}
                    style={{
                      padding: '8px 10px',
                      background: selectedSlot === 'siang' ? 'var(--eco-50)' : '#ffffff',
                      border: selectedSlot === 'siang' ? '2px solid var(--eco-500)' : '1px solid var(--neutral-300)',
                      borderRadius: 6,
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: 12, color: 'var(--text-primary)' }}>⛅ Siang (13:30 - 16:30 WIB)</span>
                      <span className={`badge ${selectedSlot === 'siang' ? 'badge-green' : 'badge-yellow'}`} style={{ fontSize: 8 }}>
                        {selectedSlot === 'siang' ? 'DIPILIH' : 'TERSEDIA'}
                      </span>
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
                      Kapasitas Kurir: Tersedia 1 Kuota Armada
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: 8, fontSize: 10, color: 'var(--text-muted)', fontStyle: 'italic', lineHeight: 1.3 }}>
                  ℹ Kurir akan membagikan lokasi langsung (live GPS) 15 menit sebelum menuju titik jemput.
                </div>
              </div>
            </div>

            {/* 3. Kategori Sampah Terpilah & Estimasi Bobot */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)' }}>
                  3. KATEGORI SAMPAH TERPILAH & ESTIMASI BOBOT
                </span>
                <span className="badge badge-green" style={{ fontSize: 9 }}>
                  Minimal Penjemputan Gratis: 15,0 kg
                </span>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table className="data-table" style={{ width: '100%', fontSize: 12 }}>
                  <thead>
                    <tr>
                      <th style={{ width: 40 }}>PILIH</th>
                      <th>KLASIFIKASI SAMPAH</th>
                      <th>KONDISI / STANDAR</th>
                      <th style={{ width: 120 }}>ESTIMASI BOBOT (KG)</th>
                      <th style={{ textAlign: 'right', width: 130 }}>PEROLEHAN POIN</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((cat) => (
                      <tr key={cat.id}>
                        <td>
                          <input
                            type="checkbox"
                            checked={cat.selected}
                            onChange={() => handleToggleCategory(cat.id)}
                          />
                        </td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{cat.name}</div>
                          <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>{cat.code}</div>
                        </td>
                        <td>
                          <span className="badge badge-green" style={{ fontSize: 9 }}>{cat.condition}</span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <input
                              type="number"
                              step="0.5"
                              disabled={!cat.selected}
                              value={cat.weight}
                              onChange={(e) => handleWeightChange(cat.id, parseFloat(e.target.value) || 0)}
                              style={{
                                width: 64,
                                padding: '4px 8px',
                                fontSize: 12,
                                fontWeight: 700,
                                borderRadius: 4,
                                border: '1px solid var(--neutral-300)',
                                textAlign: 'right',
                                background: cat.selected ? '#fff' : '#f1f5f9'
                              }}
                            />
                            <span>kg</span>
                          </div>
                        </td>
                        <td style={{ textAlign: 'right', fontWeight: 700, color: cat.selected ? 'var(--eco-700)' : 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
                          {cat.selected ? `+${Math.round(cat.weight * cat.ratePerKg)} POIN` : '0 POIN'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Total Bobot & Poin Box */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 18px',
              background: 'var(--eco-50)',
              border: '1px solid var(--eco-300)',
              borderRadius: 8,
              marginBottom: 16
            }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
                  TOTAL ESTIMASI BOBOT SAMPAH:
                </div>
                <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--eco-900)' }}>
                  {totalWeight.toFixed(1)} <span style={{ fontSize: 14 }}>kg</span>
                </div>
                <div style={{ fontSize: 11, color: isFreeEligible ? 'var(--eco-700)' : '#dc2626', fontWeight: 600, marginTop: 2 }}>
                  {isFreeEligible
                    ? '✔ Memenuhi syarat minimal 15 kg untuk fasilitas jemput gratis wilayah Tebet.'
                    : '⚠ Kurang dari 15 kg (dikenakan biaya jemput Rp 10.000 atau tambahkan sampah).'}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
                  ESTIMASI POIN DIPEROLEH:
                </div>
                <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--eco-700)' }}>
                  {totalPoints} <span style={{ fontSize: 14 }}>POIN</span>
                </div>
              </div>
            </div>

            {/* 4. Catatan Khusus Textarea */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 4 }}>
                <span>4. CATATAN KHUSUS UNTUK PETUGAS / KURIR PENJEMPUT</span>
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Maksimal 250 karakter</span>
              </div>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  fontSize: 12,
                  borderRadius: 6,
                  border: '1px solid var(--neutral-300)',
                  outline: 'none'
                }}
              />
            </div>

            {/* Bottom Actions Bar */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: 14,
              borderTop: '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: 'var(--eco-800)' }}>
                <span>🛡</span>
                <span>DATA TERENKRIPSI AMAN // SISTEM BANK SAMPAH CERDAS</span>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => {
                    setToast('Draf penjemputan disimpan!');
                    setTimeout(() => setToast(null), 2500);
                  }}
                  className="btn btn-secondary"
                  style={{ padding: '8px 16px', fontSize: 12 }}
                >
                  Simpan Draf
                </button>
                <button
                  onClick={handleConfirm}
                  className="btn btn-primary"
                  style={{ padding: '8px 20px', fontSize: 12, fontWeight: 700 }}
                >
                  ✔ Konfirmasi Jadwal Penjemputan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
