import {
  FinancialInput,
  FinancialResult,
  FinancialHealthStatus,
} from '@/types/financial';

/**
 * Menentukan klasifikasi kesehatan finansial bisnis berdasarkan Laba Bersih dan Margin Laba
 */
export function determineHealthStatus(
  netProfit: number,
  profitMarginPercent: number
): FinancialHealthStatus {
  if (netProfit <= 0) {
    return 'operating_loss';
  }
  if (profitMarginPercent >= 15) {
    return 'healthy_profit';
  }
  return 'narrow_margin';
}

/**
 * Menghasilkan pesan status kelayakan usaha yang edukatif dan mudah dipahami pemula
 */
export function getHealthStatusMessage(
  status: FinancialHealthStatus,
  contributionMarginPerUnit: number
): string {
  if (status === 'operating_loss') {
    if (contributionMarginPerUnit <= 0) {
      return 'Peringatan: Harga jual per unit belum menutup modal bahan baku langsung (HPP). Tinjau ulang harga jual produk Anda.';
    }
    return 'Proyeksi saat ini menunjukkan defisit operasional bulanan. Pertimbangkan untuk meningkatkan target penjualan harian atau mengefisienkan biaya tetap (sewa/operasional).';
  }

  if (status === 'narrow_margin') {
    return 'Usaha menghasilkan laba positif, namun dengan margin tipis (di bawah 15%). Bisnis rentan jika terjadi kenaikan harga bahan baku; lakukan pengawasan biaya secara berkala.';
  }

  return 'Proyeksi usaha menunjukkan potensi laba yang sehat dengan margin di atas 15%. Model bisnis memiliki bantalan keamanan keuntungan yang baik.';
}

/**
 * Mesin Hitung Finansial Deterministik Murni (Pure Function)
 * Menghitung seluruh proyeksi keuangan bisnis (Omzet, HPP, Biaya Tetap, Laba Bersih, BEP, Payback Period)
 * tanpa pembulatan acak dan bebas efek samping.
 */
export function calculateFinancials(input: FinancialInput): FinancialResult {
  // 1. Total unit penjualan bulanan (Q)
  const monthlyUnitsSold = input.unitsSoldPerDay * input.operatingDaysPerMonth;

  // 2. Proyeksi Omzet Bulanan (R = Q * Selling Price)
  const monthlyRevenue = Math.round(monthlyUnitsSold * input.sellingPricePerUnit);

  // 3. Total Biaya Variabel Bulanan (VC = Q * Variable Cost per unit)
  const monthlyVariableCost = Math.round(monthlyUnitsSold * input.variableCostPerUnit);

  // 4. Margin Kontribusi per Unit (CM = Selling Price - Variable Cost per unit)
  const contributionMarginPerUnit = input.sellingPricePerUnit - input.variableCostPerUnit;

  // 5. Rasio Margin Kontribusi (CMR = CM / Selling Price)
  const contributionMarginRatio =
    input.sellingPricePerUnit > 0
      ? contributionMarginPerUnit / input.sellingPricePerUnit
      : 0;

  // 6. Total Biaya Tetap Bulanan (FC = sewa + gaji + utilitas + lain-lain)
  const monthlyFixedCost = Math.round(
    input.monthlyFixedCosts.rent +
      input.monthlyFixedCosts.labor +
      input.monthlyFixedCosts.utilities +
      input.monthlyFixedCosts.marketingAndOther
  );

  // 7. Total Biaya Pengeluaran Bulanan (TC = VC + FC)
  const totalMonthlyCost = monthlyVariableCost + monthlyFixedCost;

  // 8. Laba Bersih Bulanan (NP = R - TC)
  const monthlyNetProfit = monthlyRevenue - totalMonthlyCost;

  // 9. Margin Laba Bersih Persen (PM = (NP / R) * 100) dibulatkan ke 2 desimal
  const profitMarginPercent =
    monthlyRevenue > 0
      ? Math.round((monthlyNetProfit / monthlyRevenue) * 10000) / 100
      : 0;

  // 10. Titik Impas Satuan Unit (BEP Units = ceil(FC / CM)), null jika CM <= 0
  const bepUnitsMonthly =
    contributionMarginPerUnit > 0
      ? Math.ceil(monthlyFixedCost / contributionMarginPerUnit)
      : null;

  // 11. Titik Impas Satuan Rupiah (BEP Revenue = round(FC / CMR)), null jika CMR <= 0
  const bepRevenueMonthly =
    contributionMarginRatio > 0
      ? Math.round(monthlyFixedCost / contributionMarginRatio)
      : null;

  // 12. Estimasi Periode Balik Modal (Payback Period = round(Modal Awal / NP, 1 desimal)), null jika NP <= 0
  const paybackPeriodMonths =
    monthlyNetProfit > 0
      ? Math.round((input.initialInvestment / monthlyNetProfit) * 10) / 10
      : null;

  // 13. Klasifikasi Kesehatan Finansial
  const healthStatus = determineHealthStatus(monthlyNetProfit, profitMarginPercent);

  // 14. Pesan Edukasi Kontekstual
  const statusMessage = getHealthStatusMessage(healthStatus, contributionMarginPerUnit);

  return {
    monthlyRevenue,
    monthlyVariableCost,
    monthlyFixedCost,
    totalMonthlyCost,
    monthlyNetProfit,
    profitMarginPercent,
    contributionMarginPerUnit,
    contributionMarginRatio,
    bepUnitsMonthly,
    bepRevenueMonthly,
    paybackPeriodMonths,
    healthStatus,
    statusMessage,
  };
}

