import { useMemo, useSyncExternalStore } from 'react';
import type { Ewallet } from './ewallet';

export { MAX_REWARD } from './constants';

/**
 * Penyimpanan lokal (localStorage) untuk mesin, nominal reward, dan transaksi.
 * Ini pengganti sementara backend: data hanya ada di browser yang dipakai.
 * Saat backend sungguhan tersedia, cukup ganti isi file ini.
 */

export type Classification = 'organik' | 'non-organik';
export type MachineStatus = 'aktif' | 'nonaktif' | 'maintenance';
export type TransactionStatus = 'BERHASIL' | 'GAGAL';

export interface Machine {
  id: string;
  name: string;
  location: string;
  status: MachineStatus;
  /** Reward dalam Rupiah per satu kali buang sampah organik. */
  rewardOrganik: number;
  /** Reward dalam Rupiah per satu kali buang sampah non-organik. */
  rewardNonOrganik: number;
}

export interface Transaction {
  id: string;
  /** ISO 8601 */
  time: string;
  machineId: string;
  ewallet: Ewallet;
  /** Nomor e-wallet yang sudah disamarkan; nomor asli tidak disimpan. */
  phoneMasked: string;
  classification: Classification;
  confidence: number;
  reward: number;
  status: TransactionStatus;
  gatewayRef: string;
  /** Alasan gagal (hanya untuk status GAGAL). */
  failureReason?: string;
}

/** Batas jumlah transaksi tersimpan agar tidak melebihi kuota localStorage (~5 MB). */
const MAX_TRANSACTIONS = 5000;

const MACHINES_KEY = 'ecosort_machines';
const TRANSACTIONS_KEY = 'ecosort_transactions';
const KIOSK_MACHINE_KEY = 'ecosort_kiosk_machine';
const CHANGE_EVENT = 'ecosort-store-change';

export const DEFAULT_MACHINES: Machine[] = [
  { id: 'VM-001', name: 'Mesin 1', location: 'Lobby Utama', status: 'aktif', rewardOrganik: 200, rewardNonOrganik: 500 },
  { id: 'VM-002', name: 'Mesin 2', location: 'Area Kantin', status: 'aktif', rewardOrganik: 200, rewardNonOrganik: 500 },
];

const EMPTY_TRANSACTIONS: Transaction[] = [];

// ---------- low-level storage ----------

function readRaw(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeRaw(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error(`Gagal menyimpan "${key}" ke localStorage:`, error);
    return false;
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
  return true;
}

function parseArray<T>(raw: string | null, fallback: T[]): T[] {
  if (!raw) return fallback;
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : fallback;
  } catch {
    return fallback;
  }
}

function subscribe(callback: () => void): () => void {
  window.addEventListener('storage', callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

function useRaw(key: string): string | null {
  return useSyncExternalStore(
    subscribe,
    () => readRaw(key),
    () => null,
  );
}

// ---------- hooks ----------

export function useMachines(): Machine[] {
  const raw = useRaw(MACHINES_KEY);
  return useMemo(() => parseArray(raw, DEFAULT_MACHINES), [raw]);
}

export function useTransactions(): Transaction[] {
  const raw = useRaw(TRANSACTIONS_KEY);
  return useMemo(() => parseArray(raw, EMPTY_TRANSACTIONS), [raw]);
}

/** ID mesin yang dipilih di layar kiosk (null jika belum pernah dipilih). */
export function useKioskMachineId(): string | null {
  return useRaw(KIOSK_MACHINE_KEY);
}

// ---------- mutations ----------

export function readMachines(): Machine[] {
  return parseArray(readRaw(MACHINES_KEY), DEFAULT_MACHINES);
}

export function saveMachines(machines: Machine[]): boolean {
  return writeRaw(MACHINES_KEY, JSON.stringify(machines));
}

export function readTransactions(): Transaction[] {
  return parseArray(readRaw(TRANSACTIONS_KEY), EMPTY_TRANSACTIONS);
}

export function addTransaction(tx: Transaction): boolean {
  const next = [tx, ...readTransactions()].slice(0, MAX_TRANSACTIONS);
  return writeRaw(TRANSACTIONS_KEY, JSON.stringify(next));
}

export function setKioskMachineId(id: string): boolean {
  return writeRaw(KIOSK_MACHINE_KEY, id);
}

// ---------- helpers ----------

export function generateTransactionId(): string {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `TRX-${stamp}-${rand}`;
}

export function nextMachineId(machines: Machine[]): string {
  const max = machines.reduce((acc, m) => {
    const n = Number(m.id.replace(/^VM-/, ''));
    return Number.isFinite(n) && n > acc ? n : acc;
  }, 0);
  return `VM-${String(max + 1).padStart(3, '0')}`;
}

export function rewardFor(machine: Machine, classification: Classification): number {
  return classification === 'organik' ? machine.rewardOrganik : machine.rewardNonOrganik;
}

/** Mesin untuk layar kiosk: pilihan tersimpan jika ada, jika tidak mesin aktif pertama. */
export function resolveKioskMachine(machines: Machine[], selectedId: string | null): Machine | null {
  return (
    machines.find((m) => m.id === selectedId) ??
    machines.find((m) => m.status === 'aktif') ??
    machines[0] ??
    null
  );
}
