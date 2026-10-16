'use client';

import React, { useState, useEffect } from 'react';
import {
  Send,
  CheckCircle,
  Briefcase,
  AlertTriangle,
} from 'lucide-react';
import {
  consultationRequestSchema,
  ConsultationFormData,
} from '@/domain/validation/consultation.schema';
import { ConsultationRequest, BusinessTopic } from '@/types/consultation';
import { consultationRepository } from '@/adapters/repositories/consultation.repository';
import { useUserProfile } from '@/hooks/use-user-profile';
import { InputField } from '@/components/ui/input-field';
import { SelectDropdown } from '@/components/ui/select-dropdown';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ConsultationConsentBox } from './consultation-consent-box';
import { formatRupiah } from '@/lib/formatters';

export interface ConsultationFormProps {
  onSubmitSuccess: (ticket: ConsultationRequest) => void;
  initialTopic?: BusinessTopic;
}

const TOPIC_OPTIONS = [
  {
    value: 'financial_literacy',
    label: 'Literasi Finansial & Pemisahan Uang Usaha',
  },
  {
    value: 'cashflow_management',
    label: 'Manajemen Arus Kas & Pengendalian Biaya Operasional',
  },
  {
    value: 'business_expansion',
    label: 'Rencana Ekspansi & Penambahan Modal Usaha',
  },
  {
    value: 'general_advice',
    label: 'Konsultasi Umum Rintisan Usaha Baru',
  },
];

/**
 * Komponen Form Pengajuan Konsultasi Mantri BRI (TASK-MNT-01, REQ-MANTRI-01, AC-MANTRI-01.1, AC-MANTRI-02.1).
 *
 * Mengelola:
 * 1. Validasi runtime Zod (Nama, WA Indonesia, Lokasi, Topik).
 * 2. Tanda validasi visual hijau jika input valid.
 * 3. Prefill otomatis dari profil pengguna yang tersimpan di safeStorage.
 * 4. Integrasi kotak persetujuan eksplisit (Consent Box).
 * 5. Penonaktifan (disabled) tombol submit jika syarat belum terpenuhi.
 */
interface ConsultationInputState {
  fullName: string;
  phoneNumber: string;
  preferredLocation: string;
  businessTopic: BusinessTopic;
  notes: string;
  explicitConsentGiven: boolean;
  disclaimerAcknowledged: boolean;
}

export function ConsultationForm({
  onSubmitSuccess,
  initialTopic = 'financial_literacy',
}: ConsultationFormProps) {
  const { profile, isInitialized } = useUserProfile();

  const [formData, setFormData] = useState<ConsultationInputState>({
    fullName: '',
    phoneNumber: '',
    preferredLocation: '',
    businessTopic: initialTopic,
    notes: '',
    explicitConsentGiven: false,
    disclaimerAcknowledged: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Prefill otomatis data pemohon dari profil tersimpan (jika ada)
  useEffect(() => {
    if (isInitialized && profile) {
      setFormData((prev) => {
        const updated = { ...prev };
        if (!prev.fullName && profile.fullName) {
          updated.fullName = profile.fullName;
        }
        if (!prev.preferredLocation && profile.location) {
          const locParts = [
            profile.location.district ? `Kec. ${profile.location.district}` : null,
            profile.location.regency,
            profile.location.province,
          ].filter(Boolean);
          if (locParts.length > 0) {
            updated.preferredLocation = locParts.join(', ');
          }
        }
        return updated;
      });
    }
  }, [isInitialized, profile]);

  // Validasi reaktif field per field
  const validateField = (field: keyof ConsultationInputState, value: unknown) => {
    try {
      const fieldSchema = consultationRequestSchema.shape[field as keyof ConsultationFormData];
      if (fieldSchema) {
        fieldSchema.parse(value);
        setErrors((prev) => {
          const next = { ...prev };
          delete next[field];
          return next;
        });
      }
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'errors' in err) {
        const zodErrors = (err as { errors: Array<{ message: string }> }).errors;
        if (zodErrors && zodErrors.length > 0) {
          setErrors((prev) => ({ ...prev, [field]: zodErrors[0].message }));
        }
      }
    }
  };

  const handleTextChange = (field: keyof ConsultationInputState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      validateField(field, value);
    }
  };

  const handleBlur = (field: keyof ConsultationInputState) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field, formData[field]);
  };

  const handleConsentChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, explicitConsentGiven: checked }));
    setTouched((prev) => ({ ...prev, explicitConsentGiven: true }));
    validateField('explicitConsentGiven', checked);
  };

  const handleDisclaimerChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, disclaimerAcknowledged: checked }));
    setTouched((prev) => ({ ...prev, disclaimerAcknowledged: true }));
    validateField('disclaimerAcknowledged', checked);
  };

  // Evaluasi validitas keseluruhan skema Zod
  const validationResult = consultationRequestSchema.safeParse(formData);
  const isFormValid = validationResult.success;

  // Tombol ajukan wajib disabled jika belum dicentang atau data tidak valid (AC-MANTRI-02.1)
  const isSubmitDisabled =
    !isFormValid ||
    !formData.explicitConsentGiven ||
    !formData.disclaimerAcknowledged ||
    isSubmitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionError(null);

    // Tandai semua field sebagai disentuh
    setTouched({
      fullName: true,
      phoneNumber: true,
      preferredLocation: true,
      businessTopic: true,
      explicitConsentGiven: true,
      disclaimerAcknowledged: true,
    });

    const parsed = consultationRequestSchema.safeParse(formData);
    if (!parsed.success) {
      const newErrors: Record<string, string> = {};
      parsed.error.errors.forEach((err) => {
        const path = err.path[0] as string;
        if (!newErrors[path]) {
          newErrors[path] = err.message;
        }
      });
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Siapkan snapshot profil usaha jika profil pengguna tersedia
      const snapshot = profile
        ? {
            category:
              profile.preferredCategories && profile.preferredCategories.length > 0
                ? profile.preferredCategories[0]
                : 'Usaha Mandiri',
            plannedCapital: profile.availableCapital || 10000000,
            projectedNetProfit: Math.round((profile.availableCapital || 10000000) * 0.18),
          }
        : {
            category: 'Usaha Mandiri',
            plannedCapital: 10000000,
            projectedNetProfit: 1800000,
          };

      const newTicket = await consultationRepository.createSimulationRequest({
        fullName: parsed.data.fullName,
        phoneNumber: parsed.data.phoneNumber,
        preferredLocation: parsed.data.preferredLocation,
        businessTopic: parsed.data.businessTopic as BusinessTopic,
        notes: parsed.data.notes,
        explicitConsentGiven: parsed.data.explicitConsentGiven,
        disclaimerAcknowledged: parsed.data.disclaimerAcknowledged,
        businessProfileSnapshot: snapshot,
      });

      onSubmitSuccess(newTicket);
    } catch (err: unknown) {
      setSubmissionError(
        err instanceof Error ? err.message : 'Terjadi kendala saat menerbitkan tiket simulasi.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Indikator validasi visual hijau (AC-MANTRI-01.1)
  const isFieldValid = (field: keyof ConsultationInputState): boolean => {
    return Boolean(touched[field] && !errors[field] && formData[field]);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Kartu Informasi Snapshot Profil Jika Tersedia */}
      {profile && (
        <div className="rounded-2xl border border-brand-navy-200 bg-brand-navy-50/50 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand-navy-600 text-white">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-navy-700">
                  Profil Usaha Terdeteksi
                </span>
                <Badge variant="simulation">Data simulasi</Badge>
              </div>
              <p className="text-sm font-semibold text-slate-800">
                {profile.fullName || 'Calon Wirausaha'} • Modal Rencana:{' '}
                {formatRupiah(profile.availableCapital)}
              </p>
            </div>
          </div>
          <span className="text-xs text-slate-500 bg-white/80 px-2.5 py-1 rounded-lg border border-slate-200">
            Terisi Otomatis
          </span>
        </div>
      )}

      {/* Field: Nama Lengkap */}
      <div className="relative">
        <InputField
          id="fullName"
          name="fullName"
          label="Nama Lengkap Pemohon"
          placeholder="Contoh: Budi Santoso"
          value={formData.fullName || ''}
          onChange={(e) => handleTextChange('fullName', e.target.value)}
          onBlur={() => handleBlur('fullName')}
          error={touched.fullName ? errors.fullName : undefined}
          required
          helperText="Gunakan nama sesuai identitas Anda"
        />
        {isFieldValid('fullName') && (
          <div
            className="absolute right-3.5 top-9 flex items-center text-brand-emerald-600"
            aria-label="Validasi nama berhasil"
          >
            <CheckCircle className="h-5 w-5" />
          </div>
        )}
      </div>

      {/* Field: Nomor WhatsApp Indonesia */}
      <div className="relative">
        <InputField
          id="phoneNumber"
          name="phoneNumber"
          type="tel"
          label="Nomor WhatsApp Aktif"
          placeholder="Contoh: 081234567890 atau +6281234567890"
          value={formData.phoneNumber || ''}
          onChange={(e) => handleTextChange('phoneNumber', e.target.value)}
          onBlur={() => handleBlur('phoneNumber')}
          error={touched.phoneNumber ? errors.phoneNumber : undefined}
          required
          helperText="Format nomor ponsel Indonesia (dimulai dengan 08, 628, atau +628)"
        />
        {isFieldValid('phoneNumber') && (
          <div
            className="absolute right-3.5 top-9 flex items-center text-brand-emerald-600"
            aria-label="Validasi nomor WhatsApp berhasil"
          >
            <CheckCircle className="h-5 w-5" />
          </div>
        )}
      </div>

      {/* Field: Lokasi / Unit Kerja Terdekat */}
      <div className="relative">
        <InputField
          id="preferredLocation"
          name="preferredLocation"
          label="Lokasi Usaha / Kecamatan Terdekat"
          placeholder="Contoh: Kec. Coblong, Kota Bandung, Jawa Barat"
          value={formData.preferredLocation || ''}
          onChange={(e) => handleTextChange('preferredLocation', e.target.value)}
          onBlur={() => handleBlur('preferredLocation')}
          error={touched.preferredLocation ? errors.preferredLocation : undefined}
          required
          helperText="Lokasi ini digunakan untuk mencocokkan Mantri pembina wilayah terdekat"
        />
        {isFieldValid('preferredLocation') && (
          <div
            className="absolute right-3.5 top-9 flex items-center text-brand-emerald-600"
            aria-label="Validasi lokasi berhasil"
          >
            <CheckCircle className="h-5 w-5" />
          </div>
        )}
      </div>

      {/* Field: Topik Bimbingan */}
      <div>
        <SelectDropdown
          id="businessTopic"
          name="businessTopic"
          label="Topik Bimbingan yang Diinginkan"
          options={TOPIC_OPTIONS}
          value={formData.businessTopic || 'financial_literacy'}
          onChange={(e) => handleTextChange('businessTopic', e.target.value)}
          onBlur={() => handleBlur('businessTopic')}
          error={touched.businessTopic ? errors.businessTopic : undefined}
          required
          helperText="Pilih area yang paling membutuhkan pendampingan saat ini"
        />
      </div>

      {/* Field: Catatan Tambahan (Opsional) */}
      <div className="space-y-1.5">
        <label
          htmlFor="notes"
          className="block text-sm font-semibold text-slate-800"
        >
          Catatan Tambahan (Opsional)
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          maxLength={500}
          value={formData.notes || ''}
          onChange={(e) => handleTextChange('notes', e.target.value)}
          placeholder="Ceritakan gambaran singkat usaha yang sedang atau ingin Anda jalankan..."
          className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-navy-600 focus:outline-none focus:ring-2 focus:ring-brand-navy-600/20"
        />
        <div className="flex justify-between text-xs text-slate-400">
          <span>Maksimal 500 karakter</span>
          <span>{(formData.notes || '').length}/500</span>
        </div>
      </div>

      {/* Kotak Persetujuan Eksplisit & Kepatuhan Etis (TASK-MNT-02) */}
      <ConsultationConsentBox
        explicitConsent={Boolean(formData.explicitConsentGiven)}
        onConsentChange={handleConsentChange}
        disclaimerAcknowledged={Boolean(formData.disclaimerAcknowledged)}
        onDisclaimerChange={handleDisclaimerChange}
        consentError={touched.explicitConsentGiven ? errors.explicitConsentGiven : undefined}
        disclaimerError={
          touched.disclaimerAcknowledged ? errors.disclaimerAcknowledged : undefined
        }
        disabled={isSubmitting}
      />

      {/* Pesan Kesalahan Submission Jika Ada */}
      {submissionError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-bold">Gagal Menerbitkan Tiket</div>
            <div>{submissionError}</div>
          </div>
        </div>
      )}

      {/* Tombol Submit Pengajuan (AC-MANTRI-02.1) */}
      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isSubmitDisabled}
          isLoading={isSubmitting}
          className="w-full min-h-[48px] text-base font-bold shadow-md bg-brand-navy-600 hover:bg-brand-navy-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="mr-2 h-5 w-5" />
          <span>Ajukan Jadwal Konsultasi</span>
        </Button>

        {!formData.explicitConsentGiven && (
          <p className="mt-2 text-center text-xs text-slate-500">
            * Tombol pengajuan akan aktif setelah Anda mencentang kotak persetujuan di atas.
          </p>
        )}
      </div>
    </form>
  );
}
