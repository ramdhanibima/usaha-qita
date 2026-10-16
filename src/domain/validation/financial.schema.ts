import { z } from 'zod';

export const monthlyFixedCostsSchema = z.object({
  rent: z
    .number({ invalid_type_error: 'Biaya sewa harus berupa angka' })
    .min(0, 'Biaya sewa tidak boleh bernilai negatif'),
  labor: z
    .number({ invalid_type_error: 'Gaji karyawan harus berupa angka' })
    .min(0, 'Gaji karyawan tidak boleh bernilai negatif'),
  utilities: z
    .number({ invalid_type_error: 'Biaya utilitas harus berupa angka' })
    .min(0, 'Biaya utilitas tidak boleh bernilai negatif'),
  marketingAndOther: z
    .number({ invalid_type_error: 'Biaya operasional lain harus berupa angka' })
    .min(0, 'Biaya operasional lain tidak boleh bernilai negatif'),
});

export const financialInputSchema = z.object({
  sellingPricePerUnit: z
    .number({ invalid_type_error: 'Harga jual harus berupa angka' })
    .positive('Harga jual per unit harus lebih besar dari 0'),
  unitsSoldPerDay: z
    .number({ invalid_type_error: 'Volume penjualan harus berupa angka' })
    .min(0, 'Estimasi penjualan harian tidak boleh bernilai negatif'),
  operatingDaysPerMonth: z
    .number({ invalid_type_error: 'Hari kerja harus berupa angka' })
    .int('Hari kerja bulanan harus berupa bilangan bulat')
    .min(1, 'Hari operasional bulanan minimal 1 hari')
    .max(31, 'Hari operasional bulanan maksimal 31 hari'),
  variableCostPerUnit: z
    .number({ invalid_type_error: 'Biaya variabel harus berupa angka' })
    .min(0, 'Biaya variabel (HPP) per unit tidak boleh bernilai negatif'),
  monthlyFixedCosts: monthlyFixedCostsSchema,
  initialInvestment: z
    .number({ invalid_type_error: 'Modal awal harus berupa angka' })
    .min(0, 'Modal investasi awal tidak boleh bernilai negatif'),
});

export type FinancialInputFormData = z.infer<typeof financialInputSchema>;

