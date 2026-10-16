# Usaha Qita — powered by BRI

Platform web responsif untuk membantu masyarakat Indonesia merencanakan usaha baru, mengembangkan usaha mikro/kecil yang sudah berjalan, atau mengkaji ekspansi wilayah berbasis matematika finansial deterministik dan pendampingan konsultatif Mantri BRI.

> [!IMPORTANT]
> **Pemberitahuan Etis & Kepatuhan Perbankan**:
> 1. Usaha Qita adalah inisiatif edukasi dan simulasi perencanaan usaha mandiri. Usaha Qita **bukan aplikasi resmi penerbit pinjaman dari PT Bank Rakyat Indonesia (Persero) Tbk**.
> 2. Pengajuan konsultasi Mantri BRI bersifat bimbingan/diskusi usaha dan **tidak menjamin persetujuan kredit**.
> 3. Seluruh proyeksi finansial dan data pasar pada tahap MVP adalah **data simulasi edukatif**.

---

## 1. Teknologi yang Digunakan

- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Bahasa**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS
- **Test Runner**: Vitest (Unit Testing)
- **Validasi Skema**: Zod
- **Runtime**: Node.js LTS (v24.x)

---

## 2. Panduan Menjalankan Aplikasi di macOS

### Langkah 1: Klon atau Buka Direktori Proyek
Buka aplikasi **Terminal** di Mac Anda, lalu pastikan Anda berada di direktori proyek:
```bash
cd /Users/ramdhanibima/Documents/GitHub/usaha-qita
```

### Langkah 2: Instalasi Dependensi
Pastikan Node.js sudah terpasang, lalu jalankan:
```bash
npm install
```

### Langkah 3: Konfigurasi Lingkungan (Environment Variables)
Salin template konfigurasi bebas rahasia:
```bash
cp .env.example .env.local
```
*(Catatan: Jangan pernah menuliskan API key atau rahasia ke dalam berkas repositori)*

### Langkah 4: Menjalankan Server Pengembangan Lokal
Jalankan perintah berikut:
```bash
npm run dev
```
Setelah server aktif, buka browser Anda (Safari atau Chrome) dan kunjungi:
👉 **`http://localhost:3000`**

---

## 3. Perintah Pengujian & Pemeliharaan Kode

- **Pemeriksaan Tipe TypeScript**:
  ```bash
  npm run typecheck
  ```
- **Menjalankan Pengujian Otomatis (Vitest)**:
  ```bash
  npm run test
  ```
- **Pemeriksaan Kualitas Kode (ESLint)**:
  ```bash
  npm run lint
  ```
- **Kompilasi Versi Produksi (Build)**:
  ```bash
  npm run build
  ```

---

## 4. Filosofi Pengembangan (Spec-Driven Development)

Proyek ini dikembangkan mengikuti spesifikasi ketat yang terdokumentasi di folder `specs/`:
- [`AGENTS.md`](./AGENTS.md) — Panduan arsitektur dan aturan kerja asisten AI.
- [`specs/requirements.md`](./specs/requirements.md) — Kebutuhan fungsional dan batasan kepatuhan.
- [`specs/design.md`](./specs/design.md) — Arsitektur teknis, rumus finansial, dan kontrak tipe.
- [`specs/tasks.md`](./specs/tasks.md) — Rincian tugas kerja (WBS) dan status pengerjaan.
- [`specs/acceptance-criteria.md`](./specs/acceptance-criteria.md) — Kriteria keberterimaan terukur (Gherkin).

