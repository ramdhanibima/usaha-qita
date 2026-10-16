'use client';

import React from 'react';
import {
  DollarSign,
  TrendingUp,
  Store,
  Layers,
  RotateCcw,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { InputField } from '@/components/ui/input-field';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatRupiah, parseRupiah } from '@/lib/utils';
import type { FinancialInput, MonthlyFixedCosts } from '@/types/financial';

export interface FinancialInputFormProps {
  input: FinancialInput;
  errors: Record<string, string>;
  onUpdateField: <K extends keyof FinancialInput>(field: K, value: FinancialInput[K]) => void;
  onUpdateFixedCost: <K extends keyof MonthlyFixedCosts>(field: K, value: number) => void;
  onReset: () => void;
  opportunityTitle?: string;
  className?: string;
}

/**
 * Komponen Form Input Asumsi Finansial (TASK-FIN-02, REQ-FIN-01, AC-FIN-01.1).
 * Memungkinkan pengguna mengubah harga, target harian, HPP, biaya tetap bulanan, dan modal awal
 * dengan validasi runtime terperinci berbahasa Indonesia.
 */
export function FinancialInputForm({
  input,
  errors,
  onUpdateField,
  onUpdateFixedCost,
  onReset,
  opportunityTitle,
  className,
}: FinancialInputFormProps) {
  // Total Biaya Tetap Bulanan
  const totalFixedCosts =
    input.monthlyFixedCosts.rent +
    input.monthlyFixedCosts.labor +
    input.monthlyFixedCosts.utilities +
    input.monthlyFixedCosts.marketingAndOther;

  // Margin Kontribusi Kotor per Unit
  const unitContributionMargin = input.sellingPricePerUnit - input.variableCostPerUnit;
  const isLossPerUnit = unitContributionMargin <= 0;

  return (
    <div className={`space-y-6 ${className || ''}`}>
      {/* Header Form & Notifikasi Asumsi Peluang */}
      <div className="flex items-center justify-between gap-3 flex-wrap border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-navy-600">
              Parameter Asumsi Usaha
            </span>
            <Badge variant="simulation" size="sm" dot />
          </div>
          <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
            Input Asumsi Finansial Bisnis
          </h2>
          {opportunityTitle && (
            <p className="text-xs text-brand-navy-700 mt-0.5">
              Terkait dengan ide peluang:{' '}
              <strong className="underline decoration-brand-navy-300">{opportunityTitle}</strong>
            </p>
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
          className="text-xs"
        >
          Reset Asumsi
        </Button>
      </div>

      {/* Bagian 1: Penetapan Harga & Target Penjualan */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 text-brand-navy-700">
            <TrendingUp className="h-4 w-4" />
            <CardTitle className="text-base">1. Harga Jual & Target Penjualan</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Berapa harga yang Anda tetapkan per satuan produk dan berapa rata-rata unit terjual per hari.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="Harga Jual per Unit (Rp)"
              required
              type="text"
              value={input.sellingPricePerUnit ? String(input.sellingPricePerUnit) : ''}
              onChange={(e) => {
                const parsed = parseRupiah(e.target.value);
                onUpdateField('sellingPricePerUnit', parsed);
              }}
              placeholder="Contoh: 18000"
              helperText={`Terbaca: ${formatRupiah(input.sellingPricePerUnit)} / unit`}
              error={errors['sellingPricePerUnit']}
            />

            <InputField
              label="Target Penjualan Harian (Unit)"
              required
              type="number"
              min={0}
              value={input.unitsSoldPerDay ? String(input.unitsSoldPerDay) : ''}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                onUpdateField('unitsSoldPerDay', isNaN(val) ? 0 : Math.max(0, val));
              }}
              placeholder="Contoh: 50"
              helperText="Estimasi cup / porsi / transaksi per hari"
              error={errors['unitsSoldPerDay']}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <InputField
              label="Hari Operasional per Bulan"
              required
              type="number"
              min={1}
              max={31}
              value={input.operatingDaysPerMonth ? String(input.operatingDaysPerMonth) : ''}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                onUpdateField('operatingDaysPerMonth', isNaN(val) ? 1 : Math.min(31, Math.max(1, val)));
              }}
              placeholder="Contoh: 26 atau 30"
              helperText="Jumlah hari buka usaha dalam sebulan (1 - 31 hari)"
              error={errors['operatingDaysPerMonth']}
            />

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 flex flex-col justify-center text-xs">
              <span className="text-slate-500 block">Total Estimasi Volume Penjualan:</span>
              <span className="text-sm font-extrabold text-slate-900 mt-0.5">
                {(input.unitsSoldPerDay * input.operatingDaysPerMonth).toLocaleString('id-ID')} unit / bulan
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bagian 2: Biaya Variabel Langsung (HPP) */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 text-brand-emerald-700">
            <DollarSign className="h-4 w-4" />
            <CardTitle className="text-base">2. Biaya Variabel / HPP Langsung</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Biaya bahan baku mentah, bumbu, kemasan (cup/plastik), atau ongkos kulakan per satu unit produk.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-2">
          <InputField
            label="Biaya Variabel (HPP) per Unit (Rp)"
            required
            type="text"
            value={input.variableCostPerUnit ? String(input.variableCostPerUnit) : ''}
            onChange={(e) => {
              const parsed = parseRupiah(e.target.value);
              onUpdateField('variableCostPerUnit', parsed);
            }}
            placeholder="Contoh: 7000"
            helperText={`Terbaca: ${formatRupiah(input.variableCostPerUnit)} / unit`}
            error={errors['variableCostPerUnit']}
          />

          {/* Banner Margin Kontribusi Instan */}
          <div
            className={`rounded-xl border p-3 text-xs flex items-start gap-2.5 ${
              isLossPerUnit
                ? 'border-brand-danger-300 bg-brand-danger-50 text-brand-danger-900'
                : 'border-emerald-200 bg-emerald-50 text-emerald-900'
            }`}
          >
            {isLossPerUnit ? (
              <AlertTriangle className="h-4 w-4 text-brand-danger-600 shrink-0 mt-0.5" />
            ) : (
              <Sparkles className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            )}
            <div>
              <span className="font-bold block">
                {isLossPerUnit
                  ? 'Peringatan: Harga Jual Belum Menutup Biaya Bahan Baku!'
                  : `Laba Kotor per Unit (Margin Kontribusi): ${formatRupiah(unitContributionMargin)}`}
              </span>
              <p className="mt-0.5 leading-relaxed text-[11px] opacity-90">
                {isLossPerUnit
                  ? 'Harga jual per unit lebih kecil atau sama dengan HPP. Usaha akan selalu rugi pada setiap penjualan. Naikkan harga jual atau efisienkan biaya bahan baku.'
                  : 'Setiap unit yang berhasil terjual menyumbangkan laba kotor di atas untuk menutupi biaya sewa dan gaji.'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bagian 3: Biaya Tetap Bulanan (Overhead) */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 text-brand-navy-700">
              <Store className="h-4 w-4" />
              <CardTitle className="text-base">3. Biaya Tetap Operasional Bulanan</CardTitle>
            </div>
            <Badge variant="navy" size="sm">
              Subtotal: {formatRupiah(totalFixedCosts)}/bln
            </Badge>
          </div>
          <CardDescription className="text-xs">
            Biaya rutin yang wajib dibayar setiap bulan meskipun toko sedang sepi pengunjung.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="Sewa Lapak / Tempat (Rp/bln)"
              type="text"
              value={input.monthlyFixedCosts.rent ? String(input.monthlyFixedCosts.rent) : ''}
              onChange={(e) => onUpdateFixedCost('rent', parseRupiah(e.target.value))}
              placeholder="Contoh: 2500000"
              helperText={`Terbaca: ${formatRupiah(input.monthlyFixedCosts.rent)}`}
              error={errors['monthlyFixedCosts.rent']}
            />

            <InputField
              label="Gaji Karyawan / Asisten (Rp/bln)"
              type="text"
              value={input.monthlyFixedCosts.labor ? String(input.monthlyFixedCosts.labor) : ''}
              onChange={(e) => onUpdateFixedCost('labor', parseRupiah(e.target.value))}
              placeholder="Contoh: 3000000"
              helperText={`Terbaca: ${formatRupiah(input.monthlyFixedCosts.labor)}`}
              error={errors['monthlyFixedCosts.labor']}
            />

            <InputField
              label="Listrik, Air & Gas (Rp/bln)"
              type="text"
              value={input.monthlyFixedCosts.utilities ? String(input.monthlyFixedCosts.utilities) : ''}
              onChange={(e) => onUpdateFixedCost('utilities', parseRupiah(e.target.value))}
              placeholder="Contoh: 500000"
              helperText={`Terbaca: ${formatRupiah(input.monthlyFixedCosts.utilities)}`}
              error={errors['monthlyFixedCosts.utilities']}
            />

            <InputField
              label="Iuran, Promosi & Biaya Lain (Rp/bln)"
              type="text"
              value={
                input.monthlyFixedCosts.marketingAndOther
                  ? String(input.monthlyFixedCosts.marketingAndOther)
                  : ''
              }
              onChange={(e) => onUpdateFixedCost('marketingAndOther', parseRupiah(e.target.value))}
              placeholder="Contoh: 500000"
              helperText={`Terbaca: ${formatRupiah(input.monthlyFixedCosts.marketingAndOther)}`}
              error={errors['monthlyFixedCosts.marketingAndOther']}
            />
          </div>
        </CardContent>
      </Card>

      {/* Bagian 4: Kebutuhan Modal Awal Investasi */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 text-brand-amber-700">
            <Layers className="h-4 w-4" />
            <CardTitle className="text-base">4. Modal Awal Investasi Rintisan</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Alokasi belanja peralatan mesin, renovasi lapak, etalase, dan modal kerja awal.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-2">
          <InputField
            label="Total Modal Awal Investasi (Rp)"
            required
            type="text"
            value={input.initialInvestment ? String(input.initialInvestment) : ''}
            onChange={(e) => {
              const parsed = parseRupiah(e.target.value);
              onUpdateField('initialInvestment', parsed);
            }}
            placeholder="Contoh: 25000000"
            helperText={`Terbaca: ${formatRupiah(input.initialInvestment)}`}
            error={errors['initialInvestment']}
          />
          <p className="text-[11px] text-slate-500">
            💡 Angka ini digunakan untuk menghitung estimasi <strong>Payback Period</strong> (berapa
            bulan keuntungan operasional dapat mengembalikan seluruh modal awal).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
