'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Filter,
  ArrowRight,
  RotateCcw,
  AlertCircle,
  HelpCircle,
  Info,
} from 'lucide-react';
import { OpportunityCard } from '@/components/opportunities';
import { Button } from '@/components/ui/button';
import { InputField } from '@/components/ui/input-field';
import { SelectDropdown } from '@/components/ui/select-dropdown';
import { Badge } from '@/components/ui/badge';
import { SkeletonCard } from '@/components/ui/skeleton-loader';
import { useUserProfile } from '@/hooks/use-user-profile';
import { opportunityRepository } from '@/adapters/repositories/opportunity.repository';
import { matchOpportunitiesForProfile } from '@/domain/opportunities/matcher';
import { formatRupiah } from '@/lib/utils';
import type { BusinessOpportunity } from '@/types/opportunity';

const CATEGORY_FILTER_OPTIONS = [
  { value: 'all', label: 'Semua Kategori Sektor' },
  { value: 'culinary', label: 'Kuliner & Minuman' },
  { value: 'retail', label: 'Ritel & Toko Kelontong' },
  { value: 'services', label: 'Jasa & Servis' },
  { value: 'agribusiness', label: 'Agribisnis & Peternakan' },
  { value: 'creative', label: 'Industri Kreatif & Kerajinan' },
];

const CAPITAL_FILTER_OPTIONS = [
  { value: 'all', label: 'Semua Rentang Modal' },
  { value: 'my_capital', label: 'Sesuai Modal Profil Saya' },
  { value: 'under_15m', label: 'Hingga Rp 15 Juta' },
  { value: 'under_30m', label: 'Hingga Rp 30 Juta' },
  { value: 'above_30m', label: 'Di Atas Rp 30 Juta' },
];

export default function OpportunitiesPage() {
  const { profile, isLoading: isProfileLoading } = useUserProfile();

  const [rawCatalog, setRawCatalog] = useState<BusinessOpportunity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCapitalRange, setSelectedCapitalRange] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Fetch katalog data dari repository
  const loadOpportunities = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await opportunityRepository.getAll();
      setRawCatalog(data);
    } catch {
      setErrorMessage(
        'Gagal memuat katalog peluang usaha. Silakan periksa koneksi dan coba lagi.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOpportunities();
  }, []);

  // 1. Urutkan katalog berdasarkan profil pengguna (AC-OPP-01.1)
  const prioritizedCatalog = useMemo(() => {
    if (!rawCatalog || rawCatalog.length === 0) return [];
    return matchOpportunitiesForProfile(profile, rawCatalog);
  }, [profile, rawCatalog]);

  // 2. Terapkan filter kategori, rentang modal, dan kata kunci
  const filteredOpportunities = useMemo(() => {
    return prioritizedCatalog.filter((item) => {
      // Filter Kategori
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // Filter Rentang Modal
      if (selectedCapitalRange === 'my_capital') {
        const userMax = profile?.availableCapital || 0;
        if (userMax > 0 && item.minCapital > userMax) {
          return false;
        }
      } else if (selectedCapitalRange === 'under_15m' && item.minCapital > 15000000) {
        return false;
      } else if (selectedCapitalRange === 'under_30m' && item.minCapital > 30000000) {
        return false;
      } else if (selectedCapitalRange === 'above_30m' && item.minCapital <= 30000000) {
        return false;
      }

      // Filter Kata Kunci
      if (searchQuery.trim().length > 0) {
        const query = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(query);
        const matchDesc = item.shortDescription.toLowerCase().includes(query);
        const matchTarget = item.targetCustomer.toLowerCase().includes(query);
        if (!matchTitle && !matchDesc && !matchTarget) {
          return false;
        }
      }

      return true;
    });
  }, [
    prioritizedCatalog,
    selectedCategory,
    selectedCapitalRange,
    searchQuery,
    profile?.availableCapital,
  ]);

  // Reset filter ke kondisi default (AC-OPP-04.1)
  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedCapitalRange('all');
    setSearchQuery('');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 space-y-8">
      {/* Header Halaman & Konteks Edukatif */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-navy-600">
              Eksplorasi Ide Bisnis
            </span>
            <Badge variant="simulation" size="sm" dot />
            <Badge variant="navy" size="sm">
              10 Pilihan Terkurasi
            </Badge>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Katalog & Rekomendasi Peluang Usaha
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            Pilihan ide usaha UMKM Indonesia yang disusun dengan parameter modal realistis, profil risiko terukur,
            dan disesuaikan dengan profil rencana bisnis Anda.
          </p>
        </div>

        {/* Status Profil Pengguna Ringkas */}
        {profile && (
          <div className="rounded-xl border border-brand-emerald-200 bg-brand-emerald-50/70 p-3 sm:text-right shrink-0">
            <span className="text-[11px] font-semibold text-brand-emerald-900 block">
              Diselaraskan dengan Profil Anda:
            </span>
            <span className="text-xs font-extrabold text-brand-emerald-800">
              {profile.fullName} ({formatRupiah(profile.availableCapital)})
            </span>
          </div>
        )}
      </div>

      {/* Banner Rekomendasi Jika Belum Ada Profil */}
      {!isProfileLoading && !profile && (
        <div className="rounded-2xl border border-brand-navy-200 bg-brand-navy-50/80 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-brand-navy-600 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-slate-700">
              <strong className="text-brand-navy-900 block mb-0.5">
                Ingin Rekomendasi yang Dipersonalisasi?
              </strong>
              Saat ini katalog menampilkan seluruh peluang kurasi. Isi profil usaha Anda untuk melihat
              peluang yang otomatis diprioritaskan berdasarkan modal dan kategori minat Anda.
            </div>
          </div>
          <Link href="/onboarding" className="shrink-0 w-full sm:w-auto">
            <Button
              variant="primary"
              size="sm"
              fullWidth
              rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
            >
              Isi Profil Saya
            </Button>
          </Link>
        </div>
      )}

      {/* Baris Filter & Pencarian Interaktif */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
          <Filter className="h-4 w-4 text-brand-navy-600" />
          <span>Saring & Cari Peluang Usaha</span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {/* Filter Kategori */}
          <SelectDropdown
            label="Kategori Usaha"
            options={CATEGORY_FILTER_OPTIONS}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          />

          {/* Filter Rentang Modal */}
          <SelectDropdown
            label="Kebutuhan Modal Awal"
            options={CAPITAL_FILTER_OPTIONS}
            value={selectedCapitalRange}
            onChange={(e) => setSelectedCapitalRange(e.target.value)}
          />

          {/* Pencarian Teks */}
          <InputField
            label="Cari Ide Usaha"
            placeholder="Ketik kata kunci, misal: kopi, sembako..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Informasi Filter Aktif & Tombol Reset */}
        {(selectedCategory !== 'all' ||
          selectedCapitalRange !== 'all' ||
          searchQuery.trim().length > 0) && (
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2 text-xs">
            <span className="text-slate-500">
              Menampilkan {filteredOpportunities.length} dari {rawCatalog.length} peluang usaha.
            </span>
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-navy-600 hover:text-brand-navy-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-navy-600 rounded px-1.5 py-0.5"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Atur Ulang Filter</span>
            </button>
          </div>
        )}
      </div>

      {/* Grid Katalog Peluang Usaha (4 State: Loading, Error, Empty, Default) */}

      {/* 1. Loading State (AC-SYS-02.1) */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {/* 2. Error State (AC-SYS-02.1) */}
      {!isLoading && errorMessage && (
        <div className="rounded-2xl border border-brand-danger-200 bg-brand-danger-50 p-6 text-center space-y-3">
          <AlertCircle className="h-8 w-8 text-brand-danger-600 mx-auto" />
          <h2 className="text-base font-bold text-brand-danger-900">Kendala Pemuatan Data</h2>
          <p className="text-xs text-brand-danger-700 max-w-md mx-auto">{errorMessage}</p>
          <div className="pt-2">
            <Button variant="outline" size="sm" onClick={loadOpportunities}>
              Coba Muat Ulang
            </Button>
          </div>
        </div>
      )}

      {/* 3. Empty State (AC-OPP-04.1) */}
      {!isLoading && !errorMessage && filteredOpportunities.length === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-8 sm:p-12 text-center space-y-4">
          <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-xl bg-slate-100 text-slate-400">
            <HelpCircle className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900">
              Belum Menemukan Usaha yang Sesuai dengan Filter Ini
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              Tidak ada peluang yang cocok dengan kombinasi kategori dan rentang modal yang Anda pilih.
              Silakan sesuaikan pilihan filter atau atur ulang pencarian Anda.
            </p>
          </div>
          <div className="pt-2">
            <Button
              variant="primary"
              size="sm"
              onClick={handleResetFilters}
              leftIcon={<RotateCcw className="h-4 w-4" />}
            >
              Atur Ulang Filter
            </Button>
          </div>
        </div>
      )}

      {/* 4. Default State: Grid Peluang Terfilter & Terurut */}
      {!isLoading && !errorMessage && filteredOpportunities.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>
              Menampilkan {filteredOpportunities.length} peluang usaha kurasi terurut:
            </span>
            <span className="hidden sm:inline">Urutan berdasarkan kecocokan minat & modal</span>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredOpportunities.map((opportunity) => (
              <OpportunityCard
                key={opportunity.id}
                opportunity={opportunity}
                userProfile={profile}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
