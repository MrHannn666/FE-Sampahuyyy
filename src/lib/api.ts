/**
 * Modul untuk berkomunikasi dengan backend API.
 *
 * Endpoints:
 * - POST /api/auth/validate  → JWT
 * - POST /api/scan           → scan_id, organic_value, non_organic_value
 * - POST /api/withdrawals    → withdrawal result (Midtrans)
 * - GET  /api/withdrawals/:id → status transaksi
 */

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

// ─── Helpers ───────────────────────────────────────────────

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(
  path: string,
  opts: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    ...opts,
    headers: {
      ...opts.headers,
    },
  });

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    const msg =
      (body as Record<string, unknown>)?.message ??
      (body as Record<string, unknown>)?.error ??
      `Request gagal (${res.status})`;
    throw new ApiError(String(msg), res.status, body);
  }

  return body as T;
}

function authHeaders(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}` };
}

// ─── Response types ────────────────────────────────────────

export interface ValidateResponse {
  token: string;
  /** field lain dari backend boleh ditambah di sini */
  [key: string]: unknown;
}

export interface ScanResponse {
  scan_id: string;
  organic_value: number;
  non_organic_value: number;
  [key: string]: unknown;
}

export interface WithdrawalResponse {
  jenis_sampah: string;
  nama_sampah: string[];
  confidence: number;
  transfered_amount: number;
  referral_number: string;
  [key: string]: unknown;
}

export interface WithdrawalStatus {
  id: string;
  status: string;
  [key: string]: unknown;
}

// ─── API functions ─────────────────────────────────────────

/**
 * Langkah 1: validasi nomor HP + jenis wallet → dapat JWT.
 */
export async function validateAuth(
  no_telp: string,
  jenis_wallet: string,
): Promise<ValidateResponse> {
  return request<ValidateResponse>('/api/auth/validate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ no_telp, jenis_wallet }),
  });
}

/**
 * Langkah 2: kirim gambar sampah → dapat scan_id + nilai organik/non-organik.
 * Backend minta form-data dengan field "image".
 */
export async function scanImage(
  token: string,
  imageBlob: Blob,
): Promise<ScanResponse> {
  const form = new FormData();
  form.append('image', imageBlob, 'capture.jpg');

  return request<ScanResponse>('/api/scan', {
    method: 'POST',
    headers: authHeaders(token),
    body: form,
  });
}

/**
 * Langkah 3: ajukan withdrawal / penarikan saldo via Midtrans.
 */
export async function createWithdrawal(
  token: string,
  payload: {
    organic_value: number;
    non_organic_value: number;
    jenis_pembayaran: string;
    no_telp: string;
    scan_id: string;
  },
): Promise<WithdrawalResponse> {
  return request<WithdrawalResponse>('/api/withdrawals', {
    method: 'POST',
    headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

/**
 * Cek status transaksi withdrawal.
 */
export async function getWithdrawalStatus(
  id: string,
): Promise<WithdrawalStatus> {
  return request<WithdrawalStatus>(`/api/withdrawals/${encodeURIComponent(id)}`);
}
