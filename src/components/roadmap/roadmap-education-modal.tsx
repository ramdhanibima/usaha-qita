'use client';

import React from 'react';
import Link from 'next/link';
import {
  BookOpen,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { Modal, ModalFooter } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { DetailedRoadmapStep } from '@/domain/roadmap/roadmap-dataset';
import { ROADMAP_PHASE_CONFIG } from '@/domain/roadmap/roadmap-dataset';

export interface RoadmapEducationModalProps {
  step: DetailedRoadmapStep | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleComplete?: (stepId: string) => void;
  isCompleted?: boolean;
}

/**
 * Modal Ringkasan Edukasi Tiap Langkah Roadmap (TASK-ROAD-02, REQ-ROAD-03, AC-ROAD-03.1).
 * Menguraikan tujuan langkah, dokumen prasyarat, tips praktis pemula, dan tautan aksi resmi.
 */
export function RoadmapEducationModal({
  step,
  isOpen,
  onClose,
  onToggleComplete,
  isCompleted = false,
}: RoadmapEducationModalProps) {
  if (!step) return null;

  const phaseConfig = ROADMAP_PHASE_CONFIG[step.phase] || {
    number: 1,
    title: 'Fase Roadmap',
    badgeVariant: 'navy' as const,
  };

  const isExternalUrl = step.actionUrl?.startsWith('http');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={step.title}
      description={`Fase ${phaseConfig.number}: ${phaseConfig.title}`}
      size="lg"
    >
      <div className="space-y-5 text-xs sm:text-sm text-slate-700 leading-relaxed py-1">
        {/* Lencana Status & Krusial */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant={phaseConfig.badgeVariant} size="sm">
            Fase {phaseConfig.number}
          </Badge>
          {step.isCrucialForMicroBusiness && (
            <Badge variant="amber" size="sm">
              Langkah Sangat Krusial
            </Badge>
          )}
          {isCompleted && (
            <Badge variant="emerald" size="sm" dot>
              Sudah Selesai
            </Badge>
          )}
        </div>

        {/* 1. Tujuan Langkah (Objective) */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-1">
          <strong className="text-xs font-bold uppercase tracking-wider text-slate-900 block flex items-center gap-1.5">
            <BookOpen className="h-4 w-4 text-brand-navy-600" />
            Tujuan Langkah Ini:
          </strong>
          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
            {step.objective}
          </p>
        </div>

        {/* 2. Dokumen Prasyarat (Prerequisites) */}
        {step.prerequisites && step.prerequisites.length > 0 && (
          <div className="space-y-2">
            <strong className="text-xs font-bold uppercase tracking-wider text-slate-900 block">
              Dokumen / Bahan Prasyarat yang Perlu Disiapkan:
            </strong>
            <ul className="space-y-1.5">
              {step.prerequisites.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="h-4 w-4 text-brand-emerald-600 shrink-0 mt-0.5" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 3. Tips Praktis Bagi Pemula */}
        <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4 space-y-1 text-blue-950">
          <strong className="text-xs font-bold uppercase tracking-wider text-brand-navy-900 block flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-brand-navy-600" />
            Tips Praktis bagi Pemula:
          </strong>
          <p className="text-xs sm:text-sm leading-relaxed text-blue-950/90">
            {step.educationalTip}
          </p>
        </div>

        {/* 4. Tautan Aksi Resmi (Action Link) */}
        {step.actionUrl && (
          <div className="pt-1">
            {isExternalUrl ? (
              <a
                href={step.actionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand-navy-200 bg-white px-4 py-2.5 text-xs font-bold text-brand-navy-700 hover:bg-brand-navy-50 hover:text-brand-navy-900 transition-colors shadow-xs w-full sm:w-auto min-h-[44px]"
              >
                <span>{step.actionLabel || 'Akses Portal Resmi'}</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            ) : (
              <Link href={step.actionUrl}>
                <Button variant="secondary" size="sm" className="w-full sm:w-auto min-h-[44px]">
                  {step.actionLabel || 'Buka Fitur Terkait'}
                </Button>
              </Link>
            )}
          </div>
        )}

        {/* 5. Penafian Kepatuhan Etis (Disclaimer Hukum) */}
        <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3 flex items-start gap-2.5 text-[11px] text-amber-950 leading-relaxed">
          <ShieldAlert className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
          <p>
            <strong>Penafian Edukatif:</strong> Informasi di atas adalah panduan umum untuk edukasi
            wirausaha mikro dan bukan merupakan nasihat hukum resmi. Pastikan selalu memverifikasi
            persyaratan terkini melalui portal resmi kementerian atau dinas terkait.
          </p>
        </div>
      </div>

      <ModalFooter className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-3">
        <Button variant="outline" size="sm" onClick={onClose} className="w-full sm:w-auto">
          Tutup Panduan
        </Button>

        {onToggleComplete && (
          <Button
            variant={isCompleted ? 'secondary' : 'emerald'}
            size="sm"
            onClick={() => {
              onToggleComplete(step.id);
            }}
            className="w-full sm:w-auto"
            leftIcon={<CheckCircle2 className="h-4 w-4" />}
          >
            {isCompleted ? 'Tandai Belum Selesai' : 'Tandai Langkah Ini Selesai'}
          </Button>
        )}
      </ModalFooter>
    </Modal>
  );
}
