import { BusinessOpportunity } from '@/types/opportunity';

/**
 * PEMBERITAHUAN TRANSPARANSI ETIS & DATA SIMULASI:
 * Seluruh data peluang usaha, estimasi modal, proyeksi omzet, biaya operasional,
 * dan margin keuntungan di bawah ini merupakan ASUMSI ILUSTRATIF EDUKATIF MODEL USAHA QITA.
 * Angka-angka ini BUKAN statistik pasar resmi, bukan jaminan pendapatan, dan bukan
 * representasi kelayakan fasilitas pembiayaan/kredit dari PT Bank Rakyat Indonesia (Persero) Tbk.
 */
export const SIMULATION_DATA_DISCLAIMER =
  'Estimasi Model Edukatif Usaha Qita (Data Simulasi)';

export const BUSINESS_CATALOG_DATA: BusinessOpportunity[] = [
  // ==========================================
  // KATEGORI: KULINER (culinary)
  // ==========================================
  {
    id: 'opp-culinary-01',
    slug: 'kedai-kopi-susu',
    title: 'Kedai Kopi Susu Gula Aren & Roti Panggang',
    category: 'culinary',
    shortDescription:
      'Gerai minuman kopi kekinian dengan modal terjangkau yang menyasar pekerja muda dan pelajar.',
    fullDescription:
      'Peluang usaha minuman kopi susu berbasis espresso dan susu segar dengan cita rasa lokal gula aren. Dapat dijalankan di ruko mini, gerai kontainer, atau teras rumah strategis. Modal mencakup mesin espresso kompak, blender, sealer cup, dan stok awal bahan baku.',
    minCapital: 8000000,
    maxCapital: 25000000,
    matchingRationale:
      'Cocok untuk wirausaha pemula di daerah pemukiman padat atau dekat kampus dengan tren konsumsi kopi harian yang stabil.',
    targetCustomer:
      'Mahasiswa, pelajar, karyawan kantoran, dan komunitas pemuda lokal.',
    riskLevel: 'medium',
    riskMitigationTips: [
      'Gunakan kemasan ramah lingkungan dan jaga konsistensi rasa kopi.',
      'Sediakan menu non-kopi (matcha, cokelat) untuk menjangkau konsumen yang tidak minum kafein.',
      'Manfaatkan promo pesan antar online pada jam istirahat siang.',
    ],
    defaultFinancialAssumptions: {
      sellingPricePerUnit: 18000, // Harga per cup
      estimatedUnitsSoldPerDay: 50,
      operatingDaysPerMonth: 30, // 1.500 cup per bulan
      variableCostPerUnit: 7000, // HPP biji kopi, susu, gula aren, cup & sedotan
      monthlyRent: 2500000,
      monthlyLaborCost: 3000000,
      monthlyUtilitiesCost: 500000,
      monthlyOtherFixedCost: 500000,
      initialInvestmentCapital: 25000000,
    },
    isSimulation: true,
    dataSourceLabel: SIMULATION_DATA_DISCLAIMER,
  },
  {
    id: 'opp-culinary-02',
    slug: 'gerobak-ayam-geprek',
    title: 'Gerobak Ayam Geprek Sambal Bawang',
    category: 'culinary',
    shortDescription:
      'Kuliner pedas populer dengan perputaran modal cepat dan basis konsumen harian yang sangat luas.',
    fullDescription:
      'Usaha kuliner cepat saji ayam krispi dengan sambal bawang ulek segar yang disajikan bersama nasi hangat. Kebutuhan operasional sederhana, perputaran bahan baku harian cepat, dan digemari seluruh lapisan masyarakat.',
    minCapital: 5000000,
    maxCapital: 12000000,
    matchingRationale:
      'Pilihan tepat untuk modal awal terbatas dengan potensi omzet tunai harian yang cepat berputar.',
    targetCustomer:
      'Pelajar sekolah, mahasiswa, pekerja pabrik, dan keluarga sekitar lokasi.',
    riskLevel: 'low',
    riskMitigationTips: [
      'Pastikan kebersihan minyak goreng dan kesegaran daging ayam setiap hari.',
      'Tawarkan level kepedasan sambal yang variatif sesuai selera pelanggan.',
    ],
    defaultFinancialAssumptions: {
      sellingPricePerUnit: 15000, // Paket nasi ayam geprek
      estimatedUnitsSoldPerDay: 40,
      operatingDaysPerMonth: 26, // 1.040 porsi per bulan
      variableCostPerUnit: 8500, // Ayam, tepung bumbu, cabai, minyak, nasi, kotak
      monthlyRent: 1000000,
      monthlyLaborCost: 1500000,
      monthlyUtilitiesCost: 300000,
      monthlyOtherFixedCost: 200000,
      initialInvestmentCapital: 8000000,
    },
    isSimulation: true,
    dataSourceLabel: SIMULATION_DATA_DISCLAIMER,
  },

  // ==========================================
  // KATEGORI: RITEL / TOKO KELONTONG (retail)
  // ==========================================
  {
    id: 'opp-retail-01',
    slug: 'toko-pakaian-anak',
    title: 'Toko Pakaian Anak & Bayi Rumahan',
    category: 'retail',
    shortDescription:
      'Penjualan baju harian dan pakaian pesta anak dengan margin keuntungan stabil dan risiko basi nol.',
    fullDescription:
      'Usaha ritel fashion anak yang memanfaatkan ruang depan rumah atau ruko kecil. Keunggulan usaha pakaian adalah produk tidak memiliki tanggal kedaluwarsa, sehingga modal barang dagangan tetap aman selama disimpan dengan rapi.',
    minCapital: 7000000,
    maxCapital: 15000000,
    matchingRationale:
      'Ideal bagi ibu rumah tangga atau wirausaha pemula yang menginginkan usaha minim risiko penyusutan barang.',
    targetCustomer:
      'Ibu-ibu muda, orang tua baru, serta kerabat yang mencari kado kelahiran anak.',
    riskLevel: 'low',
    riskMitigationTips: [
      'Pilih model pakaian kasual berbahan katun lembut yang nyaman untuk iklim tropis.',
      'Lakukan promosi melalui grup media sosial dan status WhatsApp warga sekitar.',
    ],
    defaultFinancialAssumptions: {
      sellingPricePerUnit: 60000, // Harga rata-rata per potong pakaian
      estimatedUnitsSoldPerDay: 5,
      operatingDaysPerMonth: 26, // 130 potong per bulan
      variableCostPerUnit: 45000, // Biaya kulakan grosir per potong
      monthlyRent: 1000000,
      monthlyLaborCost: 0, // Dikelola mandiri
      monthlyUtilitiesCost: 200000,
      monthlyOtherFixedCost: 200000,
      initialInvestmentCapital: 10000000,
    },
    isSimulation: true,
    dataSourceLabel: SIMULATION_DATA_DISCLAIMER,
  },
  {
    id: 'opp-retail-02',
    slug: 'warung-sembako-kelontong',
    title: 'Warung Sembako & Kebutuhan Rumah Tangga',
    category: 'retail',
    shortDescription:
      'Penyedia beras, telur, minyak, gula, dan barang harian di lingkungan tempat tinggal.',
    fullDescription:
      'Usaha kebutuhan pokok yang menjadi jantung perekonomian warga lingkungan sekitar. Memiliki permintaan konsisten setiap hari dengan perputaran kas tunai yang sangat tinggi.',
    minCapital: 10000000,
    maxCapital: 30000000,
    matchingRationale:
      'Paling tahan terhadap fluktuasi ekonomi karena menjual barang kebutuhan primer sehari-hari.',
    targetCustomer:
      'Warga perumahan, tetangga lingkungan RT/RW, dan pengguna jalan sekitar.',
    riskLevel: 'low',
    riskMitigationTips: [
      'Jaga pasokan barang fast-moving (telur, beras, minyak) agar tidak pernah kosong.',
      'Terapkan pencatatan kasir yang disiplin dan hindari piutang berlebih tanpa jaminan.',
    ],
    defaultFinancialAssumptions: {
      sellingPricePerUnit: 25000, // Nilai rata-rata keranjang belanja per transaksi
      estimatedUnitsSoldPerDay: 30,
      operatingDaysPerMonth: 30, // 900 transaksi per bulan
      variableCostPerUnit: 21000, // HPP kulakan grosir
      monthlyRent: 1200000,
      monthlyLaborCost: 0, // Dikelola mandiri
      monthlyUtilitiesCost: 400000,
      monthlyOtherFixedCost: 200000,
      initialInvestmentCapital: 18000000,
    },
    isSimulation: true,
    dataSourceLabel: SIMULATION_DATA_DISCLAIMER,
  },

  // ==========================================
  // KATEGORI: JASA (services)
  // ==========================================
  {
    id: 'opp-services-01',
    slug: 'laundry-kiloan-rumahan',
    title: 'Laundry Kiloan Bersih Wangi Rumahan',
    category: 'services',
    shortDescription:
      'Jasa cuci dan setrika pakaian harian dengan pelanggan rutin keluarga dan anak kos.',
    fullDescription:
      'Layanan jasa cuci basah, cuci kering, dan setrika uap kiloan. Sangat dibutuhkan oleh masyarakat perkotaan yang memiliki waktu terbatas untuk mencuci sendiri. Modal mencakup mesin cuci komersial, pengering gas, setrika uap, dan timbangan digital.',
    minCapital: 12000000,
    maxCapital: 30000000,
    matchingRationale:
      'Cocok untuk lokasi dekat kampus, kawasan kos-kosan karyawan, atau perumahan keluarga sibuk.',
    targetCustomer:
      'Mahasiswa kos, karyawan kantor, pasangan suami-istri yang bekerja.',
    riskLevel: 'medium',
    riskMitigationTips: [
      'Gunakan sistem label pakaian teratur untuk mencegah pakaian tertukar atau hilang.',
      'Sediakan layanan jemput-antar gratis untuk radius jarak 1 kilometer.',
    ],
    defaultFinancialAssumptions: {
      sellingPricePerUnit: 8000, // Tarif per kilogram
      estimatedUnitsSoldPerDay: 35, // 35 kg per hari
      operatingDaysPerMonth: 30, // 1.050 kg per bulan
      variableCostPerUnit: 2500, // Detergen cair, pewangi, softener, plastik packing
      monthlyRent: 1500000,
      monthlyLaborCost: 2000000,
      monthlyUtilitiesCost: 800000, // Listrik & air
      monthlyOtherFixedCost: 300000,
      initialInvestmentCapital: 20000000,
    },
    isSimulation: true,
    dataSourceLabel: SIMULATION_DATA_DISCLAIMER,
  },
  {
    id: 'opp-services-02',
    slug: 'barbershop-pria',
    title: 'Pangkas Rambut / Barbershop Kompak',
    category: 'services',
    shortDescription:
      'Layanan potong rambut pria dengan ruangan ber-AC yang nyaman dan tarif terjangkau.',
    fullDescription:
      'Jasa pangkas rambut pria modern dengan fasilitas kursi barber hidrolik, pendingin ruangan, dan tata potong rambut yang rapi. Usaha jasa memiliki keunggulan biaya bahan baku yang sangat rendah.',
    minCapital: 8000000,
    maxCapital: 20000000,
    matchingRationale:
      'Peluang bagus jika memiliki keahlian potong rambut atau bermitra dengan kapster berpengalaman.',
    targetCustomer:
      'Pria dewasa, remaja sekolah, dan anak-anak di pemukiman sekitar.',
    riskLevel: 'low',
    riskMitigationTips: [
      'Jaga kebersihan alat cukur, sisir, dan kain penutup demi kenyamanan pelanggan.',
      'Berikan kartu stamp loyalitas (misal: 5 kali potong gratis 1 kali).',
    ],
    defaultFinancialAssumptions: {
      sellingPricePerUnit: 25000, // Tarif potong rambut
      estimatedUnitsSoldPerDay: 12,
      operatingDaysPerMonth: 26, // 312 pelanggan per bulan
      variableCostPerUnit: 2000, // Minyak rambut, pisau silet steril, bedak
      monthlyRent: 1500000,
      monthlyLaborCost: 1500000,
      monthlyUtilitiesCost: 400000,
      monthlyOtherFixedCost: 200000,
      initialInvestmentCapital: 12000000,
    },
    isSimulation: true,
    dataSourceLabel: SIMULATION_DATA_DISCLAIMER,
  },

  // ==========================================
  // KATEGORI: AGRIBISNIS (agribusiness)
  // ==========================================
  {
    id: 'opp-agribusiness-01',
    slug: 'kebun-sayur-hidroponik',
    title: 'Kebun Sayuran Segar Hidroponik',
    category: 'agribusiness',
    shortDescription:
      'Budidaya sayuran hijau (selada, pakcoy, kailan) tanpa tanah di lahan pekarangan rumah.',
    fullDescription:
      'Usaha pertanian modern perkotaan (urban farming) dengan instalasi pipa hidroponik NFT/DFT. Menghasilkan sayuran bebas pestisida kimia yang disukai oleh restoran, hotel, dan konsumen pecinta makanan sehat.',
    minCapital: 6000000,
    maxCapital: 18000000,
    matchingRationale:
      'Sangat cocok bagi pemula yang memiliki pekarangan rumah menganggur dan tertarik dengan tren gaya hidup sehat.',
    targetCustomer:
      'Restoran vegetarian, supermarket lokal, kafe salad, dan warga perumahan.',
    riskLevel: 'medium',
    riskMitigationTips: [
      'Kontrol kadar nutrisi (PPM) dan keasaman air (pH) secara rutin setiap pagi.',
      'Pasang jaring paranet / insect net untuk melindungi tanaman dari hama serangga.',
    ],
    defaultFinancialAssumptions: {
      sellingPricePerUnit: 12000, // Harga per pack sayur 250 gram
      estimatedUnitsSoldPerDay: 25,
      operatingDaysPerMonth: 30, // 750 pack per bulan
      variableCostPerUnit: 3500, // Nutrisi AB mix, benih unggul, rockwool, kemasan
      monthlyRent: 500000, // Sewa lahan teras / pekarangan
      monthlyLaborCost: 0, // Dikelola mandiri
      monthlyUtilitiesCost: 300000, // Listrik pompa air
      monthlyOtherFixedCost: 200000,
      initialInvestmentCapital: 10000000,
    },
    isSimulation: true,
    dataSourceLabel: SIMULATION_DATA_DISCLAIMER,
  },
  {
    id: 'opp-agribusiness-02',
    slug: 'budidaya-jamur-tiram',
    title: 'Budidaya Jamur Tiram Kumbung Mini',
    category: 'agribusiness',
    shortDescription:
      'Produksi jamur konsumsi bernutrisi tinggi dengan media baglog di ruangan tertutup.',
    fullDescription:
      'Budidaya jamur tiram putih di ruangan kumbung bambu sederhana. Memiliki siklus panen harian setelah baglog dibuka. Permintaan jamur tiram selalu tinggi dari pedagang sayur pasar tradisional dan warung makan.',
    minCapital: 4000000,
    maxCapital: 10000000,
    matchingRationale:
      'Pilihan modal rendah di daerah berhawa sejuk atau ruangan terlindung dengan panen harian cepat.',
    targetCustomer:
      'Pedagang sayur pasar tradisional, rumah makan, penjual jamur krispi.',
    riskLevel: 'medium',
    riskMitigationTips: [
      'Jaga kelembapan udara kumbung antara 80-90% dengan penyemprotan kabut air.',
      'Pilih bibit baglog dari produsen terpercaya yang sudah steril dan miselium tebal.',
    ],
    defaultFinancialAssumptions: {
      sellingPricePerUnit: 15000, // Harga per kilogram
      estimatedUnitsSoldPerDay: 15,
      operatingDaysPerMonth: 30, // 450 kg per bulan
      variableCostPerUnit: 6000, // Biaya baglog terdepresiasi & kantong plastik
      monthlyRent: 400000,
      monthlyLaborCost: 0,
      monthlyUtilitiesCost: 150000,
      monthlyOtherFixedCost: 150000,
      initialInvestmentCapital: 6000000,
    },
    isSimulation: true,
    dataSourceLabel: SIMULATION_DATA_DISCLAIMER,
  },

  // ==========================================
  // KATEGORI: KREATIF & KERAJINAN (creative)
  // ==========================================
  {
    id: 'opp-creative-01',
    slug: 'sablon-kaos-merchandise',
    title: 'Sablon Kaos & Cetak Merchandise Komunitas',
    category: 'creative',
    shortDescription:
      'Layanan sablon digital DTF dan manual untuk kaos acara, seragam komunitas, dan merchandise.',
    fullDescription:
      'Usaha jasa percetakan kreatif yang melayani pembuatan kaos seragam, tote bag, topi, dan mug kustom. Model bisnis dapat berbasis pesanan (make-to-order) sehingga meminimalkan risiko modal tertahan pada stok mati.',
    minCapital: 7000000,
    maxCapital: 18000000,
    matchingRationale:
      'Cocok untuk wirausaha yang memiliki minat desain grafis dan jejaring komunitas yang aktif.',
    targetCustomer:
      'Panitia acara sekolah/kampus, komunitas hobi, organisasi pemuda, dan UMKM lokal.',
    riskLevel: 'medium',
    riskMitigationTips: [
      'Terapkan kebijakan uang muka (DP minimal 50%) sebelum memulai proses cetak.',
      'Lakukan pembuatan sampel (proofing) sebelum memproduksi dalam jumlah massal.',
    ],
    defaultFinancialAssumptions: {
      sellingPricePerUnit: 55000, // Harga rata-rata per potong kaos sablon
      estimatedUnitsSoldPerDay: 10,
      operatingDaysPerMonth: 26, // 260 pcs per bulan
      variableCostPerUnit: 32000, // Kaos polos cotton combed & transfer film DTF
      monthlyRent: 800000,
      monthlyLaborCost: 0, // Dikerjakan mandiri
      monthlyUtilitiesCost: 350000, // Listrik mesin heat press
      monthlyOtherFixedCost: 200000,
      initialInvestmentCapital: 9000000,
    },
    isSimulation: true,
    dataSourceLabel: SIMULATION_DATA_DISCLAIMER,
  },
  {
    id: 'opp-creative-02',
    slug: 'kreasi-hampers-souvenir',
    title: 'Kreasi Hampers & Kado Souvenir Personal',
    category: 'creative',
    shortDescription:
      'Pembuatan bingkisan hadiah pernikahan, wisuda, dan hari raya dengan kemasan estetik.',
    fullDescription:
      'Bisnis kerajinan kemasan hadiah dan cinderamata kustom dengan sentuhan artistik. Tidak membutuhkan mesin berat, dapat dimulai dari meja kerja rumah, dan memiliki lonjakan omzet tinggi pada momen perayaan hari besar.',
    minCapital: 3000000,
    maxCapital: 9000000,
    matchingRationale:
      'Pilihan modal sangat terjangkau bagi individu kreatif dengan ketelitian estetika tinggi.',
    targetCustomer:
      'Calon pengantin, instansi kantor yang mengadakan gathering, masyarakat saat momen Idul Fitri/Natal.',
    riskLevel: 'low',
    riskMitigationTips: [
      'Bangun portofolio visual yang menarik di media sosial dengan pencahayaan foto yang baik.',
      'Beli bahan kemasan (kotak akrilik, pita, kartu ucapan) dalam jumlah grosir.',
    ],
    defaultFinancialAssumptions: {
      sellingPricePerUnit: 75000, // Harga per paket hampers
      estimatedUnitsSoldPerDay: 5,
      operatingDaysPerMonth: 26, // 130 paket per bulan
      variableCostPerUnit: 42000, // Box kemasan, isi hampers, kartu ucapan, dekorasi
      monthlyRent: 0, // Berbasis rumah
      monthlyLaborCost: 0,
      monthlyUtilitiesCost: 200000,
      monthlyOtherFixedCost: 150000,
      initialInvestmentCapital: 4500000,
    },
    isSimulation: true,
    dataSourceLabel: SIMULATION_DATA_DISCLAIMER,
  },
];

