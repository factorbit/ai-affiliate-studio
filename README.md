# AI Affiliate Studio — Tahap 1

Fondasi antarmuka untuk aplikasi affiliate pribadi berbahasa Indonesia.

## Yang sudah tersedia
- Dashboard dark premium yang responsif untuk tablet dan HP.
- Navigasi sidebar untuk Dashboard, Riset Produk, Studio Konten AI, Kampanye, Analitik, Asisten AI, dan Pengaturan.
- Kartu ringkasan dan contoh kampanye menggunakan data demo.
- Navigasi halaman berfungsi.
- Tidak ada koneksi marketplace, Supabase, atau API AI pada tahap ini.

## Menjalankan secara lokal
Membutuhkan Node.js versi LTS.

```bash
npm install
npm run dev
```

## Build produksi
```bash
npm run build
```
Hasil build ada di folder `dist`.

## Deploy ke Netlify
- Build command: `npm run build`
- Publish directory: `dist`

## Catatan
Semua angka dan kampanye di dashboard adalah data contoh, bukan performa aktual. Jangan memasukkan API key ke frontend. Integrasi backend dan database direncanakan pada tahap berikutnya.
