/**
 * Utilitas pemformatan angka dan mata uang Rupiah (TASK-CORE-04, REQ-FIN-01).
 * Menggunakan standar konvensi penulisan angka di Indonesia (pemisah ribuan titik, desimal koma).
 */

/**
 * Memformat angka nominal menjadi representasi Rupiah Indonesia.
 * Contoh: 15000000 -> "Rp 15.000.000"
 */
export function formatRupiah(amount: number): string {
  if (isNaN(amount) || !isFinite(amount)) {
    return 'Rp 0';
  }

  // Gunakan Math.round untuk menghindari desimal pecahan rupiah kecil
  const rounded = Math.round(amount);
  const formatted = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(rounded);

  // Standarisasi spasi setelah "Rp"
  return formatted.replace(/^Rp\s?/, 'Rp ');
}

/**
 * Memformat angka dengan pemisah ribuan (tanpa simbol Rp).
 * Contoh: 15000 -> "15.000"
 */
export function formatNumber(value: number): string {
  if (isNaN(value) || !isFinite(value)) {
    return '0';
  }

  return new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

/**
 * Memformat nilai desimal menjadi persentase.
 * Contoh: 15.54 -> "15.5%"
 */
export function formatPercent(value: number, decimals: number = 1): string {
  if (isNaN(value) || !isFinite(value)) {
    return '0%';
  }

  return `${value.toFixed(decimals)}%`;
}

/**
 * Mengubah string format Rupiah atau angka berpemisah menjadi number murni.
 * Contoh: "Rp 15.000.000" -> 15000000
 */
export function parseRupiah(value: string): number {
  if (!value) return 0;
  // Hapus semua karakter kecuali digit angka dan minus
  const cleaned = value.replace(/[^0-9-]/g, '');
  const parsed = parseInt(cleaned, 10);
  return isNaN(parsed) ? 0 : parsed;
}

