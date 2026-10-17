# Usaha Qita — Prototipe Independen Perencana Usaha & Simulasi Mandiri UMKM

Platform web prototipe independen yang dirancang untuk membantu masyarakat Indonesia merencanakan rintisan usaha baru, mengkaji kelayakan finansial UMKM, dan mempersiapkan simulasi konsultasi bersama Mantri BRI berbasis matematika finansial deterministik dan alur persetujuan transparan.

> [!IMPORTANT]
> **PEMBERITAHUAN KEPATUHAN & TRANSPARANSI DATA SIMULASI (NON-NEGOTIABLE GUARDRAILS)**:
> 1. **Bukan Aplikasi Resmi Penerbit Pinjaman**: Usaha Qita adalah platform edukasi dan simulasi perencanaan usaha mandiri. Usaha Qita **bukan aplikasi perbankan resmi dari PT Bank Rakyat Indonesia (Persero) Tbk**.
> 2. **Tidak Ada Akses Core Banking**: Aplikasi ini tidak terhubung ke database rahasia, sistem perbankan internal, atau core banking BRI.
> 3. **Konsultasi Tanpa Janji Kredit**: Pengajuan jadwal diskusi Mantri BRI bersifat bimbingan/konsultasi kewirausahaan dan **tidak menjamin persetujuan kredit/pinjaman** (seperti KUR atau Kupedes).
> 4. **Seluruh Data Berstatus Simulasi**: Proyeksi omzet, estimasi HPP, modal awal, dan profil peluang bisnis pada aplikasi adalah asumsi edukatif yang wajib diberi label visual: **"Data simulasi"**.
> 5. **Privasi & Penyimpanan Lokal (Zero Secret)**: Seluruh data profil dan permohonan bimbingan disimpan secara mandiri di penyimpanan lokal peramban (*browser storage*) tanpa pengiriman data pribadi ke server eksternal.

---

## 1. Arsitektur & Teknologi Utama

- **Framework**: Next.js 15 (App Router Architecture)
- **Library Tampilan**: React 19
- **Bahasa Pemrograman**: TypeScript (Strict Mode `strict: true`)
- **Styling**: Tailwind CSS (Mobile-First Utility Classes)
- **Pengujian Otomatis**: Vitest 3.2 (Unit Test Engine)
- **Validasi Skema**: Zod (Runtime Type & Input Validation)
- **Runtime Target**: Node.js LTS (macOS / Linux / Windows)
- **Pola Desain**: *Spec-Driven Development (SDD)* dengan pemisahan domain murni (*Clean Architecture*).

---

## 2. Struktur Folder Proyek

```text
usaha-qita/
├── specs/                         # Spesifikasi Single Source of Truth (SDD)
│   ├── requirements.md            # Kebutuhan produk dan batasan kepatuhan
│   ├── design.md                  # Arsitektur sistem, formula finansial & kontrak tipe
│   ├── tasks.md                   # Work Breakdown Structure (WBS)
│   ├── acceptance-criteria.md     # Kriteria keberterimaan terukur (Gherkin format)
│   └── qa-checklist.md            # Matriks verifikasi penjaminan mutu akhir
├── src/
│   ├── app/                       # Next.js App Router Pages
│   │   ├── page.tsx               # Rute / (Landing Page)
│   │   ├── onboarding/page.tsx    # Rute /onboarding (Wizard Profil 5 Langkah)
│   │   ├── dashboard/page.tsx     # Rute /dashboard (Ringkasan Rencana & Profil)
│   │   ├── opportunities/         # Rute /opportunities (Katalog Peluang)
│   │   │   ├── page.tsx           # Katalog & Filter Pencarian
│   │   │   └── [id]/page.tsx      # Rute /opportunities/[id] (Detail Peluang)
│   │   ├── calculator/page.tsx    # Rute /calculator (Simulator BEP & Finansial)
│   │   ├── roadmap/page.tsx       # Rute /roadmap (Panduan 4 Fase & 10 Langkah)
│   │   ├── consultation/page.tsx  # Rute /consultation (Form & Tiket Mantri BRI)
│   │   ├── layout.tsx             # Root layout dengan banner kepatuhan & navigasi
│   │   ├── not-found.tsx          # Halaman 404 ramah pemula
│   │   └── error.tsx              # Error boundary global
│   ├── components/                # Komponen Antarmuka Reusable
│   │   ├── ui/                    # Primitif UI (Button, Card, InputField, Modal, Badge, Skeleton)
│   │   ├── layout/                # Navbar (Desktop & Mobile Drawer), Footer, DisclaimerBanner
│   │   ├── onboarding/            # Form wizard onboarding profil
│   │   ├── opportunities/         # OpportunityCard, FilterBar
│   │   ├── calculator/            # FinancialInputForm, FinancialSummaryCard
│   │   ├── roadmap/               # RoadmapProgressBar, RoadmapStepCard, RoadmapEducationModal
│   │   └── consultation/          # ConsultationForm, ConsultationConsentBox, SimulationTicketCard
│   ├── domain/                    # Logika Bisnis Murni (Zero UI Dependency)
│   │   ├── financial/             # Formula deterministik omzet, HPP, laba, BEP & payback
│   │   ├── opportunities/         # Mesin rekomendasi pencocokan profil (matcher) & filter
│   │   ├── roadmap/               # Dataset 10 langkah UMKM standar
│   │   ├── consultation/          # Generator tiket referensi UQ-MNT-[YYYYMM]-[XXXX]
│   │   └── validation/            # Skema Zod untuk profil, finansial, dan konsultasi
│   ├── adapters/                  # Lapisan Abstraksi Data (Repository Pattern)
│   │   ├── mock-data/             # Dataset kurasi 10 peluang usaha berlabel simulasi
│   │   └── repositories/          # Mock repository (Opportunity & Consultation)
│   ├── hooks/                     # Custom React Hooks
│   │   ├── use-user-profile.ts    # Manajemen profil pengguna & safeStorage
│   │   ├── use-financial-calculator.ts # State asumsi finansial & kalkulasi reaktif
│   │   └── use-roadmap-progress.ts     # Status checklist roadmap & persentase progres
│   ├── types/                     # Definisi Tipe Data Global TypeScript
│   └── lib/                       # Utilitas Pendukung (Format Rupiah, Safe Storage)
├── .env.example                   # Template variabel lingkungan bebas rahasia
├── .gitignore                     # Proteksi pencegahan kebocoran secret (.env*)
├── package.json                   # Dependensi dan script perintah npm
├── tailwind.config.ts             # Konfigurasi palet warna tematik & responsif
└── vitest.config.ts               # Konfigurasi unit test runner Vitest
```

---

## 3. Panduan Menjalankan Aplikasi di Komputer Lokal

### Prasyarat:
- Komputer dengan sistem operasi macOS, Linux, atau Windows.
- **Node.js**: Versi LTS v20.x atau v22.x+ (teruji pada Node v24.x).
- Package Manager bawaan: **npm** (v10+).

### Langkah 1: Klon & Masuk ke Direktori Proyek
```bash
git clone https://github.com/ramdhanibima/usaha-qita.git
cd usaha-qita
```

### Langkah 2: Pemasangan Dependensi
Pasang seluruh paket pustaka yang terdaftar:
```bash
npm install
```

### Langkah 3: Konfigurasi Variabel Lingkungan
Salin template konfigurasi bebas rahasia:
```bash
cp .env.example .env.local
```
*(Catatan: Aplikasi tidak memerlukan API key eksternal untuk menjalankan seluruh fitur MVP).*

### Langkah 4: Menjalankan Server Pengembangan Lokal
Mulai server development:
```bash
npm run dev
```
Setelah muncul pesan `Ready`, buka browser Anda dan akses:
👉 **`http://localhost:3000`**

---

## 4. Perintah Verifikasi Kualitas & Pengujian (Quality Assurance)

Jalankan perintah pengujian standar berikut di Terminal:

| Perintah | Deskripsi | Standar Kelulusan |
|---|---|---|
| `npm run typecheck` | Pemeriksaan tipe statis TypeScript ketat (`tsc --noEmit`) | 0 kesalahan tipe |
| `npm run test` | Eksekusi seluruh pengujian unit otomatis (`vitest run`) | 95/95 tes lulus |
| `npm run lint` | Pemeriksaan gaya kode & kaidah linter (`next lint`) | 0 peringatan / 0 error |
| `npm run build` | Kompilasi build versi produksi Next.js (`next build`) | 11/11 rute sukses |

---

## 5. Rute Aplikasi & Panduan Pengujian Manual

### 1. Beranda (`/`)
- Membuka halaman utama yang memuat perkenalan Usaha Qita, banner peringatan etis, 4 pilar fitur, dan live preview kartu simulasi.
- Uji navigasi: Klik tombol hamburger di tampilan layar ponsel (< 768px) untuk memastikan drawer terbuka dan tautan aktif.

### 2. Onboarding Profil Pengguna (`/onboarding`)
- Wizard 5 langkah: Identitas, Modal Awal, Lokasi Usaha, Pengalaman, dan Minat Kategori Usaha.
- Uji validasi: Masukkan modal kurang dari Rp 500.000 untuk melihat pesan kesalahan validasi Zod.
- Selesaikan dengan input valid untuk diarahkan ke Dashboard.

### 3. Dashboard Ringkasan Rencana (`/dashboard`)
- Menampilkan 3 state UI:
  - *Empty State*: Muncul saat profil belum diisi, dilengkapi tombol ajakan ke Onboarding.
  - *Loading State*: Skeleton loader saat data profil dimuat dari browser storage.
  - *Active State*: Rangkuman profil, quick action, rekomendasi peluang, tombol edit, dan modal konfirmasi reset profil.

### 4. Katalog Peluang Usaha (`/opportunities`)
- Menampilkan 10 katalog peluang usaha UMKM kurasi (Kuliner, Ritel, Jasa, Agribisnis, Kreatif).
- Uji filter: Cari kata "kopi" atau filter kategori "Jasa", lalu klik "Reset Filter" jika hasil kosong.

### 5. Detail Peluang Usaha (`/opportunities/[id]`)
- Menampilkan rincian target pasar, mitigasi risiko (Rendah/Sedang/Tinggi), dan rincian asumsi biaya awal.
- Klik tombol **"Buka di Kalkulator BEP"** untuk memuat asumsi langsung ke simulator finansial.

### 6. Simulator Finansial & Kalkulator BEP (`/calculator`)
- Menguji perhitungan deterministik:
  - Masukkan harga jual Rp 15.000, biaya variabel/HPP Rp 6.000, volume 50 cup/hari, dan biaya tetap Rp 4.500.000/bln.
  - Periksa indikator Titik Impas (BEP) harian dan Payback Period.
  - Uji kasus rugi (masukkan HPP lebih besar dari harga jual) untuk melihat indikator peringatan operasional merugi tanpa crash `NaN`/`Infinity`.

### 7. Roadmap Usaha Interaktif (`/roadmap`)
- Menampilkan 4 fase sekuensial (Perencanaan, Legalitas NIB/OSS, Pengadaan, Peluncuran) dengan 10 langkah terstandarisasi.
- Centang 4 langkah dan periksa apakah progress bar terisi tepat 40%.
- Buka modal edukasi "Pelajari Panduan" pada langkah legalitas NIB via OSS untuk memeriksa ringkasan syarat dan tips praktis.
- Segarkan (refresh) halaman untuk memastikan checklist tersimpan di `safeStorage`.

### 8. Konsultasi Mantri BRI (`/consultation`)
- Mengisi nama lengkap, nomor WhatsApp Indonesia (contoh: `081234567890`), lokasi unit kerja, dan topik bimbingan.
- Periksa tombol submit: **Tombol berstatus nonaktif (disabled)** sampai kotak persetujuan eksplisit dicentang.
- Centang persetujuan dan kirim permohonan untuk menerbitkan tiket digital resmi simulasi berformat `UQ-MNT-[YYYYMM]-[XXXX]`.
- Periksa nomor tiket dan tombol salin nomor.

---

## 6. Verifikasi Responsivitas Antarmuka (Mobile-First)

Aplikasi dirancang mengikuti metodologi *mobile-first* dan teruji rapi pada 4 dimensi viewport utama:
- **360 × 800 px** (Ponsel Android Layar Kompak): Komponen bertumpuk vertikal, touch target minimal 44x44px, tanpa scroll horizontal yang bocor.
- **390 × 844 px** (iPhone Layar Standar): Penataan kartu, modal popup, dan formulir proporsional.
- **768 × 1024 px** (Tablet Layar Sentuh): Transisi mulus antara menu mobile drawer dan bilah navigasi tablet.
- **1440 × 900 px** (Komputer Desktop): Tata letak seimbang dengan kontainer terpusat `max-w-7xl` dan tata letak sticky 2-kolom pada kalkulator finansial.

---

## 7. Batasan Sistem & Rencana Ekstensi (Post-MVP)

- **Penyimpanan Bersifat Lokal**: Aplikasi saat ini beroperasi murni pada peramban pengguna (*browser client-side*) menggunakan `safeStorage`. Pembersihan data browser (*clear cache*) akan mereset data tersimpan.
- **Batas Integrasi Masa Depan**: Interface boundary repository (`IOpportunityRepository`, `IConsultationRepository`) telah disiapkan di `src/adapters/` sehingga sistem siap dihubungkan ke backend database cloud (seperti PostgreSQL/Supabase), Gemini AI API untuk analisis SWOT otomatis, atau sistem resmi Bank BRI di masa depan apabila telah memperoleh izin dan persetujuan kepatuhan formal.

---

## 8. Lisensi & Hak Cipta

Proyek ini dikembangkan untuk tujuan edukasi, literasi keuangan, dan pemberdayaan kewirausahaan mandiri di Indonesia.
