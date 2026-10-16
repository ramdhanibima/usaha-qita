'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Compass,
  DollarSign,
  MapPin,
  Briefcase,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { InputField } from '@/components/ui/input-field';
import { SelectDropdown } from '@/components/ui/select-dropdown';
import { Badge } from '@/components/ui/badge';
import { useUserProfile } from '@/hooks/use-user-profile';
import { userProfileSchema } from '@/domain/validation/profile.schema';
import { formatRupiah, parseRupiah } from '@/lib/utils';
import type { BusinessGoal, ExperienceLevel, BusinessCategory } from '@/types/profile';

// Daftar opsi provinsi Indonesia untuk kemudahan pengguna
const PROVINCE_OPTIONS = [
  { value: 'DKI Jakarta', label: 'DKI Jakarta' },
  { value: 'Jawa Barat', label: 'Jawa Barat' },
  { value: 'Jawa Tengah', label: 'Jawa Tengah' },
  { value: 'Jawa Timur', label: 'Jawa Timur' },
  { value: 'Banten', label: 'Banten' },
  { value: 'D.I. Yogyakarta', label: 'D.I. Yogyakarta' },
  { value: 'Bali', label: 'Bali' },
  { value: 'Sumatera Utara', label: 'Sumatera Utara' },
  { value: 'Sumatera Barat', label: 'Sumatera Barat' },
  { value: 'Riau', label: 'Riau' },
  { value: 'Sulawesi Selatan', label: 'Sulawesi Selatan' },
  { value: 'Kalimantan Timur', label: 'Kalimantan Timur' },
  { value: 'Lainnya', label: 'Provinsi Lainnya' },
];

const GOAL_OPTIONS: { value: BusinessGoal; label: string; desc: string }[] = [
  {
    value: 'start_new',
    label: 'Mulai Usaha Baru',
    desc: 'Memulai dari nol dengan ide usaha yang cocok dan perhitungan modal terukur.',
  },
  {
    value: 'grow_existing',
    label: 'Kembangkan Usaha Berjalan',
    desc: 'Meningkatkan omzet, laba bersih, atau menambah variasi produk usaha saat ini.',
  },
  {
    value: 'expand_region',
    label: 'Ekspansi ke Wilayah Baru',
    desc: 'Membuka gerai atau cabang baru dan menilai potensi daya beli pasar lokal.',
  },
];

const EXPERIENCE_OPTIONS: { value: ExperienceLevel; label: string; desc: string }[] = [
  {
    value: 'beginner',
    label: 'Pemula',
    desc: 'Belum pernah menjalankan usaha sendiri sebelumnya.',
  },
  {
    value: 'intermediate',
    label: 'Menengah',
    desc: 'Pernah mengelola usaha selama 1 - 2 tahun.',
  },
  {
    value: 'advanced',
    label: 'Mahir / Berpengalaman',
    desc: 'Telah berpengalaman lebih dari 2 tahun dalam bisnis.',
  },
];

const CATEGORY_OPTIONS: { value: BusinessCategory; label: string; desc: string; icon: string }[] = [
  {
    value: 'culinary',
    label: 'Kuliner & Minuman',
    desc: 'Makanan siap saji, kedai kopi, katering, aneka cemilan.',
    icon: '🍲',
  },
  {
    value: 'retail',
    label: 'Ritel & Toko Kelontong',
    desc: 'Warung sembako, toko busana, agen kebutuhan pokok.',
    icon: '🛒',
  },
  {
    value: 'services',
    label: 'Jasa & Pelayanan',
    desc: 'Laundry kiloan, cuci motor, pangkas rambut, servis alat.',
    icon: '✂️',
  },
  {
    value: 'agribusiness',
    label: 'Agribisnis & Peternakan',
    desc: 'Hidroponik, budidaya ikan lele, peternakan unggas rakyat.',
    icon: '🌱',
  },
  {
    value: 'creative',
    label: 'Industri Kreatif & Kerajinan',
    desc: 'Desain sablon, kerajinan lokal, hampers cinderamata.',
    icon: '🎨',
  },
];

const QUICK_CAPITAL_OPTIONS = [5000000, 10000000, 20000000, 50000000];

export default function OnboardingPage() {
  const router = useRouter();
  const { profile, saveProfile } = useUserProfile();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 5;

  // Form State
  const [fullName, setFullName] = useState<string>('');
  const [goal, setGoal] = useState<BusinessGoal>('start_new');
  const [capitalInput, setCapitalInput] = useState<string>('10000000');
  const [availableCapital, setAvailableCapital] = useState<number>(10000000);
  const [province, setProvince] = useState<string>('Jawa Barat');
  const [regency, setRegency] = useState<string>('Kota Bandung');
  const [district, setDistrict] = useState<string>('');
  const [experience, setExperience] = useState<ExperienceLevel>('beginner');
  const [preferredCategories, setPreferredCategories] = useState<BusinessCategory[]>([
    'culinary',
  ]);

  // Validation Errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Muat data profil yang sudah ada jika pengguna ingin menyunting (prefill)
  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || '');
      setGoal(profile.goal || 'start_new');
      setAvailableCapital(profile.availableCapital || 10000000);
      setCapitalInput(String(profile.availableCapital || 10000000));
      setProvince(profile.location.province || 'Jawa Barat');
      setRegency(profile.location.regency || 'Kota Bandung');
      setDistrict(profile.location.district || '');
      setExperience(profile.experience || 'beginner');
      setPreferredCategories(profile.preferredCategories || ['culinary']);
    }
  }, [profile]);

  // Handler toggle kategori minat
  const handleToggleCategory = (cat: BusinessCategory) => {
    setPreferredCategories((prev) => {
      const exists = prev.includes(cat);
      if (exists) {
        return prev.filter((c) => c !== cat);
      } else {
        return [...prev, cat];
      }
    });
  };

  // Handler perubahan modal
  const handleCapitalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const parsed = parseRupiah(rawValue);
    setCapitalInput(rawValue);
    setAvailableCapital(parsed);

    if (parsed < 500000) {
      setErrors((prev) => ({
        ...prev,
        availableCapital: 'Modal awal minimal Rp 500.000 untuk simulasi yang realistis',
      }));
    } else {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.availableCapital;
        return next;
      });
    }
  };

  // Validasi per langkah (AC-PROF-01.1)
  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return fullName.trim().length >= 3 && Boolean(goal);
      case 2:
        return availableCapital >= 500000;
      case 3:
        return province.trim().length > 0 && regency.trim().length > 0;
      case 4:
        return Boolean(experience) && preferredCategories.length >= 1;
      case 5:
        return true;
      default:
        return false;
    }
  };

  // Handler navigasi langkah
  const handleNext = () => {
    if (!isStepValid(currentStep)) return;
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handler simpan profil akhir (TASK-PROF-02, AC-PROF-03.1)
  const handleSubmitProfile = () => {
    const formData = {
      fullName,
      goal,
      availableCapital,
      location: {
        province,
        regency,
        district: district || undefined,
      },
      experience,
      preferredCategories,
    };

    const validation = userProfileSchema.safeParse(formData);
    if (!validation.success) {
      const formattedErrors: { [key: string]: string } = {};
      validation.error.errors.forEach((err) => {
        const path = err.path.join('.');
        formattedErrors[path] = err.message;
      });
      setErrors(formattedErrors);
      return;
    }

    const saved = saveProfile(validation.data);
    if (saved) {
      router.push('/dashboard');
    } else {
      setErrors({ form: 'Terjadi kendala saat menyimpan profil. Silakan coba lagi.' });
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Header Alur Onboarding */}
      <div className="text-center mb-8">
        <Badge variant="navy" size="md" className="mb-2">
          Langkah {currentStep} dari {totalSteps}
        </Badge>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          Rencanakan Profil Usaha Anda
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
          Bantu kami memahami tujuan dan kesiapan modal Anda untuk mencocokkan simulasi peluang UMKM
          yang paling sesuai.
        </p>

        {/* Indikator Progres Bar Responsif */}
        <div className="mt-6 w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-brand-navy-600 h-2.5 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            role="progressbar"
            aria-valuenow={(currentStep / totalSteps) * 100}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>

      {/* Konten Formulir Berdasarkan Langkah Aktif */}
      <Card className="shadow-md border-slate-200">
        <CardContent className="p-6 sm:p-8 space-y-6">
          {/* LANGKAH 1: IDENTITAS & TUJUAN USAHA */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 text-brand-navy-700 mb-1">
                  <Compass className="h-5 w-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Langkah 1</span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                  Siapa nama Anda dan apa tujuan usaha utama Anda?
                </h2>
              </div>

              <InputField
                label="Nama Lengkap Pemilik Usaha"
                required
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (e.target.value.trim().length >= 3) {
                    setErrors((prev) => {
                      const next = { ...prev };
                      delete next.fullName;
                      return next;
                    });
                  }
                }}
                placeholder="Contoh: Budi Santoso"
                helperText="Nama ini akan digunakan untuk sapaan dan ringkasan konsultasi bimbingan."
                error={
                  fullName.length > 0 && fullName.trim().length < 3
                    ? 'Nama lengkap minimal 3 karakter'
                    : errors['fullName']
                }
              />

              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-800 block">
                  Pilih Tujuan Usaha Anda <span className="text-brand-danger-600">*</span>
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {GOAL_OPTIONS.map((item) => {
                    const isSelected = goal === item.value;
                    return (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => setGoal(item.value)}
                        className={`text-left p-4 rounded-xl border-2 transition-all flex items-start justify-between min-h-[44px] ${
                          isSelected
                            ? 'border-brand-navy-600 bg-brand-navy-50/60 shadow-xs'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="pr-4">
                          <span className="font-bold text-sm text-slate-900 block">
                            {item.label}
                          </span>
                          <span className="text-xs text-slate-600 mt-1 block leading-relaxed">
                            {item.desc}
                          </span>
                        </div>
                        <div
                          className={`h-5 w-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                            isSelected
                              ? 'border-brand-navy-600 bg-brand-navy-600 text-white'
                              : 'border-slate-300'
                          }`}
                        >
                          {isSelected && <Check className="h-3 w-3" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* LANGKAH 2: KESIAPAN MODAL AWAL */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 text-brand-emerald-700 mb-1">
                  <DollarSign className="h-5 w-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Langkah 2</span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                  Berapa alokasi modal awal yang Anda miliki saat ini?
                </h2>
              </div>

              <InputField
                label="Nominal Modal Tersedia (Rupiah)"
                required
                type="text"
                value={capitalInput}
                onChange={handleCapitalChange}
                placeholder="Contoh: 15.000.000"
                helperText={`Terbaca: ${formatRupiah(availableCapital)}`}
                error={errors.availableCapital}
              />

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 block">
                  Atau pilih opsi cepat modal awal:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {QUICK_CAPITAL_OPTIONS.map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => {
                        setAvailableCapital(val);
                        setCapitalInput(String(val));
                        setErrors((prev) => {
                          const next = { ...prev };
                          delete next.availableCapital;
                          return next;
                        });
                      }}
                      className={`py-2 px-3 text-xs font-bold rounded-lg border text-center transition min-h-[44px] ${
                        availableCapital === val
                          ? 'border-brand-emerald-600 bg-brand-emerald-50 text-brand-emerald-800'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {formatRupiah(val)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4 text-xs text-blue-900 leading-relaxed">
                <p className="font-semibold mb-1">💡 Tips Penentuan Modal Realistis:</p>
                <p>
                  Sistem kami menetapkan batas minimum modal Rp 500.000 agar rencana pengadaan bahan baku
                  dan operasional tetap memiliki daya tahan di fase rintisan awal.
                </p>
              </div>
            </div>
          )}

          {/* LANGKAH 3: LOKASI USAHA */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 text-brand-amber-700 mb-1">
                  <MapPin className="h-5 w-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Langkah 3</span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                  Di mana rencana lokasi wilayah operasional usaha Anda?
                </h2>
              </div>

              <SelectDropdown
                label="Provinsi"
                required
                options={PROVINCE_OPTIONS}
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                helperText="Pilih provinsi tempat basis usaha direncanakan."
              />

              <InputField
                label="Kota / Kabupaten"
                required
                value={regency}
                onChange={(e) => setRegency(e.target.value)}
                placeholder="Contoh: Kota Bandung, Kab. Sleman, Jakarta Selatan"
                helperText="Karakteristik biaya sewa dan daya beli akan mengacu pada area ini."
              />

              <InputField
                label="Kecamatan (Opsional)"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="Contoh: Coblong, Sukajadi, Depok"
                helperText="Membantu Mantri BRI memetakan kedekatan lokasi unit kerja binaan."
              />
            </div>
          )}

          {/* LANGKAH 4: PENGALAMAN & KATEGORI MINAT */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 text-brand-navy-700 mb-1">
                  <Briefcase className="h-5 w-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Langkah 4</span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                  Pengalaman Anda dan sektor usaha yang diminati
                </h2>
              </div>

              {/* Tingkat Pengalaman */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-800 block">
                  Tingkat Pengalaman Berwirausaha <span className="text-brand-danger-600">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {EXPERIENCE_OPTIONS.map((item) => {
                    const isSelected = experience === item.value;
                    return (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => setExperience(item.value)}
                        className={`text-left p-3.5 rounded-xl border-2 transition-all flex flex-col justify-between min-h-[44px] ${
                          isSelected
                            ? 'border-brand-navy-600 bg-brand-navy-50/70 shadow-xs'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <span className="font-bold text-sm text-slate-900">{item.label}</span>
                        <span className="text-xs text-slate-500 mt-1 leading-normal">
                          {item.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Kategori Minat */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-800">
                    Sektor Usaha yang Menarik Minat Anda{' '}
                    <span className="text-brand-danger-600">*</span>
                  </label>
                  <span className="text-xs text-slate-500">
                    Dipilih: {preferredCategories.length} kategori
                  </span>
                </div>

                {preferredCategories.length === 0 && (
                  <p className="text-xs font-medium text-brand-danger-600 animate-shake">
                    Pilih minimal 1 kategori usaha yang menarik minat Anda (AC-PROF-02.2).
                  </p>
                )}

                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {CATEGORY_OPTIONS.map((item) => {
                    const isChecked = preferredCategories.includes(item.value);
                    return (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => handleToggleCategory(item.value)}
                        className={`text-left p-3.5 rounded-xl border-2 transition-all flex items-start gap-3 min-h-[44px] ${
                          isChecked
                            ? 'border-brand-navy-600 bg-brand-navy-50/60 shadow-xs'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <span className="text-2xl select-none" aria-hidden="true">
                          {item.icon}
                        </span>
                        <div className="flex-1">
                          <span className="text-sm font-bold text-slate-900 block">
                            {item.label}
                          </span>
                          <span className="text-xs text-slate-500 block leading-tight mt-0.5">
                            {item.desc}
                          </span>
                        </div>
                        <div
                          className={`h-5 w-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${
                            isChecked
                              ? 'border-brand-navy-600 bg-brand-navy-600 text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isChecked && <Check className="h-3.5 w-3.5" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* LANGKAH 5: RINGKASAN & KONFIRMASI SIMPAN */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 text-brand-emerald-700 mb-1">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Langkah 5 (Akhir)</span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                  Periksa Ringkasan Profil Rencana Usaha Anda
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Pastikan informasi berikut sudah sesuai sebelum disimpan ke penyimpanan lokal browser.
                </p>
              </div>

              {/* Ringkasan Isian */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-200">
                  <div>
                    <span className="text-xs text-slate-500 block">Nama Lengkap Pemilik</span>
                    <span className="text-sm font-bold text-slate-900">{fullName}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">Tujuan Utama</span>
                    <span className="text-sm font-bold text-brand-navy-700">
                      {GOAL_OPTIONS.find((g) => g.value === goal)?.label}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-200">
                  <div>
                    <span className="text-xs text-slate-500 block">Modal Awal Tersedia</span>
                    <span className="text-base font-extrabold text-brand-emerald-700">
                      {formatRupiah(availableCapital)}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">Tingkat Pengalaman</span>
                    <span className="text-sm font-bold text-slate-800">
                      {EXPERIENCE_OPTIONS.find((e) => e.value === experience)?.label}
                    </span>
                  </div>
                </div>

                <div className="pb-4 border-b border-slate-200">
                  <span className="text-xs text-slate-500 block mb-1">Lokasi Rencana</span>
                  <p className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    <span>
                      {regency}, {province} {district ? `(Kec. ${district})` : ''}
                    </span>
                  </p>
                </div>

                <div>
                  <span className="text-xs text-slate-500 block mb-2">
                    Kategori Usaha Terpilih ({preferredCategories.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {preferredCategories.map((catKey) => {
                      const item = CATEGORY_OPTIONS.find((c) => c.value === catKey);
                      return (
                        <Badge key={catKey} variant="navy" size="md">
                          {item?.icon} {item?.label}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Jaminan Privasi & Penyimpanan Lokal */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-brand-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-600 leading-relaxed">
                  <strong className="text-slate-900 block mb-0.5">
                    Penyimpanan Lokal Terproteksi (Zero Cloud Leakage):
                  </strong>
                  Profil ini disimpan langsung di browser perangkat Anda (`localStorage`). Usaha Qita
                  tidak mengirim data pribadi Anda ke database pihak ketiga tanpa persetujuan eksplisit.
                </div>
              </div>

              {errors.form && (
                <p className="text-xs font-semibold text-brand-danger-700 bg-brand-danger-50 p-3 rounded-lg border border-brand-danger-200">
                  {errors.form}
                </p>
              )}
            </div>
          )}
        </CardContent>

        {/* Footer Tombol Navigasi Antar-Langkah */}
        <CardFooter className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 p-6 border-t border-slate-100 bg-slate-50/50">
          {currentStep > 1 ? (
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              leftIcon={<ArrowLeft className="h-4 w-4" />}
              className="w-full sm:w-auto min-h-[44px]"
            >
              Kembali
            </Button>
          ) : (
            <div className="hidden sm:block" />
          )}

          {currentStep < totalSteps ? (
            <Button
              type="button"
              variant="primary"
              onClick={handleNext}
              disabled={!isStepValid(currentStep)}
              rightIcon={<ArrowRight className="h-4 w-4" />}
              className="w-full sm:w-auto min-h-[44px]"
            >
              Lanjutkan ke Langkah {currentStep + 1}
            </Button>
          ) : (
            <Button
              type="button"
              variant="emerald"
              onClick={handleSubmitProfile}
              rightIcon={<Sparkles className="h-4 w-4" />}
              className="w-full sm:w-auto min-h-[44px]"
            >
              Simpan Profil & Buka Dashboard
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
