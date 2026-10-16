import type { RoadmapStep } from '@/types/roadmap';

export interface DetailedRoadmapStep extends RoadmapStep {
  objective: string; // Tujuan spesifik langkah
  prerequisites: string[]; // Dokumen/persiapan prasyarat
  actionLabel?: string; // Label tombol aksi (misal "Buka Portal OSS")
}

/**
 * Dataset Standar Roadmap Eksekusi Usaha Mikro Indonesia (TASK-ROAD-01, REQ-ROAD-01, AC-ROAD-01.1).
 * Terdiri dari 10 langkah sekuensial terbagi dalam 4 fase:
 * 1. Perencanaan & Validasi Pasar (3 langkah)
 * 2. Legalitas & Izin Usaha Mikro NIB via OSS (2 langkah)
 * 3. Pengadaan Alat & Standar Operasional (3 langkah)
 * 4. Peluncuran Gerai & Promosi Perdana (2 langkah)
 */
export const ROADMAP_DATASET: DetailedRoadmapStep[] = [
  // =========================================================================
  // FASE 1: PERENCANAAN & VALIDASI PASAR (planning)
  // =========================================================================
  {
    id: 'step-plan-01',
    phase: 'planning',
    title: 'Validasi Kebutuhan Pasar & Calon Pelanggan',
    description:
      'Lakukan survei dan wawancara singkat kepada minimal 10 orang calon pembeli di lingkungan target Anda.',
    objective:
      'Memastikan menu, produk, atau jasa yang ingin Anda jual benar-benar dibutuhkan dan disukai oleh calon konsumen lokal.',
    educationalTip:
      'Tanyakan kendala yang biasa mereka alami saat membeli produk serupa dan berapa kisaran harga yang menurut mereka wajar.',
    prerequisites: [
      'Ide awal produk / konsep menu',
      'Catatan survei sederhana',
      'Contoh sampel produk uji coba (tester)',
    ],
    isCrucialForMicroBusiness: true,
  },
  {
    id: 'step-plan-02',
    phase: 'planning',
    title: 'Simulasi Biaya & Titik Impas (Break-Even Point)',
    description:
      'Hitung perkiraan modal awal, harga jual per unit, biaya bahan baku (HPP), dan biaya tetap sewa serta gaji.',
    objective:
      'Mengetahui berapa unit produk yang wajib terjual per hari agar operasional tidak mengalami defisit/rugi.',
    educationalTip:
      'Gunakan Kalkulator Finansial Usaha Qita. Pastikan harga jual per unit selalu lebih tinggi dari modal bahan baku langsung.',
    prerequisites: [
      'Daftar harga bahan baku dari pedagang/supplier',
      'Estimasi biaya sewa lapak bulanan',
      'Target hari kerja per bulan',
    ],
    actionUrl: '/calculator',
    actionLabel: 'Buka Kalkulator Finansial',
    isCrucialForMicroBusiness: true,
  },
  {
    id: 'step-plan-03',
    phase: 'planning',
    title: 'Penentuan Lokasi Lapak atau Kanal Penjualan',
    description:
      'Tentukan apakah usaha akan menggunakan lapak fisik (ruko/tenda/teras) atau berbasis daring (pesan antar).',
    objective:
      'Mengamankan titik penjualan yang mudah diakses dan sesuai dengan segmen pelanggan utama Anda.',
    educationalTip:
      'Perhatikan arus pejalan kaki dan pengendara pada jam-jam sibuk pagi, siang, dan sore hari di sekitar lokasi.',
    prerequisites: [
      'Kesepakatan sewa dengan pemilik tempat',
      'Akses listrik dan air bersih yang memadai',
      'Izin lingkungan sekitar lapak',
    ],
    isCrucialForMicroBusiness: false,
  },

  // =========================================================================
  // FASE 2: LEGALITAS & IZIN USAHA MIKRO (legality)
  // =========================================================================
  {
    id: 'step-legal-01',
    phase: 'legality',
    title: 'Penerbitan Nomor Induk Berusaha (NIB) via OSS',
    description:
      'Daftarkan usaha perseorangan Anda secara resmi melalui sistem Online Single Submission (OSS) Kementerian Investasi/BKPM.',
    objective:
      'Mendapatkan identitas legal resmi usaha mikro yang berlaku sebagai izin edar dasar, tanda daftar usaha, dan prasyarat pembinaan perbankan.',
    educationalTip:
      'Pendaftaran NIB untuk Usaha Mikro perseorangan berisiko rendah adalah GRATIS tanpa pungutan biaya resmi dan langsung terbit secara elektronik.',
    prerequisites: [
      'KTP elektronik (NIK)',
      'Nomor WhatsApp dan alamat email aktif',
      'Data kegiatan usaha (KBLI) yang sesuai',
    ],
    actionUrl: 'https://oss.go.id',
    actionLabel: 'Kunjungi Portal Resmi OSS',
    isCrucialForMicroBusiness: true,
  },
  {
    id: 'step-legal-02',
    phase: 'legality',
    title: 'Rekening Usaha Terpisah & Pendaftaran QRIS',
    description:
      'Buka rekening perbankan khusus operasional usaha dan sediakan kode QRIS untuk mempermudah pembayaran non-tunai.',
    objective:
      'Menghindari tercampurnya uang pribadi rumah tangga dengan kas bisnis, serta mempermudah pencatatan riwayat transaksi.',
    educationalTip:
      'Rekening usaha yang rapi dan transaksi QRIS aktif merupakan data historis penting saat Anda berkonsultasi dengan Mantri BRI.',
    prerequisites: [
      'NIB yang telah terbit',
      'KTP pemilik usaha',
      'Setoran awal pembukaan rekening mikro (misal Simpedes Usaha)',
    ],
    isCrucialForMicroBusiness: true,
  },

  // =========================================================================
  // FASE 3: PENGADAAN ALAT & STANDAR OPERASIONAL (operations)
  // =========================================================================
  {
    id: 'step-ops-01',
    phase: 'operations',
    title: 'Pengadaan Peralatan Kerja & Perlengkapan Gerai',
    description:
      'Beli peralatan produksi, etalase, dan wadah penyimpanan sesuai prioritas anggaran modal awal yang telah dihitung.',
    objective:
      'Menyediakan sarana produksi yang higienis, kokoh, dan siap pakai tanpa melebihi pagu modal investasi awal.',
    educationalTip:
      'Hindari membeli alat mewah yang belum mendesak. Beli alat inti terlebih dahulu untuk menghemat cadangan kas darurat.',
    prerequisites: [
      'Daftar rincian alat wajib vs opsional',
      'Perbandingan harga dari minimal 2 toko perlengkapan',
      'Dana modal investasi awal',
    ],
    isCrucialForMicroBusiness: false,
  },
  {
    id: 'step-ops-02',
    phase: 'operations',
    title: 'Penyusunan Resep Standar & Alur Pelayanan (SOP)',
    description:
      'Tuliskan takaran baku resep produk atau panduan pengerjaan jasa agar mutu hasil tetap konsisten setiap hari.',
    objective:
      'Memastikan rasa produk atau mutu jasa tidak berubah-ubah meskipun dikerjakan oleh orang yang berbeda.',
    educationalTip:
      'Gunakan timbangan digital kecil untuk mengukur gramasi bumbu/bahan baku utama demi menjaga biaya HPP tetap terkontrol.',
    prerequisites: [
      'Uji coba rasa dan ketahanan produk',
      'Lembar resep tertulis dan alur kerja penyajian',
    ],
    isCrucialForMicroBusiness: true,
  },
  {
    id: 'step-ops-03',
    phase: 'operations',
    title: 'Pengadaan Stok Bahan Baku & Kemasan Perdana',
    description:
      'Belanja persediaan bahan baku dan kemasan berlabel nama usaha untuk kebutuhan 1-2 minggu masa perintisan awal.',
    objective:
      'Menjamin ketersediaan bahan saat hari pembukaan tanpa risiko pembusukan bahan segar akibat belanja berlebihan.',
    educationalTip:
      'Cari agen atau pemasok tangan pertama di pasar induk terdekat untuk mendapatkan harga kulakan yang lebih murah.',
    prerequisites: [
      'Kontak supplier utama dan supplier cadangan',
      'Kemasan ramah lingkungan dan stiker label brand',
    ],
    isCrucialForMicroBusiness: false,
  },

  // =========================================================================
  // FASE 4: PELUNCURAN GERAI & PROMOSI PERDANA (marketing)
  // =========================================================================
  {
    id: 'step-mkt-01',
    phase: 'marketing',
    title: 'Pemasangan Spanduk, Titik Maps & Akun Media Sosial',
    description:
      'Pasang plang nama gerai yang mencolok di lokasi dan daftarkan titik gerai Anda di Google Maps agar mudah ditemukan pembeli.',
    objective:
      'Membangun daya kenal (awareness) warga sekitar dan memudahkan kurir pesan-antar menemukan gerai Anda.',
    educationalTip:
      'Pastikan tulisan nama produk utama pada spanduk terlihat jelas dari jarak minimal 10 meter oleh pengendara motor.',
    prerequisites: [
      'Spanduk atau plang nama gerai',
      'Titik koordinat gerai di Google Business/Maps',
      'Akun media sosial usaha untuk katalog foto produk',
    ],
    isCrucialForMicroBusiness: false,
  },
  {
    id: 'step-mkt-02',
    phase: 'marketing',
    title: 'Peluncuran Perdana (Grand Opening) & Promo Kenalan',
    description:
      'Buka gerai perdana dengan promosi menarik (diskon pembukaan atau tester gratis) untuk mengundang pembeli pertama.',
    objective:
      'Menciptakan keramaian pada hari pembukaan dan mengumpulkan testimoni atau ulasan pertama dari pelanggan.',
    educationalTip:
      'Minta masukan yang jujur dari pembeli pertama mengenai rasa, kemasan, dan kecepatan pelayanan untuk evaluasi harian.',
    prerequisites: [
      'Stok produk siap saji untuk hari perdana',
      'Uang kembalian kasir pecahan kecil',
      'Materi promosi pembukaan (pamflet/status WhatsApp)',
    ],
    isCrucialForMicroBusiness: true,
  },
];

export const ROADMAP_PHASE_CONFIG: Record<
  string,
  { number: number; title: string; subtitle: string; badgeVariant: 'navy' | 'emerald' | 'amber' | 'neutral' }
> = {
  planning: {
    number: 1,
    title: 'Perencanaan & Validasi Pasar',
    subtitle: 'Riset kebutuhan calon konsumen dan perhitungan biaya dasar',
    badgeVariant: 'navy',
  },
  legality: {
    number: 2,
    title: 'Legalitas Usaha & Izin NIB (OSS)',
    subtitle: 'Perizinan resmi usaha mikro dan pemisahan rekening bank',
    badgeVariant: 'emerald',
  },
  operations: {
    number: 3,
    title: 'Pengadaan Alat & Standar Kerja',
    subtitle: 'Belanja perlengkapan inti dan standarisasi resep/layanan',
    badgeVariant: 'amber',
  },
  marketing: {
    number: 4,
    title: 'Peluncuran Gerai & Promosi Perdana',
    subtitle: 'Pemasangan titik lokasi, spanduk, dan promo pembukaan',
    badgeVariant: 'neutral',
  },
};

