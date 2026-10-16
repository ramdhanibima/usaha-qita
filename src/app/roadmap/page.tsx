'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  RotateCcw,
  ShieldCheck,
  AlertTriangle,
  Info,
} from 'lucide-react';
import {
  RoadmapProgressBar,
  RoadmapStepCard,
  RoadmapEducationModal,
} from '@/components/roadmap';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal, ModalFooter } from '@/components/ui/modal';
import { SkeletonLoader } from '@/components/ui/skeleton-loader';
import { useRoadmapProgress } from '@/hooks/use-roadmap-progress';
import { useUserProfile } from '@/hooks/use-user-profile';
import {
  ROADMAP_DATASET,
  ROADMAP_PHASE_CONFIG,
  type DetailedRoadmapStep,
} from '@/domain/roadmap/roadmap-dataset';
import type { RoadmapPhase } from '@/types/roadmap';

export default function RoadmapPage() {
  const { profile } = useUserProfile();
  const {
    completedCount,
    totalSteps,
    progressPercentage,
    isLoading,
    isStepCompleted,
    toggleStep,
    resetProgress,
  } = useRoadmapProgress(ROADMAP_DATASET.length);

  // State Modal Edukasi
  const [selectedStep, setSelectedStep] = useState<DetailedRoadmapStep | null>(null);
  const [isEduModalOpen, setIsEduModalOpen] = useState(false);

  // State Modal Konfirmasi Reset Checklist
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // Kelompokkan 10 langkah ke dalam 4 fase sekuensial (AC-ROAD-01.1)
  const stepsByPhase = useMemo(() => {
    const phases: { phaseKey: RoadmapPhase; config: (typeof ROADMAP_PHASE_CONFIG)[string]; steps: DetailedRoadmapStep[] }[] = [
      { phaseKey: 'planning', config: ROADMAP_PHASE_CONFIG.planning, steps: [] },
      { phaseKey: 'legality', config: ROADMAP_PHASE_CONFIG.legality, steps: [] },
      { phaseKey: 'operations', config: ROADMAP_PHASE_CONFIG.operations, steps: [] },
      { phaseKey: 'marketing', config: ROADMAP_PHASE_CONFIG.marketing, steps: [] },
    ];

    ROADMAP_DATASET.forEach((step) => {
      const target = phases.find((p) => p.phaseKey === step.phase);
      if (target) {
        target.steps.push(step);
      }
    });

    return phases;
  }, []);

  const handleOpenEducation = (step: DetailedRoadmapStep) => {
    setSelectedStep(step);
    setIsEduModalOpen(true);
  };

  const handleConfirmReset = () => {
    resetProgress();
    setIsResetModalOpen(false);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 space-y-8">
      {/* Header Halaman & Konteks Edukatif */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-navy-600">
              Panduan Praktis Wirausaha
            </span>
            <Badge variant="navy" size="sm">
              4 Fase Sekuensial
            </Badge>
            <Badge variant="emerald" size="sm" dot>
              Checklist Interaktif
            </Badge>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Roadmap Eksekusi Usaha Mandiri
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            10 langkah konkret dari riset ide pasar, perizinan legalitas NIB via OSS, pengadaan alat,
            hingga hari pembukaan gerai perdana Anda.
          </p>
        </div>

        {/* Tombol Reset & Status Profil */}
        <div className="flex items-center gap-2 shrink-0">
          {completedCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsResetModalOpen(true)}
              leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
              className="text-xs min-h-[44px]"
            >
              Reset Checklist
            </Button>
          )}
        </div>
      </div>

      {/* Banner Sapaan Profil Pengguna atau Ajakan Melengkapi Onboarding */}
      {profile ? (
        <div className="rounded-2xl border border-brand-emerald-200 bg-brand-emerald-50/70 p-4 sm:p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-brand-emerald-700 shrink-0" />
            <div className="text-xs sm:text-sm text-brand-emerald-950">
              <span>Roadmap ini disiapkan untuk mendukung rencana usaha: </span>
              <strong className="text-brand-emerald-900">{profile.fullName}</strong>
              <span className="text-brand-emerald-800"> ({profile.location.regency})</span>
            </div>
          </div>
          <Link href="/dashboard" className="hidden sm:inline-block">
            <Button variant="outline" size="sm" className="bg-white text-xs">
              Lihat Dashboard
            </Button>
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border border-brand-navy-200 bg-brand-navy-50/70 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-brand-navy-600 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-slate-700">
              <strong className="text-brand-navy-900 block mb-0.5">
                Rencanakan Lebih Spesifik dengan Profil Usaha
              </strong>
              Lengkapi profil modal dan minat bisnis Anda di onboarding agar simulasi dan konsultasi
              berjalan optimal.
            </div>
          </div>
          <Link href="/onboarding" className="shrink-0 w-full sm:w-auto">
            <Button variant="primary" size="sm" fullWidth>
              Isi Profil Sekarang
            </Button>
          </Link>
        </div>
      )}

      {/* Indikator Progres Bar Interaktif (AC-ROAD-02.1) */}
      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
          <SkeletonLoader variant="rectangular" className="h-6 w-60 rounded" />
          <SkeletonLoader variant="rectangular" className="h-3 w-full rounded-full" />
        </div>
      ) : (
        <RoadmapProgressBar
          completedCount={completedCount}
          totalSteps={totalSteps}
          progressPercentage={progressPercentage}
        />
      )}

      {/* Daftar 4 Fase Sekuensial Roadmap (AC-ROAD-01.1) */}
      <div className="space-y-10">
        {stepsByPhase.map((phaseGroup) => {
          const { phaseKey, config, steps } = phaseGroup;
          return (
            <section
              key={phaseKey}
              aria-labelledby={`phase-heading-${phaseKey}`}
              className="space-y-4"
            >
              {/* Header Fase */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 pb-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-navy-600 text-sm font-extrabold text-white shrink-0">
                    {config.number}
                  </span>
                  <div>
                    <h2
                      id={`phase-heading-${phaseKey}`}
                      className="text-base sm:text-lg font-bold text-slate-900"
                    >
                      Fase {config.number}: {config.title}
                    </h2>
                    <p className="text-xs text-slate-500">{config.subtitle}</p>
                  </div>
                </div>

                <Badge variant={config.badgeVariant} size="sm">
                  {steps.filter((s) => isStepCompleted(s.id)).length} / {steps.length} Selesai
                </Badge>
              </div>

              {/* Grid Kartu Langkah dalam Fase */}
              <div className="space-y-3">
                {steps.map((step) => {
                  const globalStepNumber =
                    ROADMAP_DATASET.findIndex((s) => s.id === step.id) + 1;
                  const isDone = isStepCompleted(step.id);

                  return (
                    <RoadmapStepCard
                      key={step.id}
                      step={step}
                      stepNumber={globalStepNumber}
                      isCompleted={isDone}
                      onToggle={toggleStep}
                      onOpenEducation={handleOpenEducation}
                    />
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* Penafian Transparansi Kepatuhan Etis */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-5 flex items-start gap-3.5 text-xs text-amber-950 leading-relaxed shadow-xs">
        <ShieldCheck className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold text-amber-900 block mb-0.5">
            Panduan Edukatif & Penafian Keberhasilan Usaha:
          </strong>
          Roadmap ini disusun sebagai kerangka kerja persiapan terstruktur bagi pelaku UMKM pemula.
          Mengikuti seluruh tahapan di atas tidak menjamin kepastian keuntungan bisnis atau kelayakan
          persetujuan kredit bank. Usaha Qita adalah platform edukatif mandiri dan bukan konsultan hukum.
        </div>
      </div>

      {/* Banner Tautan Aksi Cepat ke Fitur Lain */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Ingin Membahas Rencana Usaha Anda Secara Langsung?
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            Ajukan jadwal konsultasi bimbingan bersama Mantri BRI untuk pendampingan usaha Anda.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link href="/consultation" className="w-full sm:w-auto">
            <Button
              variant="primary"
              size="md"
              fullWidth
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Ajukan Konsultasi Mantri
            </Button>
          </Link>
        </div>
      </div>

      {/* Modal Edukasi Ringkas (AC-ROAD-03.1) */}
      <RoadmapEducationModal
        step={selectedStep}
        isOpen={isEduModalOpen}
        onClose={() => {
          setIsEduModalOpen(false);
          setSelectedStep(null);
        }}
        onToggleComplete={(stepId) => {
          toggleStep(stepId);
          setIsEduModalOpen(false);
        }}
        isCompleted={selectedStep ? isStepCompleted(selectedStep.id) : false}
      />

      {/* Modal Konfirmasi Reset Checklist */}
      <Modal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title="Reset Seluruh Checklist?"
        description="Tindakan ini akan mengosongkan status centang langkah yang tersimpan di peramban Anda."
        size="md"
      >
        <div className="py-2 text-xs sm:text-sm text-slate-600 leading-relaxed space-y-3">
          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-900">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <p>
              Seluruh progres persentase akan kembali menjadi 0%. Anda dapat mencentang kembali
              langkah-langkah ini kapan saja.
            </p>
          </div>
        </div>

        <ModalFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsResetModalOpen(false)}
          >
            Batal
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={handleConfirmReset}
            leftIcon={<RotateCcw className="h-4 w-4" />}
          >
            Ya, Reset Checklist
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
