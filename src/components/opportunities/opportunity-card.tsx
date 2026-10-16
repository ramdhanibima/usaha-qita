import React from 'react';
import Link from 'next/link';
import {
  Compass,
  ArrowRight,
  Calculator,
  Users,
  Wallet,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatRupiah } from '@/lib/utils';
import { generateMatchExplanation } from '@/domain/opportunities/matcher';
import type { BusinessOpportunity, RiskLevel } from '@/types/opportunity';
import type { UserProfile, BusinessCategory } from '@/types/profile';

export interface OpportunityCardProps {
  opportunity: BusinessOpportunity;
  userProfile?: UserProfile | null;
  className?: string;
}

const CATEGORY_ICONS: Record<BusinessCategory, string> = {
  culinary: '🍲',
  retail: '🛒',
  services: '✂️',
  agribusiness: '🌱',
  creative: '🎨',
};

const CATEGORY_LABELS: Record<BusinessCategory, string> = {
  culinary: 'Kuliner & Minuman',
  retail: 'Ritel & Toko',
  services: 'Jasa & Servis',
  agribusiness: 'Agribisnis',
  creative: 'Industri Kreatif',
};

const RISK_CONFIG: Record<RiskLevel, { label: string; variant: 'emerald' | 'amber' | 'danger' }> = {
  low: { label: 'Risiko Rendah', variant: 'emerald' },
  medium: { label: 'Risiko Sedang', variant: 'amber' },
  high: { label: 'Risiko Tinggi', variant: 'danger' },
};

/**
 * Komponen Kartu Peluang Usaha (TASK-OPP-01, REQ-OPP-02, AC-OPP-02.1).
 * Menampilkan ringkasan ide bisnis, modal, target pasar, profil risiko,
 * penjelasan kecocokan profil pengguna, serta badge penanda "Data simulasi" yang tegas.
 */
export function OpportunityCard({
  opportunity,
  userProfile,
  className,
}: OpportunityCardProps) {
  const riskInfo = RISK_CONFIG[opportunity.riskLevel] || {
    label: 'Risiko Terukur',
    variant: 'amber' as const,
  };

  const rationaleText = userProfile
    ? generateMatchExplanation(opportunity, userProfile)
    : opportunity.matchingRationale;

  return (
    <Card
      hoverable
      className={`flex flex-col justify-between border-slate-200 bg-white transition-all duration-200 ${className || ''}`}
    >
      <div>
        {/* Header Kartu: Kategori, Risiko, dan Badge Simulasi (AC-SYS-03.2) */}
        <CardHeader className="pb-3 border-b border-slate-100">
          <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <span className="text-base select-none" aria-hidden="true">
                {CATEGORY_ICONS[opportunity.category]}
              </span>
              <span>{CATEGORY_LABELS[opportunity.category]}</span>
            </span>

            <div className="flex items-center gap-1.5">
              <Badge variant={riskInfo.variant} size="sm">
                {riskInfo.label}
              </Badge>
              <Badge variant="simulation" size="sm" />
            </div>
          </div>

          <CardTitle className="text-lg font-bold text-slate-900 leading-snug line-clamp-1">
            {opportunity.title}
          </CardTitle>

          <CardDescription className="text-xs text-slate-600 line-clamp-2 mt-1">
            {opportunity.shortDescription}
          </CardDescription>
        </CardHeader>

        {/* Konten Utama Kartu */}
        <CardContent className="pt-4 pb-2 space-y-3.5">
          {/* Estimasi Modal Awal */}
          <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block flex items-center gap-1 mb-0.5">
              <Wallet className="h-3.5 w-3.5 text-slate-400" />
              Estimasi Modal Awal (Simulasi)
            </span>
            <div className="text-sm font-extrabold text-slate-900">
              {formatRupiah(opportunity.minCapital)}
              {opportunity.maxCapital > opportunity.minCapital && (
                <span className="text-xs font-normal text-slate-500">
                  {' '}— {formatRupiah(opportunity.maxCapital)}
                </span>
              )}
            </div>
          </div>

          {/* Target Konsumen Utama */}
          <div className="text-xs text-slate-600 flex items-start gap-2">
            <Users className="h-4 w-4 text-brand-navy-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-800">Target Konsumen: </span>
              <span className="line-clamp-2">{opportunity.targetCustomer}</span>
            </div>
          </div>

          {/* Alasan Kecocokan Profil (Rationale) */}
          <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-3 text-xs text-slate-700 leading-relaxed">
            <div className="flex items-start gap-1.5">
              <Compass className="h-3.5 w-3.5 text-brand-navy-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-brand-navy-900 block text-[11px] uppercase tracking-wider mb-0.5">
                  Analisis Kesesuaian:
                </strong>
                <p className="text-xs text-slate-600 line-clamp-3">{rationaleText}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </div>

      {/* Footer Kartu: Tombol Aksi (AC-OPP-02.1 & AC-OPP-03.1) */}
      <CardFooter className="pt-3 pb-4 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-2">
        <Link href={`/opportunities/${opportunity.id}`} className="w-full sm:flex-1">
          <Button
            variant="outline"
            size="sm"
            fullWidth
            rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
            className="min-h-[44px]"
          >
            Detail Peluang
          </Button>
        </Link>

        <Link href={`/calculator?opportunityId=${opportunity.id}`} className="w-full sm:flex-1">
          <Button
            variant="emerald"
            size="sm"
            fullWidth
            leftIcon={<Calculator className="h-3.5 w-3.5" />}
            className="min-h-[44px]"
          >
            Simulasikan
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
