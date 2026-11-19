# Arsip fitur EcoSort lama

Kode di folder ini **tidak ikut build** (dikecualikan di `tsconfig.json` dan `eslint.config.mjs`).
Isinya fitur versi bank sampah / EcoToken yang tidak ada di use case diagram Smart Waste Vending Machine:

- Role warga: dashboard triase, buku besar setoran, hasil optik AI, pencetakan & penukaran token, pemeriksaan kamera, jadwal penjemputan kurir
- Admin lama: triase, buku besar batch, konfigurasi warga, master data
- Versi lama `AuthContext`, `AppShell`, `Sidebar`, `Header`, halaman login (dua role), dan route `classify`

## Cara memakai ulang

1. Pindahkan file ke `src/app/...` atau `src/components/...` sesuai struktur aslinya
   (path di sini mengikuti struktur lama; `app/` = `src/app/`, `components/` = `src/components/`).
2. `app/login-page.tsx` -> `src/app/login/page.tsx`, `app/classify-route.ts` -> `src/app/api/classify/route.ts`,
   `AuthContext.tsx` -> `src/context/AuthContext.tsx`.
3. Komponen lama memakai `user.balance`, `updateBalance`, dan role `warga` dari `AuthContext` lama.
   Versi baru hanya punya role `admin`, jadi pulihkan `AuthContext` lama atau sesuaikan komponennya.
