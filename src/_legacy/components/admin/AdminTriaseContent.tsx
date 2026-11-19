'use client';

import React, { useState, useRef, useEffect } from 'react';

interface QueueItem {
  id: string;
  nasabah: string;
  nik: string;
  dropbox: string;
  material: string;
  materialRate: number; // rate per kg
  aiWeight: number;
  actualWeight: number;
  detectedCondition: string;
  statusBadge: string;
  notes: string;
}

export default function AdminTriaseContent() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [useSim, setUseSim] = useState(true);

  const initialQueue: QueueItem[] = [
    {
      id: 'TRX-20241024-9941',
      nasabah: 'Siti Rahmawati',
      nik: '3175084920040003',
      dropbox: 'DROP_BOX_JKT_EAST_09',
      material: 'Plastik Botol PET Bening Mutu A (Rp 80 / kg / 80 EcoTokens)',
      materialRate: 80,
      aiWeight: 3.40,
      actualWeight: 3.25,
      detectedCondition: 'Bersih, Tanpa Label',
      statusBadge: 'SIAP',
      notes: 'Barang telah diperiksa fisik. Botol kering sempurna, tutup telah dipisah. Bobot net disesuaikan setelah pengurangan tara wadah resmi.'
    },
    {
      id: 'TRX-20241024-9942',
      nasabah: 'Budi Santoso',
      nik: '3174889021004001',
      dropbox: 'DROP_BOX_TEBET_WEST_02',
      material: 'Kardus & Kertas Karton Tebal (Rp 60 / kg / 60 EcoTokens)',
      materialRate: 60,
      aiWeight: 5.80,
      actualWeight: 5.80,
      detectedCondition: 'Kering, Terikat Rapih',
      statusBadge: 'SIAP',
      notes: 'Kardus dalam kondisi baik tanpa staples besi.'
    },
    {
      id: 'TRX-20241024-9943',
      nasabah: 'Rina Handayani',
      nik: '3175028472910002',
      dropbox: 'DROP_BOX_JKT_SOUTH_05',
      material: 'Kaleng Minuman Aluminium (Rp 120 / kg / 120 EcoTokens)',
      materialRate: 120,
      aiWeight: 1.20,
      actualWeight: 1.15,
      detectedCondition: 'Rata / Dipipihkan',
      statusBadge: 'PINDAI_AI',
      notes: 'Aluminium bersih tanpa residu cairan manis.'
    },
    {
      id: 'TRX-20241024-9944',
      nasabah: 'Ahmad Faisal',
      nik: '3174928173920004',
      dropbox: 'DROP_BOX_TEBET_EAST_01',
      material: 'Plastik Campuran Mutu B (Rp 60 / kg / 60 EcoTokens)',
      materialRate: 60,
      aiWeight: 2.45,
      actualWeight: 2.30,
      detectedCondition: 'Perlu Sortir Tambahan',
      statusBadge: 'SIAP',
      notes: 'Terdapat 2 tutup botol yang perlu dipisahkan.'
    },
  ];

  const [queue, setQueue] = useState<QueueItem[]>(initialQueue);
  const [currentIdx, setCurrentIdx] = useState(0);
  const current = queue[currentIdx] || initialQueue[0];

  const [riilWeight, setRiilWeight] = useState(current.actualWeight);
  const [decision, setDecision] = useState<'penuh' | 'disesuaikan' | 'ditolak'>('disesuaikan');
  const [notes, setNotes] = useState(current.notes);
  const [selectedMaterial, setSelectedMaterial] = useState(current.material);
  const [toast, setToast] = useState<string | null>(null);

  // Sync state when selected queue changes
  useEffect(() => {
    setRiilWeight(current.actualWeight);
    setNotes(current.notes);
    setSelectedMaterial(current.material);
  }, [currentIdx, current]);

  // Real Camera stream (on-demand)
  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setUseSim(true);
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(() => {});
        };
      }
      setCameraActive(true);
      setUseSim(false);
    } catch {
      setUseSim(true);
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current) {
      try {
        videoRef.current.pause();
      } catch {}
      if (videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(t => t.stop());
        videoRef.current.srcObject = null;
      }
    }
    setCameraActive(false);
    setUseSim(true);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Calculate calculations
  const rate = current.materialRate;
  const initialAiToken = Math.round(current.aiWeight * rate);
  const finalVerifiedToken = Math.round(riilWeight * rate);
  const diffWeight = +(riilWeight - current.aiWeight).toFixed(2);

  const handlePullScaleWeight = () => {
    const jitter = +(current.aiWeight - 0.15 + (Math.random() * 0.05 - 0.025)).toFixed(2);
    setRiilWeight(jitter);
    setToast(`Data ditarik dari Port COM3: ${jitter} kg`);
    setTimeout(() => setToast(null), 2500);
  };

  const handleConfirmVerification = () => {
    setToast(`Berhasil verifikasi & cairkan ${finalVerifiedToken} EcoToken untuk ${current.nasabah}!`);
    setTimeout(() => {
      setToast(null);
      // Move to next in queue
      if (queue.length > 1) {
        const nextQ = queue.filter((_, i) => i !== currentIdx);
        setQueue(nextQ);
        setCurrentIdx(0);
      }
    }, 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Toast Alert */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: 60,
          right: 20,
          background: 'var(--eco-700)',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: 8,
          boxShadow: 'var(--shadow-lg)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontSize: 13,
          fontWeight: 600,
        }}>
          <span>✔</span>
          <span>{toast}</span>
        </div>
      )}

      {/* Header bar matching screenshot 3 */}
      <div style={{
        background: '#ffffff',
        border: '1px solid var(--border-color)',
        borderRadius: 10,
        padding: '12px 18px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 10
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: 'var(--eco-700)', fontWeight: 700 }}>
            <span style={{ padding: '2px 6px', background: 'var(--eco-100)', borderRadius: 4 }}>
              AUDIT_SISTEM // REKONSILIASI_FISIK
            </span>
            <span>SIMPUL_KALIBRASI_04 ●</span>
          </div>

          <h2 style={{ fontSize: 18, fontWeight: 800, margin: '4px 0 2px', color: 'var(--text-primary)' }}>
            Konsol Verifikasi Fisik & Kalibrasi Timbangan Nasabah
          </h2>

          <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: "'JetBrains Mono', monospace" }}>
            <strong style={{ color: 'var(--eco-800)' }}>{current.id}</strong> • Nasabah: <strong>{current.nasabah}</strong> (NIK: {current.nik}) • {current.dropbox}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>STATUS BUKU BESAR</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--eco-800)', background: 'var(--eco-100)', padding: '4px 8px', borderRadius: 4 }}>
              Menunggu Persetujuan Petugas Lapangan
            </div>
          </div>

          <button
            onClick={() => {
              setToast('Data kalibrasi timbangan diperbarui');
              setTimeout(() => setToast(null), 2000);
            }}
            style={{ width: 34, height: 34, border: '1px solid var(--neutral-300)', background: '#fff', borderRadius: 6, cursor: 'pointer' }}
            title="Refresh"
          >
            🔄
          </button>
        </div>
      </div>

      {/* Main Split Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16 }}>
        {/* LEFT: Telemetri Optik & Segmentasi AI */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="card" style={{ padding: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                <span>👁</span>
                <span>Telemetri Optik & Segmentasi AI</span>
              </div>
              <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: 'var(--eco-700)', fontWeight: 600 }}>
                ● SALURAN_LANGSUNG_CH01
              </span>
            </div>

            {/* Video / Camera Box */}
            <div style={{
              position: 'relative',
              width: '100%',
              height: 360,
              background: '#091e17',
              borderRadius: 8,
              overflow: 'hidden',
              border: '1px solid rgba(16,185,129,0.3)'
            }}>
              <video
                ref={videoRef}
                playsInline
                autoPlay
                muted
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: useSim ? 'none' : 'block'
                }}
              />

              {useSim && (
                <div style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'radial-gradient(circle at center, #064e3b 0%, #022c22 70%)',
                  color: '#a7f3d0'
                }}>
                  <div style={{ fontSize: 42, marginBottom: 8 }}>🧺</div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>Umpan Kamera Optik Spektral CH01</div>
                  <div style={{ fontSize: 11, color: '#6ee7b7' }}>Sensor Bin Kontainer: CONT_44709</div>
                </div>
              )}

              {/* Bounding box #PET_MUTU_A 96.8% */}
              <div style={{
                position: 'absolute',
                top: '15%',
                left: '12%',
                width: '74%',
                height: '70%',
                border: '2px solid #10b981',
                borderRadius: 4,
                boxShadow: '0 0 12px rgba(16,185,129,0.5)',
                pointerEvents: 'none'
              }}>
                <div style={{
                  position: 'absolute',
                  top: -24,
                  left: 0,
                  background: 'var(--eco-600)',
                  color: '#fff',
                  padding: '2px 8px',
                  borderRadius: 4,
                  fontSize: 10,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 700
                }}>
                  #PET_MUTU_A 96.8%
                </div>

                <div style={{
                  position: 'absolute',
                  bottom: 10,
                  right: 10,
                  background: 'rgba(0,0,0,0.7)',
                  color: '#34d399',
                  padding: '2px 8px',
                  borderRadius: 4,
                  fontSize: 10,
                  fontFamily: "'JetBrains Mono', monospace"
                }}>
                  EST_VOL: 0.042m³
                </div>
              </div>

              {/* Floating Camera control buttons */}
              <div style={{
                position: 'absolute',
                top: 10,
                right: 10,
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                zIndex: 10
              }}>
                <button
                  onClick={() => setUseSim(!useSim)}
                  style={{ width: 28, height: 28, borderRadius: 4, background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontSize: 12, cursor: 'pointer' }}
                  title="Ganti Mode Kamera"
                >
                  🔍
                </button>
                <button
                  onClick={startCamera}
                  style={{ width: 28, height: 28, borderRadius: 4, background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontSize: 12, cursor: 'pointer' }}
                  title="Refresh Stream"
                >
                  ⛶
                </button>
              </div>

              {/* Bottom HUD bar */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '6px 12px',
                background: 'rgba(0,0,0,0.75)',
                display: 'flex',
                justifyContent: 'space-between',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                color: '#cbd5e1'
              }}>
                <span>RESOLUSI: 1920x1080_RGB</span>
                <span>RANA: 1/120d</span>
                <span>WAKTU: 24-10-2024 14:22:09 WIB</span>
              </div>
            </div>

            {/* Three Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 12 }}>
              <div style={{ padding: '8px 10px', background: 'var(--eco-50)', borderRadius: 6, border: '1px solid var(--eco-200)' }}>
                <div style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>SENSOR KAMERA AI</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--eco-900)', marginTop: 2 }}>YOLOv8-Sampah v4</div>
              </div>
              <div style={{ padding: '8px 10px', background: 'var(--eco-50)', borderRadius: 6, border: '1px solid var(--eco-200)' }}>
                <div style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>ESTIMASI AI</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--eco-900)', marginTop: 2 }}>{current.aiWeight.toFixed(2)} kg</div>
              </div>
              <div style={{ padding: '8px 10px', background: 'var(--eco-50)', borderRadius: 6, border: '1px solid var(--eco-200)' }}>
                <div style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>KONDISI DETEKSI</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--eco-900)', marginTop: 2 }}>{current.detectedCondition}</div>
              </div>
            </div>

            {/* Matriks Keyakinan Klasifikasi Neural */}
            <div style={{ marginTop: 12, padding: '10px 12px', background: 'var(--neutral-50)', borderRadius: 6, border: '1px solid var(--neutral-200)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: 'var(--text-secondary)' }}>
                <span>MATRIKS KEYAKINAN KLASIFIKASI NEURAL</span>
                <span style={{ color: 'var(--eco-700)' }}>96.8% TINGGI</span>
              </div>
              <div className="progress-bar" style={{ marginTop: 6, height: 6 }}>
                <div className="progress-fill green" style={{ width: '96.8%' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-muted)' }}>
                <span>01. PET_BENING: 96.8%</span>
                <span>02. TUTUP_HDPE: 2.1%</span>
                <span>03. KONTAMINAN: 1.1%</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Inspeksi & Kalibrasi Fisik */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="card" style={{ padding: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                <span>⚖</span>
                <span>Inspeksi & Kalibrasi Fisik</span>
              </div>
              <span className="badge badge-green" style={{ fontSize: 9 }}>
                PORT_TIMBANGAN_COM3: AKTIF
              </span>
            </div>

            {/* Digital IoT Scale Card */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 14px',
              background: 'var(--eco-50)',
              border: '1px solid var(--eco-300)',
              borderRadius: 8
            }}>
              <div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
                  PEMBACAAN TIMBANGAN DIGITAL IOT TERHUBUNG
                </div>
                <div style={{ fontSize: 26, fontWeight: 900, color: 'var(--eco-900)', fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>
                  {riilWeight.toFixed(2)} <span style={{ fontSize: 14 }}>kg</span>
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 2 }}>
                  ✔ Tara Otomatis: -0.10 kg (Wadah Standar Bin-04)
                </div>
              </div>

              <button
                onClick={handlePullScaleWeight}
                style={{
                  padding: '8px 14px',
                  background: '#ffffff',
                  border: '1px solid var(--eco-400)',
                  borderRadius: 6,
                  color: 'var(--eco-800)',
                  fontWeight: 700,
                  fontSize: 11,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <span>🔄</span>
                <span>Tarik Berat Langsung</span>
              </button>
            </div>

            {/* Manual weight input */}
            <div style={{ marginTop: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontFamily: "'JetBrains Mono', monospace", marginBottom: 4 }}>
                <span style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>INPUT BERAT TIMBANGAN RIIL PETUGAS (KG)</span>
                <span style={{ color: diffWeight < 0 ? '#dc2626' : 'var(--eco-700)', fontWeight: 600 }}>
                  SELISIH: {diffWeight > 0 ? `+${diffWeight}` : diffWeight} KG DARI AI
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="number"
                  step="0.05"
                  value={riilWeight}
                  onChange={(e) => setRiilWeight(parseFloat(e.target.value) || 0)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    fontSize: 14,
                    fontWeight: 700,
                    borderRadius: 6,
                    border: '1px solid var(--neutral-300)',
                    fontFamily: "'JetBrains Mono', monospace"
                  }}
                />
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)' }}>kg BERSIH</span>
              </div>
            </div>

            {/* Material dropdown */}
            <div style={{ marginTop: 12 }}>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)', fontFamily: "'JetBrains Mono', monospace", marginBottom: 4 }}>
                KLASIFIKASI MATERIAL FISIK RESMI
              </label>
              <select
                value={selectedMaterial}
                onChange={(e) => setSelectedMaterial(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  fontSize: 12,
                  borderRadius: 6,
                  border: '1px solid var(--neutral-300)',
                  background: '#ffffff'
                }}
              >
                <option value={current.material}>{current.material}</option>
                <option value="Plastik Botol PET Bening Mutu B (Rp 70 / kg / 70 EcoTokens)">Plastik Botol PET Bening Mutu B (Rp 70 / kg)</option>
                <option value="Tutup Botol HDPE (Rp 90 / kg / 90 EcoTokens)">Tutup Botol HDPE (Rp 90 / kg)</option>
                <option value="Kardus & Kertas Karton (Rp 60 / kg / 60 EcoTokens)">Kardus & Kertas Karton (Rp 60 / kg)</option>
              </select>
            </div>

            {/* Recalculate Token Box */}
            <div style={{ marginTop: 12, padding: 10, background: 'var(--neutral-50)', borderRadius: 6, border: '1px solid var(--neutral-200)' }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace", marginBottom: 6 }}>
                KALKULASI ULANG SALDO TOKEN // TARIFF: {rate} TK/KG
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div style={{ padding: '8px 10px', background: '#fff', borderRadius: 4, border: '1px solid var(--neutral-200)' }}>
                  <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>ESTIMASI AWAL AI</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', marginTop: 2 }}>
                    {initialAiToken} <span style={{ fontSize: 10 }}>EcoTokens</span>
                  </div>
                  <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>Basis {current.aiWeight.toFixed(2)} kg @ {rate} TK</div>
                </div>

                <div style={{ padding: '8px 10px', background: 'var(--eco-700)', borderRadius: 4, color: '#fff' }}>
                  <div style={{ fontSize: 9, opacity: 0.9 }}>NILAI TERVERIFIKASI FINAL</div>
                  <div style={{ fontSize: 15, fontWeight: 800, marginTop: 2 }}>
                    {finalVerifiedToken} <span style={{ fontSize: 10 }}>EcoTokens</span>
                  </div>
                  <div style={{ fontSize: 9, opacity: 0.85 }}>Disesuaikan riil ({diffWeight} kg)</div>
                </div>
              </div>
            </div>

            {/* Verification Decision radio options */}
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)', fontFamily: "'JetBrains Mono', monospace", marginBottom: 6 }}>
                PILIHAN KEPUTUSAN PETUGAS
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {[
                  { id: 'penuh', label: 'Disetujui Penuh' },
                  { id: 'disesuaikan', label: 'Disesuaikan Bobot' },
                  { id: 'ditolak', label: 'Ditolak' }
                ].map((opt) => (
                  <label
                    key={opt.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '6px 8px',
                      background: decision === opt.id ? 'var(--eco-50)' : '#fff',
                      border: decision === opt.id ? '1px solid var(--eco-500)' : '1px solid var(--neutral-300)',
                      borderRadius: 6,
                      fontSize: 11,
                      cursor: 'pointer',
                      fontWeight: decision === opt.id ? 700 : 500
                    }}
                  >
                    <input
                      type="radio"
                      name="decision"
                      checked={decision === opt.id}
                      onChange={() => setDecision(opt.id as typeof decision)}
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Notes textarea */}
            <div style={{ marginTop: 12 }}>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)', fontFamily: "'JetBrains Mono', monospace", marginBottom: 4 }}>
                CATATAN VERIFIKATOR LAPANGAN
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  fontSize: 11,
                  borderRadius: 6,
                  border: '1px solid var(--neutral-300)',
                  outline: 'none'
                }}
              />
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
              <button
                onClick={handleConfirmVerification}
                className="btn btn-primary"
                style={{ flex: 1, padding: '10px 14px', fontSize: 12, justifyContent: 'center' }}
              >
                ✔ Verifikasi & Cairkan Token ke Nasabah
              </button>

              <button
                onClick={() => {
                  setToast('Setoran ditunda untuk tinjau ulang');
                  setTimeout(() => setToast(null), 2000);
                }}
                className="btn btn-secondary"
                style={{ padding: '10px 14px', fontSize: 12 }}
              >
                Tunda / Tinjau Ulang
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Antrean Verifikasi Queue Strip */}
      <div className="card" style={{ padding: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
            <span>📋</span>
            <span>Daftar Antrean Verifikasi</span>
            <span className="badge badge-green" style={{ fontSize: 9 }}>{queue.length} ANTREAN TERSISA</span>
          </div>

          <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
            PEMBARUAN_OTOMATIS: 15d ⚙
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr) 180px', gap: 10 }}>
          {queue.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setCurrentIdx(idx)}
              style={{
                padding: '10px 12px',
                background: currentIdx === idx ? 'var(--eco-50)' : '#ffffff',
                border: currentIdx === idx ? '2px solid var(--eco-500)' : '1px solid var(--neutral-200)',
                borderRadius: 8,
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 10, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: 'var(--eco-800)' }}>
                  {item.id}
                </span>
                <span className="badge badge-green" style={{ fontSize: 8 }}>{item.statusBadge}</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: 12, marginTop: 4, color: 'var(--text-primary)' }}>
                {item.nasabah}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 11 }}>
                <span style={{ color: 'var(--text-secondary)' }}>{item.material.split('(')[0]}</span>
                <span style={{ fontWeight: 700, color: 'var(--eco-700)', fontFamily: "'JetBrains Mono', monospace" }}>
                  ~{Math.round(item.aiWeight * item.materialRate)} TK
                </span>
              </div>
            </div>
          ))}

          <div
            onClick={() => {
              setToast('Menampilkan seluruh antrean bank sampah...');
              setTimeout(() => setToast(null), 2000);
            }}
            style={{
              padding: '10px 12px',
              background: 'var(--neutral-100)',
              border: '1px dashed var(--neutral-300)',
              borderRadius: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>📋</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>
              BUKA ANTREAN LENGKAP
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>+3 antrean lainnya</div>
          </div>
        </div>
      </div>
    </div>
  );
}
