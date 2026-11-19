'use client';

import React, { useState } from 'react';

export default function AdminMasterDataContent() {
  const [activeTab, setActiveTab] = useState<'tps' | 'nasabah' | 'tarif'>('tps');
  const [searchQuery, setSearchQuery] = useState('');
  const [wilayahFilter, setWilayahFilter] = useState('Semua Wilayah (DKI Jakarta)');
  const [showAddModal, setShowAddModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [tpsList, setTpsList] = useState([
    {
      code: 'TPS-01',
      name: 'TPS 3R Tebet Barat',
      address: 'Jl. Tebet Timur VI, RT.04/RW.06',
      load: 2250,
      max: 5000,
      percentage: 45,
      status: 'NORMAL',
      statusClass: 'badge-green',
    },
    {
      code: 'TPS-02',
      name: 'TPS Cilandak Sentral',
      address: 'Jl. Cilandak Raya No. 18',
      load: 4600,
      max: 5000,
      percentage: 92,
      status: 'KRITIS',
      statusClass: 'badge-red',
    },
    {
      code: 'TPS-03',
      name: 'TPS Menteng Heritage',
      address: 'Jl. Teuku Umar No. 12',
      load: 1500,
      max: 5000,
      percentage: 30,
      status: 'NORMAL',
      statusClass: 'badge-green',
    },
    {
      code: 'TPS-04',
      name: 'TPS Kuningan Cyber Pod',
      address: 'Jl. Rasuna Said Kav. B-4',
      load: 3100,
      max: 5000,
      percentage: 62,
      status: 'NORMAL',
      statusClass: 'badge-green',
    },
    {
      code: 'TPS-05',
      name: 'TPS Kebayoran Baru',
      address: 'Jl. Wijaya I No. 45',
      load: 3850,
      max: 5000,
      percentage: 77,
      status: 'SIAGA',
      statusClass: 'badge-yellow',
    },
    {
      code: 'TPS-06',
      name: 'TPS Rawamangun Hub',
      address: 'Jl. Balap Sepeda No. 8',
      load: 1900,
      max: 5000,
      percentage: 38,
      status: 'NORMAL',
      statusClass: 'badge-green',
    },
  ]);

  // Form for new TPS
  const [newCode, setNewCode] = useState('TPS-07');
  const [newName, setNewName] = useState('');
  const [newAddress, setNewAddress] = useState('');

  const handleDrainTPS = (code: string) => {
    setTpsList(prev =>
      prev.map(item =>
        item.code === code
          ? {
              ...item,
              load: 200,
              percentage: 4,
              status: 'NORMAL',
              statusClass: 'badge-green'
            }
          : item
      )
    );
    setToast(`Muatan ${code} berhasil dikuras & ditransfer ke truk pengangkut!`);
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddTPS = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;

    setTpsList(prev => [
      ...prev,
      {
        code: newCode,
        name: newName,
        address: newAddress || 'DKI Jakarta',
        load: 0,
        max: 5000,
        percentage: 0,
        status: 'NORMAL',
        statusClass: 'badge-green'
      }
    ]);

    setShowAddModal(false);
    setNewName('');
    setNewAddress('');
    setToast(`Titik setor baru ${newCode} berhasil didaftarkan ke sistem!`);
    setTimeout(() => setToast(null), 3000);
  };

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8,"
      + "Kode TPS,Nama TPS,Alamat,Beban (kg),Kapasitas (kg),Persentase,Status\n"
      + tpsList.map(t => `${t.code},"${t.name}","${t.address}",${t.load},${t.max},${t.percentage}%,${t.status}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `master_data_tps_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToast('File CSV berhasil diunduh ke komputer Anda!');
    setTimeout(() => setToast(null), 2500);
  };

  const filteredTps = tpsList.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalLoad = tpsList.reduce((acc, curr) => acc + curr.load, 0);
  const totalMax = tpsList.reduce((acc, curr) => acc + curr.max, 0);
  const avgLoadPercent = +(totalLoad / totalMax * 100).toFixed(2);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
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

      {/* Top Banner with Stats & Tambah Titik Setor button */}
      <div style={{
        background: '#ffffff',
        border: '1px solid var(--border-color)',
        borderRadius: 10,
        padding: '16px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 14
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: 'var(--eco-700)', fontWeight: 700 }}>
            <span>ADMIN BANK SAMPAH // DATA PUSAT</span>
            <span>/</span>
            <span>VERSI_4.2_STABIL</span>
          </div>

          <h2 style={{ fontSize: 20, fontWeight: 800, margin: '4px 0', color: 'var(--text-primary)' }}>
            Master Data Manajemen Sistem Bank Sampah
          </h2>

          <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0 }}>
            Kelola dan konfigurasi titik setor TPS, batas kuota kapasitas gudang penampungan, serta direktori data nasabah terverifikasi.
          </p>

          <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
            <div style={{ padding: '6px 12px', background: 'var(--eco-50)', borderRadius: 6, border: '1px solid var(--eco-200)', fontSize: 11 }}>
              <span style={{ color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>TOTAL TITIK SETOR: </span>
              <strong style={{ color: 'var(--eco-900)' }}>{tpsList.length.toString().padStart(2, '0')} LOKASI</strong>
            </div>
            <div style={{ padding: '6px 12px', background: 'var(--eco-50)', borderRadius: 6, border: '1px solid var(--eco-200)', fontSize: 11 }}>
              <span style={{ color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>TOTAL MUATAN GABUNGAN: </span>
              <strong style={{ color: 'var(--eco-900)' }}>{totalLoad.toLocaleString()} / {totalMax.toLocaleString()} KG</strong>
            </div>
            <div style={{ padding: '6px 12px', background: 'var(--eco-50)', borderRadius: 6, border: '1px solid var(--eco-200)', fontSize: 11 }}>
              <span style={{ color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>TOTAL NASABAH: </span>
              <strong style={{ color: 'var(--eco-900)' }}>4.129 TERVERIFIKASI</strong>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary"
          style={{ padding: '10px 18px', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <span>＋</span>
          <span>TAMBAH TITIK SETOR BARU</span>
        </button>
      </div>

      {/* Tabs Row */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          onClick={() => setActiveTab('tps')}
          style={{
            padding: '10px 18px',
            borderRadius: 8,
            border: activeTab === 'tps' ? '1px solid var(--eco-500)' : '1px solid var(--neutral-300)',
            background: activeTab === 'tps' ? '#ffffff' : 'var(--neutral-100)',
            color: activeTab === 'tps' ? 'var(--eco-800)' : 'var(--text-secondary)',
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: activeTab === 'tps' ? 'var(--shadow-sm)' : 'none'
          }}
        >
          <span>🏛</span>
          <span>Titik Setor & Kapasitas TPS</span>
          <span className="badge badge-green" style={{ fontSize: 9 }}>{tpsList.length}</span>
        </button>

        <button
          onClick={() => setActiveTab('nasabah')}
          style={{
            padding: '10px 18px',
            borderRadius: 8,
            border: activeTab === 'nasabah' ? '1px solid var(--eco-500)' : '1px solid var(--neutral-300)',
            background: activeTab === 'nasabah' ? '#ffffff' : 'var(--neutral-100)',
            color: activeTab === 'nasabah' ? 'var(--eco-800)' : 'var(--text-secondary)',
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: activeTab === 'nasabah' ? 'var(--shadow-sm)' : 'none'
          }}
        >
          <span>👥</span>
          <span>Data Nasabah & Saldo Token</span>
          <span className="badge badge-green" style={{ fontSize: 9 }}>4.129</span>
        </button>

        <button
          onClick={() => setActiveTab('tarif')}
          style={{
            padding: '10px 18px',
            borderRadius: 8,
            border: activeTab === 'tarif' ? '1px solid var(--eco-500)' : '1px solid var(--neutral-300)',
            background: activeTab === 'tarif' ? '#ffffff' : 'var(--neutral-100)',
            color: activeTab === 'tarif' ? 'var(--eco-800)' : 'var(--text-secondary)',
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: activeTab === 'tarif' ? 'var(--shadow-sm)' : 'none'
          }}
        >
          <span>🏷</span>
          <span>Tarif Token Kategori Sampah</span>
          <span className="badge badge-green" style={{ fontSize: 9 }}>8 KATEGORI</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 14px',
        background: '#ffffff',
        border: '1px solid var(--border-color)',
        borderRadius: 8,
        gap: 12
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: 360 }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari ID, Nama Lokasi, atau Nasabah..."
              style={{
                width: '100%',
                padding: '7px 28px 7px 32px',
                fontSize: 12,
                borderRadius: 6,
                border: '1px solid var(--neutral-300)',
                outline: 'none'
              }}
            />
            <span style={{ position: 'absolute', left: 10, top: 8, color: 'var(--text-muted)' }}>🔍</span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: 8, top: 7, background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: 'var(--text-muted)' }}
              >
                ×
              </button>
            )}
          </div>

          <select
            value={wilayahFilter}
            onChange={(e) => setWilayahFilter(e.target.value)}
            style={{
              padding: '7px 12px',
              fontSize: 12,
              borderRadius: 6,
              border: '1px solid var(--neutral-300)',
              background: '#fff'
            }}
          >
            <option>Semua Wilayah (DKI Jakarta)</option>
            <option>Jakarta Selatan</option>
            <option>Jakarta Pusat</option>
            <option>Jakarta Timur</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={handleExportCSV}
            className="btn btn-secondary"
            style={{ padding: '6px 12px', fontSize: 11, display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <span>📥</span>
            <span>CSV</span>
          </button>
          <button
            onClick={() => {
              setToast('Data disinkronkan dengan server pusat!');
              setTimeout(() => setToast(null), 2500);
            }}
            style={{ width: 32, height: 32, border: '1px solid var(--neutral-300)', background: '#fff', borderRadius: 6, cursor: 'pointer' }}
            title="Refresh Data"
          >
            🔄
          </button>
        </div>
      </div>

      {/* Main Table: DAFTAR TITIK SETOR AKTIF */}
      <div className="card" style={{ padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--eco-500)', display: 'inline-block' }} />
            <span>DAFTAR TITIK SETOR AKTIF: WILAYAH OPERASIONAL DKI JAKARTA</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }}>
            <span>Beban Rata-rata: <strong>{avgLoadPercent}% Kuota</strong></span>
            <span>|</span>
            <span style={{ color: 'var(--eco-700)' }}>● Normal: 4 Titik</span>
            <span>|</span>
            <span style={{ color: '#d97706' }}>● Siaga: 1 Titik</span>
            <span>|</span>
            <span style={{ color: '#dc2626' }}>● Kritis: 1 Titik</span>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ width: '100%', fontSize: 12 }}>
            <thead>
              <tr>
                <th>KODE TPS</th>
                <th>NAMA LOKASI TITIK SETOR</th>
                <th>ALAMAT OPERASIONAL</th>
                <th>BEBAN SAAT INI</th>
                <th>MAX KAPASITAS</th>
                <th>PERSENTASE KUOTA</th>
                <th>STATUS</th>
                <th style={{ textAlign: 'right' }}>AKSI OPERASI</th>
              </tr>
            </thead>
            <tbody>
              {filteredTps.map((row) => (
                <tr key={row.code}>
                  <td style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: 'var(--eco-800)' }}>
                    {row.code}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span>📍</span>
                      <strong style={{ color: 'var(--text-primary)' }}>{row.name}</strong>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: 11 }}>
                    {row.address}
                  </td>
                  <td style={{ fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: row.status === 'KRITIS' ? '#dc2626' : 'var(--text-primary)' }}>
                    {row.load.toLocaleString()} kg
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
                    {row.max.toLocaleString()} kg
                  </td>
                  <td style={{ width: 140 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="progress-bar" style={{ flex: 1, height: 6 }}>
                        <div
                          className={`progress-fill ${row.status === 'KRITIS' ? 'red' : row.status === 'SIAGA' ? 'yellow' : 'green'}`}
                          style={{ width: `${row.percentage}%` }}
                        />
                      </div>
                      <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
                        {row.percentage}%
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${row.statusClass}`}>
                      {row.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 6 }}>
                      {row.status === 'KRITIS' ? (
                        <button
                          onClick={() => handleDrainTPS(row.code)}
                          style={{
                            padding: '4px 10px',
                            background: '#dc2626',
                            border: 'none',
                            borderRadius: 4,
                            color: '#ffffff',
                            fontWeight: 700,
                            fontSize: 10,
                            cursor: 'pointer'
                          }}
                        >
                          ! DISPOSISI CEPAT
                        </button>
                      ) : (
                        <button
                          onClick={() => handleDrainTPS(row.code)}
                          className="btn btn-secondary"
                          style={{ padding: '4px 8px', fontSize: 10 }}
                        >
                          🚛 Kuras Muatan
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setToast(`Mengubah konfigurasi ${row.code}...`);
                          setTimeout(() => setToast(null), 2000);
                        }}
                        className="btn btn-secondary"
                        style={{ padding: '4px 8px', fontSize: 10 }}
                      >
                        ⚙ Ubah
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Summary Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 14,
          paddingTop: 12,
          borderTop: '1px solid #e2e8f0',
          fontSize: 11,
          fontFamily: "'JetBrains Mono', monospace",
          color: 'var(--text-secondary)'
        }}>
          <div>
            <strong>TOTAL KESELURUHAN: </strong>
            <span>{tpsList.length} Titik Operasional Terhubung • Koridor DKI Jakarta</span>
          </div>
          <div>
            <strong>{totalLoad.toLocaleString()} kg / {totalMax.toLocaleString()} kg </strong>
            <span>({avgLoadPercent}% Kapasitas Gabungan)</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>WAKTU_SINKRON: 14:02 WIB</span>
          </div>
        </div>
      </div>

      {/* Bottom Row: Visualisasi Jalur Truk & Protokol Disposisi */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
        {/* Visualisasi Matriks Jalur Truk Evakuasi */}
        <div className="card" style={{ padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
              <span>🌐</span>
              <span>VISUALISASI MATRIKS JALUR TRUK EVAKUASI & RADIUS PENJEMPUTAN</span>
            </div>
            <span className="badge badge-green" style={{ fontSize: 9 }}>GIS_PETA: AKTIF</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {/* Card 1 */}
            <div style={{ padding: 12, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#991b1b' }}>TPS-02 CILANDAK</span>
                <span className="badge badge-red" style={{ fontSize: 8 }}>KRITIS</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', margin: '8px 0' }}>
                Unit armada terdekat: <strong>TRK-09 (1,8 km)</strong>
              </div>
              <div style={{ paddingTop: 6, borderTop: '1px solid #fecaca', display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                <span style={{ color: 'var(--text-muted)' }}>Estimasi Tiba:</span>
                <span style={{ fontWeight: 800, color: '#dc2626' }}>12 MENIT</span>
              </div>
            </div>

            {/* Card 2 */}
            <div style={{ padding: 12, background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#92400e' }}>TPS-05 KEBAYORAN</span>
                <span className="badge badge-yellow" style={{ fontSize: 8 }}>SIAGA</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', margin: '8px 0' }}>
                Unit terjadwal: <strong>TRK-04 (15:30 WIB)</strong>
              </div>
              <div style={{ paddingTop: 6, borderTop: '1px solid #fde68a', display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                <span style={{ color: 'var(--text-muted)' }}>Estimasi Tiba:</span>
                <span style={{ fontWeight: 800, color: '#d97706' }}>1 JAM 28 MENIT</span>
              </div>
            </div>

            {/* Card 3 */}
            <div style={{ padding: 12, background: 'var(--eco-50)', border: '1px solid var(--eco-200)', borderRadius: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--eco-900)' }}>RESIKO BANJIR MUATAN</span>
                <span className="badge badge-green" style={{ fontSize: 8 }}>STABIL</span>
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-secondary)', margin: '8px 0' }}>
                Prediksi akumulasi harian: <strong>+1.240 kg</strong>
              </div>
              <div style={{ paddingTop: 6, borderTop: '1px solid var(--eco-200)', display: 'flex', justifyContent: 'space-between', fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }}>
                <span style={{ color: 'var(--text-muted)' }}>Sisa Ruang:</span>
                <span style={{ fontWeight: 700, color: 'var(--eco-800)' }}>12.800 KG</span>
              </div>
            </div>
          </div>
        </div>

        {/* Protokol Disposisi Logistik */}
        <div className="card" style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>
            <span>🚚</span>
            <span>PROTOKOL DISPOSISI LOGISTIK</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12, marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Armada Siap Jalan:</span>
              <strong>3 Truk Sampah (Kapasitas 5T)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Tujuan Pembuangan:</span>
              <strong>Pusat Daur Ulang Bantargebang</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-muted)' }}>Sensor Timbangan:</span>
              <span className="badge badge-green" style={{ fontSize: 9 }}>TERKALIBRASI (+/- 0,05%)</span>
            </div>
          </div>

          <button
            onClick={() => {
              setToast('Jadwal kuras otomatis batch dikirimkan ke armada!');
              setTimeout(() => setToast(null), 3000);
            }}
            className="btn btn-primary"
            style={{ width: '100%', padding: '10px 14px', fontSize: 12, justifyContent: 'center' }}
          >
            🚛 JADWALKAN KURAS OTOMATIS (BATCH)
          </button>
        </div>
      </div>

      {/* Add New TPS Modal */}
      {showAddModal && (
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
            maxWidth: 440,
            boxShadow: 'var(--shadow-lg)'
          }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, marginBottom: 14 }}>
              Tambah Titik Setor TPS Baru
            </h3>

            <form onSubmit={handleAddTPS} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, marginBottom: 4 }}>Kode TPS</label>
                <input
                  type="text"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  required
                  style={{ width: '100%', padding: '8px 10px', fontSize: 12, border: '1px solid #ccc', borderRadius: 6 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, marginBottom: 4 }}>Nama Titik Setor</label>
                <input
                  type="text"
                  placeholder="misal: TPS 3R Pasar Minggu"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                  style={{ width: '100%', padding: '8px 10px', fontSize: 12, border: '1px solid #ccc', borderRadius: 6 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, marginBottom: 4 }}>Alamat Lengkap</label>
                <input
                  type="text"
                  placeholder="misal: Jl. Raya Ragunan No. 12"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', fontSize: 12, border: '1px solid #ccc', borderRadius: 6 }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-secondary"
                  style={{ fontSize: 12 }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ fontSize: 12 }}
                >
                  Simpan Titik Setor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
