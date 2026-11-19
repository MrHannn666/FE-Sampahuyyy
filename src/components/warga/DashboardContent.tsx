'use client';

import Link from 'next/link';

export default function DashboardContent() {
  return (
    <>
      {/* ===== TOP STATS ROW ===== */}
      <div className="grid-4" style={{ marginBottom: 20 }}>
        {/* Saldo EcoToken */}
        <div className="card animate-fade-in delay-1">
          <div className="card-header">
            <span className="card-title">Saldo EcoToken</span>
            <div className="card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><path d="M12 6v12M6 12h12" />
              </svg>
            </div>
          </div>
          <div className="stat-value">1.450 <span className="stat-unit">TK</span></div>
          <div className="stat-change positive">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /></svg>
            +128 ago ini
          </div>
          <div className="stat-sub" style={{ marginTop: 4, fontSize: 11, color: 'var(--eco-600)', cursor: 'pointer' }}>TUKAR →</div>
        </div>

        {/* Total Setoran Sampah */}
        <div className="card animate-fade-in delay-2">
          <div className="card-header">
            <span className="card-title">Total Setoran Sampah</span>
            <div className="card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" />
              </svg>
            </div>
          </div>
          <div className="stat-value">42,8 <span className="stat-unit">kg</span></div>
          <div className="stat-sub">
            Siklus: Bulan{' '}
            <strong style={{ color: 'var(--eco-700)' }}>9</strong> Kumpulan Valid
          </div>
          <div className="stat-sub" style={{ fontSize: 11 }}>Sasaran: ~6 Bibit Pohon</div>
        </div>

        {/* Pengurangan Emisi Karbon */}
        <div className="card animate-fade-in delay-3">
          <div className="card-header">
            <span className="card-title">Pengurangan Emisi Karbon</span>
            <div className="card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
          </div>
          <div className="stat-value">84,2 <span className="stat-unit">kg CO₂e</span></div>
          <div className="stat-sub">Setara: ~6 Bibit Pohon</div>
          <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--eco-500)" strokeWidth="2"><polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /></svg>
          </div>
        </div>

        {/* Titik Pengumpulan Aktif */}
        <div className="card animate-fade-in delay-4">
          <div className="card-header">
            <span className="card-title">Titik Pengumpulan Aktif</span>
            <div className="card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
              </svg>
            </div>
          </div>
          <div className="stat-value">14 <span className="stat-unit">Lokasi</span></div>
          <div className="stat-sub">DKI Jakarta 6 Sektor</div>
          <div className="badge badge-green" style={{ marginTop: 6 }}>100% AKTIF</div>
        </div>
      </div>

      {/* ===== ACTION CARDS ROW ===== */}
      <div className="grid-2" style={{ marginBottom: 20 }}>
        {/* Pindai Sampah */}
        <div className="action-card animate-fade-in delay-2">
          <div className="action-card-content">
            <div className="action-card-badge">
              <span className="badge badge-green">OPTIK YOLOv8 v4.2</span>
              <span className="badge badge-outline">LATENSI &lt; 200MS</span>
            </div>
            <h3>Pindai Sampah Cerdas Sekarang</h3>
            <p>Arahkan kamera ke kemasan plastik, kaleng, atau kertas untuk deteksi fraksi dan perhitungan reward seketika.</p>
          </div>
          <Link href="/warga/pemeriksaan" className="btn btn-primary btn-lg" style={{ textDecoration: 'none' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" />
            </svg>
            BUKA PEMINDAI
          </Link>
        </div>

        {/* Jadwal Penjemputan */}
        <div className="action-card animate-fade-in delay-3">
          <div className="action-card-content">
            <div className="action-card-badge">
              <span className="badge badge-outline">LAYANAN LOGISTIK</span>
              <span className="badge badge-outline">ARMADA LISTRIK</span>
            </div>
            <h3>Jadwalkan Penjemputan</h3>
            <p>Minimal akumulasi 15 kg. Kurir tersertifikasi mengambil langsung dari rumah tanpa biaya transport.</p>
          </div>
          <Link href="/warga/jadwal-penjemputan" className="btn btn-outline btn-lg" style={{ textDecoration: 'none' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            PILIH JADWAL
          </Link>
        </div>
      </div>

      {/* ===== TPS LIST + MAP ===== */}
      <div className="grid-2" style={{ marginBottom: 20 }}>
        {/* TPS List */}
        <div className="card animate-fade-in delay-3">
          <div className="section-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
            </svg>
            <span className="section-title">Daftar Titik Pengumpulan Terdekat</span>
            <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>RADIUS: &lt; 5,0 KM</span>
          </div>

          <div className="tps-list">
            {/* TPS 1 */}
            <div className="tps-card">
              <div className="tps-card-header">
                <div>
                  <div className="tps-name">TPS Tebet Barat 3R</div>
                  <span className="tps-id">ID-JKT-082</span>
                </div>
                <span className="status-badge status-operasional">OPERASIONAL</span>
              </div>
              <div className="tps-meta">
                <span>🕐 Buka • 08:00 - 17:00</span>
                <span>📍 1,2 km dari Anda</span>
              </div>
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Kapasitas Kontainer Smart Bin:</div>
                <div className="progress-bar">
                  <div className="progress-fill green" style={{ width: '45%' }} />
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>45% (Optimal)</div>
              </div>
              <div className="tps-materials">Menerima: PET, HDPE, Logam, Kardus</div>
              <div className="tps-footer">
                <a href="#" style={{ fontSize: 11, color: 'var(--eco-600)', textDecoration: 'none', fontWeight: 600 }}>Rute ➜</a>
              </div>
            </div>

            {/* TPS 2 */}
            <div className="tps-card">
              <div className="tps-card-header">
                <div>
                  <div className="tps-name">TPS Cilandak Sentral</div>
                  <span className="tps-id">ID-JKT-104</span>
                </div>
                <span className="status-badge status-hampir-penuh">
                  HAMPIR PENUH
                </span>
              </div>
              <div className="tps-meta">
                <span>🕐 Buka • 07:30 - 18:00</span>
                <span>📍 2,8 km dari Anda</span>
              </div>
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Kapasitas Kontainer Smart Bin:</div>
                <div className="progress-bar">
                  <div className="progress-fill red" style={{ width: '92%' }} />
                </div>
                <div style={{ fontSize: 10, color: 'var(--status-danger)', marginTop: 2 }}>92% (Perlu Pengosongan)</div>
              </div>
              <div className="tps-materials">Menerima: Botol Kaca, Plastik Film, Tetrapak</div>
              <div className="tps-footer">
                <a href="#" style={{ fontSize: 11, color: 'var(--eco-600)', textDecoration: 'none', fontWeight: 600 }}>Rute ➜</a>
              </div>
            </div>

            {/* TPS 3 */}
            <div className="tps-card">
              <div className="tps-card-header">
                <div>
                  <div className="tps-name">TPS Menteng Heritage</div>
                  <span className="tps-id">ID-JKT-019</span>
                </div>
                <span className="status-badge status-operasional">OPERASIONAL</span>
              </div>
              <div className="tps-meta">
                <span>🕐 Buka • 08:00 - 16:30</span>
                <span>📍 3,6 km dari Anda</span>
              </div>
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Kapasitas Kontainer Smart Bin:</div>
                <div className="progress-bar">
                  <div className="progress-fill green" style={{ width: '30%' }} />
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>30% (Lapang)</div>
              </div>
              <div className="tps-materials">Menerima: Semua Kategori Anorganik</div>
              <div className="tps-footer">
                <a href="#" style={{ fontSize: 11, color: 'var(--eco-600)', textDecoration: 'none', fontWeight: 600 }}>Rute ➜</a>
              </div>
            </div>

            {/* TPS 4 */}
            <div className="tps-card">
              <div className="tps-card-header">
                <div>
                  <div className="tps-name">TPS Kuningan Cyber Pod</div>
                  <span className="tps-id">ID-JKT-044</span>
                </div>
                <span className="status-badge status-mandiri">MANDIRI</span>
              </div>
              <div className="tps-meta">
                <span>🕐 Buka • 24 Jam</span>
                <span>📍 4,1 km dari Anda</span>
              </div>
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Kapasitas Kontainer Smart Bin:</div>
                <div className="progress-bar">
                  <div className="progress-fill green" style={{ width: '62%' }} />
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>62% (Normal)</div>
              </div>
              <div className="tps-materials">Menerima: Limbah Elektronik, Baterai, Botol Plastik</div>
              <div className="tps-footer">
                <a href="#" style={{ fontSize: 11, color: 'var(--eco-600)', textDecoration: 'none', fontWeight: 600 }}>Rute ➜</a>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 12, fontSize: 11, color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
            <span>Menampilkan 4 dari 14 Lokasi</span>
            <a href="#" style={{ color: 'var(--eco-600)', textDecoration: 'none', fontWeight: 600 }}>Lihat Semua Aktif Radius →</a>
          </div>
        </div>

        {/* Map */}
        <div className="card animate-fade-in delay-4">
          <div className="section-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" /><line x1="8" y1="2" x2="8" y2="18" /><line x1="16" y1="6" x2="16" y2="22" />
            </svg>
            <span className="section-title">Peta Telemetri Spasial</span>
            <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
              EPSG:4326 // DKI JAKARTA SEKTOR SELATAN
            </span>
          </div>

          <div className="map-container" style={{ height: 420 }}>
            <div className="map-grid" />
            <div className="map-overlay" />

            {/* Scale bar */}
            <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 4, zIndex: 5 }}>
              <button className="btn btn-sm btn-outline" style={{ padding: '4px 8px', minWidth: 28 }}>+</button>
              <button className="btn btn-sm btn-outline" style={{ padding: '4px 8px', minWidth: 28 }}>−</button>
            </div>
            <div style={{ position: 'absolute', top: 12, left: 12, fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-muted)', zIndex: 5 }}>
              SKALA KISI // 1:25.000 METRIK
            </div>

            {/* Map markers */}
            <div className="map-marker" style={{ top: '25%', left: '65%' }}>
              <div className="map-marker-label">TPS Nantong (36%)</div>
              <div className="map-marker-dot normal">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="5" /></svg>
              </div>
            </div>

            <div className="map-marker" style={{ top: '45%', left: '70%' }}>
              <div className="map-marker-label">TPS Tebet Barat 3R — KAP 45%</div>
              <div className="map-marker-dot normal">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="5" /></svg>
              </div>
            </div>

            <div className="map-marker" style={{ top: '55%', left: '50%' }}>
              <div className="map-marker-label">Jakarta-Massa</div>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--eco-600)', border: '2px solid white', boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }} />
            </div>

            <div className="map-marker" style={{ top: '50%', left: '80%' }}>
              <div className="map-marker-label">TPS Kuningan (62%)</div>
              <div className="map-marker-dot normal">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="5" /></svg>
              </div>
            </div>

            <div className="map-marker" style={{ top: '70%', left: '40%' }}>
              <div className="map-marker-label">TPS Cilandak Sentral — 2,8 KM — PENUH 92%</div>
              <div className="map-marker-dot danger">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 9v4M12 17h.01" /><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /></svg>
              </div>
            </div>

            {/* Legend */}
            <div style={{ position: 'absolute', bottom: 12, left: 12, fontSize: 10, display: 'flex', gap: 16, zIndex: 5 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--eco-500)' }} />
                <span style={{ color: 'var(--text-secondary)' }}>NORMAL (&lt; 75%)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--status-danger)' }} />
                <span style={{ color: 'var(--text-secondary)' }}>PENUH (&gt; 90%)</span>
              </div>
            </div>
          </div>

          {/* Map stats */}
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>STATUS SENSOR IOT:</span>
              <span style={{ fontWeight: 600 }}>14/14 Node Ultrasonik Siap</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>DATA-RATA KAPASITAS REGIONAL:</span>
              <span style={{ fontWeight: 600 }}>57,25%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
              <button className="btn btn-outline btn-sm">MUAT ULANG DATA</button>
            </div>
          </div>
        </div>
      </div>

      {/* ===== BUKU CATATAN PENYETORAN TERKINI ===== */}
      <div className="card animate-fade-in delay-5">
        <div className="section-header" style={{ marginBottom: 4 }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
          </svg>
          <span className="section-title">Buku Catatan Penyetoran Terkini</span>
          <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
            VERIFIKASI BLOK TERAKHIR: A048821
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>ID Kumpulan</th>
                <th>Stempel Waktu</th>
                <th>Titik Pengumpulan</th>
                <th>Klasifikasi Fraksi Utama</th>
                <th>Berat Bersih</th>
                <th>Akurasi Optik</th>
                <th>Kredit EcoToken</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-mono" style={{ fontSize: 11, fontWeight: 600 }}>0x7F-9921</td>
                <td>
                  <div style={{ fontSize: 12 }}>3 Okt,</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>19:14 WIB</div>
                </td>
                <td>TPS Tebet Barat 3R</td>
                <td>
                  <span className="badge badge-green">
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--eco-500)', display: 'inline-block' }} />
                    PET Bening
                  </span>
                </td>
                <td style={{ fontWeight: 600 }}>3,40 kg</td>
                <td style={{ fontWeight: 600 }}>98,8%</td>
                <td style={{ fontWeight: 700, color: 'var(--eco-700)' }}>+102 TK</td>
                <td><span className="badge badge-green">TERKONFIRMASI</span></td>
              </tr>
              <tr>
                <td className="font-mono" style={{ fontSize: 11, fontWeight: 600 }}>0x7F-8884</td>
                <td>
                  <div style={{ fontSize: 12 }}>29 Okt,</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>15:42 WIB</div>
                </td>
                <td>TPS Menteng Heritage</td>
                <td>
                  <span className="badge badge-yellow">
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />
                    Karton & Dupleks
                  </span>
                </td>
                <td style={{ fontWeight: 600 }}>8,15 kg</td>
                <td style={{ fontWeight: 600 }}>99,2%</td>
                <td style={{ fontWeight: 700, color: 'var(--eco-700)' }}>+160 TK</td>
                <td><span className="badge badge-green">TERKONFIRMASI</span></td>
              </tr>
              <tr>
                <td className="font-mono" style={{ fontSize: 11, fontWeight: 600 }}>0x7F-4810</td>
                <td>
                  <div style={{ fontSize: 12 }}>21 Okt,</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>09:28 WIB</div>
                </td>
                <td>TPS Kuningan Cyber Pod</td>
                <td>
                  <span className="badge badge-gray">
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--neutral-400)', display: 'inline-block' }} />
                    Kaleng Aluminium
                  </span>
                </td>
                <td style={{ fontWeight: 600 }}>1,80 kg</td>
                <td style={{ fontWeight: 600 }}>97,5%</td>
                <td style={{ fontWeight: 700, color: 'var(--eco-700)' }}>+180 TK</td>
                <td><span className="badge badge-green">TERKONFIRMASI</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border-color)', fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-muted)' }}>
          <span>🔗 Hash SHA-256 Integritas Data Aktif</span>
          <div style={{ display: 'flex', gap: 16 }}>
            <a href="#" style={{ color: 'var(--eco-600)', textDecoration: 'none', fontWeight: 600 }}>Unduh Salinan CSV</a>
            <a href="#" style={{ color: 'var(--eco-600)', textDecoration: 'none', fontWeight: 600 }}>Lihat Audit Lengkap →</a>
          </div>
        </div>
      </div>
    </>
  );
}
