export interface MonthlyFixedCosts {
  rent: number; // Sewa tempat/lapak
  labor: number; // Gaji karyawan/asisten
  utilities: number; // Listrik, air, gas, internet
  marketingAndOther: number; // Biaya kebersihan, iuran, promosi
}

export interface FinancialInput {
  sellingPricePerUnit: number; // Harga jual per satuan produk/jasa
  unitsSoldPerDay: number; // Rata-rata transaksi/unit per hari
  operatingDaysPerMonth: number; // Hari kerja per bulan (misal 26 atau 30 hari)
  variableCostPerUnit: number; // Biaya variabel per unit (Bahan baku / HPP)
  monthlyFixedCosts: MonthlyFixedCosts;
  initialInvestment: number; // Total modal awal (beli alat, renovasi ringan)
}

export type FinancialHealthStatus = 'healthy_profit' | 'narrow_margin' | 'operating_loss';

export interface FinancialResult {
  monthlyRevenue: number; // Omzet bulanan (IDR)
  monthlyVariableCost: number; // Total biaya bahan baku sebulan (IDR)
  monthlyFixedCost: number; // Total biaya tetap sebulan (IDR)
  totalMonthlyCost: number; // Biaya operasional total sebulan (IDR)
  monthlyNetProfit: number; // Laba bersih sebelum pajak (IDR)
  profitMarginPercent: number; // Margin laba bersih (%)
  contributionMarginPerUnit: number; // Laba kotor per unit produk (IDR)
  contributionMarginRatio: number; // Rasio margin kontribusi (0 - 1)
  bepUnitsMonthly: number | null; // Titik impas (unit per bulan), null jika CM <= 0
  bepRevenueMonthly: number | null; // Titik impas (Rupiah per bulan), null jika CM <= 0
  paybackPeriodMonths: number | null; // Estimasi balik modal (bulan), null jika rugi
  healthStatus: FinancialHealthStatus;
  statusMessage: string;
}

