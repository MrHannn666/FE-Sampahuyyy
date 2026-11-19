'use client';

import React, { useMemo, useState } from 'react';
import { useMachines, useTransactions, type Transaction } from '@/lib/store';
import { formatDateTime, formatRupiah, localDayKey } from '@/lib/format';

const selectStyle: React.CSSProperties = {
  padding: '6px 8px',
  border: '1px solid var(--border-color)',
  borderRadius: 6,
  fontSize: 12,
  background: '#ffffff',
};

/** Escape sel CSV, termasuk penetralan formula injection untuk Excel/Sheets. */
function csvCell(value: string | number): string {
  let text = String(value);
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

function buildCsv(rows: Transaction[], machineNames: Map<string, string>): string {
  const header = [
    'ID', 'Waktu', 'Mesin', 'Nama Mesin', 'E-wallet', 'Nomor (disamarkan)',
    'Klasifikasi', 'Confidence (%)', 'Reward (Rp)', 'Status', 'Ref Gateway', 'Alasan Gagal',
  ];
  const lines = rows.map((t) =>
    [
      t.id, t.time, t.machineId, machineNames.get(t.machineId) ?? '-', t.ewallet, t.phoneMasked,
      t.classification, t.confidence, t.reward, t.status, t.gatewayRef, t.failureReason ?? '',
    ].map(csvCell).join(','),
  );
  return [header.map(csvCell).join(','), ...lines].join('\r\n');
}

export default function AdminTransaksiContent() {
  const transactions = useTransactions();
  const machines = useMachines();

  const [search, setSearch] = useState('');
  const [machineFilter, setMachineFilter] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const machineNames = useMemo(() => new Map(machines.map((m) => [m.id, m.name])), [machines]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return transactions.filter((t) => {
      if (machineFilter && t.machineId !== machineFilter) return false;
      if (classFilter && t.classification !== classFilter) return false;
      if (statusFilter && t.status !== statusFilter) return false;
      if (q && !`${t.id} ${t.gatewayRef} ${t.phoneMasked} ${t.ewallet}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [transactions, search, machineFilter, classFilter, statusFilter]);

  const handleExport = () => {
    // BOM agar Excel membaca UTF-8 dengan benar.
    const blob = new Blob(['\uFEFF', buildCsv(filtered, machineNames)], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transaksi-${localDayKey(new Date())}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, gap: 12, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace", marginBottom: 4 }}>
            ADMIN // TRANSAKSI_EXPORT
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px' }}>Transaksi & Export</h2>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
            Menampilkan {filtered.length} dari {transactions.length} transaksi.
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleExport} disabled={filtered.length === 0} style={{ opacity: filtered.length === 0 ? 0.5 : 1 }}>
          ⬇ Export CSV ({filtered.length} baris)
        </button>
      </div>

      <div className="card" style={{ padding: 14, marginBottom: 16, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <input
          style={{ ...selectStyle, flex: 1, minWidth: 200 }}
          placeholder="Cari ID transaksi, ref gateway, nomor, e-wallet..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select style={selectStyle} value={machineFilter} onChange={(e) => setMachineFilter(e.target.value)}>
          <option value="">Semua mesin</option>
          {machines.map((m) => <option key={m.id} value={m.id}>{m.id} — {m.name}</option>)}
        </select>
        <select style={selectStyle} value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
          <option value="">Semua jenis</option>
          <option value="organik">Organik</option>
          <option value="non-organik">Non-organik</option>
        </select>
        <select style={selectStyle} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">Semua status</option>
          <option value="BERHASIL">Berhasil</option>
          <option value="GAGAL">Gagal</option>
        </select>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'auto', maxHeight: '60vh' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Waktu</th>
              <th>Mesin</th>
              <th>E-wallet</th>
              <th>Jenis</th>
              <th>Confidence</th>
              <th>Reward</th>
              <th>Status</th>
              <th>Ref Gateway</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                  {transactions.length === 0 ? 'Belum ada transaksi. Data muncul setelah ada yang memakai layar pelanggan.' : 'Tidak ada transaksi yang cocok dengan filter.'}
                </td>
              </tr>
            )}
            {filtered.map((t) => (
              <tr key={t.id}>
                <td><span className="font-mono" style={{ fontSize: 11, fontWeight: 700 }}>{t.id}</span></td>
                <td style={{ fontSize: 12, whiteSpace: 'nowrap' }}>{formatDateTime(t.time)}</td>
                <td style={{ fontSize: 12 }}>{t.machineId}</td>
                <td style={{ fontSize: 12 }}>{t.ewallet}<br /><span className="font-mono" style={{ fontSize: 10, color: 'var(--text-muted)' }}>{t.phoneMasked}</span></td>
                <td><span className={`badge ${t.classification === 'organik' ? 'badge-green' : 'badge-blue'}`}>{t.classification.toUpperCase()}</span></td>
                <td style={{ fontSize: 12 }}>{t.confidence.toFixed(1)}%</td>
                <td style={{ fontSize: 12, fontWeight: 700 }}>{formatRupiah(t.reward)}</td>
                <td>
                  <span className={`badge ${t.status === 'BERHASIL' ? 'badge-green' : 'badge-red'}`} title={t.failureReason}>{t.status}</span>
                </td>
                <td><span className="font-mono" style={{ fontSize: 10, color: 'var(--text-muted)' }}>{t.gatewayRef}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
