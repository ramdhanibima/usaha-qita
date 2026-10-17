'use client';

import React from 'react';
import { ShieldCheck, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ConsultationConsentBoxProps {
  explicitConsent: boolean;
  onConsentChange: (checked: boolean) => void;
  disclaimerAcknowledged: boolean;
  onDisclaimerChange: (checked: boolean) => void;
  consentError?: string;
  disclaimerError?: string;
  disabled?: boolean;
}

/**
 * Komponen Kotak Persetujuan Eksplisit & Penegakan Kepatuhan Etis (TASK-MNT-02, REQ-MANTRI-02, AC-MANTRI-02.1, AC-SYS-03.1).
 *
 * Persyaratan:
 * 1. Checkbox tidak tercentang secara default (defaultChecked = false).
 * 2. Teks klausul eksplisit tanpa ambiguitas.
 * 3. Touch target minimal 44x44px untuk kenyamanan perangkat mobile.
 * 4. State visual jelas antara belum dicentang dan sudah dicentang.
 */
export function ConsultationConsentBox({
  explicitConsent,
  onConsentChange,
  disclaimerAcknowledged,
  onDisclaimerChange,
  consentError,
  disclaimerError,
  disabled = false,
}: ConsultationConsentBoxProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6 transition-all duration-200 space-y-4">
      <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200/80">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-navy-100 text-brand-navy-700">
          <ShieldCheck className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-brand-navy-900">
            Persetujuan & Pernyataan Transparansi
          </h3>
          <p className="text-xs text-slate-500">
            Wajib disetujui sebelum mengajukan permohonan simulasi bimbingan
          </p>
        </div>
      </div>

      {/* Checkbox 1: Persetujuan Eksplisit Pembagian Data Bimbingan (AC-MANTRI-02.1) */}
      <div
        className={cn(
          'relative rounded-xl border p-4 transition-all duration-150',
          explicitConsent
            ? 'border-brand-emerald-400 bg-brand-emerald-50/40 shadow-sm'
            : consentError
            ? 'border-red-300 bg-red-50/40'
            : 'border-slate-200 bg-white hover:border-slate-300'
        )}
      >
        <label
          htmlFor="explicit-consent-checkbox"
          className="flex items-start gap-3.5 cursor-pointer min-h-[44px]"
        >
          <div className="flex items-center h-6">
            <input
              id="explicit-consent-checkbox"
              name="explicitConsentGiven"
              type="checkbox"
              checked={explicitConsent}
              onChange={(e) => onConsentChange(e.target.checked)}
              disabled={disabled}
              className="h-5 w-5 rounded border-slate-300 text-brand-navy-600 focus:ring-2 focus:ring-brand-navy-500 focus:ring-offset-1 disabled:opacity-50 cursor-pointer"
              aria-describedby={consentError ? 'consent-error-message' : undefined}
            />
          </div>
          <div className="text-xs sm:text-sm text-slate-700 leading-relaxed select-none">
            <span className="font-semibold text-slate-900">
              Persetujuan Penerusan Ringkasan Usaha:{' '}
            </span>
            &ldquo;Saya menyetujui ringkasan simulasi usaha ini diteruskan kepada
            Mantri BRI untuk keperluan bimbingan/konsultasi usaha dan saya memahami
            konsultasi ini bukan jaminan persetujuan pinjaman.&rdquo;
          </div>
        </label>
        {consentError && (
          <div
            id="consent-error-message"
            className="mt-2.5 flex items-center gap-1.5 text-xs font-medium text-red-600"
          >
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{consentError}</span>
          </div>
        )}
      </div>

      {/* Checkbox 2: Pemahaman Platform Simulasi & Batasan Etis (AC-SYS-03.1) */}
      <div
        className={cn(
          'relative rounded-xl border p-4 transition-all duration-150',
          disclaimerAcknowledged
            ? 'border-brand-emerald-400 bg-brand-emerald-50/40 shadow-sm'
            : disclaimerError
            ? 'border-red-300 bg-red-50/40'
            : 'border-slate-200 bg-white hover:border-slate-300'
        )}
      >
        <label
          htmlFor="disclaimer-acknowledged-checkbox"
          className="flex items-start gap-3.5 cursor-pointer min-h-[44px]"
        >
          <div className="flex items-center h-6">
            <input
              id="disclaimer-acknowledged-checkbox"
              name="disclaimerAcknowledged"
              type="checkbox"
              checked={disclaimerAcknowledged}
              onChange={(e) => onDisclaimerChange(e.target.checked)}
              disabled={disabled}
              className="h-5 w-5 rounded border-slate-300 text-brand-navy-600 focus:ring-2 focus:ring-brand-navy-500 focus:ring-offset-1 disabled:opacity-50 cursor-pointer"
              aria-describedby={disclaimerError ? 'disclaimer-error-message' : undefined}
            />
          </div>
          <div className="text-xs sm:text-sm text-slate-700 leading-relaxed select-none">
            <span className="font-semibold text-slate-900">
              Pemahaman Status Simulasi Mandiri:{' '}
            </span>
            Saya memahami bahwa Usaha Qita adalah sarana simulasi edukatif dan{' '}
            <strong>bukan aplikasi perbankan resmi dari PT Bank Rakyat Indonesia (Persero) Tbk</strong>.
            Tidak ada penarikan data perbankan rahasia, dan diskusi ini bertujuan
            mematangkan kesiapan manajemen usaha.
          </div>
        </label>
        {disclaimerError && (
          <div
            id="disclaimer-error-message"
            className="mt-2.5 flex items-center gap-1.5 text-xs font-medium text-red-600"
          >
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{disclaimerError}</span>
          </div>
        )}
      </div>

      <div className="rounded-xl bg-amber-50/80 p-3.5 border border-amber-200 text-xs text-amber-900 space-y-1">
        <div className="font-bold text-amber-950 flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-amber-700" />
          <span>Transparansi Penyimpanan Data Pribadi Lokal:</span>
        </div>
        <p className="leading-relaxed">
          Data kontak Anda (<strong>Nama Lengkap, Nomor WhatsApp, dan Lokasi Usaha</strong>)
          hanya disimpan secara lokal di memori peramban Anda (<em>browser localStorage</em>) untuk
          kebutuhan mencetak tiket simulasi digital ini. Data ini <strong>tidak dikirim ke server eksternal
          maupun sistem perbankan resmi BRI</strong>, dan Anda dapat menghapusnya sewaktu-waktu dari peramban.
        </p>
      </div>
    </div>
  );
}

