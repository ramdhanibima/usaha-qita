# SPECS/REQUIREMENTS.MD — Spesifikasi Kebutuhan Produk

**Nama Produk**: Usaha Qita — powered by BRI  
**Versi Dokumen**: 1.0.0 (Tahap Perencanaan MVP)  
**Status**: Menunggu Tinjauan & Persetujuan Pengguna  

---

## 1. Ringkasan Eksekutif & Latar Belakang

Banyak calon pengusaha dan pemilik Usaha Mikro, Kecil, dan Menengah (UMKM) di Indonesia menghadapi kesulitan dalam:
1. Memilih jenis usaha yang cocok dengan modal, lokasi, dan latar belakang mereka.
2. Melakukan perhitungan keuangan mendasar (mengetahui berapa omzet minimal agar tidak rugi / *Break-Even Point*).
3. Mengetahui langkah konkret yang harus diambil sejak tahap ide hingga pembukaan usaha (*Roadmap*).
4. Mendapatkan pendampingan atau konsultasi usaha yang terpercaya.

**Usaha Qita** hadir sebagai aplikasi web interaktif yang memberdayakan masyarakat untuk merencanakan usaha secara terstruktur, berbasis data simulasi yang transparan, dan menyediakan jembatan komunikasi konsultatif kepada tenaga pendamping lapangan perbankan (Mantri BRI).

---

## 2. Batasan Etis, Hukum & Kepatuhan Perbankan (Compliance Boundaries)

> [!IMPORTANT]
> Seluruh perancangan fitur wajib tunduk pada kepatuhan etika berikut:
> 1. **Bukan Representasi Resmi PT Bank Rakyat Indonesia (Persero) Tbk**: Aplikasi ini merupakan inisiatif pendampingan/edukasi usaha, bukan sistem perbankan resmi yang menerbitkan keputusan finansial mengikat.
> 2. **Dilarang Menjanjikan Persetujuan Kredit**: Aplikasi tidak boleh memuat janji, jaminan, atau pernyataan kelayakan persetujuan kredit (KUR, Kupedes, atau fasilitas pinjaman apa pun).
> 3. **Tidak Mengakses Data Internal BRI**: Sistem tidak terhubung ke core banking BRI atau data nasabah rahasia.
> 4. **Label Transparansi Data**: Seluruh rekomendasi pasar dan angka proyeksi pada tahap MVP berstatus simulasi edukatif dan **wajib dilabeli "Data simulasi"**.
> 5. **Izin Berbagi Data (Explicit Consent)**: Pengguna memiliki kendali penuh atas data profil usaha yang hendak dikonsultasikan kepada Mantri BRI.

---

## 3. Persona Pengguna (Target Users)

### Persona 1: Mas Budi — Calon Wirausaha Pemula (24 tahun)
- **Latar Belakang**: Baru lulus kuliah, memiliki tabungan modal Rp 10.000.000, belum pernah berbisnis.
- **Tujuan**: Ingin mencari peluang usaha kuliner atau ritel di daerahnya yang risikonya terukur.
- **Kebutuhan**: Bimbingan memilih ide usaha, simulasi apakah modalnya cukup, dan panduan langkah pertama (izin usaha dasar, belanja peralatan).

### Persona 2: Ibu Siti — Pemilik Usaha Mikro yang Ingin Tumbuh (38 tahun)
- **Latar Belakang**: Menjual aneka kue dan katering rumahan selama 1 tahun, omzet Rp 8.000.000/bulan.
- **Tujuan**: Ingin membuka gerai kecil dan mengetahui apakah keuntungannya bisa menutupi sewa tempat.
- **Kebutuhan**: Kalkulator keuangan untuk menghitung titik impas (BEP) dan laba bersih jika menambah biaya sewa dan 1 orang karyawan.

### Persona 3: Pak Hendra — Pengusaha yang Mengkaji Ekspansi (45 tahun)
- **Latar Belakang**: Memiliki toko kelontong sukses di satu kecamatan, ingin ekspansi ke kecamatan sebelah.
- **Tujuan**: Menghitung kebutuhan modal kerja tambahan dan menyusun jadwal ekspansi bertahap.
- **Kebutuhan**: Roadmap eksekutif dan opsi konsultasi dengan Mantri BRI setempat untuk mendiskusikan ekosistem pasar lokal.

---

## 4. Ruang Lingkup MVP (In-Scope vs Out-of-Scope)

### 4.1 Termasuk dalam MVP (In-Scope)
- **Landing Page Interaktif**: Nilai manfaat produk, panduan ringkas, disclaimer perbankan yang jelas.
- **Onboarding Profil Pengguna**: Input tujuan, modal, lokasi (provinsi, kab/kota, kecamatan), pengalaman, dan minat kategori bisnis.
- **Rekomendasi Peluang Usaha**: Kurasi katalog ide usaha berdasarkan profil dengan detail: alasan rekomendasi, target pasar, perkiraan modal awal, dan profil risiko (berlabel "Data simulasi").
- **Kalkulator & Simulator Keuangan Deterministik**: Perhitungan omzet, biaya tetap, biaya variabel, HPP, laba bersih bulanan, margin keuntungan, BEP unit, BEP nominal (Rupiah), serta estimasi periode balik modal (*payback period*).
- **Roadmap Usaha Interaktif**: Tahapan konkret (Persiapan, Legalitas dasar NIB/OSS, Pengadaan, Peluncuran, Pemasaran) dengan *checklist* penyelesaian.
- **Alur Permohonan Konsultasi Mantri BRI**: Formulir pengajuan diskusi bimbingan usaha dengan persetujuan eksplisit pengguna (*consent checkbox*) dan ringkasan data.
- **Respon Antarmuka Lengkap**: State form (valid, invalid), loading skeleton, empty state, dan error message yang ramah.
- **Dukungan Tampilan Responsif**: Diuji pada lebar layar 360px, 390px, 768px, dan 1440px.
- **Penyimpanan Lokal Sederhana (Local Persistence)**: Data profil dan simulasi disimpan di penyimpanan browser (`localStorage`) agar pengguna tidak kehilangan progres saat me-refresh halaman.

### 4.2 Belum Termasuk dalam MVP / Batas Integrasi Masa Depan (Out-of-Scope)
- **Integrasi Langsung Gemini AI / LLM**: Dijadwalkan pada fase terpisah setelah fondasi aplikasi stabil.
- **API Eksternal Langsung**: Google Places API, scraping media sosial, data real-time BPS, dan core banking BRI tidak diaktifkan pada MVP; diisolasi melalui modul adapter mock.
- **Database Cloud & Akun Login Otentikasi**: Tidak ada backend database cloud atau sistem login kompleks pada MVP awal guna meminimalkan friksi pengguna dan menjaga kesederhanaan.

---

## 5. Daftar Kebutuhan Fungsional (Functional Requirements)

### 5.1 Kebutuhan Sistem & Navigasi (REQ-SYS)

| Requirement ID | Judul Kebutuhan | Deskripsi | Prioritas |
|---|---|---|---|
| `REQ-SYS-01` | Desain Responsif Multi-Resolusi | Seluruh halaman aplikasi harus tampil proporsional tanpa elemen terpotong (*overflow*) pada breakpoint 360px, 390px, 768px, dan 1440px. | P0 (Must Have) |
| `REQ-SYS-02` | Penanganan State Komprehensif | Setiap komponen pemuat data dan form wajib memiliki 4 state visual: default, loading, empty, dan error. | P0 (Must Have) |
| `REQ-SYS-03` | Disclaimer Transparansi & Kepatuhan | Banner atau catatan kepatuhan harus tampil di footer dan pada alur konsultasi: menegaskan aplikasi bukan bank resmi, tidak menjanjikan pinjaman, dan data pasar bersifat simulasi. | P0 (Must Have) |
| `REQ-SYS-04` | Navigasi Aplikasi Terpadu | Header navigasi global yang menyediakan akses cepat ke: Beranda, Dashboard, Rekomendasi Peluang, Simulasi Keuangan, Roadmap Usaha, dan Konsultasi Mantri. | P1 (Should Have) |

### 5.2 Profil & Onboarding Pengguna (REQ-PROF)

| Requirement ID | Judul Kebutuhan | Deskripsi | Prioritas |
|---|---|---|---|
| `REQ-PROF-01` | Formulir Onboarding Bertahap | Pengguna dapat mengisi data: (1) Tujuan Usaha (Mulai Baru, Kembangkan, Ekspansi), (2) Ketersediaan Modal (Rp), (3) Lokasi Rencana (Provinsi & Kota/Kabupaten), (4) Tingkat Pengalaman (Pemula, Menengah, Mahir), (5) Kategori Minat (Kuliner, Ritel/Toko, Jasa, Agribisnis, Kreatif). | P0 (Must Have) |
| `REQ-PROF-02` | Validasi Form Onboarding | Validasi data secara real-time dengan pesan error Bahasa Indonesia yang jelas (misal: modal harus berupa angka positif minimal Rp 500.000). | P0 (Must Have) |
| `REQ-PROF-03` | Penyimpanan Profil Lokal | Profil yang sudah diisi disimpan otomatis di browser pengguna (`localStorage`) dan dapat disunting kembali kapan saja. | P1 (Should Have) |

### 5.3 Rekomendasi Peluang Usaha (REQ-OPP)

| Requirement ID | Judul Kebutuhan | Deskripsi | Prioritas |
|---|---|---|---|
| `REQ-OPP-01` | Katalog Peluang Terfilter | Menampilkan daftar rekomendasi peluang usaha yang relevan dengan modal dan minat pengguna dari modul data simulasi. | P0 (Must Have) |
| `REQ-OPP-02` | Informasi Detail Peluang | Setiap kartu peluang memuat: Nama Usaha, Kategori, Rentang Modal Awal, Alasan Kecocokan, Target Pelanggan Utama, Profil Risiko Usaha (Rendah/Sedang/Tinggi), dan label "Data simulasi". | P0 (Must Have) |
| `REQ-OPP-03` | Pemilihan Peluang ke Simulator | Pengguna dapat memilih satu peluang bisnis untuk langsung memindahkan asumsi biayanya ke halaman Simulator Keuangan. | P1 (Should Have) |
| `REQ-OPP-04` | State Kosong Rekomendasi | Jika tidak ada peluang yang cocok dengan filter modal/kategori pengguna, tampilkan panduan cara menyesuaikan modal atau memilih kategori alternatif. | P1 (Should Have) |

### 5.4 Simulator Finansial & Kalkulator BEP (REQ-FIN)

| Requirement ID | Judul Kebutuhan | Deskripsi | Prioritas |
|---|---|---|---|
| `REQ-FIN-01` | Input Asumsi Finansial Dinamis | Pengguna dapat mengubah parameter bisnis: (1) Estimasi harga jual per unit, (2) Estimasi penjualan unit per hari/bulan, (3) Biaya Variabel per unit (HPP/bahan baku), (4) Biaya Tetap bulanan (sewa, gaji, listrik/air, operasional lain), (5) Total Modal Investasi Awal. | P0 (Must Have) |
| `REQ-FIN-02` | Mesin Hitung Deterministik Murni | Sistem menghitung secara otomatis dan presisi tanpa pembulatan error: Proyeksi Omzet Bulanan, Total Biaya Variabel, Total Biaya Tetap, Total Pengeluaran, Laba Bersih Bulanan, dan Profit Margin (%). | P0 (Must Have) |
| `REQ-FIN-03` | Kalkulasi Titik Impas (BEP) | Menghitung: (1) BEP dalam Satuan Unit (berapa unit produk harus terjual per bulan agar biaya tertutup), (2) BEP dalam Rupiah (berapa omzet minimal agar impas). | P0 (Must Have) |
| `REQ-FIN-04` | Estimasi Balik Modal (Payback Period) | Menghitung perkiraan waktu (dalam satuan bulan) modal investasi awal akan kembali berdasarkan laba bersih bulanan, dengan peringatan jika bisnis mengalami defisit/rugi. | P1 (Should Have) |
| `REQ-FIN-05` | Visualisasi Ringkasan Sehat/Tidak | Menampilkan indikator status kelayakan sederhana (Hijau: Untung Sehat, Kuning: Margin Tipis / Waspada, Merah: Potensi Rugi / Perlu Evaluasi Biaya). | P1 (Should Have) |

### 5.5 Roadmap Usaha Bertahap (REQ-ROAD)

| Requirement ID | Judul Kebutuhan | Deskripsi | Prioritas |
|---|---|---|---|
| `REQ-ROAD-01` | Roadmap Berdasarkan Jenis Usaha | Menampilkan panduan langkah demi langkah yang dibagi menjadi 4 fase: (1) Validasi & Perencanaan, (2) Legalitas Dasar & Izin (NIB melalui OSS), (3) Pengadaan & Operasional, (4) Peluncuran & Pemasaran. | P0 (Must Have) |
| `REQ-ROAD-02` | Checklist Progres Interaktif | Pengguna dapat menandai (centang) tugas yang sudah diselesaikan; progres persentase diperbarui secara real-time dan disimpan di browser. | P1 (Should Have) |
| `REQ-ROAD-03` | Edukasi Ringkas Tiap Langkah | Setiap butir roadmap memiliki kartu ringkasan penjelasan (misal: apa itu NIB, dokumen apa yang diperlukan, tips mencari supplier bahan baku murah). | P1 (Should Have) |

### 5.6 Alur Konsultasi Mantri BRI (REQ-MANTRI)

| Requirement ID | Judul Kebutuhan | Deskripsi | Prioritas |
|---|---|---|---|
| `REQ-MANTRI-01` | Formulir Pengajuan Diskusi Usaha | Pengguna dapat mengajukan permohonan temu diskusi dengan Mantri BRI terdekat dengan mengisi: Nama Lengkap, Nomor Kontak WhatsApp/Telepon, Lokasi Usaha, Kebutuhan Bimbingan (Edukasi Finansial, Manajemen Arus Kas, Tata Cara Pengajuan Usaha), dan Catatan Tambahan. | P0 (Must Have) |
| `REQ-MANTRI-02` | Persetujuan Eksplisit (Consent Checkbox) | Kotak persetujuan wajib dicentang sebelum tombol kirim aktif: menyatakan pengguna secara sadar mengizinkan ringkasan profil usahanya dilihat untuk keperluan konsultasi dan memahami konsultasi ini bukan jaminan kredit. | P0 (Must Have) |
| `REQ-MANTRI-03` | Mock Konfirmasi & Ringkasan Pengajuan | Menampilkan tiket konfirmasi digital permohonan konsultasi beserta nomor referensi simulasi dan petunjuk langkah selanjutnya saat Mantri menghubungi. | P1 (Should Have) |

### 5.7 Manajemen Data Simulasi & Boundary Adapter (REQ-DATA)

| Requirement ID | Judul Kebutuhan | Deskripsi | Prioritas |
|---|---|---|---|
| `REQ-DATA-01` | Isolasi Mock Repository Layer | Seluruh data peluang, benchmark pasar, dan data simulasi dikelola melalui interface repository terpisah, sehingga siap digantikan dengan API eksternal di masa depan tanpa mengubah kode UI. | P0 (Must Have) |
| `REQ-DATA-02` | Penandaan Label Data Simulasi | Setiap representasi data yang dihasilkan mock repository menyertakan metadata flag `isSimulation: true` dan label sumber data "Estimasi Model Usaha Qita (Data Simulasi)". | P0 (Must Have) |

---

## 6. Asumsi Proyek

1. **Lingkungan Pengguna**: Pengguna mengakses aplikasi melalui browser modern (Safari iOS, Chrome Android, Chrome/Firefox/Edge Desktop).
2. **Koneksi Internet**: Aplikasi dapat dibuka dengan konektivitas rendah (*low bandwidth*) karena seluruh aset dioptimalkan secara lokal dan perhitungan dijalankan di sisi klien (*client-side deterministic calculation*).
3. **Mata Uang**: Seluruh simulasi moneter menggunakan Rupiah (IDR) dengan pemformatan standar Indonesia (`Rp 1.000.000`).

---

## 7. Risiko Teknis & Mitigasi

| Risiko | Tingkat | Dampak | Mitigasi |
|---|---|---|---|
| Kesalahpahaman pengguna mengira aplikasi menyetujui pinjaman bank | Tinggi | Reputasi & komplain nasabah | Pasang banner kepatuhan statis di footer dan modal konfirmasi sebelum pengajuan konsultasi. |
| Kesalahan perhitungan finansial akibat *floating point precision* pada JavaScript | Sedang | Angka laba dan BEP meleset | Gunakan fungsi pembulatan presisi desimal teruji dan validasi ketat pada unit test. |
| Pengguna kehilangan data simulasi saat berpindah halaman | Sedang | Frustrasi pengguna | Sinkronisasi state formulir secara otomatis ke `localStorage` dengan penanganan fallback jika storage penuh/dinonaktifkan. |
| Tampilan berantakan di layar smartphone kecil (360px) | Sedang | Pengalaman pengguna buruk | Pendekatan desain *Mobile-First*, pengujian breakpoint spesifik (360px & 390px) pada seluruh form dan tabel kalkulator. |

---

## 8. Pertanyaan Terbuka & Keputusan yang Membutuhkan Persetujuan

1. **Kategori Usaha Awal**: Apakah 5 kategori awal (Kuliner, Ritel/Toko Kelontong, Jasa/Laundry/Barbershop, Agribisnis/Hidroponik, Industri Kreatif/Kerajinan) sudah cukup mewakili UMKM sasaran awal?
2. **Kanal Notifikasi Simulasi**: Apakah respons tiket Mantri BRI cukup ditampilkan di layar aplikasi (mock ticket), atau pengguna ingin ada tombol simulasi tautan langsung ke WhatsApp Web?

