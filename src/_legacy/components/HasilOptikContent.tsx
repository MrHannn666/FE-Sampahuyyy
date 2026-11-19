'use client';

import React, { useState } from 'react';

const analysisResults = [
  { id: 'OPT-2024-0891', time: '14:20:18', material: 'PET Bening (Polietilena Tereftalat)', confidence: 98.4, purity: 99.1, polymerCode: 'C10H8O4', condition: 'KERING', status: 'LOLOS', weight: '3.20 kg', token: '+256 TK' },
  { id: 'OPT-2024-0412', time: '10:15:33', material: 'Aluminium (Kaleng Minuman)', confidence: 97.2, purity: 98.5, polymerCode: 'Al-6061', condition: 'KERING', status: 'LOLOS', weight: '1.85 kg', token: '+320 TK' },
  { id: 'OPT-2024-1102', time: '16:45:01', material: 'Karton Cokelat (Dupleks)', confidence: 95.8, purity: 94.2, polymerCode: 'CELL-K42', condition: 'KERING', status: 'LOLOS', weight: '12.40 kg', token: '+186 TK' },
  { id: 'OPT-2024-0930', time: '09:12:44', material: 'Baterai Lithium (Li-ion 18650)', confidence: 92.1, purity: 88.7, polymerCode: 'LiCoO2', condition: 'SENSITIF', status: 'REVIEW', weight: '0.45 kg', token: '+150 TK' },
  { id: 'OPT-2024-0210', time: '11:00:22', material: 'PP (Polipropilena)', confidence: 96.5, purity: 97.3, polymerCode: 'C3H6', condition: 'KERING', status: 'LOLOS', weight: '2.10 kg', token: '+84 TK' },
  { id: 'OPT-2024-0188', time: '08:30:15', material: 'HDPE (High-Density Polyethylene)', confidence: 97.8, purity: 98.9, polymerCode: 'C2H4', condition: 'KERING', status: 'LOLOS', weight: '4.50 kg', token: '+360 TK' },
];

export default function HasilOptikContent() {
  const [results, setResults] = useState(analysisResults);
  const [toast, setToast] = useState<string | null>(null);

  const handleRefresh = () => {
    setToast('Memperbarui data spektrometri optik...');
    setTimeout(() => {
      setToast('Data spektrometri AI telah disinkronkan!');
      setTimeout(() => setToast(null), 2000);
    }, 600);
  };

  const handleExport = () => {
    const csv = "data:text/csv;charset=utf-8,ID,Waktu,Material,Confidence,Purity,Polimer,Kondisi,Status,Berat,Token\n"
      + results.map(r => `${r.id},${r.time},"${r.material}",${r.confidence}%,${r.purity}%,${r.polymerCode},${r.condition},${r.status},${r.weight},${r.token}`).join("\n");
    const encodedUri = encodeURI(csv);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `analisis_optik_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToast('Laporan spektral AI berhasil diekspor ke CSV!');
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

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace", marginBottom: 4 }}>
            MODUL_ANALISIS // HASIL_OPTIK_AI // SPEKTROSKOPI_OTOMATIS
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px' }}>Hasil Analisis Optik AI</h2>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
            Riwayat lengkap hasil klasifikasi material oleh model YOLOv8 + analisis spektral NIR.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={handleRefresh} className="btn btn-outline btn-sm">⟳ Refresh</button>
          <button onClick={handleExport} className="btn btn-primary btn-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
            Ekspor Laporan
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid-4" style={{ marginBottom: 20 }}>
        <div className="card animate-fade-in delay-1" style={{ padding: 16 }}>
          <div className="card-title" style={{ marginBottom: 8 }}>Total Pemindaian</div>
          <div style={{ fontSize: 32, fontWeight: 800 }}>156</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Bulan ini (Okt 2024)</div>
        </div>
        <div className="card animate-fade-in delay-2" style={{ padding: 16 }}>
          <div className="card-title" style={{ marginBottom: 8 }}>Akurasi Rata-rata</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--eco-700)' }}>96.8%</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Confidence model YOLOv8</div>
        </div>
        <div className="card animate-fade-in delay-3" style={{ padding: 16 }}>
          <div className="card-title" style={{ marginBottom: 8 }}>Kemurnian Spektral</div>
          <div style={{ fontSize: 32, fontWeight: 800 }}>95.4%</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>NIR spektroskopi rata-rata</div>
        </div>
        <div className="card animate-fade-in delay-4" style={{ padding: 16 }}>
          <div className="card-title" style={{ marginBottom: 8 }}>Tingkat Lolos</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--eco-700)' }}>94.2%</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>147 dari 156 pemindaian</div>
        </div>
      </div>

      {/* Results Table */}
      <div className="card animate-fade-in delay-3" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', background: 'var(--eco-50)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--eco-500)' }} />
            REKAMAN HASIL ANALISIS SPEKTRAL
          </div>
          <div className="search-input" style={{ maxWidth: 220 }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input placeholder="Cari ID atau material..." />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>ID Analisis</th>
                <th>Waktu</th>
                <th>Material Terdeteksi</th>
                <th>Confidence</th>
                <th>Kemurnian</th>
                <th>Kode Polimer</th>
                <th>Kondisi</th>
                <th>Berat</th>
                <th>Token</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {analysisResults.map((r) => (
                <tr key={r.id} style={{ cursor: 'pointer' }}>
                  <td className="font-mono" style={{ fontSize: 11, fontWeight: 600, color: 'var(--eco-700)' }}>{r.id}</td>
                  <td className="font-mono" style={{ fontSize: 11 }}>{r.time}</td>
                  <td style={{ fontSize: 12, fontWeight: 500, maxWidth: 200 }}>{r.material}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div className="progress-bar" style={{ width: 60, height: 6 }}>
                        <div className={`progress-fill ${r.confidence > 95 ? 'green' : r.confidence > 90 ? 'yellow' : 'red'}`} style={{ width: `${r.confidence}%` }} />
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700 }}>{r.confidence}%</span>
                    </div>
                  </td>
                  <td style={{ fontSize: 11, fontWeight: 600 }}>{r.purity}%</td>
                  <td className="font-mono" style={{ fontSize: 10, color: 'var(--text-muted)' }}>{r.polymerCode}</td>
                  <td><span className={`badge ${r.condition === 'KERING' ? 'badge-green' : 'badge-yellow'}`}>{r.condition}</span></td>
                  <td style={{ fontWeight: 600, fontSize: 12 }}>{r.weight}</td>
                  <td style={{ fontWeight: 700, color: 'var(--eco-700)', fontSize: 12 }}>{r.token}</td>
                  <td><span className={`badge ${r.status === 'LOLOS' ? 'badge-green' : 'badge-yellow'}`}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination" style={{ padding: '12px 16px', borderTop: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Menampilkan 6 dari 156 hasil</span>
          <span style={{ marginLeft: 'auto', fontSize: 11 }}>Halaman 1 dari 26</span>
          <button>‹</button>
          <button>›</button>
        </div>
      </div>

      {/* Distribution chart placeholder */}
      <div className="grid-2" style={{ marginTop: 20 }}>
        <div className="card animate-fade-in delay-4" style={{ padding: 20 }}>
          <div className="card-title" style={{ marginBottom: 16 }}>Distribusi Material Terdeteksi</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { name: 'PET (Polietilena Tereftalat)', pct: 38, color: 'var(--eco-500)' },
              { name: 'HDPE (High-Density PE)', pct: 22, color: 'var(--eco-400)' },
              { name: 'Karton & Kertas', pct: 18, color: '#f59e0b' },
              { name: 'Aluminium & Logam', pct: 12, color: 'var(--neutral-400)' },
              { name: 'PP (Polipropilena)', pct: 7, color: 'var(--eco-300)' },
              { name: 'E-Waste & Lainnya', pct: 3, color: 'var(--status-info)' },
            ].map((m) => (
              <div key={m.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{m.name}</span>
                  <span style={{ fontWeight: 700 }}>{m.pct}%</span>
                </div>
                <div className="progress-bar">
                  <div style={{ height: '100%', width: `${m.pct}%`, background: m.color, borderRadius: 100, transition: 'width 0.8s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card animate-fade-in delay-5" style={{ padding: 20 }}>
          <div className="card-title" style={{ marginBottom: 16 }}>Performa Model AI (7 Hari Terakhir)</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { day: 'Sen', scans: 24, accuracy: 97.2 },
              { day: 'Sel', scans: 31, accuracy: 96.8 },
              { day: 'Rab', scans: 18, accuracy: 98.1 },
              { day: 'Kam', scans: 27, accuracy: 95.4 },
              { day: 'Jum', scans: 22, accuracy: 97.6 },
              { day: 'Sab', scans: 19, accuracy: 96.9 },
              { day: 'Min', scans: 15, accuracy: 98.4 },
            ].map((d) => (
              <div key={d.day} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ width: 30, fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>{d.day}</span>
                <div className="progress-bar" style={{ flex: 1 }}>
                  <div className="progress-fill green" style={{ width: `${(d.scans / 35) * 100}%` }} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, width: 60 }}>{d.scans} scan</span>
                <span className={`badge ${d.accuracy > 97 ? 'badge-green' : 'badge-yellow'}`} style={{ width: 60, justifyContent: 'center' }}>{d.accuracy}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
