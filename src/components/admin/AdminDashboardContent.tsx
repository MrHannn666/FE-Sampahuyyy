'use client';

import React, { useMemo } from 'react';
import { useMachines, useTransactions, type MachineStatus } from '@/lib/store';
import { formatRupiah, localDayKey } from '@/lib/format';

const STATUS_BADGE: Record<MachineStatus, string> = {
  aktif: 'badge-green',
  maintenance: 'badge-yellow',
  nonaktif: 'badge-gray',
};

const DAYS = 7;

export default function AdminDashboardContent() {
  const machines = useMachines();
  const transactions = useTransactions();

  const stats = useMemo(() => {
    const successful = transactions.filter((t) => t.status === 'BERHASIL');
    const organik = transactions.filter((t) => t.classification === 'organik').length;
    const confidenceSum = transactions.reduce((sum, t) => sum + t.confidence, 0);

    return {
      total: transactions.length,
      failed: transactions.length - successful.length,
      totalReward: successful.reduce((sum, t) => sum + t.reward, 0),
      organik,
      nonOrganik: transactions.length - organik,
      successRate: transactions.length ? (successful.length / transactions.length) * 100 : 0,
      avgConfidence: transactions.length ? confidenceSum / transactions.length : 0,
    };
  }, [transactions]);

  const daily = useMemo(() => {
    const buckets = new Map<string, { label: string; organik: number; nonOrganik: number }>();
    for (let i = DAYS - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      buckets.set(localDayKey(date), {
        label: date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
        organik: 0,
        nonOrganik: 0,
      });
    }
    for (const tx of transactions) {
      const bucket = buckets.get(localDayKey(new Date(tx.time)));
      if (!bucket) continue;
      if (tx.classification === 'organik') bucket.organik += 1;
      else bucket.nonOrganik += 1;
    }
    return Array.from(buckets.values());
  }, [transactions]);

  const perMachine = useMemo(
    () =>
      machines.map((machine) => {
        const own = transactions.filter((t) => t.machineId === machine.id);
        return {
          machine,
          count: own.length,
          organik: own.filter((t) => t.classification === 'organik').length,
          reward: own.filter((t) => t.status === 'BERHASIL').reduce((sum, t) => sum + t.reward, 0),
        };
      }),
    [machines, transactions],
  );

  const maxDaily = Math.max(1, ...daily.map((d) => d.organik + d.nonOrganik));
  const organikPct = stats.total ? (stats.organik / stats.total) * 100 : 0;

  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace", marginBottom: 4 }}>
          ADMIN // DASHBOARD_ANALITIK
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px' }}>Dashboard Analitik</h2>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
          Ringkasan transaksi seluruh mesin Smart Waste Vending Machine.
        </p>
      </div>

      <div className="grid-4" style={{ marginBottom: 20 }}>
        <div className="card" style={{ padding: 20 }}>
          <div className="card-title" style={{ marginBottom: 10 }}>Total Transaksi</div>
          <div className="stat-value">{stats.total.toLocaleString('id-ID')}</div>
          <div className="stat-sub">{stats.failed} gagal bayar</div>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <div className="card-title" style={{ marginBottom: 10 }}>Reward Tersalurkan</div>
          <div className="stat-value" style={{ fontSize: 26 }}>{formatRupiah(stats.totalReward)}</div>
          <div className="stat-sub">Hanya transaksi berhasil</div>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <div className="card-title" style={{ marginBottom: 10 }}>Tingkat Keberhasilan</div>
          <div className="stat-value">{stats.successRate.toFixed(1)}<span className="stat-unit">%</span></div>
          <div className="stat-sub">Pembayaran e-wallet</div>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <div className="card-title" style={{ marginBottom: 10 }}>Rata-rata Confidence</div>
          <div className="stat-value">{stats.avgConfidence.toFixed(1)}<span className="stat-unit">%</span></div>
          <div className="stat-sub">Model ML</div>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 20 }}>
        <div className="card" style={{ padding: 20 }}>
          <div className="card-title" style={{ marginBottom: 14 }}>Transaksi 7 Hari Terakhir</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 150 }}>
            {daily.map((d) => {
              const total = d.organik + d.nonOrganik;
              return (
                <div key={d.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>{total || ''}</div>
                  <div style={{ width: '100%', maxWidth: 36, height: `${(total / maxDaily) * 100}%`, display: 'flex', flexDirection: 'column-reverse', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ flex: d.organik, background: 'var(--eco-500)' }} title={`Organik: ${d.organik}`} />
                    <div style={{ flex: d.nonOrganik, background: '#3b82f6' }} title={`Non-organik: ${d.nonOrganik}`} />
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 6, whiteSpace: 'nowrap' }}>{d.label}</div>
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 12, fontSize: 11, color: 'var(--text-secondary)' }}>
            <span><span style={{ display: 'inline-block', width: 10, height: 10, background: 'var(--eco-500)', borderRadius: 2, marginRight: 6 }} />Organik</span>
            <span><span style={{ display: 'inline-block', width: 10, height: 10, background: '#3b82f6', borderRadius: 2, marginRight: 6 }} />Non-organik</span>
          </div>
        </div>

        <div className="card" style={{ padding: 20 }}>
          <div className="card-title" style={{ marginBottom: 14 }}>Komposisi Sampah</div>
          {stats.total === 0 ? (
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Belum ada transaksi.</div>
          ) : (
            <>
              <div style={{ display: 'flex', height: 18, borderRadius: 9, overflow: 'hidden', background: 'var(--neutral-200)' }}>
                <div style={{ width: `${organikPct}%`, background: 'var(--eco-500)' }} />
                <div style={{ width: `${100 - organikPct}%`, background: '#3b82f6' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14, fontSize: 13 }}>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--eco-700)' }}>Organik</div>
                  <div>{stats.organik} transaksi ({organikPct.toFixed(1)}%)</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, color: '#2563eb' }}>Non-organik</div>
                  <div>{stats.nonOrganik} transaksi ({(100 - organikPct).toFixed(1)}%)</div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-color)', background: 'var(--eco-50)', fontSize: 13, fontWeight: 700 }}>
          Performa per Mesin
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Mesin</th>
              <th>Lokasi</th>
              <th>Status</th>
              <th>Transaksi</th>
              <th>Organik / Non</th>
              <th>Reward Tersalurkan</th>
            </tr>
          </thead>
          <tbody>
            {perMachine.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Belum ada mesin terdaftar.</td></tr>
            )}
            {perMachine.map(({ machine, count, organik, reward }) => (
              <tr key={machine.id}>
                <td><span className="font-mono" style={{ fontWeight: 700 }}>{machine.id}</span> {machine.name}</td>
                <td>{machine.location}</td>
                <td><span className={`badge ${STATUS_BADGE[machine.status]}`}>{machine.status.toUpperCase()}</span></td>
                <td>{count}</td>
                <td>{organik} / {count - organik}</td>
                <td>{formatRupiah(reward)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
