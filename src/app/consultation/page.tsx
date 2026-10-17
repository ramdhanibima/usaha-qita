'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Clock,
  Sparkles,
  ChevronRight,
  FileCheck2,
  Users,
} from 'lucide-react';
import { ConsultationRequest } from '@/types/consultation';
import { consultationRepository } from '@/adapters/repositories/consultation.repository';
import {
  ConsultationForm,
  SimulationTicketCard,
} from '@/components/consultation';
import { Badge } from '@/components/ui/badge';
import { SkeletonLoader } from '@/components/ui/skeleton-loader';
import { Button } from '@/components/ui/button';

/**
 * Halaman Pengajuan Konsultasi Mantri BRI (TASK-MNT-04, REQ-MANTRI-01, REQ-MANTRI-02, REQ-MANTRI-03, AC-MANTRI-01.1, AC-MANTRI-02.1, AC-MANTRI-03.1).
 *
 * Menggabungkan:
 * 1. Hero banner edukasi dan transparansi bimbingan usaha Mantri BRI.
 * 2. Form validasi kontak & topik bimbingan (ConsultationForm).
 * 3. Kotak persetujuan eksplisit (ConsultationConsentBox).
 * 4. Tampilan tiket simulasi digital (SimulationTicketCard).
 * 5. Penanganan state komprehensif (Loading, Default Form, Active Ticket).
 */
export default function ConsultationPage() {
  const [activeTicket, setActiveTicket] = useState<ConsultationRequest | null>(null);
  const [hasExistingTicket, setHasExistingTicket] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'form' | 'ticket'>('form');

  // Muat tiket simulasi terakhir dari storage saat halaman dibuka
  useEffect(() => {
    let mounted = true;

    async function loadLatestTicket() {
      try {
        const latest = await consultationRepository.getLatest();
        if (mounted && latest) {
          setActiveTicket(latest);
          setHasExistingTicket(true);
        }
      } catch {
        // Fallback diam
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadLatestTicket();

    return () => {
      mounted = false;
    };
  }, []);

  const handleFormSuccess = (newTicket: ConsultationRequest) => {
    setActiveTicket(newTicket);
    setHasExistingTicket(true);
    setViewMode('ticket');
    // Scroll mulus ke atas halaman
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleResetForm = () => {
    setViewMode('form');
  };

  const handleDeleteTicket = async () => {
    await consultationRepository.clearHistory();
    setActiveTicket(null);
    setHasExistingTicket(false);
    setViewMode('form');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb Sederhana */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-brand-navy-600 transition-colors">
            Beranda
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/dashboard" className="hover:text-brand-navy-600 transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="font-semibold text-brand-navy-900" aria-current="page">
            Simulasi Konsultasi Mantri BRI
          </span>
        </nav>

        {/* Hero Section */}
        <div className="rounded-3xl bg-gradient-to-br from-brand-navy-900 via-brand-navy-800 to-brand-navy-900 p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          {/* Aksen Latar Belakang */}
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand-navy-600/30 blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-brand-amber-500/10 blur-3xl pointer-events-none" />

          <div className="relative space-y-4 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-amber-400/20 px-3 py-1 text-xs font-bold text-brand-amber-300 backdrop-blur-md border border-brand-amber-400/30">
                <Users className="h-3.5 w-3.5" />
                <span>Simulasi Pendampingan UMKM Mandiri</span>
              </span>
              <Badge variant="simulation" className="border-white/30 text-white bg-white/20">
                Data simulasi
              </Badge>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Simulasi Konsultasi Rencana Usaha bersama Mantri BRI
            </h1>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              Simulasikan permohonan bimbingan praktis mengenai literasi keuangan, pengelolaan modal kerja,
              dan strategi rintisan usaha sebagai bahan persiapan sebelum berkunjung ke kantor unit BRI.
            </p>

            {/* Banner Penegasan Kepatuhan Etis (AC-SYS-03.1) */}
            <div className="rounded-2xl bg-white/10 backdrop-blur-md p-4 border border-white/15 flex items-start gap-3 text-xs sm:text-sm text-slate-200">
              <ShieldCheck className="h-5 w-5 text-brand-amber-400 flex-shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong>Catatan Kepatuhan:</strong> Sesi konsultasi ini bersifat edukasi dan
                bimbingan kewirausahaan.{' '}
                <span className="text-brand-amber-200 font-semibold">
                  Bukan jaminan atau janji persetujuan pinjaman/kredit.
                </span>{' '}
                Usaha Qita adalah platform simulasi mandiri.
              </div>
            </div>
          </div>
        </div>

        {/* Tab Pemilih (Hanya muncul jika sudah ada tiket sebelumnya) */}
        {!isLoading && hasExistingTicket && (
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setViewMode('form')}
                className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all min-h-[40px] ${
                  viewMode === 'form'
                    ? 'bg-brand-navy-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                Buat Pengajuan Baru
              </button>
              <button
                type="button"
                onClick={() => setViewMode('ticket')}
                className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all min-h-[40px] inline-flex items-center gap-1.5 ${
                  viewMode === 'ticket'
                    ? 'bg-brand-navy-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <FileCheck2 className="h-4 w-4" />
                <span>Lihat Tiket Terakhir</span>
              </button>
            </div>

            <span className="text-xs text-slate-500 hidden sm:inline">
              Riwayat simulasi tersimpan lokal
            </span>
          </div>
        )}

        {/* Konten Utama Berdasarkan State */}
        {isLoading ? (
          <div className="space-y-6">
            <SkeletonLoader variant="rectangular" className="h-48" />
            <SkeletonLoader variant="rectangular" className="h-96" />
          </div>
        ) : viewMode === 'ticket' && activeTicket ? (
          /* Tampilan Tiket Simulasi Berhasil (AC-MANTRI-03.1) */
          <div className="space-y-6 animate-fadeIn">
            <SimulationTicketCard
              ticket={activeTicket}
              onReset={handleResetForm}
              onDeleteTicket={handleDeleteTicket}
            />
          </div>
        ) : (
          /* Tampilan Form Pengajuan Konsultasi (AC-MANTRI-01.1, AC-MANTRI-02.1) */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Kolom Kiri: Formulir Pengajuan (2 Kolom di Desktop) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
                <div className="mb-6 space-y-1">
                  <h2 className="text-lg sm:text-xl font-bold text-brand-navy-900">
                    Formulir Permohonan Bimbingan Usaha
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Lengkapi identitas dan topik bahasan yang ingin Anda diskusikan bersama Mantri.
                  </p>
                </div>

                <ConsultationForm onSubmitSuccess={handleFormSuccess} />
              </div>
            </div>

            {/* Kolom Kanan: Panduan & Edukasi Peran Mantri BRI */}
            <div className="space-y-6">
              {/* Card: Apa peran Mantri BRI? */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-navy-100 text-brand-navy-700 font-bold text-xs">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-bold text-brand-navy-900">
                    Peran Mantri BRI untuk UMKM
                  </h3>
                </div>

                <ul className="space-y-3 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-brand-navy-600 mt-1.5 flex-shrink-0" />
                    <span>
                      <strong>Sahabat Diskusi Finansial:</strong> Membantu merapikan catatan kas
                      dan memisahkan uang pribadi dari rekening toko.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-brand-navy-600 mt-1.5 flex-shrink-0" />
                    <span>
                      <strong>Penasihat Skala Usaha:</strong> Menilai kesiapan modal awal dan
                      titik impas (BEP) sebelum Anda mengambil risiko modal besar.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-brand-navy-600 mt-1.5 flex-shrink-0" />
                    <span>
                      <strong>Jaringan Ekosistem Lokal:</strong> Menghubungkan pelaku usaha
                      dengan komunitas binaan BRI di wilayah kecamatan Anda.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Card: Alur Proses Simulasi */}
              <div className="rounded-3xl border border-brand-amber-200 bg-brand-amber-50/50 p-6 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-brand-amber-900 font-bold text-sm">
                  <Clock className="h-4 w-4 text-brand-amber-700" />
                  <span>Alur Setelah Tiket Diterbitkan</span>
                </div>
                <ol className="space-y-2 text-xs text-brand-amber-950 list-decimal list-inside leading-relaxed">
                  <li>Tiket simulasi digital langsung terbit di layar Anda.</li>
                  <li>Simpan nomor referensi simulasi berformat UQ-MNT.</li>
                  <li>
                    Gunakan ringkasan simulasi saat berkonsultasi langsung di kantor unit BRI
                    terdekat atau saat ada bimbingan lapangan.
                  </li>
                </ol>
              </div>

              {/* Tautan ke Roadmap & Kalkulator */}
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center space-y-3">
                <div className="text-xs font-semibold text-slate-700">
                  Belum menghitung titik impas usaha Anda?
                </div>
                <Link href="/calculator" className="block">
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    Buka Kalkulator BEP
                  </Button>
                </Link>
                <Link href="/roadmap" className="block">
                  <Button variant="ghost" size="sm" className="w-full text-xs text-brand-navy-600">
                    Cek Roadmap NIB & Legalitas
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
