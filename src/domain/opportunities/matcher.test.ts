import { describe, it, expect } from 'vitest';
import {
  matchOpportunitiesForProfile,
  generateMatchExplanation,
} from './matcher';
import { BusinessOpportunity } from '@/types/opportunity';
import { UserProfile } from '@/types/profile';

describe('Algoritma Pencocokan Peluang Usaha (Matcher)', () => {
  const mockCatalog: BusinessOpportunity[] = [
    {
      id: 'opp-1',
      slug: 'ayam-geprek',
      title: 'Ayam Geprek',
      category: 'culinary',
      shortDescription: 'Kuliner ayam pedas',
      fullDescription: 'Deskripsi lengkap',
      minCapital: 5000000,
      maxCapital: 12000000,
      matchingRationale: '',
      targetCustomer: 'Pelajar & Mahasiswa',
      riskLevel: 'low',
      riskMitigationTips: [],
      defaultFinancialAssumptions: {
        sellingPricePerUnit: 15000,
        estimatedUnitsSoldPerDay: 40,
        operatingDaysPerMonth: 26,
        variableCostPerUnit: 8500,
        monthlyRent: 1000000,
        monthlyLaborCost: 1500000,
        monthlyUtilitiesCost: 300000,
        monthlyOtherFixedCost: 200000,
        initialInvestmentCapital: 8000000,
      },
      isSimulation: true,
      dataSourceLabel: 'Data Simulasi',
    },
    {
      id: 'opp-2',
      slug: 'kedai-kopi',
      title: 'Kedai Kopi Susu',
      category: 'culinary',
      shortDescription: 'Kedai kopi kekinian',
      fullDescription: 'Deskripsi lengkap',
      minCapital: 8000000,
      maxCapital: 25000000,
      matchingRationale: '',
      targetCustomer: 'Mahasiswa & Pekerja',
      riskLevel: 'medium',
      riskMitigationTips: [],
      defaultFinancialAssumptions: {
        sellingPricePerUnit: 18000,
        estimatedUnitsSoldPerDay: 50,
        operatingDaysPerMonth: 30,
        variableCostPerUnit: 7000,
        monthlyRent: 2500000,
        monthlyLaborCost: 3000000,
        monthlyUtilitiesCost: 500000,
        monthlyOtherFixedCost: 500000,
        initialInvestmentCapital: 25000000,
      },
      isSimulation: true,
      dataSourceLabel: 'Data Simulasi',
    },
    {
      id: 'opp-3',
      slug: 'restoran-seafood',
      title: 'Restoran Seafood Keluarga',
      category: 'culinary',
      shortDescription: 'Restoran skala besar',
      fullDescription: 'Deskripsi lengkap',
      minCapital: 40000000,
      maxCapital: 80000000,
      matchingRationale: '',
      targetCustomer: 'Keluarga',
      riskLevel: 'high',
      riskMitigationTips: [],
      defaultFinancialAssumptions: {
        sellingPricePerUnit: 50000,
        estimatedUnitsSoldPerDay: 30,
        operatingDaysPerMonth: 30,
        variableCostPerUnit: 25000,
        monthlyRent: 5000000,
        monthlyLaborCost: 8000000,
        monthlyUtilitiesCost: 1000000,
        monthlyOtherFixedCost: 1000000,
        initialInvestmentCapital: 50000000,
      },
      isSimulation: true,
      dataSourceLabel: 'Data Simulasi',
    },
    {
      id: 'opp-4',
      slug: 'laundry-kiloan',
      title: 'Laundry Kiloan',
      category: 'services',
      shortDescription: 'Jasa cuci kiloan',
      fullDescription: 'Deskripsi lengkap',
      minCapital: 12000000,
      maxCapital: 30000000,
      matchingRationale: '',
      targetCustomer: 'Warga kos',
      riskLevel: 'medium',
      riskMitigationTips: [],
      defaultFinancialAssumptions: {
        sellingPricePerUnit: 8000,
        estimatedUnitsSoldPerDay: 35,
        operatingDaysPerMonth: 30,
        variableCostPerUnit: 2500,
        monthlyRent: 1500000,
        monthlyLaborCost: 2000000,
        monthlyUtilitiesCost: 800000,
        monthlyOtherFixedCost: 300000,
        initialInvestmentCapital: 20000000,
      },
      isSimulation: true,
      dataSourceLabel: 'Data Simulasi',
    },
  ];

  it('memprioritaskan kategori minat yang sesuai dan modal mencukupi (AC-OPP-01.1)', () => {
    const profile: UserProfile = {
      id: 'user-1',
      fullName: 'Mas Budi',
      goal: 'start_new',
      availableCapital: 10000000, // Rp 10.000.000
      location: { province: 'Jawa Barat', regency: 'Bandung' },
      experience: 'beginner',
      preferredCategories: ['culinary'],
      updatedAt: new Date().toISOString(),
    };

    const results = matchOpportunitiesForProfile(profile, mockCatalog);

    // Peluang kuliner dengan modal <= 10jt harus berada di paling atas
    expect(results.length).toBe(4);
    expect(results[0].category).toBe('culinary');
    expect(results[0].minCapital).toBeLessThanOrEqual(10000000);
    expect(results[1].category).toBe('culinary');
    expect(results[1].minCapital).toBeLessThanOrEqual(10000000);

    // Restoran seafood (modal 40jt) harus berada di bawah peluang kuliner yang modalnya cukup
    const seafoodIndex = results.findIndex((r) => r.slug === 'restoran-seafood');
    const geprekIndex = results.findIndex((r) => r.slug === 'ayam-geprek');
    const kopiIndex = results.findIndex((r) => r.slug === 'kedai-kopi');
    expect(geprekIndex).toBeLessThan(seafoodIndex);
    expect(kopiIndex).toBeLessThan(seafoodIndex);
  });

  it('menangani multikategori minat pengguna', () => {
    const profile: UserProfile = {
      id: 'user-2',
      fullName: 'Ibu Siti',
      goal: 'grow_existing',
      availableCapital: 15000000,
      location: { province: 'Jawa Tengah', regency: 'Semarang' },
      experience: 'intermediate',
      preferredCategories: ['culinary', 'services'],
      updatedAt: new Date().toISOString(),
    };

    const results = matchOpportunitiesForProfile(profile, mockCatalog);

    // Peluang kuliner dan jasa yang modalnya <= 15jt harus berada di top 3
    const topThreeSlugs = results.slice(0, 3).map((r) => r.slug);
    expect(topThreeSlugs).toContain('ayam-geprek');
    expect(topThreeSlugs).toContain('kedai-kopi');
    expect(topThreeSlugs).toContain('laundry-kiloan');
  });

  it('menangani kasus batas: modal di bawah semua peluang usaha (insufficient capital)', () => {
    const lowCapitalProfile: UserProfile = {
      id: 'user-3',
      fullName: 'Dedi Pemula',
      goal: 'start_new',
      availableCapital: 1000000, // Rp 1.000.000 (di bawah semua minCapital)
      location: { province: 'DKI Jakarta', regency: 'Jakarta Selatan' },
      experience: 'beginner',
      preferredCategories: ['culinary'],
      updatedAt: new Date().toISOString(),
    };

    const results = matchOpportunitiesForProfile(lowCapitalProfile, mockCatalog);

    // Harus tetap mengembalikan hasil terurut dengan penjelasan rasional kekurangan modal
    expect(results.length).toBe(4);
    expect(results[0].category).toBe('culinary');
    expect(results[0].matchingRationale).toContain('membutuhkan tambahan');
  });

  it('menangani kasus batas: katalog kosong dan profil null', () => {
    expect(matchOpportunitiesForProfile(null, [])).toEqual([]);

    const profile: UserProfile = {
      id: 'user-4',
      fullName: 'Anonim',
      goal: 'start_new',
      availableCapital: 5000000,
      location: { province: 'Jawa Timur', regency: 'Surabaya' },
      experience: 'beginner',
      preferredCategories: [],
      updatedAt: new Date().toISOString(),
    };

    expect(matchOpportunitiesForProfile(profile, [])).toEqual([]);

    // Jika profil null, kembalikan seluruh katalog
    const nullProfileResults = matchOpportunitiesForProfile(null, mockCatalog);
    expect(nullProfileResults.length).toBe(mockCatalog.length);
  });

  it('menghasilkan penjelasan rasional yang transparan tanpa janji keuntungan', () => {
    const profile: UserProfile = {
      id: 'user-5',
      fullName: 'Budi Santoso',
      goal: 'start_new',
      availableCapital: 10000000,
      location: { province: 'Bali', regency: 'Denpasar' },
      experience: 'beginner',
      preferredCategories: ['culinary'],
      updatedAt: new Date().toISOString(),
    };

    const affordableOpp = mockCatalog[0]; // minCapital 5jt
    const expensiveOpp = mockCatalog[2]; // minCapital 40jt

    const explanationAffordable = generateMatchExplanation(affordableOpp, profile);
    const explanationExpensive = generateMatchExplanation(expensiveOpp, profile);

    expect(explanationAffordable).toContain('mencukupi estimasi modal minimal');
    expect(explanationExpensive).toContain('membutuhkan tambahan');

    // Pastikan tidak ada klaim palsu jaminan untung atau jaminan kredit
    expect(explanationAffordable).not.toContain('pasti untung');
    expect(explanationAffordable).not.toContain('jaminan');
    expect(explanationExpensive).not.toContain('pasti untung');
  });
});

