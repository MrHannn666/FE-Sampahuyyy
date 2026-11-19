import { NextResponse } from 'next/server';
import { isEwallet, normalizePhone } from '@/lib/ewallet';
import { MAX_REWARD } from '@/lib/constants';

/**
 * MOCK payment gateway.
 * Memvalidasi permintaan lalu pura-pura mengirim saldo ke e-wallet.
 * Untuk integrasi sungguhan, ganti bagian "SIMULASI" dengan panggilan ke
 * penyedia payment gateway (kredensial lewat env, jangan di client).
 *
 * Catatan: nominal berasal dari konfigurasi admin yang tersimpan di browser,
 * jadi server hanya bisa memvalidasi rentangnya, bukan keasliannya.
 */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Body permintaan tidak valid' }, { status: 400 });
  }

  const { ewallet, phone, amount } = body;

  if (!isEwallet(ewallet)) {
    return NextResponse.json({ success: false, error: 'E-wallet tidak didukung' }, { status: 400 });
  }
  if (typeof phone !== 'string' || !normalizePhone(phone)) {
    return NextResponse.json({ success: false, error: 'Nomor e-wallet tidak valid' }, { status: 400 });
  }
  if (typeof amount !== 'number' || !Number.isInteger(amount) || amount <= 0 || amount > MAX_REWARD) {
    return NextResponse.json({ success: false, error: 'Nominal reward tidak valid' }, { status: 400 });
  }

  // SIMULASI: gateway selalu menerima permintaan.
  const gatewayRef = `PG-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;

  return NextResponse.json({ success: true, gatewayRef, ewallet, amount });
}
