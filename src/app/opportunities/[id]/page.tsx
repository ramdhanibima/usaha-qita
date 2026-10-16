import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  ShieldAlert,
  Users,
  Wallet,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { opportunityRepository } from '@/adapters/repositories/opportunity.repository';
import { formatRupiah, formatNumber } from '@/lib/utils';
import type { RiskLevel } from '@/types/opportunity';

interface OpportunityDetailPageProps {
  params: Promise<{ id: string }>;
}

const RISK_CONFIG: Record<RiskLevel, { label: string; variant: 'emerald' | 'amber' | 'danger'; desc: string }> = {
  low: {
    label: 'Risiko Rendah',
    variant: 'emerald',
    desc: 'Tingkat kegagalan relatif kecil, perputaran barang cepat, kebutuhan modal kerja stabil.',
  },
  medium: {
    label: 'Risiko Sedang',
    variant: 'amber',
    desc: 'Membutuhkan konsistensi kualitas rasa/layanan dan pengelolaan persediaan bahan baku.',
  },
  high: {
    label: 'Risiko Tinggi',
    variant: 'danger',
    desc: 'Sensitif terhadap persaingan tren, perizinan teknis, dan fluktuasi harga bahan modal.',
  },
};

/**
 * Halaman Detail Peluang Usaha (TASK-OPP-03, REQ-OPP-02, REQ-OPP-03, AC-OPP-02.1, AC-OPP-03.1).
 * Menguraikan deskripsi lengkap, target konsumen, mitigasi risiko, dan rincian asumsi finansial bawaan
 * dengan label transparansi "Data simulasi" yang tegas.
 */
export default async function OpportunityDetailPage({
  params,
}: OpportunityDetailPageProps) {
  const { id } = await params;
  const opportunity = await opportunityRepository.getById(id);

  if (!opportunity) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center space-y-4">
        <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
          <AlertTriangle className="h-8 w-8 text-amber-600" />
        </div>
        <h1 className="text-xl font-bold text-slate-900">Peluang Usaha Tidak Ditemukan</h1>
        <p className="text-sm text-slate-600">
          Ide peluang usaha yang Anda cari tidak tersedia dalam katalog simulasi.
        </p>
        <div className="pt-2">
          <Link href="/opportunities">
            <Button variant="primary" size="md" leftIcon={<ArrowLeft className="h-4 w-4" />}>
              Kembali ke Katalog Peluang
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const riskInfo = RISK_CONFIG[opportunity.riskLevel] || {
    label: 'Risiko Terukur',
    variant: 'amber' as const,
    desc: 'Perhatikan dinamika persaingan dan biaya operasional.',
  };

  const assumptions = opportunity.defaultFinancialAssumptions;
  const totalMonthlyFixedCost =
    assumptions.monthlyRent +
    assumptions.monthlyLaborCost +
    assumptions.monthlyUtilitiesCost +
    assumptions.monthlyOtherFixedCost;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 space-y-8">
      {/* Tombol Navigasi Kembali */}
      <div>
        <Link
          href="/opportunities"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-brand-navy-600 transition-colors py-1 px-2 rounded-lg hover:bg-slate-100"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Katalog Peluang Usaha</span>
        </Link>
      </div>

      {/* Header Utama Detail Peluang */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="navy" size="md">
              Kategori: {opportunity.category}
            </Badge>
            <Badge variant={riskInfo.variant} size="md">
              {riskInfo.label}
            </Badge>
            <Badge variant="simulation" size="md" dot />
          </div>

          <span className="text-[11px] text-slate-500 font-medium">
            {opportunity.dataSourceLabel}
          </span>
        </div>

        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            {opportunity.title}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
            {opportunity.shortDescription}
          </p>
        </div>

        {/* Highlight Modal & Target Pasar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
          <div className="rounded-2xl border border-brand-emerald-200 bg-brand-emerald-50/50 p-4">
            <span className="text-xs font-semibold text-brand-emerald-900 uppercase tracking-wider block flex items-center gap-1.5 mb-1">
              <Wallet className="h-4 w-4 text-brand-emerald-700" />
              Estimasi Kebutuhan Modal Awal
            </span>
            <div className="text-xl sm:text-2xl font-extrabold text-brand-emerald-900">
              {formatRupiah(opportunity.minCapital)}
              {opportunity.maxCapital > opportunity.minCapital && (
                <span className="text-sm font-normal text-slate-600">
                  {' '}— {formatRupiah(opportunity.maxCapital)}
                </span>
              )}
            </div>
            <p className="mt-1 text-[11px] text-brand-emerald-800">
              Mencakup belanja peralatan, bahan baku awal, dan cadangan sewa.
            </p>
          </div>

          <div className="rounded-2xl border border-brand-navy-200 bg-brand-navy-50/50 p-4">
            <span className="text-xs font-semibold text-brand-navy-900 uppercase tracking-wider block flex items-center gap-1.5 mb-1">
              <Users className="h-4 w-4 text-brand-navy-700" />
              Target Konsumen Utama
            </span>
            <p className="text-sm font-bold text-brand-navy-900 leading-snug">
              {opportunity.targetCustomer}
            </p>
            <p className="mt-1 text-[11px] text-brand-navy-700">
              Segmen pembeli yang menjadi prioritas pemasaran produk/layanan ini.
            </p>
          </div>
        </div>
      </div>

      {/* Deskripsi Lengkap & Analisis Peluang */}
      <Card>
        <CardHeader>
          <CardTitle>Gambaran Lengkap Model Usaha</CardTitle>
          <CardDescription>
            Karakteristik operasional dan potensi pengembangan usaha di pasar riil Indonesia.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-slate-700 leading-relaxed">
          <p>{opportunity.fullDescription}</p>

          <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4 space-y-1">
            <strong className="text-xs font-bold uppercase tracking-wider text-brand-navy-900 block flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-brand-navy-600" />
              Alasan Kurasi Ide Ini:
            </strong>
            <p className="text-xs text-slate-600 leading-relaxed">
              {opportunity.matchingRationale}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Panduan Mitigasi Risiko */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-amber-600" />
            <CardTitle>Profil Risiko & Tips Mitigasi Praktis</CardTitle>
          </div>
          <CardDescription>{riskInfo.desc}</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
            {opportunity.riskMitigationTips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-brand-emerald-600 shrink-0 mt-0.5" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Rincian Asumsi Finansial Bawaan (Default Assumptions) */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <CardTitle>Asumsi Finansial Bawaan (Simulasi)</CardTitle>
              <CardDescription>
                Model angka ilustratif yang disiapkan untuk diuji pada Simulator BEP & Finansial.
              </CardDescription>
            </div>
            <Badge variant="simulation" size="sm" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Harga Jual Rata-rata
              </span>
              <span className="text-base font-extrabold text-slate-900 block mt-1">
                {formatRupiah(assumptions.sellingPricePerUnit)} / unit
              </span>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Biaya Variabel (HPP)
              </span>
              <span className="text-base font-extrabold text-slate-900 block mt-1">
                {formatRupiah(assumptions.variableCostPerUnit)} / unit
              </span>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Target Penjualan Harian
              </span>
              <span className="text-base font-extrabold text-slate-900 block mt-1">
                {formatNumber(assumptions.estimatedUnitsSoldPerDay)} unit / hari
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                ({assumptions.operatingDaysPerMonth} hari kerja sebulan)
              </span>
            </div>
          </div>

          {/* Breakdown Biaya Tetap Bulanan */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Rincian Biaya Tetap Operasional Bulanan
              </span>
              <span className="text-sm font-extrabold text-brand-navy-900">
                Total: {formatRupiah(totalMonthlyFixedCost)} / bln
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block">Sewa Tempat/Lapak</span>
                <span className="font-semibold text-slate-800">
                  {formatRupiah(assumptions.monthlyRent)}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Gaji Karyawan/Asisten</span>
                <span className="font-semibold text-slate-800">
                  {formatRupiah(assumptions.monthlyLaborCost)}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Listrik, Air & Gas</span>
                <span className="font-semibold text-slate-800">
                  {formatRupiah(assumptions.monthlyUtilitiesCost)}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Iuran & Operasional Lain</span>
                <span className="font-semibold text-slate-800">
                  {formatRupiah(assumptions.monthlyOtherFixedCost)}
                </span>
              </div>
            </div>
          </div>

          {/* Banner Transparansi Model Simulasi */}
          <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-4 flex items-start gap-3 text-xs text-amber-950 leading-relaxed">
            <Info className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold text-amber-900 block mb-0.5">
                Transparansi Simulasi Finansial:
              </strong>
              Angka omzet dan biaya di atas adalah asumsi model edukatif untuk membantu Anda memahami
              logika bisnis. Biaya riil di lapangan dapat bervariasi bergantung pada lokasi, negosiasi
              sewa, dan skala operasional yang Anda pilih.
            </div>
          </div>
        </CardContent>

        {/* Footer Tombol Aksi Pindah ke Simulator */}
        <CardFooter className="pt-4 pb-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50">
          <Link href="/opportunities" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="md"
              fullWidth
              leftIcon={<ArrowLeft className="h-4 w-4" />}
            >
              Kembali ke Katalog
            </Button>
          </Link>

          <Link
            href={`/calculator?opportunityId=${opportunity.id}`}
            className="w-full sm:w-auto"
          >
            <Button
              variant="emerald"
              size="md"
              fullWidth
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Simulasikan di Kalkulator BEP
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
