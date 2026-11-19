'use client';

import React, { useState } from 'react';
import {
  MAX_REWARD,
  nextMachineId,
  readMachines,
  saveMachines,
  useMachines,
  type Machine,
  type MachineStatus,
} from '@/lib/store';

const STATUS_OPTIONS: { value: MachineStatus; label: string }[] = [
  { value: 'aktif', label: 'Aktif' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'nonaktif', label: 'Nonaktif' },
];

const inputStyle: React.CSSProperties = {
  padding: '6px 8px',
  border: '1px solid var(--border-color)',
  borderRadius: 6,
  fontSize: 12,
  background: '#ffffff',
  width: '100%',
};

/** Mengubah input teks menjadi nominal Rupiah valid (bilangan bulat 0..MAX_REWARD) atau null. */
function parseReward(value: string): number | null {
  if (!/^\d+$/.test(value.trim())) return null;
  const n = Number(value);
  return n <= MAX_REWARD ? n : null;
}

function MachineRow({
  machine,
  onSave,
  onDelete,
}: {
  machine: Machine;
  onSave: (updated: Machine) => void;
  onDelete: (id: string) => void;
}) {
  const [name, setName] = useState(machine.name);
  const [location, setLocation] = useState(machine.location);
  const [status, setStatus] = useState<MachineStatus>(machine.status);
  const [organik, setOrganik] = useState(String(machine.rewardOrganik));
  const [nonOrganik, setNonOrganik] = useState(String(machine.rewardNonOrganik));

  const organikValue = parseReward(organik);
  const nonOrganikValue = parseReward(nonOrganik);
  const valid = name.trim() !== '' && organikValue !== null && nonOrganikValue !== null;
  const dirty =
    name !== machine.name ||
    location !== machine.location ||
    status !== machine.status ||
    organikValue !== machine.rewardOrganik ||
    nonOrganikValue !== machine.rewardNonOrganik;

  return (
    <tr>
      <td><span className="font-mono" style={{ fontWeight: 700 }}>{machine.id}</span></td>
      <td><input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} aria-label={`Nama ${machine.id}`} /></td>
      <td><input style={inputStyle} value={location} onChange={(e) => setLocation(e.target.value)} aria-label={`Lokasi ${machine.id}`} /></td>
      <td>
        <select style={inputStyle} value={status} onChange={(e) => setStatus(e.target.value as MachineStatus)} aria-label={`Status ${machine.id}`}>
          {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </td>
      <td>
        <input
          style={{ ...inputStyle, borderColor: organikValue === null ? '#ef4444' : undefined }}
          inputMode="numeric"
          value={organik}
          onChange={(e) => setOrganik(e.target.value)}
          aria-label={`Reward organik ${machine.id}`}
        />
      </td>
      <td>
        <input
          style={{ ...inputStyle, borderColor: nonOrganikValue === null ? '#ef4444' : undefined }}
          inputMode="numeric"
          value={nonOrganik}
          onChange={(e) => setNonOrganik(e.target.value)}
          aria-label={`Reward non-organik ${machine.id}`}
        />
      </td>
      <td style={{ whiteSpace: 'nowrap' }}>
        <button
          className="btn btn-sm btn-primary"
          disabled={!dirty || !valid}
          style={{ opacity: !dirty || !valid ? 0.5 : 1, marginRight: 6 }}
          onClick={() =>
            onSave({
              ...machine,
              name: name.trim(),
              location: location.trim(),
              status,
              rewardOrganik: organikValue as number,
              rewardNonOrganik: nonOrganikValue as number,
            })
          }
        >
          Simpan
        </button>
        <button className="btn btn-sm btn-outline" style={{ color: '#b91c1c' }} onClick={() => onDelete(machine.id)}>
          Hapus
        </button>
      </td>
    </tr>
  );
}

export default function AdminMesinContent() {
  const machines = useMachines();
  const [toast, setToast] = useState<{ text: string; error?: boolean } | null>(null);
  const [newName, setNewName] = useState('');
  const [newLocation, setNewLocation] = useState('');

  const notify = (text: string, error = false) => {
    setToast({ text, error });
    setTimeout(() => setToast(null), 3000);
  };

  const persist = (next: Machine[], successMessage: string) => {
    if (saveMachines(next)) notify(successMessage);
    else notify('Gagal menyimpan: penyimpanan browser penuh atau diblokir.', true);
  };

  const handleSave = (updated: Machine) => {
    persist(
      readMachines().map((m) => (m.id === updated.id ? updated : m)),
      `${updated.id} berhasil disimpan.`,
    );
  };

  const handleDelete = (id: string) => {
    if (!window.confirm(`Hapus mesin ${id}? Riwayat transaksinya tetap tersimpan.`)) return;
    persist(readMachines().filter((m) => m.id !== id), `${id} dihapus.`);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const current = readMachines();
    const machine: Machine = {
      id: nextMachineId(current),
      name: newName.trim(),
      location: newLocation.trim(),
      status: 'nonaktif',
      rewardOrganik: 0,
      rewardNonOrganik: 0,
    };
    persist([...current, machine], `${machine.id} ditambahkan (nonaktif, reward Rp 0). Atur nominal lalu aktifkan.`);
    setNewName('');
    setNewLocation('');
  };

  return (
    <>
      {toast && (
        <div style={{
          position: 'fixed', top: 60, right: 20, zIndex: 100,
          background: toast.error ? '#b91c1c' : 'var(--eco-700)', color: '#ffffff',
          padding: '12px 20px', borderRadius: 8, boxShadow: 'var(--shadow-lg)', fontSize: 13, fontWeight: 600,
        }}>
          {toast.error ? '⚠' : '✔'} {toast.text}
        </div>
      )}

      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace", marginBottom: 4 }}>
          ADMIN // KELOLA_MESIN_REWARD
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px' }}>Kelola Mesin & Nominal Reward</h2>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
          Nominal reward (Rupiah) dibayarkan per satu kali buang sampah. Maksimal Rp {MAX_REWARD.toLocaleString('id-ID')}.
        </p>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'auto', marginBottom: 20 }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama</th>
              <th>Lokasi</th>
              <th>Status</th>
              <th>Reward Organik (Rp)</th>
              <th>Reward Non-organik (Rp)</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {machines.length === 0 && (
              <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Belum ada mesin. Tambahkan di bawah.</td></tr>
            )}
            {machines.map((machine) => (
              <MachineRow
                key={`${machine.id}-${machine.name}-${machine.location}-${machine.status}-${machine.rewardOrganik}-${machine.rewardNonOrganik}`}
                machine={machine}
                onSave={handleSave}
                onDelete={handleDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      <form onSubmit={handleAdd} className="card" style={{ padding: 20, display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 180 }}>
          <label style={{ display: 'block', fontSize: 11, marginBottom: 4, color: 'var(--text-secondary)' }}>Nama mesin</label>
          <input style={inputStyle} value={newName} onChange={(e) => setNewName(e.target.value)} required placeholder="Mesin 3" />
        </div>
        <div style={{ flex: 1, minWidth: 180 }}>
          <label style={{ display: 'block', fontSize: 11, marginBottom: 4, color: 'var(--text-secondary)' }}>Lokasi</label>
          <input style={inputStyle} value={newLocation} onChange={(e) => setNewLocation(e.target.value)} required placeholder="Perpustakaan" />
        </div>
        <button type="submit" className="btn btn-primary">+ Tambah Mesin</button>
      </form>
    </>
  );
}
