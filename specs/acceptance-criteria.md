# SPECS/ACCEPTANCE-CRITERIA.MD — Kriteria Keberterimaan (Acceptance Criteria)

**Nama Produk**: Usaha Qita — powered by BRI  
**Versi Dokumen**: 1.1.0 (Hasil Audit Sinkronisasi)  
**Format Penulisan**: Gherkin (*Given-When-Then*) dengan Vektor Uji Numerik Deterministik  
**Status**: Telah Disinkronkan & Siap Sebagai Acuan Pengujian  

---

## 1. Hubungan Kriteria dengan Kebutuhan (Traceability)

Setiap kriteria keberterimaan memiliki ID unik berformat `AC-[MODUL]-[NOMOR].[SUB]` yang terhubung langsung secara 1-ke-1 dengan ID kebutuhan fungsional di `specs/requirements.md`.

---

## 2. Kriteria Keberterimaan Sistem & Tampilan (AC-SYS)

### `AC-SYS-01`: Desain Responsif Multi-Resolusi
- **AC-SYS-01.1 (Layar Ponsel 360px & 390px)**:
  - **Given** pengguna membuka aplikasi melalui layar beresolusi lebar 360px atau 390px
  - **When** pengguna mengakses halaman Landing, Onboarding, Peluang, Kalkulator, Roadmap, dan Konsultasi
  - **Then** tidak ada scroll horizontal liar (*no horizontal overflow*), seluruh teks terbaca tanpa terpotong, tombol CTA memenuhi lebar kontainer (*full width*), dan target klik memiliki tinggi minimal 44px.
- **AC-SYS-01.2 (Layar Tablet 768px)**:
  - **Given** pengguna membuka aplikasi pada viewport lebar 768px
  - **When** pengguna melihat katalog peluang dan dashboard
  - **Then** elemen ditampilkan dalam tata letak 2 kolom yang proporsional.
- **AC-SYS-01.3 (Layar Desktop 1440px)**:
  - **Given** pengguna membuka halaman simulator finansial di layar 1440px
  - **When** pengguna menggulir halaman form input asumsi di sisi kiri
  - **Then** kartu ringkasan hasil dan indikator BEP di sisi kanan tetap terlihat rapi (*sticky sidebar summary*).

### `AC-SYS-02`: Penanganan State Komprehensif
- **AC-SYS-02.1 (Empat State UI)**:
  - **Given** sebuah komponen antarmuka yang memerlukan data
  - **When** kondisi aplikasi berubah
  - **Then** sistem harus menampilkan:
    1. *Skeleton pulse* saat data sedang dimuat (Loading State),
    2. Pesan panduan informatif saat tidak ada data yang cocok (Empty State),
    3. Kotak pesan error ramah pengguna dengan tombol coba lagi saat terjadi kesalahan parsing (Error State),
    4. Tampilan normal yang interaktif saat data tersedia (Default State).

### `AC-SYS-03`: Kepatuhan Etis & Disclaimer Transparansi
- **AC-SYS-03.1 (Footer Disclaimer)**:
  - **Given** pengguna membuka halaman apa pun di aplikasi
  - **When** pengguna melihat bagian footer
  - **Then** tercantum pernyataan kepatuhan:
    > "Usaha Qita adalah platform edukasi & simulasi perencanaan usaha mandiri. Usaha Qita bukan aplikasi resmi penerbit pinjaman dari PT Bank Rakyat Indonesia (Persero) Tbk. Pengajuan konsultasi Mantri BRI bersifat bimbingan/diskusi dan tidak menjamin persetujuan kredit."
- **AC-SYS-03.2 (Label Data Simulasi)**:
  - **Given** pengguna melihat kartu peluang usaha atau hasil kalkulasi
  - **When** komponen tersebut dirender
  - **Then** wajib terdapat badge visual bertuliskan "Data simulasi" dengan warna latar yang kontras dan jelas.

### `AC-SYS-04`: Navigasi Aplikasi Terpadu
- **AC-SYS-04.1 (Header Navigasi Global & Mobile Drawer)**:
  - **Given** pengguna berada di halaman mana pun di aplikasi
  - **When** pengguna berinteraksi dengan header navigasi
  - **Then** pada tampilan desktop (lebar $\ge 768$px) tersedia tautan aktif ke Beranda, Dashboard, Peluang Usaha, Kalkulator, Roadmap, dan Konsultasi Mantri; pada layar ponsel ($< 768$px), tersedia tombol hamburger menu yang membuka panel navigasi vertikal tanpa merusak tata letak.

---

## 3. Kriteria Keberterimaan Profil & Onboarding (AC-PROF)

### `AC-PROF-01`: Alur Pengisian Profil
- **AC-PROF-01.1**:
  - **Given** pengguna baru membuka halaman `/onboarding`
  - **When** pengguna menyelesaikan tahapan form (Tujuan, Modal, Lokasi, Pengalaman, Minat Kategori)
  - **Then** tombol navigasi "Lanjutkan" hanya aktif jika field wajib pada langkah terkait telah terisi secara valid.

### `AC-PROF-02`: Validasi Input Profil
- **AC-PROF-02.1**:
  - **Given** pengguna memasukkan angka modal kurang dari Rp 500.000 atau bernilai negatif
  - **When** pengguna berpindah kolom (*blur*) atau menekan tombol Lanjut
  - **Then** muncul pesan peringatan: "Modal awal minimal Rp 500.000 untuk simulasi yang realistis."
- **AC-PROF-02.2**:
  - **Given** pengguna tidak memilih satu pun kategori usaha
  - **When** pengguna berada di langkah pemilihan minat
  - **Then** muncul pesan panduan: "Pilih minimal 1 kategori usaha yang menarik minat Anda."

### `AC-PROF-03`: Persistensi Profil di LocalStorage
- **AC-PROF-03.1**:
  - **Given** pengguna telah melengkapi profil di `/onboarding`
  - **When** pengguna menutup tab browser atau me-refresh halaman `/dashboard`
  - **Then** data nama, modal, lokasi, dan preferensi tetap tersimpan dan langsung dimuat kembali tanpa meminta input ulang.

---

## 4. Kriteria Keberterimaan Peluang Usaha (AC-OPP)

### `AC-OPP-01`: Rekomendasi Terfilter
- **AC-OPP-01.1**:
  - **Given** profil pengguna memiliki modal Rp 10.000.000 dan minat kategori "Kuliner"
  - **When** pengguna membuka halaman `/opportunities`
  - **Then** sistem memprioritaskan ide usaha kategori Kuliner yang rentang modalnya berada di bawah atau setara Rp 10.000.000.

### `AC-OPP-02`: Detail Kartu Peluang Usaha
- **AC-OPP-02.1**:
  - **Given** pengguna melihat salah satu kartu rekomendasi peluang usaha
  - **When** kartu dirender
  - **Then** kartu wajib menampilkan: (1) Judul Peluang, (2) Kategori, (3) Estimasi Modal, (4) Alasan Kecocokan Profil, (5) Target Konsumen Utama, (6) Tingkat Risiko (Rendah/Sedang/Tinggi), (7) Badge "Data simulasi", dan (8) Tombol aksi "Simulasikan Usaha Ini".

### `AC-OPP-03`: Perpindahan Data Peluang ke Simulator
- **AC-OPP-03.1**:
  - **Given** pengguna menekan tombol "Simulasikan Usaha Ini" pada kartu peluang (contoh: "Kedai Kopi Susu")
  - **When** sistem mengalihkan halaman ke `/calculator`
  - **Then** field harga jual, biaya variabel, biaya sewa, dan estimasi penjualan terisi otomatis dengan angka bawaan (*default assumptions*) dari ide peluang tersebut.

### `AC-OPP-04`: Penanganan State Kosong (Empty State)
- **AC-OPP-04.1**:
  - **Given** pengguna menyaring peluang dengan filter yang tidak memiliki kecocokan data
  - **When** daftar hasil pencarian kosong
  - **Then** sistem menampilkan ilustrasi ramah dengan teks: "Belum menemukan usaha yang sesuai dengan filter ini" dan tombol "Atur Ulang Filter".

---

## 5. Kriteria Keberterimaan Simulator Finansial & Kalkulator BEP (AC-FIN)

### `AC-FIN-01`: Interaktivitas Form Finansial
- **AC-FIN-01.1**:
  - **Given** pengguna berada di halaman `/calculator`
  - **When** pengguna mengubah salah satu nilai input (misal menaikkan harga jual dari Rp 15.000 menjadi Rp 18.000)
  - **Then** seluruh hasil perhitungan (omzet, laba, margin, BEP) terbarui seketika (*instant reactive update*) dalam waktu kurang dari 50ms tanpa reload halaman.

### `AC-FIN-02`: Keakuratan Mesin Hitung Deterministik
- **AC-FIN-02.1 (Vektor Uji Terukur #1 — Kedai Kopi Susu / Untung Sehat)**:
  - **Given** parameter input sebagai berikut:
    - Harga Jual per Unit: `Rp 18.000`
    - Rata-rata Penjualan per Hari: `50 unit`
    - Hari Operasional per Bulan: `30 hari` (Total Unit Sebulan = `1.500 unit`)
    - Biaya Variabel per Unit (HPP): `Rp 7.000`
    - Biaya Tetap Bulanan:
      - Sewa Lapak: `Rp 2.500.000`
      - Gaji Karyawan: `Rp 3.000.000`
      - Listrik & Air: `Rp 500.000`
      - Operasional Lain: `Rp 500.000`
      - Total Biaya Tetap ($FC$): `Rp 6.500.000`
    - Modal Investasi Awal: `Rp 25.000.000`
  - **When** sistem menjalankan fungsi `calculateFinancials(input)`
  - **Then** hasil perhitungan harus tepat secara mutlak:
    - **Omzet Bulanan**: $1.500 \times 18.000 =$ **`Rp 27.000.000`**
    - **Total Biaya Variabel**: $1.500 \times 7.000 =$ **`Rp 10.500.000`**
    - **Total Biaya Pengeluaran**: $10.500.000 + 6.500.000 =$ **`Rp 17.000.000`**
    - **Laba Bersih Bulanan**: $27.000.000 - 17.000.000 =$ **`Rp 10.000.000`**
    - **Profit Margin**: $\frac{10.000.000}{27.000.000} \times 100\% =$ **`37.04%`**
    - **Margin Kontribusi per Unit**: $18.000 - 7.000 =$ **`Rp 11.000`**

- **AC-FIN-02.2 (Vektor Uji Terukur #2 — Toko Baju Anak / Margin Tipis)**:
  - **Given** parameter input:
    - Harga Jual: `Rp 60.000`
    - Penjualan: `5 unit/hari`, `26 hari/bulan` ($Q = 130$ unit)
    - Biaya Variabel (Bahan/Kulakan): `Rp 45.000` ($CM = Rp 15.000$)
    - Total Biaya Tetap ($FC$): `Rp 1.400.000`
    - Modal Awal: `Rp 10.000.000`
  - **When** sistem menjalankan fungsi `calculateFinancials(input)`
  - **Then** hasil perhitungan:
    - Omzet: $130 \times 60.000 = Rp 7.800.000$
    - Total Biaya: $(130 \times 45.000) + 1.400.000 = Rp 7.250.000$
    - Laba Bersih: $7.800.000 - 7.250.000 = Rp 550.000$
    - Profit Margin: $\frac{550.000}{7.800.000} \times 100\% = 7.05\%$

- **AC-FIN-02.3 (Vektor Uji Terukur #3 — Skenario Defisit / Rugi Operasional)**:
  - **Given** harga jual produk lebih rendah daripada biaya bahan baku ($CM < 0$) atau penjualan terlalu sedikit sehingga $NP < 0$
  - **When** sistem menghitung proyeksi
  - **Then** Laba Bersih bernilai negatif dengan pemformatan mata uang jelas (`- Rp X.XXX.XXX`).

### `AC-FIN-03`: Kalkulasi Titik Impas (BEP)
- **AC-FIN-03.1 (Verifikasi Nilai BEP Satuan Unit & Rupiah)**:
  - **Given** parameter input terisi valid dengan Margin Kontribusi $CM > 0$
  - **When** sistem menghitung titik impas
  - **Then**:
    - Pada Vektor Uji #1: BEP Satuan Unit adalah $\lceil 6.500.000 / 11.000 \rceil =$ **`591 unit/bulan`**, dan BEP Satuan Rupiah adalah **`Rp 10.636.364`**.
    - Pada Vektor Uji #2: BEP Satuan Unit adalah $\lceil 1.400.000 / 15.000 \rceil =$ **`94 unit/bulan`**, dan BEP Satuan Rupiah adalah **`Rp 5.600.000`**.
    - Pada kasus khusus di mana $CM \le 0$ (harga jual $\le$ modal bahan): BEP bernilai `null / infinity` dan ditampilkan sebagai pesan "Harga jual belum menutup modal bahan; titik impas tidak dapat dicapai."

### `AC-FIN-04`: Estimasi Periode Balik Modal (Payback Period)
- **AC-FIN-04.1 (Verifikasi Waktu Balik Modal & Penanganan Defisit)**:
  - **Given** nilai Modal Awal dan Laba Bersih Bulanan ($NP$)
  - **When** sistem menghitung periode balik modal
  - **Then**:
    - Pada Vektor Uji #1: Payback Period bernilai $25.000.000 / 10.000.000 =$ **`2.5 bulan`**.
    - Pada Vektor Uji #2: Payback Period bernilai $10.000.000 / 550.000 =$ **`18.2 bulan`**.
    - Jika bisnis mencatat kerugian ($NP \le 0$): Payback Period bernilai `null` dan ditampilkan sebagai teks informatif: "Tidak dapat dihitung (usaha berstatus defisit/rugi)".

### `AC-FIN-05`: Indikator Kesehatan Finansial
- **AC-FIN-05.1 (Klasifikasi Status Kelayakan Bisnis)**:
  - **Given** hasil perhitungan Laba Bersih dan Profit Margin (%)
  - **When** sistem menentukan klasifikasi kesehatan
  - **Then**:
    - Berstatus **`healthy_profit`** (hijau) bila $NP > 0$ dan Margin $\ge 15\%$.
    - Berstatus **`narrow_margin`** (kuning/waspada) bila $NP > 0$ tetapi Margin $< 15\%$.
    - Berstatus **`operating_loss`** (merah/defisit) bila $NP \le 0$.

---

## 6. Kriteria Keberterimaan Roadmap Usaha (AC-ROAD)

### `AC-ROAD-01`: Struktur Fase Roadmap
- **AC-ROAD-01.1**:
  - **Given** pengguna membuka halaman `/roadmap`
  - **When** halaman ditampilkan
  - **Then** panduan terbagi dalam 4 fase sekuensial: (1) Perencanaan & Validasi Pasar, (2) Legalitas & Izin Usaha Mikro (NIB via OSS), (3) Pengadaan Alat & Standar Operasional, (4) Peluncuran Gerai & Promosi Perdana.

### `AC-ROAD-02`: Checklist Interaktif & Persentase Progres
- **AC-ROAD-02.1**:
  - **Given** pengguna berada di halaman roadmap dengan 10 total langkah
  - **When** pengguna mencentang 4 kotak langkah yang sudah selesai
  - **Then** indikator progres bar langsung terisi `40%`, label status bertuliskan "4 dari 10 langkah terselesaikan", dan status centang disimpan ke `localStorage`.

### `AC-ROAD-03`: Edukasi Ringkas Tiap Langkah Roadmap
- **AC-ROAD-03.1 (Modal / Kartu Informasi Edukasi)**:
  - **Given** pengguna berada di halaman roadmap
  - **When** pengguna menekan tombol "Pelajari Panduan" atau kartu langkah tertentu (misal: NIB via OSS)
  - **Then** sistem menampilkan modal ringkasan edukasi yang memuat: tujuan langkah, dokumen prasyarat, tips praktis bagi pemula, serta tautan aksi resmi tanpa meninggalkan alur aplikasi.

---

## 7. Kriteria Keberterimaan Konsultasi Mantri BRI (AC-MANTRI)

### `AC-MANTRI-01`: Validasi Formulir Pengajuan Diskusi Usaha
- **AC-MANTRI-01.1**:
  - **Given** pengguna berada di halaman `/consultation`
  - **When** pengguna mengisi kolom Nama Lengkap (minimal 3 karakter), Nomor WhatsApp (format nomor ponsel Indonesia valid), Lokasi Usaha, dan Topik Bimbingan
  - **Then** sistem menampilkan tanda validasi hijau; jika input tidak valid, muncul pesan kesalahan spesifik berbahasa Indonesia.

### `AC-MANTRI-02`: Penegakan Persetujuan Eksplisit (Consent Checkbox)
- **AC-MANTRI-02.1**:
  - **Given** formulir konsultasi telah diisi lengkap
  - **When** kotak persetujuan eksplisit:
    > "Saya menyetujui ringkasan simulasi usaha ini diteruskan kepada Mantri BRI untuk keperluan bimbingan/konsultasi usaha dan saya memahami konsultasi ini bukan jaminan persetujuan pinjaman."
    belum dicentang
  - **Then** tombol "Ajukan Jadwal Konsultasi" dalam status *disabled* (tidak dapat diklik); tombol hanya aktif seketika saat kotak dicentang.

### `AC-MANTRI-03`: Penerbitan Tiket Konfirmasi Simulasi Digital
- **AC-MANTRI-03.1**:
  - **Given** formulir valid dan persetujuan eksplisit telah dicentang
  - **When** pengguna menekan tombol "Ajukan Jadwal Konsultasi"
  - **Then** aplikasi menampilkan tiket konfirmasi digital memuat:
    1. Nomor Referensi Simulasi unik (format: `UQ-MNT-[YYYYMM]-[XXXX]`),
    2. Ringkasan data usaha yang diajukan (Nama, Topik, Lokasi, Estimasi Omzet & Laba),
    3. Petunjuk langkah selanjutnya: "Mantri BRI terdekat akan menghubungi nomor WhatsApp Anda dalam 1-2 hari kerja simulasi untuk menjadwalkan sesi diskusi usaha."
    4. Badge penanda "Data simulasi", dan tombol "Kembali ke Dashboard".

---

## 8. Kriteria Keberterimaan Manajemen Data & Boundary Adapter (AC-DATA)

### `AC-DATA-01`: Isolasi Arsitektural Repository Layer
- **AC-DATA-01.1**:
  - **Given** komponen antarmuka yang memerlukan data peluang atau konsultasi
  - **When** komponen meminta data
  - **Then** komponen hanya memanggil metode melalui interface repository (`IOpportunityRepository`, `IConsultationRepository`) tanpa pernah melakukan impor langsung terhadap berkas array statis mock, sehingga siap dialihkan ke API nyata di masa depan.

### `AC-DATA-02`: Penandaan Metadata Simulasi
- **AC-DATA-02.1**:
  - **Given** data peluang usaha atau ringkasan konsultasi yang dihasilkan mock repository
  - **When** objek data diperiksa
  - **Then** setiap entitas memiliki flag metadata `isSimulation: true` dan properti teks `dataSourceLabel` yang transparan.
