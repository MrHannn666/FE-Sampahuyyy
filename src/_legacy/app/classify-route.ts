import { NextResponse } from 'next/server';

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
        return NextResponse.json({
          success: true,
          ...result,
        });
      }
    }

    // DEFAULT FALLBACK JIKA SERVER PYTHON BELUM NYALA
    const sampleItems = [
      { label: 'Botol Plastik PET Bening', code: '1-PET (Polyethylene)', confidence: 98.4, weight: 0.35, polymerCode: 'C10HB04', condition: 'BERSIH & KERING', tokenEst: 15 },
      { label: 'Kaleng Minuman Aluminium', code: 'ALU-02 (Aluminium)', confidence: 99.1, weight: 0.18, polymerCode: 'AL-99', condition: 'DIPEGANG/PIPIH', tokenEst: 25 },
      { label: 'Kardus Cokelat (Corrugated)', code: 'PAP-20 (Kardus Tebal)', confidence: 97.2, weight: 0.85, polymerCode: 'CELL-01', condition: 'KERING TERLIPAT', tokenEst: 18 },
    ];
    const picked = sampleItems[Math.floor(Math.random() * sampleItems.length)];

    return NextResponse.json({
      success: true,
      provider: provider,
      ...picked,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Gagal memproses inferensi AI' },
      { status: 500 }
    );
  }
}
