'use client';

import { useState } from 'react';

const transactions = [
  { id: 'TRX-20241023-0891', date: '23 Okt, 14:20', category: 'PLASTIK', categoryColor: 'badge-green', item: 'Botol PET Bening', weight: '3.20 kg', token: '+256 TK', status: 'SELESAI' },
  { id: 'TRX-20241021-0412', date: '21 Okt, 10:15', category: 'LOGAM', categoryColor: 'badge-gray', item: 'Kaleng Minuman Alu...', weight: '1.85 kg', token: '+320 TK', status: 'SELESAI' },
  { id: 'TRX-20241019-1102', date: '19 Okt, 16:45', category: 'KERTAS', categoryColor: 'badge-yellow', item: 'Kardus Cokelat Tebal', weight: '12.40 kg', token: '+186 TK', status: 'SELESAI' },
  { id: 'TRX-20241018-0930', date: '18 Okt, 09:12', category: 'ELEKTRONIK', categoryColor: 'badge-blue', item: 'Baterai Lithium Bekas', weight: '0.45 kg', token: '+150 TK', status: 'MENUNGGU VERIFIKASI' },
  { id: 'TRX-20241015-0210', date: '15 Okt, 11:00', category: 'PLASTIK', categoryColor: 'badge-green', item: 'Gelas Plastik PP', weight: '2.10 kg', token: '+84 TK', status: 'SELESAI' },
];

export default function BukuBesarContent() {
  const [selectedTrx, setSelectedTrx] = useState(transactions[0]);
  const [activeStatus, setActiveStatus] = useState('Semua');
  const [activeCategory, setActiveCategory] = useState('SEMUA');
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const handleExportCSV = () => {
    const csv = "data:text/csv;charset=utf-8,ID,Tanggal,Kategori,Barang,Berat,Token,Status\n"
      + transactions.map(t => `${t.id},"${t.date}",${t.category},"${t.item}",${t.weight},${t.token},${t.status}`).join("\n");
    const encodedUri = encodeURI(csv);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `buku_besar_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setToast('Berkas CSV transaksi berhasil diunduh!');
    setTimeout(() => setToast(null), 2500);
  };

  const handleResetFilters = () => {
    setActiveStatus('Semua');
    setActiveCategory('SEMUA');
    setSearchQuery('');
    setToast('Penyaring transaksi diatur ulang.');
    setTimeout(() => setToast(null), 2000);
  };

  const filteredTransactions = transactions.filter((t) => {
    const matchesStatus =
      activeStatus === 'Semua' ||
      (activeStatus === 'Selesai' && t.status === 'SELESAI') ||
      (activeStatus === 'Menunggu' && t.status.includes('MENUNGGU')) ||
      (activeStatus === 'Ditolak' && t.status === 'DITOLAK');

    const matchesCat =
      activeCategory === 'SEMUA' ||
      (activeCategory.includes('PLASTIK') && t.category === 'PLASTIK') ||
      (activeCategory.includes('KERTAS') && t.category === 'KERTAS') ||
      (activeCategory.includes('LOGAM') && t.category === 'LOGAM') ||
      (activeCategory.includes('ELEKTRONIK') && t.category === 'ELEKTRONIK');

    const matchesQuery =
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.item.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesCat && matchesQuery;
  });

  return (
    <>
      {toast && (
        <div style={{
          position: 'fixed',
          top: 60,
          right: 20,
          background: 'var(--eco-700)',
          color: '#ffffff',
          padding: '10px 18px',
          borderRadius: 8,
          boxShadow: 'var(--shadow-lg)',
          zIndex: 100,
          fontSize: 12,
          fontWeight: 600,
        }}>
          ✔ {toast}
        </div>
      )}

      {/* Page Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace", marginBottom: 4 }}>
            BUKU_BESAR_NASABAH // RIWAYAT PENYETORAN // TAMPILAN_1440
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px' }}>Riwayat Transaksi & Detail Setoran</h2>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ textAlign: 'right', fontSize: 11 }}>
            <div style={{ color: 'var(--text-muted)' }}>TOTAL AKUMULASI BERSIH</div>
            <div style={{ fontWeight: 800, fontSize: 18 }}>20.00 <span style={{ fontWeight: 500, color: 'var(--text-muted)' }}>KG</span></div>
          </div>
          <div style={{ textAlign: 'right', fontSize: 11 }}>
            <div style={{ color: 'var(--text-muted)' }}>IMBALAN TOKEN DITERIMA</div>
            <div style={{ fontWeight: 800, fontSize: 18, color: 'var(--eco-700)' }}>+996 <span style={{ fontWeight: 500 }}>TK</span></div>
          </div>
          <button onClick={handleExportCSV} className="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
            Ekspor Berkas CSV
          </button>
        </div>
      </div>

      {/* Search + Filters */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
        <div className="search-input" style={{ maxWidth: 280 }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input
            placeholder="Cari ID transaksi atau nama..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <span onClick={() => setSearchQuery('')} style={{ cursor: 'pointer', color: 'var(--text-muted)' }}>✕</span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
          <span style={{ color: 'var(--text-muted)' }}>STATUS:</span>
          <div className="filter-tabs">
            {['Semua (26)', 'Selesai (18)', 'Menunggu (6)', 'Ditolak (2)'].map((tab) => {
              const name = tab.split(' ')[0];
              return (
                <button
                  key={tab}
                  className={`filter-tab ${activeStatus === name ? 'active' : ''}`}
                  onClick={() => setActiveStatus(name)}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
          <span style={{ color: 'var(--text-muted)' }}>KATEGORI:</span>
          <div className="category-pills">
            {['SEMUA', 'PLASTIK PET/HDPE', 'KERTAS & KARTON', 'LOGAM & KALENG', 'ELEKTRONIK E-WASTE'].map((cat) => (
              <button
                key={cat}
                className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <button onClick={handleResetFilters} className="btn btn-outline btn-sm" style={{ marginLeft: 'auto' }}>
          ⇄ Atur Ulang Penyaring
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 20 }}>
        {/* LEFT: Table */}
        <div>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', background: 'var(--eco-50)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--eco-500)' }} />
                TABEL VALIDASI PENYETORAN (Menampilkan 5 dari 24 catatan)
              </div>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Urutkan: Waktu Terbaru ↓</span>
            </div>

            <table className="data-table">
              <thead>
                <tr>
                  <th>ID Transaksi</th>
                  <th>Tanggal & Waktu</th>
                  <th>Kategori</th>
                  <th>Nama Barang</th>
                  <th>Berat Bersih</th>
                  <th>EcoToken</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>
                      Tidak ada transaksi yang cocok dengan kriteria pencarian.
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((trx) => (
                    <tr
                      key={trx.id}
                      className={selectedTrx.id === trx.id ? 'selected' : ''}
                      onClick={() => setSelectedTrx(trx)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td>
                        <div className="font-mono" style={{ fontSize: 11, fontWeight: 700, color: 'var(--eco-700)' }}>
                          {selectedTrx.id === trx.id && '▸ '}{trx.id}
                        </div>
                      </td>
                      <td style={{ fontSize: 12 }}>{trx.date}</td>
                      <td><span className={`badge ${trx.categoryColor}`}>{trx.category}</span></td>
                      <td style={{ fontSize: 12 }}>{trx.item}</td>
                      <td style={{ fontWeight: 600, fontSize: 12 }}>{trx.weight}</td>
                      <td style={{ fontWeight: 700, color: 'var(--eco-700)', fontSize: 12 }}>{trx.token}</td>
                      <td>
                        <span className={`badge ${trx.status === 'SELESAI' ? 'badge-green' : 'badge-yellow'}`}>
                          {trx.status === 'MENUNGGU VERIFIKASI' && '⏳ '}
                          {trx.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <div className="pagination" style={{ padding: '12px 16px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Baris per halaman: 10</span>
              <span style={{ marginLeft: 'auto', fontSize: 11 }}>Halaman 1 dari 3</span>
              <button>‹</button>
              <button>›</button>
            </div>
          </div>

          {/* Bottom stats */}
          <div className="stats-bottom-row" style={{ marginTop: 16 }}>
            <div className="card" style={{ padding: 16 }}>
              <div className="card-header" style={{ marginBottom: 8 }}>
                <span className="card-title">Rata-rata Akurasi AI</span>
                <div className="card-icon" style={{ width: 24, height: 24 }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /></svg>
                </div>
              </div>
              <div style={{ fontSize: 28, fontWeight: 800 }}>97.8%</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Dari 24 setoran terverifikasi</div>
            </div>
            <div className="card" style={{ padding: 16 }}>
              <div className="card-header" style={{ marginBottom: 8 }}>
                <span className="card-title">Divergen Bobot (Tara)</span>
                <div className="card-icon" style={{ width: 24, height: 24 }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="12" x2="21" y2="12" /></svg>
                </div>
              </div>
              <div style={{ fontSize: 28, fontWeight: 800 }}>-0.82 kg</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Toleransi kalibrasi sensor 1.2%</div>
            </div>
            <div className="card" style={{ padding: 16 }}>
              <div className="card-header" style={{ marginBottom: 8 }}>
                <span className="card-title">EcoToken Tersedia</span>
                <div className="card-icon" style={{ width: 24, height: 24 }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v12" /></svg>
                </div>
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--eco-700)' }}>1,450 TK</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Siap ditukar saldo dompet digital</div>
            </div>
          </div>
        </div>

        {/* RIGHT: Receipt Panel */}
        <div className="receipt-panel" style={{ alignSelf: 'start', position: 'sticky', top: 0 }}>
          <div className="receipt-header">
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-sm btn-primary">RESI RESMI PENYETORAN DIGITAL</button>
              <button className="btn btn-sm btn-outline">SLIP_RESMI</button>
            </div>
          </div>
          <div className="receipt-body">
            {/* Transaction ID */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>NODE TRANSAKSI</div>
                  <div style={{ fontSize: 10, color: 'var(--eco-600)', fontWeight: 600 }}>SISTEM TERVERIFIKASI</div>
                </div>
                <span className="badge badge-green">✓ TERVALIDASI</span>
              </div>

              <div style={{ fontSize: 22, fontWeight: 900, fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-primary)', marginBottom: 4 }}>
                {selectedTrx.id}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                Rabu, 23 Oktober 2024 • 14:20:18 WIB
              </div>
            </div>

            {/* Info grid */}
            <div className="info-grid" style={{ marginBottom: 16 }}>
              <div className="info-row">
                <span className="info-label">Titik Penyetoran</span>
                <span className="info-value">TPS 3R Tebet Barat, Jakarta Selatan</span>
              </div>
              <div className="info-row">
                <span className="info-label">Petugas Verifikasi</span>
                <span className="info-value">Ahmad Ridwan (NIP 88219) 🔒</span>
              </div>
              <div className="info-row">
                <span className="info-label">Kesesuaian AI</span>
                <span className="info-value" style={{ color: 'var(--eco-700)' }}>✓ [98.4% PET Terverifikasi]</span>
              </div>
            </div>

            {/* Camera reference */}
            <div style={{ marginBottom: 16 }}>
              <div className="info-label" style={{ marginBottom: 6 }}>Rekaman Sensor Optik</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace", marginBottom: 8 }}>
                <span>BINGKAI_REF #0912</span>
              </div>
              <div style={{ background: '#0a0a0a', borderRadius: 'var(--radius-md)', padding: 20, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ fontSize: 10, color: 'rgba(16,185,129,0.5)', fontFamily: "'JetBrains Mono', monospace" }}>
                  KAMERA_SPEKTRAL // 01 ISO 100 // 60 FPS
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 12 }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ width: 80, height: 60, background: 'rgba(16,185,129,0.1)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>📸</div>
                    <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>MULTISPEKTRAL RGB+NIR</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ width: 80, height: 60, background: 'rgba(16,185,129,0.1)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🔬</div>
                    <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>POLIETILENA TEREFTALAT</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Weight breakdown */}
            <div style={{ marginBottom: 16 }}>
              <div className="info-label" style={{ marginBottom: 8 }}>Rincian Timbangan & Potongan</div>
              <div className="receipt-row">
                <span>Berat Kotor:</span>
                <span style={{ fontWeight: 600 }}>3.35 kg</span>
              </div>
              <div className="receipt-row">
                <span>Potongan Wadah (Tara):</span>
                <span style={{ fontWeight: 600, color: 'var(--status-danger)' }}>- 0.15 kg</span>
              </div>
              <div className="receipt-row" style={{ borderBottom: 'none', fontWeight: 700 }}>
                <span>Berat Bersih:</span>
                <span>3.20 kg</span>
              </div>
            </div>

            {/* Formula */}
            <div className="formula-box" style={{ marginBottom: 16 }}>
              <div className="formula-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="2" /><line x1="4" y1="12" x2="20" y2="12" /></svg>
                Formula Konversi EcoToken
              </div>
              <div className="formula-line">
                <span>Tarif Kategori (PET Mutu A):</span>
                <span style={{ fontWeight: 600 }}>80 TK / kg</span>
              </div>
              <div className="formula-line">
                <span>Perhitungan:</span>
                <span style={{ fontWeight: 600 }}>3.20 kg × 80 TK</span>
              </div>
              <div className="formula-line">
                <span>Bonus Kebersihan (AI &gt; 95%):</span>
                <span style={{ fontWeight: 600 }}>+0 TK (Standar)</span>
              </div>
              <div className="formula-total">
                <span>Total Diterima:</span>
                <span>+256 TK</span>
              </div>
            </div>

            {/* Notes */}
            <div style={{ marginBottom: 16 }}>
              <div className="info-label" style={{ marginBottom: 6 }}>Catatan Fisik Petugas</div>
              <div style={{ fontSize: 12, fontStyle: 'italic', color: 'var(--text-secondary)', padding: '8px 12px', background: 'var(--neutral-50)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--eco-300)' }}>
                &ldquo;Kondisi kering dan telah dipipihkan dengan rapi. Label tutup telah dilepas secara mandiri.&rdquo;
              </div>
            </div>

            {/* Download */}
            <button className="btn-download">
              📄 Unduh Resi PDF Resmi
            </button>

            {/* Hash */}
            <div className="hash-text" style={{ marginTop: 12, textAlign: 'center' }}>
              HASH_BLOK: 8f92b7c4d1...ea10c8 (Blok #209...)
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
