import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Calculator,
  Compass,
  MessageSquare,
  CheckCircle2,
  Coffee,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatRupiah } from '@/lib/utils';

export default function HomePage() {
  return (
    <div className="flex flex-col gap-12 pb-16 sm:gap-16 sm:pb-24">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-navy-50/70 via-white to-slate-50 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
          <div className="flex flex-col items-center text-center">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-navy-200 bg-white px-3.5 py-1.5 shadow-xs">
              <Sparkles className="h-4 w-4 text-brand-navy-600 animate-pulse" />
              <span className="text-xs font-semibold text-brand-navy-800">
                Solusi Perencanaan & Edukasi Wirausaha Mandiri
              </span>
            </div>

            {/* Headline */}
            <h1 className="mt-5 max-w-4xl text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl sm:leading-tight">
              Mulai & Kembangkan Usaha Anda dengan{' '}
              <span className="text-brand-navy-600">Perhitungan Terukur</span>
            </h1>

            {/* Subheadline */}
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-lg sm:leading-relaxed">
              Temukan peluang usaha sesuai modal dan minat, simulasikan Break-Even Point (BEP)
              secara presisi, ikuti panduan roadmap langkah demi langkah, dan persiapkan rencana Anda
              sebelum berkonsultasi bersama Mantri BRI.
            </p>

            {/* Tombol Aksi Utama (CTA) */}
            <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-center">
              <Link href="/onboarding" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="primary"
                  fullWidth
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Mulai Rencana Usaha
                </Button>
              </Link>
              <Link href="/opportunities" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" fullWidth>
                  Lihat Katalog Peluang
                </Button>
              </Link>
            </div>

            {/* Pilar Kepercayaan Ringkas */}
            <div className="mt-10 grid grid-cols-2 gap-4 border-t border-slate-200/80 pt-8 sm:grid-cols-3 sm:gap-8">
              <div className="flex flex-col items-center">
                <span className="text-xl font-extrabold text-brand-navy-900 sm:text-2xl">
                  100%
                </span>
                <span className="mt-0.5 text-xs text-slate-500">Matematika Deterministik</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xl font-extrabold text-brand-emerald-700 sm:text-2xl">
                  Transparan
                </span>
                <span className="mt-0.5 text-xs text-slate-500">Label Data Simulasi</span>
              </div>
              <div className="col-span-2 flex flex-col items-center sm:col-span-1">
                <span className="text-xl font-extrabold text-brand-amber-700 sm:text-2xl">
                  Responsif
                </span>
                <span className="mt-0.5 text-xs text-slate-500">Mobile-First (360px+)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 4 Pilar Fitur Kunci Usaha Qita */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Badge variant="navy" size="md">
            Fitur Terintegrasi
          </Badge>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Semua yang Anda Butuhkan untuk Memulai Usaha
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-xs sm:text-sm text-slate-600">
            Dari pemetaan ide awal hingga bimbingan lapangan, dirancang khusus agar mudah dipahami
            oleh siapa saja, bahkan bagi pemula yang belum pernah berwirausaha.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Pilar 1: Peluang Usaha */}
          <Card hoverable className="flex flex-col justify-between">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-navy-50 text-brand-navy-600 mb-4">
                <Compass className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Kurasi Peluang Usaha</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Pilihan ide usaha terkurasi (kuliner, ritel, jasa, kreatif, agribisnis) dengan asumsi
                modal awal dan estimasi rasional sesuai karakteristik pasar lokal.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <Badge variant="simulation" size="sm" />
              <Link
                href="/opportunities"
                className="text-xs font-semibold text-brand-navy-600 hover:text-brand-navy-800"
              >
                Jelajahi &rarr;
              </Link>
            </div>
          </Card>

          {/* Pilar 2: Kalkulator BEP */}
          <Card hoverable className="flex flex-col justify-between">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-emerald-50 text-brand-emerald-600 mb-4">
                <Calculator className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Kalkulator BEP & Finansial</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Simulasi omzet harian, biaya variabel/HPP, biaya tetap bulanan, Break-Even Point, dan
                periode balik modal dengan formula deterministik murni.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <Badge variant="emerald" size="sm">Formula Murni</Badge>
              <Link
                href="/calculator"
                className="text-xs font-semibold text-brand-emerald-700 hover:text-brand-emerald-900"
              >
                Hitung &rarr;
              </Link>
            </div>
          </Card>

          {/* Pilar 3: Roadmap Usaha */}
          <Card hoverable className="flex flex-col justify-between">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-amber-50 text-brand-amber-700 mb-4">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Roadmap 4 Fase Eksekusi</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Daftar periksa interaktif 4 fase: dari riset pasar, legalitas NIB via OSS, pengadaan
                alat, hingga peluncuran promosi perdana dengan persentase progres.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <Badge variant="amber" size="sm">Panduan Praktis</Badge>
              <Link
                href="/roadmap"
                className="text-xs font-semibold text-brand-amber-700 hover:text-brand-amber-900"
              >
                Pelajari &rarr;
              </Link>
            </div>
          </Card>

          {/* Pilar 4: Diskusi Mantri BRI */}
          <Card hoverable className="flex flex-col justify-between">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700 mb-4">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Simulasi Diskusi Mantri BRI</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Siapkan ringkasan rencana Anda untuk latihan bahan diskusi bimbingan usaha bersama Mantri BRI.
                Transparan, aman, dan data tersimpan mandiri pada peramban Anda.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <Badge variant="navy" size="sm">Bimbingan Usaha</Badge>
              <Link
                href="/consultation"
                className="text-xs font-semibold text-brand-navy-600 hover:text-brand-navy-800"
              >
                Jadwalkan &rarr;
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* 3. Contoh Kartu Simulasi (Live Preview Simulation Card) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            {/* Deskripsi Preview */}
            <div className="max-w-xl space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="simulation" size="md" dot />
                <span className="text-xs font-medium text-slate-500">Pratinjau Nyata</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Contoh Rencana Usaha yang Dihasilkan
              </h2>
              <p className="text-sm leading-relaxed text-slate-600">
                Berikut adalah contoh kartu simulasi yang akan Anda dapatkan. Setiap parameter dihitung
                secara otomatis dengan transparansi penuh atas asumsi pasar dan risiko usaha.
              </p>
              <div className="pt-2">
                <Link href="/onboarding">
                  <Button variant="primary" size="md" rightIcon={<ArrowRight className="h-4 w-4" />}>
                    Buat Rencana Saya Sekarang
                  </Button>
                </Link>
              </div>
            </div>

            {/* Kartu Simulasi Nyata */}
            <div className="w-full lg:max-w-md">
              <div className="rounded-2xl border-2 border-brand-navy-200 bg-slate-50 p-5 shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-navy-600 text-white">
                      <Coffee className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Kuliner Modern</span>
                      <span className="text-[11px] text-slate-500">Minuman Siap Saji</span>
                    </div>
                  </div>
                  <Badge variant="simulation" size="sm" />
                </div>

                <h3 className="mt-3 text-lg font-extrabold text-slate-900">
                  Kedai Kopi Susu Gula Aren
                </h3>
                <p className="mt-1 text-xs text-slate-600 line-clamp-2">
                  Konsep grab-and-go menyasar mahasiswa dan pekerja kantoran di area strategis.
                </p>

                {/* Grid Finansial Deterministik */}
                <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-white p-3 border border-slate-200">
                  <div>
                    <span className="text-[11px] text-slate-500 block">Kebutuhan Modal</span>
                    <span className="text-sm font-bold text-slate-900">
                      {formatRupiah(15000000)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">Estimasi Laba/bln</span>
                    <span className="text-sm font-bold text-brand-emerald-700">
                      {formatRupiah(4250000)}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[11px] text-slate-500 block">Titik Impas (BEP)</span>
                    <span className="text-xs font-semibold text-slate-800">
                      32 cup / hari
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[11px] text-slate-500 block">Payback Period</span>
                    <span className="text-xs font-semibold text-slate-800">
                      ~3.5 bulan
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    Persiapan 2-4 minggu
                  </span>
                  <span className="font-semibold text-brand-navy-700">Tingkat Risiko: Sedang</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Alur 3 Langkah Mudah */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Badge variant="neutral" size="md">
            Alur Langkah
          </Badge>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Tiga Langkah Memulai Perjalanan Usaha
          </h2>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-navy-600 text-sm font-bold text-white mb-3">
              1
            </span>
            <h3 className="text-base font-bold text-slate-900">Isi Profil & Modal</h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Tentukan berapa modal awal yang Anda miliki, lokasi rencana usaha, dan bidang yang paling Anda minati.
            </p>
          </div>

          <div className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-navy-600 text-sm font-bold text-white mb-3">
              2
            </span>
            <h3 className="text-base font-bold text-slate-900">Eksplorasi & Uji Simulasi</h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Pilih peluang usaha rekomendasi dan sesuaikan parameter harga jual serta biaya di kalkulator finansial.
            </p>
          </div>

          <div className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-navy-600 text-sm font-bold text-white mb-3">
              3
            </span>
            <h3 className="text-base font-bold text-slate-900">Eksekusi & Bimbingan Mantri</h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Jalankan checklist persiapan dan jadwalkan sesi diskusi usaha bersama Mantri BRI untuk arahan praktis.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Bottom CTA Banner */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-brand-navy-800 to-brand-navy-950 p-8 text-white sm:p-12 shadow-lg">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-2xl font-extrabold sm:text-3xl lg:text-4xl">
              Siap Mewujudkan Usaha Mandiri Anda?
            </h2>
            <p className="mt-3 max-w-xl text-xs sm:text-sm text-slate-300 leading-relaxed">
              Gunakan platform Usaha Qita secara gratis. Dapatkan panduan lengkap tanpa biaya,
              tanpa janji palsu, dan didukung penuh komitmen pemberdayaan UMKM.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Link href="/onboarding" className="w-full sm:w-auto">
                <Button size="lg" variant="emerald" fullWidth rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Mulai Rencana Sekarang
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
