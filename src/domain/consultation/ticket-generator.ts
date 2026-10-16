/**
 * Generator Nomor Referensi Tiket Simulasi Konsultasi Mantri BRI (AC-MANTRI-03.1).
 * Format spesifikasi: "UQ-MNT-[YYYYMM]-[XXXX]"
 * Contoh: "UQ-MNT-202610-8472"
 */

/**
 * Menghasilkan nomor tiket referensi simulasi yang unik dan terstandarisasi.
 * Fungsi ini murni (pure function) jika parameter `date` dan `randomSuffix` diberikan,
 * sehingga mudah diuji secara deterministik di unit test.
 *
 * @param date Tanggal penerbitan tiket (default: waktu sekarang)
 * @param randomSuffix 4 karakter alfanumerik akhiran (opsional, jika kosong diacak otomatis)
 * @returns String nomor tiket berformat "UQ-MNT-YYYYMM-XXXX"
 */
export function generateTicketReference(date: Date = new Date(), randomSuffix?: string): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const yyyymm = `${year}${month}`;

  let suffix: string;
  if (randomSuffix && randomSuffix.trim().length > 0) {
    // Bersihkan karakter non-alfanumerik, jadikan huruf kapital, dan pastikan panjang 4 karakter
    suffix = randomSuffix.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 4);
    if (suffix.length < 4) {
      suffix = suffix.padEnd(4, '0');
    }
  } else {
    // Karakter acak alfanumerik 4 digit kapital
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Hindari I, O, 1, 0 untuk kemudahan baca
    let generated = '';
    for (let i = 0; i < 4; i++) {
      const idx = Math.floor(Math.random() * chars.length);
      generated += chars[idx];
    }
    suffix = generated;
  }

  return `UQ-MNT-${yyyymm}-${suffix}`;
}

/**
 * Memvalidasi apakah sebuah string memiliki format nomor referensi tiket yang sah.
 */
export function isValidTicketReference(reference: string): boolean {
  const regex = /^UQ-MNT-\d{6}-[A-Z0-9]{4}$/;
  return regex.test(reference);
}

