export const EWALLETS = ['GoPay', 'OVO', 'DANA', 'ShopeePay', 'LinkAja'] as const;

export type Ewallet = (typeof EWALLETS)[number];

export function isEwallet(value: unknown): value is Ewallet {
  return typeof value === 'string' && (EWALLETS as readonly string[]).includes(value);
}

/**
 * Normalisasi nomor HP Indonesia ke format lokal (08xxxxxxxxxx).
 * Menerima 08..., 628..., atau +628... dengan spasi/strip/titik/kurung.
 * Mengembalikan null jika formatnya tidak valid.
 */
export function normalizePhone(input: string): string | null {
  const compact = input.replace(/[\s\-().]/g, '');
  const local = /^\+?62\d+$/.test(compact) ? `0${compact.replace(/^\+?62/, '')}` : compact;
  return /^08\d{8,11}$/.test(local) ? local : null;
}

export function maskPhone(localPhone: string): string {
  return `${localPhone.slice(0, 4)}****${localPhone.slice(-3)}`;
}
