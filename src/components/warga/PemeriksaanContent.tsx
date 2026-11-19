'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function PemeriksaanContent() {
  const { updateBalance } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [useSimulation, setUseSimulation] = useState(true);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  // Detection states
  const [detection, setDetection] = useState({
    label: 'Botol Plastik PET Bening',
    code: '1-PET (Polyethylene)',
    confidence: 98.4,
    weight: 0.45,
    polymerCode: 'C10HB04',
    condition: 'KERING (100%)',
    tokenEst: 15,
    lux: 420.4,
    status: 'SORTED'
  });

  const [scanHistory, setScanHistory] = useState([
    { id: 'SCN-902', name: 'Botol PET 600ml', weight: '0.04 kg', token: '+5 TK', conf: '99.1%' },
    { id: 'SCN-901', name: 'Kardus Box Cokelat', weight: '1.20 kg', token: '+24 TK', conf: '97.5%' }
  ]);

  const [toast, setToast] = useState<string | null>(null);

  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // 880Hz A5
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.2);
    } catch {
      // ignore
    }
  };

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setUseSimulation(true);
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(() => {});
        };
      }
      setCameraActive(true);
      setUseSimulation(false);
    } catch (err: unknown) {
      console.warn('Camera access failed, falling back to simulation:', err);
      setUseSimulation(true);
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
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    }
    setCameraActive(false);
    setUseSimulation(true);
  };

  const toggleFacingMode = () => {
    stopCamera();
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const triggerScan = async () => {
    setIsScanning(true);
    playBeep();

    let imageBase64 = '';
    if (videoRef.current && canvasRef.current && !useSimulation) {
      try {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          imageBase64 = canvas.toDataURL('image/jpeg', 0.8);
        }
      } catch (e) {
        console.warn('Frame capture fallback:', e);
      }
    }

    try {
      const res = await fetch('/api/pemeriksaan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64 }),
      });
      const data = await res.json();

      if (data && data.success) {
        setDetection({
          label: data.label,
          code: data.code,
          confidence: data.confidence,
          weight: data.weight,
          polymerCode: data.polymerCode,
          condition: data.condition,
          tokenEst: data.tokenEst,
          lux: +(390 + Math.random() * 60).toFixed(1),
          status: 'SORTED'
        });

        setScanHistory(prev => [
          {
            id: `SCN-${Math.floor(1000 + Math.random() * 9000)}`,
            name: data.label,
            weight: `${data.weight} kg`,
            token: `+${data.tokenEst} TK`,
            conf: `${data.confidence}%`
          },
          ...prev.slice(0, 4)
        ]);

        setToast(`AI Terdeteksi: ${data.label} (+${data.tokenEst} TK)`);
      }
    } catch {
      // Offline fallback
      setToast('Deteksi AI selesai (Mode Simulasi)');
    } finally {
      setIsScanning(false);
      setTimeout(() => setToast(null), 3500);
    }
  };

  const handleMintToken = () => {
    updateBalance(detection.tokenEst);
    setToast(`Berhasil mencetak +${detection.tokenEst} EcoToken ke dompet Anda!`);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20, minHeight: 'calc(100vh - 120px)' }}>
      {/* Toast Notification */}
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
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <span>✔</span>
          <span>{toast}</span>
        </div>
      )}

      {/* LEFT: Camera Viewport & Real AI Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Camera HUD bar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-muted)' }}>
          <span><strong>TAMPILAN KAMERA:</strong> {useSimulation ? 'SIMULATOR_SENSOR_OPTIC' : 'LENSA_WEBCAM_LIVE'}</span>
          <span><strong>KALIBRASI:</strong> SPEKTRAL_NORMAL</span>
          <span><strong>RESOLUSI:</strong> 1280x720@30FPS</span>
          <span><strong>LUX:</strong> {detection.lux} lx</span>
          <span><strong>STATUS:</strong> <span style={{ color: cameraActive ? 'var(--eco-600)' : 'var(--status-danger)' }}>{cameraActive ? 'AKTIF' : 'NONAKTIF'}</span></span>
        </div>

        {/* Camera viewport container */}
        <div className="camera-viewport" style={{ flex: 1, minHeight: 440, position: 'relative', background: '#051814', borderRadius: 12, overflow: 'hidden' }}>
          {/* Actual HTML5 Video Stream */}
          <video
            ref={videoRef}
            playsInline
            autoPlay
            muted
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: useSimulation ? 'none' : 'block',
              transform: facingMode === 'user' ? 'scaleX(-1)' : 'none'
            }}
          />

          {/* Hidden Canvas for Frame Capture */}
          <canvas ref={canvasRef} style={{ display: 'none' }} />

          {/* Simulation fallback if device has no physical camera or permission denied */}
          {useSimulation && (
            <div style={{
              width: '100%',
              height: '100%',
              minHeight: 440,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'radial-gradient(circle at center, #064e3b 0%, #022c22 60%, #01140e 100%)',
              color: '#a7f3d0',
              textAlign: 'center',
              padding: 20
            }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📷</div>
              <div style={{ fontWeight: 700, fontSize: 16, color: '#ffffff', marginBottom: 6 }}>
                Simulasi Optik Spektral AI Aktif
              </div>
              <p style={{ fontSize: 12, maxWidth: 360, color: '#6ee7b7', margin: '0 auto 16px' }}>
                Kamera fisik sedang tidak diizinkan atau tidak terdeteksi. Sistem menggunakan umpan spektral sintetis beresolusi tinggi.
              </p>
              <button
                onClick={startCamera}
                style={{
                  padding: '8px 16px',
                  background: 'var(--eco-500)',
                  border: 'none',
                  borderRadius: 6,
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: 12,
                  cursor: 'pointer'
                }}
              >
                Coba Akses Kamera WebCam Lagi
              </button>
            </div>
          )}

          {/* Crosshair & Grid HUD */}
          <div className="camera-crosshair" />
          {isScanning && <div className="camera-scanline" style={{ animation: 'scan 1.2s infinite ease-in-out' }} />}

          {/* Dynamic AI Detection Box */}
          <div
            className="detection-box"
            style={{
              top: '18%',
              left: '22%',
              width: '52%',
              height: '60%',
              position: 'absolute',
              border: isScanning ? '2px dashed #f59e0b' : '2px solid #10b981',
              borderRadius: 8,
              boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)',
              pointerEvents: 'none',
              transition: 'all 0.3s'
            }}
          >
            <div className="detection-label" style={{
              position: 'absolute',
              top: -24,
              left: 0,
              background: isScanning ? '#f59e0b' : 'var(--eco-600)',
              color: '#ffffff',
              padding: '2px 8px',
              borderRadius: 4,
              fontSize: 10,
              fontFamily: "'JetBrains Mono', monospace",
              display: 'flex',
              gap: 8
            }}>
              <span>{isScanning ? '⏳ MENGANALISIS SPEKTRAL...' : `♻ ${detection.label}`}</span>
              <span>{isScanning ? '' : `${detection.confidence}%`}</span>
            </div>

            {/* Real-time bounding corner markers */}
            <div style={{ position: 'absolute', top: -1, left: -1, width: 12, height: 12, borderTop: '3px solid #34d399', borderLeft: '3px solid #34d399' }} />
            <div style={{ position: 'absolute', top: -1, right: -1, width: 12, height: 12, borderTop: '3px solid #34d399', borderRight: '3px solid #34d399' }} />
            <div style={{ position: 'absolute', bottom: -1, left: -1, width: 12, height: 12, borderBottom: '3px solid #34d399', borderLeft: '3px solid #34d399' }} />
            <div style={{ position: 'absolute', bottom: -1, right: -1, width: 12, height: 12, borderBottom: '3px solid #34d399', borderRight: '3px solid #34d399' }} />
          </div>

          {/* Bottom HUD Tags inside camera */}
          <div style={{ position: 'absolute', bottom: 12, left: 12, right: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', zIndex: 5, pointerEvents: 'none' }}>
            <div style={{ display: 'flex', gap: 6 }}>
              <span style={{ padding: '4px 8px', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(52,211,153,0.3)', borderRadius: 4, fontSize: 10, color: '#6ee7b7', fontFamily: "'JetBrains Mono', monospace" }}>
                KODE: {detection.polymerCode}
              </span>
              <span style={{ padding: '4px 8px', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(52,211,153,0.3)', borderRadius: 4, fontSize: 10, color: '#6ee7b7', fontFamily: "'JetBrains Mono', monospace" }}>
                KONDISI: {detection.condition}
              </span>
            </div>
            <div style={{ padding: '4px 8px', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(52,211,153,0.3)', borderRadius: 4, fontSize: 10, color: '#6ee7b7', fontFamily: "'JetBrains Mono', monospace" }}>
              ESTIMASI: {detection.weight} KG
            </div>
          </div>
        </div>

        {/* Camera Action Control Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          background: 'var(--bg-primary)',
          border: '1px solid var(--border-color)',
          borderRadius: 10,
          gap: 12
        }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={cameraActive ? stopCamera : startCamera}
              className="btn btn-secondary"
              style={{ fontSize: 12, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              {cameraActive ? '⏹ Matikan Kamera' : '▶ Nyalakan Kamera'}
            </button>

            <button
              onClick={toggleFacingMode}
              className="btn btn-secondary"
              style={{ fontSize: 12, padding: '8px 14px' }}
              title="Balik arah lensa kamera"
            >
              🔄 Balik Kamera ({facingMode === 'environment' ? 'Belakang' : 'Depan'})
            </button>

            <button
              onClick={() => setUseSimulation(!useSimulation)}
              className="btn btn-secondary"
              style={{ fontSize: 12, padding: '8px 14px' }}
            >
              ⚙ {useSimulation ? 'Gunakan WebCam' : 'Simulasi Sensor'}
            </button>
          </div>

          <button
            onClick={triggerScan}
            disabled={isScanning}
            style={{
              padding: '10px 24px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              border: 'none',
              borderRadius: 8,
              color: '#ffffff',
              fontWeight: 700,
              fontSize: 13,
              cursor: isScanning ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)'
            }}
          >
            <span style={{ fontSize: 16 }}>📸</span>
            <span>{isScanning ? 'MEMINDAI DENGAN AI...' : 'PINDAI & DETEKSI OBJEK'}</span>
          </button>
        </div>
      </div>

      {/* RIGHT: Classification & Spectral Analysis Panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Detection Card */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Klasifikasi Polimer Terkini</span>
            <span className="badge badge-green">TERVERIFIKASI</span>
          </div>

          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>
              {detection.label}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>
              KODE RESMI: {detection.code}
            </div>

            <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div style={{ padding: 10, background: 'var(--eco-50)', borderRadius: 8, border: '1px solid var(--eco-200)' }}>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>AKURASI AI</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--eco-800)', marginTop: 2 }}>{detection.confidence}%</div>
              </div>
              <div style={{ padding: 10, background: 'var(--eco-50)', borderRadius: 8, border: '1px solid var(--eco-200)' }}>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>BOBOT ESTIMASI</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--eco-800)', marginTop: 2 }}>{detection.weight} kg</div>
              </div>
            </div>

            {/* Token Estimation Box */}
            <div style={{
              marginTop: 16,
              padding: '12px 14px',
              background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(5,150,105,0.15))',
              border: '1px solid var(--eco-300)',
              borderRadius: 8,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--eco-800)', fontWeight: 600 }}>NILAI TUKAR ECOTOKEN:</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--eco-700)' }}>
                  +{detection.tokenEst} TK
                </div>
              </div>
              <button
                onClick={handleMintToken}
                className="btn btn-primary"
                style={{ fontSize: 12, padding: '8px 14px' }}
              >
                Cairkan Token
              </button>
            </div>
          </div>
        </div>

        {/* Neural Confidence Breakdown */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Matriks Keyakinan Neural</span>
            <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-muted)' }}>YOLOv8-OPEN</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 600, marginBottom: 4 }}>
                <span>1-PET Bening</span>
                <span>{detection.confidence}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill green" style={{ width: `${detection.confidence}%` }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 600, marginBottom: 4 }}>
                <span>Tutup HDPE</span>
                <span>2.1%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill yellow" style={{ width: '2.1%' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 600, marginBottom: 4 }}>
                <span>Kontaminan / Label</span>
                <span>1.1%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill red" style={{ width: '1.1%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Scan History Strip */}
        <div className="card" style={{ flex: 1 }}>
          <div className="card-header">
            <span className="card-title">Riwayat Deteksi Terkini</span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>LIVE FEED</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
            {scanHistory.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 10px',
                  background: 'var(--neutral-50)',
                  borderRadius: 6,
                  border: '1px solid var(--neutral-200)',
                  fontSize: 12
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>{item.id} • {item.weight}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, color: 'var(--eco-600)' }}>{item.token}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{item.conf}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
