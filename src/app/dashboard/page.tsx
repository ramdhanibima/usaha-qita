'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Compass,
  DollarSign,
  MapPin,
  Briefcase,
  ArrowRight,
  Edit3,
  Trash2,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Modal, ModalFooter } from '@/components/ui/modal';
import { SkeletonLoader, SkeletonCard } from '@/components/ui/skeleton-loader';
import { useUserProfile } from '@/hooks/use-user-profile';
import { formatRupiah } from '@/lib/utils';
import type { BusinessGoal, ExperienceLevel, BusinessCategory } from '@/types/profile';

const GOAL_LABELS: Record<BusinessGoal, { label: string; desc: string }> = {
  start_new: {
    label: 'Mulai Usaha Baru',
    desc: 'Memulai rintisan usaha dari tahap perencanaan ide awal.',
  },
  grow_existing: {
    label: 'Kembangkan Usaha Berjalan',
    desc: 'Meningkatkan omzet, efisiensi operasional, dan laba bersih.',
  },
  expand_region: {
    label: 'Ekspansi ke Wilayah Baru',
    desc: 'Menilai peluang pembukaan cabang gerai baru di lokasi strategis.',
  },
};

const EXPERIENCE_LABELS: Record<ExperienceLevel, string> = {
  beginner: 'Pemula (Belum pernah usaha)',
  intermediate: 'Menengah (Pengalaman 1 - 2 tahun)',
  advanced: 'Mahir (> 2 tahun pengalaman)',
};

const CATEGORY_META: Record<BusinessCategory, { label: string; icon: string }> = {
  culinary: { label: 'Kuliner & Minuman', icon: '🍲' },
  retail: { label: 'Ritel & Toko Kelontong', icon: '🛒' },
  services: { label: 'Jasa & Pelayanan', icon: '✂️' },
  agribusiness: { label: 'Agribisnis & Peternakan', icon: '🌱' },
  creative: { label: 'Industri Kreatif & Kerajinan', icon: '🎨' },
};

export default function DashboardPage() {
  const router = useRouter();
  const { profile, isLoading, clearProfile } = useUserProfile();
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // 1. Loading State (AC-SYS-02.1)
  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 space-y-6">
        <div className="space-y-3">
          <SkeletonLoader variant="rectangular" className="h-8 w-64 rounded-lg" />
          <SkeletonLoader variant="text" className="h-4 w-96 max-w-full" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  // 2. Empty State (AC-SYS-02.1 & TASK-PROF-03)
  if (!profile) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-20 text-center">
        <Card className="border-dashed border-2 border-slate-300 p-8 sm:p-12 shadow-none">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-brand-navy-50 text-brand-navy-600 mb-4">
            <User className="h-8 w-8" />
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
            Belum Ada Profil Usaha Aktif
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            Anda belum mengisi profil rencana usaha. Lengkapi profil Anda sekarang untuk mendapatkan
            rekomendasi ide bisnis yang cocok dan simulasi finansial Break-Even Point (BEP).
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/onboarding" className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Mulai Isi Profil Usaha
              </Button>
            </Link>
            <Link href="/opportunities" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" fullWidth>
                Lihat Katalog Peluang Dulu
              </Button>
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="h-4 w-4 text-brand-emerald-600" />
            <span>Data tersimpan privat di peramban Anda (tanpa perlu mendaftar akun)</span>
          </div>
        </Card>
      </div>
    );
  }

  // 3. Default / Active Profile State (TASK-PROF-03)
  const goalInfo = GOAL_LABELS[profile.goal];

  const handleConfirmReset = () => {
    clearProfile();
    setIsResetModalOpen(false);
    router.push('/onboarding');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 space-y-8">
      {/* Header Dashboard & Sapaan */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-navy-600">
              Dashboard Wirausaha
            </span>
            <Badge variant="emerald" size="sm" dot>
              Profil Aktif
            </Badge>
            <Badge variant="neutral" size="sm">
              Tersimpan Lokal
            </Badge>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Selamat Datang, {profile.fullName}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-600">
            Berikut adalah ikhtisar rencana usaha dan kesiapan modal Anda saat ini.
          </p>
        </div>

        {/* Tombol Tindakan Profil */}
        <div className="flex items-center gap-2.5">
          <Link href="/onboarding">
            <Button variant="outline" size="sm" leftIcon={<Edit3 className="h-3.5 w-3.5" />}>
              Sunting Profil
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsResetModalOpen(true)}
            className="text-slate-500 hover:text-brand-danger-700 hover:bg-brand-danger-50"
            aria-label="Reset profil usaha"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Grid 4 Kartu Parameter Profil Utama */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Kartu 1: Modal Tersedia */}
        <Card className="border-brand-emerald-200 bg-brand-emerald-50/40">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-brand-emerald-900">Modal Awal Siap</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-emerald-100 text-brand-emerald-700">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-brand-emerald-900">
            {formatRupiah(profile.availableCapital)}
          </div>
          <p className="mt-1 text-xs text-brand-emerald-700">
            Alokasi dana untuk investasi awal & modal kerja
          </p>
        </Card>

        {/* Kartu 2: Tujuan Usaha */}
        <Card className="border-brand-navy-200 bg-brand-navy-50/40">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-brand-navy-900">Fokus Sasaran</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-navy-100 text-brand-navy-700">
              <Compass className="h-4 w-4" />
            </div>
          </div>
          <div className="text-base font-bold text-brand-navy-900">
            {goalInfo.label}
          </div>
          <p className="mt-1 text-xs text-brand-navy-700 line-clamp-1">
            {goalInfo.desc}
          </p>
        </Card>

        {/* Kartu 3: Lokasi Rencana */}
        <Card className="border-slate-200 bg-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-700">Wilayah Rencana</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
              <MapPin className="h-4 w-4" />
            </div>
          </div>
          <div className="text-base font-bold text-slate-900 line-clamp-1">
            {profile.location.regency}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {profile.location.province} {profile.location.district ? `• Kec. ${profile.location.district}` : ''}
          </p>
        </Card>

        {/* Kartu 4: Pengalaman */}
        <Card className="border-slate-200 bg-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-700">Tingkat Pengalaman</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
              <Briefcase className="h-4 w-4" />
            </div>
          </div>
          <div className="text-base font-bold text-slate-900">
            {EXPERIENCE_LABELS[profile.experience]}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Latar belakang kesiapan eksekusi operasional
          </p>
        </Card>
      </div>

      {/* Sektor Usaha yang Diminati */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Sektor Usaha yang Anda Minati</CardTitle>
              <CardDescription>
                Pilihan kategori ini digunakan untuk memprioritaskan rekomendasi peluang UMKM.
              </CardDescription>
            </div>
            <Badge variant="navy" size="md">
              {profile.preferredCategories.length} Sektor Dipilih
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {profile.preferredCategories.map((catKey) => {
              const meta = CATEGORY_META[catKey];
              return (
                <div
                  key={catKey}
                  className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/60"
                >
                  <span className="text-2xl select-none" aria-hidden="true">
                    {meta.icon}
                  </span>
                  <div>
                    <span className="text-sm font-bold text-slate-900 block">
                      {meta.label}
                    </span>
                    <span className="text-xs text-slate-500">Kategori Prioritas</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Alur Langkah Berikutnya (Quick Next Actions) */}
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-brand-navy-900 to-brand-navy-950 p-6 sm:p-8 text-white shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-brand-emerald-400">
              <Sparkles className="h-3.5 w-3.5" />
              Langkah Selanjutnya yang Direkomendasikan
            </div>
            <h2 className="text-xl font-bold sm:text-2xl">
              Eksplorasi Peluang & Uji Simulasi BEP
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Profil Anda siap dicocokkan dengan katalog simulasi UMKM Indonesia. Lihat proyeksi
              omzet, kalkulasi titik impas, dan buat rencana usaha yang matang.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link href="/opportunities">
              <Button
                variant="emerald"
                size="md"
                fullWidth
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Katalog Peluang
              </Button>
            </Link>
            <Link href="/calculator">
              <Button
                variant="outline"
                size="md"
                fullWidth
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
              >
                Kalkulator BEP
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Modal Konfirmasi Reset / Hapus Profil */}
      <Modal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title="Reset Profil Usaha?"
        description="Tindakan ini akan menghapus data profil yang tersimpan di peramban Anda."
        size="md"
      >
        <div className="py-2 text-xs sm:text-sm text-slate-600 leading-relaxed space-y-3">
          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-900">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <p>
              Setelah direset, data modal dan preferensi akan dihapus dari penyimpanan browser lokal.
              Anda dapat mengisi profil baru kapan saja melalui halaman onboarding.
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
            leftIcon={<Trash2 className="h-4 w-4" />}
          >
            Ya, Hapus Profil
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
