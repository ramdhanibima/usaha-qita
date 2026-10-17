'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Copy,
  Check,
  Calendar,
  MapPin,
  Phone,
  User,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Clock,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import { ConsultationRequest, BusinessTopic } from '@/types/consultation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatRupiah } from '@/lib/formatters';

export interface SimulationTicketCardProps {
  ticket: ConsultationRequest;
  onReset?: () => void;
  onDeleteTicket?: () => void;
}

const TOPIC_LABELS: Record<BusinessTopic, string> = {
  financial_literacy: 'Literasi Finansial & Pemisahan Uang Usaha',
  cashflow_management: 'Manajemen Arus Kas & Pengendalian Biaya Operasional',
  business_expansion: 'Rencana Ekspansi & Penambahan Modal Usaha',
  general_advice: 'Konsultasi Umum Rintisan Usaha Baru',
};

/**
 * Komponen Tiket Konfirmasi Simulasi Digital (TASK-MNT-03, REQ-MANTRI-03, AC-MANTRI-03.1).
 *
 * Menampilkan:
 * 1. Nomor Referensi Simulasi unik (format: UQ-MNT-[YYYYMM]-[XXXX])
 * 2. Ringkasan data usaha yang diajukan
 * 3. Petunjuk langkah selanjutnya dari Mantri BRI
 * 4. Badge visual "Data simulasi"
 * 5. Tombol navigasi "Kembali ke Dashboard"
 */
export function SimulationTicketCard({
  ticket,
  onReset,
  onDeleteTicket,
}: SimulationTicketCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyReference = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(ticket.referenceNumber);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // Fallback diam jika clipboard tidak didukung
    }
  };

  const formattedDate = new Date(ticket.submittedAt).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Banner Notifikasi Berhasil */}
      <div className="rounded-2xl bg-gradient-to-r from-brand-emerald-500 to-teal-600 p-6 text-white shadow-lg text-center sm:text-left flex flex-col sm:flex-row items-center sm:items-start gap-4">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm text-white">
          <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-lg sm:text-xl font-bold tracking-tight">
              Tiket Simulasi Bimbingan Diterbitkan
            </h2>
            <Badge variant="simulation" className="border-white/30 text-white bg-white/20">
              Data simulasi
            </Badge>
          </div>
          <p className="text-sm text-emerald-50 leading-relaxed">
            Tiket ini adalah konfirmasi simulasi lokal pada peramban Anda.
            Aplikasi belum terhubung ke sistem perbankan resmi BRI dan belum ada data yang dikirim ke kantor/sistem BRI.
          </p>
        </div>
      </div>

      {/* Badan Tiket Digital */}
      <div className="overflow-hidden rounded-3xl border-2 border-brand-navy-200 bg-white shadow-xl transition-all">
        {/* Header Tiket */}
        <div className="relative bg-gradient-to-r from-brand-navy-900 via-brand-navy-800 to-brand-navy-900 px-6 py-6 text-white sm:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs font-semibold tracking-wider uppercase text-brand-amber-400">
                Tiket Simulasi Bimbingan Usaha
              </span>
              <h3 className="text-lg font-bold text-white">Simulasi Bimbingan Usaha Mantri BRI (Prototipe Independen)</h3>
            </div>
            <Badge variant="simulation">Data simulasi</Badge>
          </div>

          {/* Kotak Nomor Referensi */}
          <div className="mt-5 rounded-2xl bg-white/10 backdrop-blur-md p-4 border border-white/20 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <div className="text-xs text-brand-navy-100 uppercase tracking-wider font-medium">
                Nomor Referensi Simulasi
              </div>
              <div className="text-2xl sm:text-3xl font-mono font-extrabold tracking-wider text-brand-amber-300">
                {ticket.referenceNumber}
              </div>
            </div>
            <button
              type="button"
              onClick={handleCopyReference}
              className="inline-flex items-center gap-2 rounded-xl bg-white/20 hover:bg-white/30 px-3.5 py-2 text-xs font-semibold text-white transition-all active:scale-95 min-h-[40px] focus:outline-none focus:ring-2 focus:ring-white"
              title="Salin nomor tiket"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-emerald-300" />
                  <span className="text-emerald-200">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Salin Nomor</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Garis Pemisah Bergaya Perforasi Tiket */}
        <div className="relative flex items-center justify-between bg-slate-100 py-2 px-4 border-y border-dashed border-slate-300">
          <div className="h-4 w-4 -ml-6 rounded-full bg-slate-50 border-r border-slate-300" />
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <Clock className="h-3.5 w-3.5" />
            <span>Diterbitkan: {formattedDate}</span>
          </div>
          <div className="h-4 w-4 -mr-6 rounded-full bg-slate-50 border-l border-slate-300" />
        </div>

        {/* Ringkasan Data Usaha yang Diajukan (AC-MANTRI-03.1 point 2) */}
        <div className="p-6 sm:p-8 space-y-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Ringkasan Pengajuan Bimbingan
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {/* Nama Pemohon */}
            <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100 flex items-start gap-3">
              <User className="h-5 w-5 text-brand-navy-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs text-slate-500">Nama Pemohon</div>
                <div className="font-semibold text-slate-900">{ticket.fullName}</div>
              </div>
            </div>

            {/* Nomor Kontak WhatsApp */}
            <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100 flex items-start gap-3">
              <Phone className="h-5 w-5 text-brand-navy-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs text-slate-500">Kontak WhatsApp</div>
                <div className="font-semibold text-slate-900">{ticket.phoneNumber}</div>
              </div>
            </div>

            {/* Topik Bimbingan */}
            <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100 flex items-start gap-3 sm:col-span-2">
              <Sparkles className="h-5 w-5 text-brand-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs text-slate-500">Topik Bimbingan Usaha</div>
                <div className="font-semibold text-slate-900">
                  {TOPIC_LABELS[ticket.businessTopic] || ticket.businessTopic}
                </div>
              </div>
            </div>

            {/* Unit Kerja / Lokasi Terdekat */}
            <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100 flex items-start gap-3 sm:col-span-2">
              <MapPin className="h-5 w-5 text-brand-navy-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs text-slate-500">Lokasi / Unit Kerja Terdekat</div>
                <div className="font-semibold text-slate-900">{ticket.preferredLocation}</div>
              </div>
            </div>

            {/* Snapshot Finansial Jika Ada */}
            {ticket.businessProfileSnapshot && (
              <div className="rounded-xl bg-brand-navy-50/60 p-4 border border-brand-navy-100 sm:col-span-2 space-y-2">
                <div className="text-xs font-bold text-brand-navy-900 uppercase tracking-wide">
                  Snapshot Finansial Simulasi
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block">Kategori Rencana:</span>
                    <span className="font-semibold text-slate-800">
                      {ticket.businessProfileSnapshot.category}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Rencana Modal:</span>
                    <span className="font-semibold text-slate-800">
                      {formatRupiah(ticket.businessProfileSnapshot.plannedCapital)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Proyeksi Laba Bersih:</span>
                    <span className="font-semibold text-brand-emerald-700">
                      {formatRupiah(ticket.businessProfileSnapshot.projectedNetProfit)}/bln
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Catatan Tambahan Jika Ada */}
            {ticket.notes && (
              <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100 sm:col-span-2 text-xs">
                <div className="text-slate-500 font-medium mb-1">Catatan Pemohon:</div>
                <div className="text-slate-700 italic">&ldquo;{ticket.notes}&rdquo;</div>
              </div>
            )}
          </div>

          {/* Petunjuk Langkah Selanjutnya (AC-MANTRI-03.1 point 3) */}
          <div className="rounded-2xl border-2 border-brand-navy-200 bg-brand-navy-50/40 p-5 space-y-3">
            <div className="flex items-center gap-2 text-brand-navy-900 font-bold text-sm">
              <Calendar className="h-5 w-5 text-brand-navy-600" />
              <span>Petunjuk Langkah Selanjutnya</span>
            </div>
            <p className="text-sm font-medium text-slate-800 leading-relaxed">
              &ldquo;Mantri BRI terdekat akan menghubungi nomor WhatsApp Anda dalam 1-2
              hari kerja simulasi untuk menjadwalkan sesi diskusi usaha.&rdquo;
            </p>
            <div className="pt-2 border-t border-brand-navy-100/60 flex items-start gap-2 text-xs text-slate-600">
              <ShieldCheck className="h-4 w-4 text-brand-emerald-600 flex-shrink-0 mt-0.5" />
              <span>
                Simpan nomor referensi di atas jika sewaktu-waktu Anda berkunjung ke kantor unit kerja BRI terdekat untuk rujukan diskusi kewirausahaan.
              </span>
            </div>
          </div>

          {/* Kotak Transparansi Simulasi */}
          <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 text-xs text-slate-600 space-y-1">
            <div className="font-semibold text-slate-800">Pemberitahuan Transparansi:</div>
            <p>
              Data simulasi permohonan ini tersimpan secara mandiri pada peramban lokal Anda.
              Aplikasi Usaha Qita tidak terhubung ke core banking BRI dan tidak memproses
              pengajuan pinjaman uang tunai secara langsung.
            </p>
          </div>

          {/* Tombol Aksi Navigasi (AC-MANTRI-03.1 point 4) */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
              {onReset && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onReset}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Buat Pengajuan Baru</span>
                </Button>
              )}

              {onDeleteTicket && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onDeleteTicket}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 text-xs"
                  title="Hapus data kontak dan nomor tiket ini dari penyimpanan browser"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Hapus Tiket dari Browser</span>
                </Button>
              )}
            </div>

            <Link href="/dashboard" className="w-full sm:w-auto sm:ml-auto">
              <Button
                type="button"
                variant="primary"
                className="w-full inline-flex items-center justify-center gap-2 bg-brand-navy-600 hover:bg-brand-navy-700"
              >
                <span>Kembali ke Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

