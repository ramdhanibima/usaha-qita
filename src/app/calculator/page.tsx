'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Compass,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { FinancialInputForm, FinancialSummaryCard } from '@/components/calculator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SkeletonLoader, SkeletonCard } from '@/components/ui/skeleton-loader';
import { useFinancialCalculator } from '@/hooks/use-financial-calculator';
import { opportunityRepository } from '@/adapters/repositories/opportunity.repository';
import type { BusinessOpportunity } from '@/types/opportunity';

/**
 * Komponen Konten Utama Simulator Finansial
 */
function CalculatorContent() {
  const searchParams = useSearchParams();
  const opportunityId = searchParams.get('opportunityId');

  const {
    input,
    result,
    isValid,
    errors,
    updateField,
    updateFixedCost,
    resetToDefaults,
    loadFromOpportunity,
  } = useFinancialCalculator();

  const [loadedOpportunity, setLoadedOpportunity] = useState<BusinessOpportunity | null>(null);
  const [opportunityNotFound, setOpportunityNotFound] = useState(false);
  const [isLoadingOpportunity, setIsLoadingOpportunity] = useState(false);

  // Ambil data peluang jika ada opportunityId pada parameter URL
  useEffect(() => {
    if (!opportunityId) {
      setLoadedOpportunity(null);
      setOpportunityNotFound(false);
      return;
    }

    let isMounted = true;
    setIsLoadingOpportunity(true);
    setOpportunityNotFound(false);

    opportunityRepository
      .getById(opportunityId)
      .then((opp) => {
        if (!isMounted) return;
        if (opp) {
          setLoadedOpportunity(opp);
          loadFromOpportunity(opp);
        } else {
          setLoadedOpportunity(null);
          setOpportunityNotFound(true);
        }
      })
      .catch(() => {
        if (!isMounted) return;
        setLoadedOpportunity(null);
        setOpportunityNotFound(true);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingOpportunity(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [opportunityId, loadFromOpportunity]);

  return (
    <div className="space-y-6">
      {/* Banner Informasi Transfer Asumsi Peluang */}
      {isLoadingOpportunity && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <SkeletonLoader variant="rectangular" className="h-6 w-80 rounded" />
        </div>
      )}

      {!isLoadingOpportunity && loadedOpportunity && (
        <div className="rounded-2xl border border-brand-emerald-200 bg-brand-emerald-50/80 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-brand-emerald-700 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-brand-emerald-950">
              <strong className="block font-bold">
                Asumsi Berhasil Dimuat dari Peluang: {loadedOpportunity.title}
              </strong>
              <p className="mt-0.5 text-xs text-brand-emerald-900/90 leading-relaxed">
                Seluruh parameter harga jual, target harian, HPP, biaya tetap sewa/gaji, dan modal
                awal telah terisi otomatis sesuai profil peluang ini. Anda bebas mengubah nilai di bawah.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link href={`/opportunities/${loadedOpportunity.id}`}>
              <Button variant="outline" size="sm" className="bg-white text-xs">
                Lihat Detail Ide
              </Button>
            </Link>
          </div>
        </div>
      )}

      {!isLoadingOpportunity && opportunityNotFound && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs sm:text-sm text-amber-900 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-semibold">
              Peluang dengan ID tersebut tidak ditemukan
            </strong>
            <p className="mt-0.5 text-xs text-amber-800">
              Kalkulator menggunakan nilai asumsi standar. Anda tetap dapat memasukkan asumsi bisnis
              secara mandiri.
            </p>
          </div>
        </div>
      )}

      {/* Grid Utama 2 Kolom Responsif (Desktop: 7 col form, 5 col summary sticky) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Kolom Kiri: Form Input Asumsi Finansial (7 Kolom) */}
        <div className="lg:col-span-7">
          <FinancialInputForm
            input={input}
            errors={errors}
            onUpdateField={updateField}
            onUpdateFixedCost={updateFixedCost}
            onReset={() => resetToDefaults()}
            opportunityTitle={loadedOpportunity?.title}
          />
        </div>

        {/* Kolom Kanan: Ringkasan Hasil & BEP Sticky (5 Kolom) */}
        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-6">
          <FinancialSummaryCard
            result={result}
            isValid={isValid}
            operatingDays={input.operatingDaysPerMonth}
            initialInvestment={input.initialInvestment}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Halaman Simulator Finansial Interaktif & Kalkulator BEP (TASK-FIN-04, REQ-FIN-01, REQ-FIN-02, AC-FIN-01.1).
 * Menggunakan Suspense boundary untuk menangani useSearchParams secara aman di Next.js App Router.
 */
export default function CalculatorPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 space-y-6">
      {/* Header Navigasi & Konteks Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-navy-600">
              Simulator Bisnis Deterministik
            </span>
            <Badge variant="simulation" size="sm" dot />
            <Badge variant="emerald" size="sm">
              100% Rumus Murni
            </Badge>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Kalkulator BEP & Finansial UMKM
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-2xl">
            Simulasikan omzet, laba bersih, Break-Even Point (BEP), dan periode balik modal secara
            presisi tanpa estimasi acak.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/opportunities">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Compass className="h-4 w-4" />}
            >
              Pilih dari Katalog Peluang
            </Button>
          </Link>
        </div>
      </div>

      {/* Konten dengan Suspense Boundary */}
      <Suspense
        fallback={
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-4">
              <SkeletonCard />
              <SkeletonCard />
            </div>
            <div className="lg:col-span-5">
              <SkeletonCard />
            </div>
          </div>
        }
      >
        <CalculatorContent />
      </Suspense>
    </div>
  );
}
