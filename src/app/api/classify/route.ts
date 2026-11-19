import { NextResponse } from 'next/server';

type Classification = 'organik' | 'non-organik';

const SIMULATED_ITEMS: { label: string; classification: Classification }[] = [
  { label: 'Sisa Makanan', classification: 'organik' },
  { label: 'Daun & Ranting', classification: 'organik' },
  { label: 'Kulit Buah', classification: 'organik' },
  { label: 'Botol Plastik PET', classification: 'non-organik' },
  { label: 'Kaleng Aluminium', classification: 'non-organik' },
  { label: 'Kardus', classification: 'non-organik' },
];

function toClassification(raw: unknown): Classification | null {
  if (typeof raw !== 'string') return null;
  const value = raw.toLowerCase();
  if (/non[\s_-]?organ|anorganik|inorganik|inorganic/.test(value)) return 'non-organik';
  if (/organik|organic/.test(value)) return 'organik';
  return null;
}

/** Confidence dikembalikan dalam persen (0-100); model boleh mengirim 0-1 atau 0-100. */
function toConfidencePercent(raw: unknown): number | null {
  if (typeof raw !== 'number' || !Number.isFinite(raw) || raw < 0) return null;
  const percent = raw <= 1 ? raw * 100 : raw;
  return Math.min(100, Math.round(percent * 10) / 10);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { imageBase64 } = body;

    // AMBIL DARI ENV (AMAN, TIDAK BOCOR KE CLIENT)
    const apiUrl = process.env.AI_API_URL;
    const apiKey = process.env.AI_API_KEY;
    const provider = process.env.AI_PROVIDER || 'python_yolo';

    // JIKA URL MODEL EXTERNAL SUDAH AKTIF:
    if (apiUrl && apiUrl !== 'http://localhost:8000/api/predict') {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'X-API-KEY': apiKey || '',
        },
        body: JSON.stringify({
          image: imageBase64,
          provider: provider,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        const classification = toClassification(
          result.classification ?? result.category ?? result.class ?? result.label,
        );
        const confidence = toConfidencePercent(result.confidence);

        if (!classification || confidence === null) {
          return NextResponse.json(
            { success: false, error: 'Sampah tidak dapat diklasifikasikan oleh model' },
            { status: 422 },
          );
        }

        return NextResponse.json({
          success: true,
          simulated: false,
          provider,
          label: typeof result.label === 'string' ? result.label : classification,
          classification,
          confidence,
        });
      }
    }

    // DEFAULT FALLBACK JIKA SERVER PYTHON BELUM NYALA (hasil acak, bukan prediksi sungguhan)
    const picked = SIMULATED_ITEMS[Math.floor(Math.random() * SIMULATED_ITEMS.length)];
    const confidence = Math.round((90 + Math.random() * 9) * 10) / 10;

    return NextResponse.json({
      success: true,
      simulated: true,
      provider,
      ...picked,
      confidence,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Gagal memproses inferensi AI' },
      { status: 500 },
    );
  }
}
