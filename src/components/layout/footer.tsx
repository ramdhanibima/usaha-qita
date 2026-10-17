import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

/**
 * Komponen Footer Kepatuhan & Transparansi Etis (TASK-UI-04, AC-SYS-03.1).
 * Mengakomodasi kepatuhan hukum, tidak menjanjikan kredit, dan menegaskan status data simulasi.
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white">
      {/* Disclaimer Kepatuhan Hukum & Etis Utama (AC-SYS-03.1) */}
      <div className="border-b border-slate-200 bg-slate-50 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 sm:p-6 shadow-xs">
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-6 w-6 text-amber-700 shrink-0 mt-0.5" />
              <div className="space-y-2 text-xs sm:text-sm text-amber-950 leading-relaxed">
                <p className="font-bold text-amber-900 flex items-center gap-2 flex-wrap">
                  <span>Pernyataan Kepatuhan & Batasan Layanan Resmi</span>
                  <Badge variant="simulation" size="sm" />
                </p>
                <p>
                  <strong>Usaha Qita</strong> adalah platform prototipe independen untuk edukasi & simulasi
                  perencanaan usaha mandiri. Usaha Qita{' '}
                  <span className="font-semibold underline decoration-amber-400">
                    bukan aplikasi resmi penerbit pinjaman dari PT Bank Rakyat Indonesia (Persero) Tbk,
                    tidak berafiliasi resmi, dan tidak mengirimkan data tiket simulasi ke sistem BRI
                  </span>
                  . Pengajuan konsultasi Mantri BRI bersifat simulasi edukatif dan{' '}
                  <strong>tidak menjamin persetujuan kredit</strong> (seperti KUR atau Kupedes).
                </p>
                <p className="text-amber-900/90 text-xs">
                  Semua proyeksi omzet, estimasi biaya HPP, laba bersih, dan titik impas (BEP) dihitung secara
                  matematis berdasarkan formula deterministik dengan data simulasi ilustratif untuk tujuan
                  edukasi wirausaha.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigasi Footer & Informasi Proyek */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Kolom 1: Profil Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-navy-600 font-extrabold text-white text-sm">
                UQ
              </div>
              <div>
                <p className="text-base font-bold text-brand-navy-900 leading-none">Usaha Qita</p>
                <p className="text-xs font-semibold text-brand-navy-600 leading-tight mt-0.5">
                  Prototipe Independen UMKM
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Membantu calon wirausaha dan UMKM Indonesia merencanakan usaha yang terukur, rasional, dan
              berkelanjutan dengan analisis finansial deterministik.
            </p>
            <div className="pt-1">
              <Badge variant="navy" size="sm">
                Inisiatif Pemberdayaan UMKM
              </Badge>
            </div>
          </div>

          {/* Kolom 2: Fitur Aplikasi */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Fitur Perencanaan
            </p>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/onboarding"
                  className="text-slate-600 hover:text-brand-navy-600 transition-colors py-1 inline-block"
                >
                  Profil & Minat Usaha
                </Link>
              </li>
              <li>
                <Link
                  href="/opportunities"
                  className="text-slate-600 hover:text-brand-navy-600 transition-colors py-1 inline-block"
                >
                  Katalog & Rekomendasi Peluang
                </Link>
              </li>
              <li>
                <Link
                  href="/calculator"
                  className="text-slate-600 hover:text-brand-navy-600 transition-colors py-1 inline-block"
                >
                  Kalkulator BEP & Finansial
                </Link>
              </li>
              <li>
                <Link
                  href="/roadmap"
                  className="text-slate-600 hover:text-brand-navy-600 transition-colors py-1 inline-block"
                >
                  Roadmap Langkah Usaha
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Pendampingan & Komitmen */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Pendampingan & Bimbingan
            </p>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/consultation"
                  className="text-slate-600 hover:text-brand-navy-600 transition-colors py-1 inline-block"
                >
                  Konsultasi Mantri BRI
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-slate-600 hover:text-brand-navy-600 transition-colors py-1 inline-block"
                >
                  Dashboard Rencana Usaha
                </Link>
              </li>
              <li className="flex items-center gap-1.5 text-slate-500 pt-1">
                <Info className="h-3.5 w-3.5 text-brand-navy-600 shrink-0" />
                <span>Persetujuan eksplisit pengguna dijunjung tinggi</span>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Kategori Sektor Usaha */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Sektor UMKM Binaan
            </p>
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="neutral" size="sm">Kuliner</Badge>
              <Badge variant="neutral" size="sm">Ritel & Warung</Badge>
              <Badge variant="neutral" size="sm">Jasa & Servis</Badge>
              <Badge variant="neutral" size="sm">Agribisnis</Badge>
              <Badge variant="neutral" size="sm">Industri Kreatif</Badge>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed pt-2">
              Didukung kurasi simulasi usaha sesuai kondisi pasar riil Indonesia.
            </p>
          </div>
        </div>

        {/* Baris Hak Cipta & Status Sistem */}
        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-slate-100 pt-6 text-center text-xs text-slate-500 sm:flex-row sm:text-left">
          <p>
            &copy; {currentYear} Usaha Qita — Inisiatif Pendampingan Wirausaha Mandiri.
          </p>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-brand-emerald-500" />
              Sistem Aktif (Deterministik)
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

