'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { EWALLETS, maskPhone, normalizePhone, type Ewallet } from '@/lib/ewallet';
import { formatRupiah } from '@/lib/format';
import {
  addTransaction,
  generateTransactionId,
  resolveKioskMachine,
  rewardFor,
  setKioskMachineId,
  useKioskMachineId,
  useMachines,
  type Classification,
  type Machine,
  type TransactionStatus,
} from '@/lib/store';

type Step = 'wallet' | 'disposal' | 'result';

interface ScanResult {
  label: string;
  classification: Classification;
  confidence: number;
  simulated: boolean;
}

interface PayoutResult {
  status: TransactionStatus;
  reward: number;
  gatewayRef: string;
  message?: string;
  logged: boolean;
}

const STEPS: { key: Step; label: string }[] = [
  { key: 'wallet', label: 'Pilih e-wallet' },
  { key: 'disposal', label: 'Buang sampah' },
  { key: 'result', label: 'Terima saldo' },
];

const mono = "'JetBrains Mono', monospace";

const panelStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: 560,
  background: 'rgba(6, 78, 59, 0.45)',
  backdropFilter: 'blur(16px)',
  border: '1px solid rgba(52, 211, 153, 0.25)',
  borderRadius: 16,
  padding: '28px 28px',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 30px rgba(16, 185, 129, 0.15)',
  color: '#ffffff',
};

const primaryButton: React.CSSProperties = {
  width: '100%',
  padding: '14px 20px',
  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  border: 'none',
  borderRadius: 10,
  color: '#ffffff',
  fontSize: 15,
  fontWeight: 700,
  cursor: 'pointer',
  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
};

const secondaryButton: React.CSSProperties = {
  padding: '10px 16px',
  background: 'transparent',
  border: '1px solid rgba(52, 211, 153, 0.35)',
  borderRadius: 8,
  color: '#a7f3d0',
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
};

export default function KioskContent() {
  const machines = useMachines();
  const selectedMachineId = useKioskMachineId();
  const machine = resolveKioskMachine(machines, selectedMachineId);
  const operational = machine?.status === 'aktif';

  const [step, setStep] = useState<Step>('wallet');
  const [ewallet, setEwallet] = useState<Ewallet | null>(null);
  const [phoneInput, setPhoneInput] = useState('');
  const [phoneLocal, setPhoneLocal] = useState<string | null>(null);
  const [formError, setFormError] = useState('');

  const [busy, setBusy] = useState(false);
  const [scanError, setScanError] = useState('');
  const [scan, setScan] = useState<ScanResult | null>(null);
  const [payout, setPayout] = useState<PayoutResult | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraActive(false);
  }, []);

  useEffect(() => stopCamera, [stopCamera]);

  const startCamera = async () => {
    setCameraError('');
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError('Kamera tidak didukung di perangkat ini. Mode simulasi dipakai.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setCameraActive(true);
    } catch {
      setCameraError('Akses kamera ditolak atau tidak tersedia. Mode simulasi dipakai.');
    }
  };

  const captureFrame = (): string => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!cameraActive || !video || !canvas) return '';
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.8);
  };

  const resetSession = () => {
    stopCamera();
    setStep('wallet');
    setEwallet(null);
    setPhoneInput('');
    setPhoneLocal(null);
    setFormError('');
    setScan(null);
    setPayout(null);
    setScanError('');
    setCameraError('');
  };

  // ---------- Langkah 1: pilih e-wallet & isi nomor ----------

  const handleWalletSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ewallet) {
      setFormError('Pilih e-wallet terlebih dahulu.');
      return;
    }
    const normalized = normalizePhone(phoneInput);
    if (!normalized) {
      setFormError('Nomor tidak valid. Contoh: 081234567890.');
      return;
    }
    setFormError('');
    setPhoneLocal(normalized);
    setStep('disposal');
  };

  // ---------- Langkah 2: buang sampah (include: klasifikasi ML) ----------

  const classify = async (): Promise<ScanResult> => {
    let res: Response;
    try {
      res = await fetch('/api/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: captureFrame() }),
      });
    } catch {
      throw new Error('Tidak dapat menghubungi server klasifikasi.');
    }
    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.success) {
      throw new Error(data?.error ?? 'Sampah gagal diklasifikasikan. Coba lagi.');
    }
    return {
      label: data.label,
      classification: data.classification,
      confidence: data.confidence,
      simulated: Boolean(data.simulated),
    };
  };

  // ---------- Langkah 3: terima saldo (extend: payment gateway) ----------

  const pay = async (m: Machine, result: ScanResult, wallet: Ewallet, phone: string) => {
    const reward = rewardFor(m, result.classification);
    let status: TransactionStatus = 'BERHASIL';
    let gatewayRef = '-';
    let failureReason: string | undefined;

    if (reward > 0) {
      try {
        const res = await fetch('/api/reward', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ewallet: wallet, phone, amount: reward }),
        });
        const data = await res.json().catch(() => null);
        if (res.ok && data?.success) {
          gatewayRef = data.gatewayRef;
        } else {
          status = 'GAGAL';
          failureReason = data?.error ?? 'Ditolak oleh payment gateway.';
        }
      } catch {
        status = 'GAGAL';
        failureReason = 'Payment gateway tidak dapat dihubungi.';
      }
    }

    const logged = addTransaction({
      id: generateTransactionId(),
      time: new Date().toISOString(),
      machineId: m.id,
      ewallet: wallet,
      phoneMasked: maskPhone(phone),
      classification: result.classification,
      confidence: result.confidence,
      reward,
      status,
      gatewayRef,
      failureReason,
    });

    setPayout({ status, reward, gatewayRef, message: failureReason, logged });
  };

  const handleDispose = async () => {
    if (!machine || !operational || !ewallet || !phoneLocal) return;
    setBusy(true);
    setScanError('');
    try {
      const result = await classify();
      setScan(result);
      await pay(machine, result, ewallet, phoneLocal);
      stopCamera();
      setStep('result');
    } catch (error) {
      setScanError(error instanceof Error ? error.message : 'Terjadi kesalahan. Coba lagi.');
    } finally {
      setBusy(false);
    }
  };

  const currentStepIndex = STEPS.findIndex((s) => s.key === step);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      background: 'radial-gradient(circle at 50% 20%, #064e3b 0%, #022c22 45%, #051a14 100%)',
      padding: 20,
      color: '#ffffff',
    }}>
      {/* Top bar */}
      <div style={{ width: '100%', maxWidth: 560, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, fontFamily: mono, color: '#6ee7b7', marginBottom: 16 }}>
        <span>
          {step === 'wallet' && machines.length > 1 ? (
            <select
              value={machine?.id ?? ''}
              onChange={(e) => setKioskMachineId(e.target.value)}
              aria-label="Pilih mesin"
              style={{ background: 'rgba(2, 44, 34, 0.7)', color: '#a7f3d0', border: '1px solid rgba(52, 211, 153, 0.3)', borderRadius: 6, padding: '4px 6px', fontFamily: mono, fontSize: 11 }}
            >
              {machines.map((m) => <option key={m.id} value={m.id}>{m.id} — {m.location}</option>)}
            </select>
          ) : (
            machine ? `${machine.id} — ${machine.location}` : 'MESIN BELUM DIATUR'
          )}
        </span>
        <Link href="/login" style={{ color: '#6ee7b7', opacity: 0.7 }}>LOGIN ADMIN →</Link>
      </div>

      <div style={panelStyle}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 26 }}>♻</div>
          <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px' }}>Smart Waste Vending Machine</h1>
          <p style={{ fontSize: 13, color: '#a7f3d0', marginTop: 2 }}>Buang sampah, dapat saldo e-wallet.</p>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {STEPS.map((s, i) => (
            <div key={s.key} style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ height: 4, borderRadius: 2, background: i <= currentStepIndex ? '#10b981' : 'rgba(255,255,255,0.15)', marginBottom: 6 }} />
              <div style={{ fontSize: 10, fontFamily: mono, color: i <= currentStepIndex ? '#a7f3d0' : 'rgba(167,243,208,0.45)' }}>
                {i + 1}. {s.label}
              </div>
            </div>
          ))}
        </div>

        {!machine && (
          <Notice tone="error">Belum ada mesin terdaftar. Minta admin menambahkan mesin.</Notice>
        )}
        {machine && !operational && (
          <Notice tone="error">
            Mesin ini sedang {machine.status === 'maintenance' ? 'dalam perawatan' : 'tidak aktif'}. Silakan gunakan mesin lain.
          </Notice>
        )}

        {/* Langkah 1 */}
        {step === 'wallet' && (
          <form onSubmit={handleWalletSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <div style={labelStyle}>Pilih e-wallet</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(96px, 1fr))', gap: 10 }}>
                {EWALLETS.map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setEwallet(w)}
                    aria-pressed={ewallet === w}
                    style={{
                      padding: '14px 8px',
                      borderRadius: 10,
                      cursor: 'pointer',
                      fontWeight: 700,
                      fontSize: 14,
                      color: '#ffffff',
                      background: ewallet === w ? 'rgba(16, 185, 129, 0.45)' : 'rgba(2, 44, 34, 0.7)',
                      border: `2px solid ${ewallet === w ? '#34d399' : 'rgba(52, 211, 153, 0.25)'}`,
                    }}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="phone" style={labelStyle}>Nomor e-wallet</label>
              <input
                id="phone"
                type="tel"
                inputMode="numeric"
                autoComplete="off"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="081234567890"
                style={{
                  width: '100%',
                  padding: '14px 14px',
                  background: 'rgba(2, 44, 34, 0.7)',
                  border: '1px solid rgba(52, 211, 153, 0.3)',
                  borderRadius: 10,
                  color: '#ffffff',
                  fontSize: 18,
                  outline: 'none',
                  fontFamily: mono,
                }}
              />
            </div>

            {formError && <Notice tone="error">{formError}</Notice>}

            <button type="submit" disabled={!operational} style={{ ...primaryButton, opacity: operational ? 1 : 0.5 }}>
              Lanjut →
            </button>
          </form>
        )}

        {/* Langkah 2 */}
        {step === 'disposal' && machine && ewallet && phoneLocal && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ fontSize: 12, fontFamily: mono, color: '#a7f3d0', display: 'flex', justifyContent: 'space-between' }}>
              <span>{ewallet} • {maskPhone(phoneLocal)}</span>
              <button type="button" onClick={() => { stopCamera(); setStep('wallet'); }} style={{ ...secondaryButton, padding: '2px 10px', fontSize: 11 }} disabled={busy}>
                Ubah
              </button>
            </div>

            <div style={{ display: 'flex', gap: 10, fontSize: 12 }}>
              <RewardChip label="Organik" value={machine.rewardOrganik} color="#34d399" />
              <RewardChip label="Non-organik" value={machine.rewardNonOrganik} color="#60a5fa" />
            </div>

            <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', background: 'rgba(2, 44, 34, 0.7)', border: '1px solid rgba(52, 211, 153, 0.25)', aspectRatio: '4 / 3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <video
                ref={videoRef}
                muted
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: cameraActive ? 'block' : 'none' }}
              />
              {!cameraActive && (
                <div style={{ textAlign: 'center', padding: 16, fontSize: 13, color: '#a7f3d0' }}>
                  <div style={{ fontSize: 40, marginBottom: 6 }}>🗑</div>
                  Masukkan sampah ke mesin, lalu tekan tombol di bawah.
                  <div style={{ marginTop: 12 }}>
                    <button type="button" onClick={startCamera} style={secondaryButton} disabled={busy}>
                      📷 Aktifkan kamera
                    </button>
                  </div>
                </div>
              )}
              <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>

            {cameraError && <Notice tone="warn">{cameraError}</Notice>}
            {scanError && <Notice tone="error">{scanError}</Notice>}

            <button type="button" onClick={handleDispose} disabled={busy || !operational} style={{ ...primaryButton, opacity: busy || !operational ? 0.6 : 1 }}>
              {busy ? 'MENGKLASIFIKASI & MEMPROSES SALDO...' : 'Sampah sudah dimasukkan'}
            </button>
          </div>
        )}

        {/* Langkah 3 */}
        {step === 'result' && scan && payout && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, textAlign: 'center' }}>
            <div style={{ fontSize: 48 }}>{payout.status === 'BERHASIL' ? '✅' : '⚠️'}</div>

            <div>
              <span style={{
                display: 'inline-block', padding: '4px 14px', borderRadius: 100, fontSize: 12, fontWeight: 800, fontFamily: mono,
                background: scan.classification === 'organik' ? 'rgba(16,185,129,0.25)' : 'rgba(59,130,246,0.25)',
                color: scan.classification === 'organik' ? '#6ee7b7' : '#93c5fd',
              }}>
                {scan.classification.toUpperCase()}
              </span>
              <div style={{ fontSize: 13, color: '#a7f3d0', marginTop: 8 }}>
                {scan.label} • keyakinan {scan.confidence.toFixed(1)}%
              </div>
              {scan.simulated && (
                <div style={{ fontSize: 10, fontFamily: mono, color: '#fcd34d', marginTop: 4 }}>
                  MODE SIMULASI — model ML belum terhubung, hasil acak
                </div>
              )}
            </div>

            {payout.status === 'BERHASIL' ? (
              <div>
                <div style={{ fontSize: 13, color: '#a7f3d0' }}>Saldo terkirim ke {ewallet}</div>
                <div style={{ fontSize: 40, fontWeight: 800 }}>{formatRupiah(payout.reward)}</div>
                {payout.gatewayRef !== '-' && (
                  <div style={{ fontSize: 11, fontFamily: mono, color: 'rgba(167,243,208,0.7)' }}>Ref: {payout.gatewayRef}</div>
                )}
                {payout.reward === 0 && (
                  <div style={{ fontSize: 12, color: '#fcd34d', marginTop: 4 }}>Jenis sampah ini belum diberi reward oleh admin.</div>
                )}
              </div>
            ) : (
              <Notice tone="error">
                Saldo gagal dikirim: {payout.message}. Sampah sudah tercatat; hubungi admin jika saldo dibutuhkan.
              </Notice>
            )}

            {!payout.logged && (
              <Notice tone="warn">Transaksi tidak tersimpan di riwayat (penyimpanan browser penuh).</Notice>
            )}

            <button type="button" onClick={resetSession} style={primaryButton}>Transaksi baru</button>
          </div>
        )}
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 11,
  fontFamily: mono,
  color: '#a7f3d0',
  marginBottom: 8,
  textTransform: 'uppercase',
};

function Notice({ tone, children }: { tone: 'error' | 'warn'; children: React.ReactNode }) {
  const error = tone === 'error';
  return (
    <div style={{
      background: error ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
      border: `1px solid ${error ? 'rgba(239, 68, 68, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`,
      color: error ? '#fca5a5' : '#fcd34d',
      padding: '10px 14px',
      borderRadius: 8,
      fontSize: 12,
      marginBottom: 4,
    }}>
      {error ? '⚠ ' : 'ℹ '}{children}
    </div>
  );
}

function RewardChip({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ flex: 1, padding: '8px 12px', borderRadius: 8, background: 'rgba(2, 44, 34, 0.7)', border: '1px solid rgba(52, 211, 153, 0.2)' }}>
      <div style={{ fontSize: 10, fontFamily: mono, color }}>{label.toUpperCase()}</div>
      <div style={{ fontWeight: 700 }}>{formatRupiah(value)}</div>
    </div>
  );
}
