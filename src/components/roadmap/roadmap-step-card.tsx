'use client';

import React from 'react';
import { Check, BookOpen } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { DetailedRoadmapStep } from '@/domain/roadmap/roadmap-dataset';

export interface RoadmapStepCardProps {
  step: DetailedRoadmapStep;
  stepNumber: number;
  isCompleted: boolean;
  onToggle: (stepId: string) => void;
  onOpenEducation: (step: DetailedRoadmapStep) => void;
  className?: string;
}

/**
 * Komponen Kartu Langkah Roadmap Reusable (TASK-ROAD-02, REQ-ROAD-01, REQ-ROAD-02, AC-ROAD-02.1).
 * Dilengkapi kotak centang interaktif (target sentuh min 44x44px), penanda langkah krusial,
 * dan tombol pembuka panduan edukasi detail.
 */
export function RoadmapStepCard({
  step,
  stepNumber,
  isCompleted,
  onToggle,
  onOpenEducation,
  className,
}: RoadmapStepCardProps) {
  const formattedNumber = String(stepNumber).padStart(2, '0');

  return (
    <Card
      className={`transition-all duration-200 border ${
        isCompleted
          ? 'border-brand-emerald-300 bg-brand-emerald-50/20 shadow-xs'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
      } ${className || ''}`}
    >
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        {/* Sisi Kiri: Checkbox Interaktif & Konten Teks Langkah */}
        <div className="flex items-start gap-3.5 flex-1">
          {/* Tombol Checkbox Aksesibel (Target Sentuh Min 44x44px) */}
          <button
            type="button"
            role="checkbox"
            aria-checked={isCompleted}
            aria-label={`Tandai langkah ${step.title} sebagai ${
              isCompleted ? 'belum selesai' : 'selesai'
            }`}
            onClick={() => onToggle(step.id)}
            className={`h-11 w-11 min-h-[44px] min-w-[44px] rounded-xl border-2 flex items-center justify-center shrink-0 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-navy-600 ${
              isCompleted
                ? 'border-brand-emerald-600 bg-brand-emerald-600 text-white shadow-xs'
                : 'border-slate-300 bg-white hover:border-brand-navy-500 hover:bg-slate-50'
            }`}
          >
            {isCompleted ? (
              <Check className="h-6 w-6 stroke-[2.5]" />
            ) : (
              <span className="text-xs font-bold text-slate-400 select-none">
                {formattedNumber}
              </span>
            )}
          </button>

          {/* Uraian Teks Langkah */}
          <div className="space-y-1.5 flex-1 pr-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Langkah {formattedNumber}
              </span>
              {step.isCrucialForMicroBusiness && (
                <Badge variant="amber" size="sm">
                  Langkah Krusial
                </Badge>
              )}
              {isCompleted && (
                <Badge variant="emerald" size="sm">
                  Terselesaikan
                </Badge>
              )}
            </div>

            <h3
              className={`text-sm sm:text-base font-bold leading-snug transition-colors ${
                isCompleted ? 'text-slate-700 line-through decoration-slate-300' : 'text-slate-900'
              }`}
            >
              {step.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {step.description}
            </p>
          </div>
        </div>

        {/* Sisi Kanan: Tombol Buka Panduan Edukasi */}
        <div className="sm:shrink-0 pt-1 sm:pt-0 pl-14 sm:pl-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenEducation(step)}
            leftIcon={<BookOpen className="h-3.5 w-3.5" />}
            className="w-full sm:w-auto text-xs min-h-[44px]"
          >
            Pelajari Panduan
          </Button>
        </div>
      </div>
    </Card>
  );
}
