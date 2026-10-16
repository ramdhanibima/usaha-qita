'use client';

import React from 'react';
import { CheckCircle2, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export interface RoadmapProgressBarProps {
  completedCount: number;
  totalSteps: number;
  progressPercentage: number;
  className?: string;
}

/**
 * Komponen Indikator Progres Roadmap Usaha (TASK-ROAD-03, REQ-ROAD-02, AC-ROAD-02.1).
 * Menampilkan persentase penyelesaian dan label status "X dari Y langkah terselesaikan"
 * dengan penanganan aksesibilitas WAI-ARIA lengkap dan aman terhadap pembagian nol.
 */
export function RoadmapProgressBar({
  completedCount,
  totalSteps,
  progressPercentage,
  className,
}: RoadmapProgressBarProps) {
  const isComplete = totalSteps > 0 && completedCount >= totalSteps;
  const safePercentage = Math.max(0, Math.min(100, progressPercentage || 0));

  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4 ${
        className || ''
      }`}
    >
      {/* Baris Informasi Teks Status Progres */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-navy-600">
              Progres Kesiapan Usaha
            </span>
            {isComplete ? (
              <Badge variant="emerald" size="sm" dot>
                Siap Meluncur
              </Badge>
            ) : (
              <Badge variant="navy" size="sm">
                Fase Bertahap
              </Badge>
            )}
          </div>
          {/* Label status persis sesuai AC-ROAD-02.1 */}
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
            {isComplete ? (
              <CheckCircle2 className="h-5 w-5 text-brand-emerald-600" />
            ) : (
              <Award className="h-5 w-5 text-brand-navy-600" />
            )}
            <span>
              {completedCount} dari {totalSteps} langkah terselesaikan
            </span>
          </h2>
        </div>

        {/* Persentase Besar */}
        <div className="flex items-baseline gap-1 sm:text-right">
          <span className="text-2xl sm:text-3xl font-extrabold text-brand-navy-900 tracking-tight">
            {safePercentage}%
          </span>
          <span className="text-xs text-slate-500 font-medium">Selesai</span>
        </div>
      </div>

      {/* Progress Bar Visual Aksesibel */}
      <div className="space-y-1.5">
        <div
          role="progressbar"
          aria-valuenow={safePercentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Progres penyelesaian checklist langkah usaha"
          className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200/80"
        >
          <div
            className={`h-full rounded-full transition-all duration-300 ease-out ${
              isComplete
                ? 'bg-brand-emerald-600'
                : safePercentage >= 50
                ? 'bg-brand-navy-600'
                : 'bg-brand-amber-500'
            }`}
            style={{ width: `${safePercentage}%` }}
          />
        </div>

        {/* Petunjuk Kontekstual */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
          <span>0% Perencanaan Awal</span>
          <span>50% Legalitas & Alat</span>
          <span>100% Siap Buka Gerai</span>
        </div>
      </div>
    </div>
  );
}
