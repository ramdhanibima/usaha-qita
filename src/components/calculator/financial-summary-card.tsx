'use client';

import React from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  HelpCircle,
  Clock,
  Target,
  ArrowRight,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatRupiah, formatNumber, formatPercent } from '@/lib/utils';
import type { FinancialResult, FinancialHealthStatus } from '@/types/financial';

export interface FinancialSummaryCardProps {
  result: FinancialResult | null;
  isValid: boolean;
  operatingDays?: number;
  initialInvestment?: number;
  className?: string;
}

const HEALTH_CONFIG: Record<
  FinancialHealthStatus,
  { label: string; variant: 'emerald' | 'amber' | 'danger'; icon: React.ComponentType<{ className?: string }> }
> = {
  healthy_profit: {
    label: 'Untung Sehat (Margin ≥ 15%)',
    variant: 'emerald',
    icon: TrendingUp,
  },
  narrow_margin: {
    label: 'Margin Tipis (< 15%)',
    variant: 'amber',
    icon: AlertTriangle,
  },
  operating_loss: {
    label: 'Defisit / Rugi Operasional',
    variant: 'danger',
    icon: TrendingDown,
  },
};

/**
 * Komponen Ringkasan Metrik Finansial & Break-Even Point (TASK-FIN-03, REQ-FIN-02, REQ-FIN-03, REQ-FIN-04, REQ-FIN-05).
 * Menampilkan ringkasan omzet, biaya, laba bersih, BEP unit & nominal, payback period,
 * dan status kesehatan hasil kalkulasi deterministik domain murni.
 */
export function FinancialSummaryCard({
  result,
  isValid,
  operatingDays = 30,
  initialInvestment = 0,
  className,
}: FinancialSummaryCardProps) {
  // State Input Belum Lengkap / Tidak Valid
  if (!isValid || !result) {
    return (
      <Card className={`border-dashed border-2 border-slate-300 bg-slate-50 p-6 text-center space-y-4 ${className || ''}`}>
        <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-xl bg-slate-200 text-slate-500">
          <HelpCircle className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-800">Menunggu Input Valid</h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            Perbaiki atau lengkapi nilai pada formulir asumsi di samping untuk melihat proyeksi
            finansial dan Break-Even Point secara otomatis.
          </p>
        </div>
        <div className="pt-2">
          <Badge variant="amber" size="sm">
            Periksa Kolom Berwarna Merah
          </Badge>
        </div>
      </Card>
    );
  }

  const health = HEALTH_CONFIG[result.healthStatus] || {
    label: 'Status Terhitung',
    variant: 'amber' as const,
    icon: Sparkles,
  };
  const HealthIcon = health.icon;

  const isProfit = result.monthlyNetProfit > 0;
  const isLoss = result.monthlyNetProfit < 0;

  // Format Laba Bersih (khusus nilai negatif ditampilkan tegas sebagai defisit)
  const formattedNetProfit = isLoss
    ? `- ${formatRupiah(Math.abs(result.monthlyNetProfit))}`
    : formatRupiah(result.monthlyNetProfit);

  // Estimasi BEP harian
  const dailyBepUnits =
    result.bepUnitsMonthly !== null
      ? Math.ceil(result.bepUnitsMonthly / Math.max(1, operatingDays))
      : null;

  return (
    <Card className={`border-slate-200 bg-white shadow-md overflow-hidden ${className || ''}`}>
      {/* Header Ringkasan: Status Kesehatan & Transparansi Simulasi */}
      <CardHeader className="bg-slate-50/80 border-b border-slate-100 pb-4">
        <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
          <Badge variant="simulation" size="sm" dot />
          <Badge variant={health.variant} size="sm">
            <HealthIcon className="h-3 w-3 mr-1 inline-block" />
            {health.label}
          </Badge>
        </div>

        <CardTitle className="text-xl font-extrabold text-slate-900">
          Proyeksi Hasil Finansial
        </CardTitle>
        <CardDescription className="text-xs text-slate-600 mt-1">
          Dihitung secara deterministik berdasarkan asumsi bulanan yang Anda tetapkan.
        </CardDescription>

        {/* Pesan Edukasi Kontekstual dari Domain Engine */}
        <div
          className={`mt-3 rounded-xl border p-3 text-xs leading-relaxed flex items-start gap-2.5 ${
            result.healthStatus === 'healthy_profit'
              ? 'border-emerald-200 bg-emerald-50/80 text-emerald-950'
              : result.healthStatus === 'narrow_margin'
              ? 'border-amber-200 bg-amber-50/80 text-amber-950'
              : 'border-brand-danger-200 bg-brand-danger-50/80 text-brand-danger-950'
          }`}
        >
          <HealthIcon className="h-4 w-4 shrink-0 mt-0.5" />
          <p>{result.statusMessage}</p>
        </div>
      </CardHeader>

      <CardContent className="p-5 sm:p-6 space-y-6">
        {/* Metrik Utama: Laba Bersih & Margin */}
        <div
          className={`rounded-2xl border p-4 sm:p-5 ${
            isLoss
              ? 'border-brand-danger-300 bg-brand-danger-50/40 text-brand-danger-900'
              : 'border-brand-emerald-300 bg-brand-emerald-50/40 text-brand-emerald-950'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider block">
              {isLoss ? 'Rugi Bersih Bulanan (Defisit)' : 'Laba Bersih Bulanan'}
            </span>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                isLoss
                  ? 'bg-brand-danger-100 text-brand-danger-800'
                  : 'bg-brand-emerald-100 text-brand-emerald-800'
              }`}
            >
              Margin: {formatPercent(result.profitMarginPercent, 2)}
            </span>
          </div>

          <div
            className={`text-2xl sm:text-3xl font-extrabold tracking-tight mt-2 ${
              isLoss ? 'text-brand-danger-700' : 'text-brand-emerald-800'
            }`}
          >
            {formattedNetProfit}
          </div>

          <p className="mt-1 text-[11px] opacity-80 leading-normal">
            {isLoss
              ? 'Pengeluaran melebihi pemasukan. Usaha memerlukan evaluasi biaya operasional atau kenaikan harga jual.'
              : 'Keuntungan bersih bulanan setelah menutup seluruh biaya bahan baku, sewa, gaji, dan utilitas.'}
          </p>
        </div>

        {/* Breakdown Arus Kas Bulanan (Omzet vs Biaya) */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
            Ikhtisar Arus Kas Operasional Bulanan
          </span>

          <div className="space-y-2 text-xs">
            {/* Omzet Bulanan */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-600 font-medium flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-brand-navy-600" />
                Estimasi Omzet Penjualan (R)
              </span>
              <span className="font-extrabold text-slate-900 text-sm">
                {formatRupiah(result.monthlyRevenue)}
              </span>
            </div>

            {/* Total Biaya Variabel */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-600 font-medium flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-brand-amber-500" />
                Total Biaya Variabel (HPP)
              </span>
              <span className="font-semibold text-slate-800">
                {formatRupiah(result.monthlyVariableCost)}
              </span>
            </div>

            {/* Total Biaya Tetap */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-600 font-medium flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-slate-500" />
                Total Biaya Tetap (Overhead)
              </span>
              <span className="font-semibold text-slate-800">
                {formatRupiah(result.monthlyFixedCost)}
              </span>
            </div>

            {/* Total Pengeluaran Bulanan */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-100/80 border border-slate-200">
              <span className="font-bold text-slate-900">Total Seluruh Biaya (TC = VC + FC)</span>
              <span className="font-extrabold text-slate-900 text-sm">
                {formatRupiah(result.totalMonthlyCost)}
              </span>
            </div>
          </div>
        </div>

        {/* Titik Impas (Break-Even Point / BEP) */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-brand-navy-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Titik Impas (Break-Even Point)
              </span>
            </div>
            <Badge variant="navy" size="sm">BEP</Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* BEP Satuan Unit */}
            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <span className="text-[11px] text-slate-500 block">BEP Satuan Unit</span>
              {result.bepUnitsMonthly !== null ? (
                <div>
                  <span className="text-base font-extrabold text-slate-900 block mt-0.5">
                    {formatNumber(result.bepUnitsMonthly)} unit / bln
                  </span>
                  {dailyBepUnits !== null && (
                    <span className="text-[11px] text-brand-navy-700 block mt-0.5">
                      (~{dailyBepUnits} unit / hari kerja)
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-xs font-semibold text-brand-danger-700 block mt-1 leading-tight">
                  Harga belum menutup HPP; BEP tidak dapat dicapai.
                </span>
              )}
            </div>

            {/* BEP Satuan Rupiah */}
            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <span className="text-[11px] text-slate-500 block">BEP Satuan Rupiah</span>
              {result.bepRevenueMonthly !== null ? (
                <div>
                  <span className="text-base font-extrabold text-slate-900 block mt-0.5">
                    {formatRupiah(result.bepRevenueMonthly)}
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    Omzet minimal agar modal impas
                  </span>
                </div>
              ) : (
                <span className="text-xs font-semibold text-brand-danger-700 block mt-1 leading-tight">
                  Tidak dapat dihitung (Margin Kontribusi ≤ 0)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Periode Balik Modal (Payback Period) */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-brand-emerald-700" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Estimasi Balik Modal (Payback Period)
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-3 text-xs">
            {result.paybackPeriodMonths !== null ? (
              <div>
                <span className="text-base font-extrabold text-brand-emerald-800 block">
                  ~{result.paybackPeriodMonths} Bulan
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Berdasarkan modal awal investasi {formatRupiah(initialInvestment)} dan laba bersih bulanan{' '}
                  {formatRupiah(result.monthlyNetProfit)}.
                </span>
              </div>
            ) : initialInvestment === 0 && isProfit ? (
              <span className="text-xs font-bold text-brand-emerald-700 block">
                ~0 Bulan (Tanpa modal awal investasi)
              </span>
            ) : (
              <div className="text-brand-danger-700 font-semibold leading-relaxed">
                <span>Tidak dapat dihitung (usaha berstatus defisit/rugi).</span>
                <p className="text-[11px] text-slate-500 font-normal mt-0.5">
                  Modal tidak akan kembali selama operasional bulanan masih mencatat kerugian.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Catatan Transparansi Kepatuhan Etis */}
        <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-3.5 flex items-start gap-2.5 text-xs text-amber-950 leading-relaxed">
          <ShieldCheck className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
          <p>
            <strong>Transparansi Simulasi Finansial:</strong> Hasil perhitungan di atas adalah proyeksi
            matematis untuk edukasi perencanaan mandiri. Bukan jaminan keberhasilan usaha atau janji
            persetujuan pinjaman perbankan (KUR/Kupedes).
          </p>
        </div>
      </CardContent>

      {/* Footer Aksi Konsultasi Mantri BRI */}
      <CardFooter className="bg-slate-50/80 border-t border-slate-100 p-5 flex flex-col sm:flex-row items-center gap-3">
        <Link href="/consultation" className="w-full">
          <Button
            variant="primary"
            size="md"
            fullWidth
            rightIcon={<ArrowRight className="h-4 w-4" />}
          >
            Simulasikan Konsultasi Bimbingan Mantri BRI
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
