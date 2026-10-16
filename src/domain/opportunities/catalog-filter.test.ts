import { describe, it, expect } from 'vitest';
import { opportunityRepository } from '@/adapters/repositories/opportunity.repository';
import { matchOpportunitiesForProfile, generateMatchExplanation } from './matcher';
import type { UserProfile } from '@/types/profile';
import type { BusinessOpportunity } from '@/types/opportunity';

describe('Katalog & Filter Peluang Usaha (TASK-OPP-02, AC-OPP-01.1, AC-OPP-04.1)', () => {
  it('loads all 10 curated opportunities with isSimulation=true from repository', async () => {
    const catalog = await opportunityRepository.getAll();
    expect(catalog).toHaveLength(10);
    catalog.forEach((item) => {
      expect(item.isSimulation).toBe(true);
      expect(item.dataSourceLabel).toContain('Data Simulasi');
      expect(item.minCapital).toBeGreaterThan(0);
      expect(item.defaultFinancialAssumptions.sellingPricePerUnit).toBeGreaterThan(0);
    });
  });

  it('retrieves specific opportunity by id correctly', async () => {
    const opp = await opportunityRepository.getById('opp-culinary-01');
    expect(opp).not.toBeNull();
    expect(opp?.id).toBe('opp-culinary-01');
    expect(opp?.category).toBe('culinary');
    expect(opp?.defaultFinancialAssumptions.operatingDaysPerMonth).toBe(30);
  });

  it('returns null when querying non-existent opportunity id', async () => {
    const opp = await opportunityRepository.getById('opp-invalid-999');
    expect(opp).toBeNull();
  });

  it('filters catalog accurately by category', async () => {
    const catalog = await opportunityRepository.getAll();
    const culinaryOnly = catalog.filter((item) => item.category === 'culinary');
    expect(culinaryOnly.length).toBeGreaterThan(0);
    culinaryOnly.forEach((item) => {
      expect(item.category).toBe('culinary');
    });
  });

  it('filters catalog accurately by capital range (<= 15 Juta)', async () => {
    const catalog = await opportunityRepository.getAll();
    const affordableUnder15m = catalog.filter((item) => item.minCapital <= 15000000);
    expect(affordableUnder15m.length).toBeGreaterThan(0);
    affordableUnder15m.forEach((item) => {
      expect(item.minCapital).toBeLessThanOrEqual(15000000);
    });
  });

  it('produces empty list when filters match no opportunities (AC-OPP-04.1)', async () => {
    const catalog = await opportunityRepository.getAll();
    // Cari peluang dengan modal kurang dari 1 juta (katalog UMKM kita minimal 3-5 juta)
    const impossibleFilter = catalog.filter(
      (item) => item.category === 'creative' && item.minCapital < 1000000
    );
    expect(impossibleFilter).toHaveLength(0);
  });

  it('prioritizes culinary opportunities when user has Rp 10M capital and culinary interest (AC-OPP-01.1)', async () => {
    const catalog = await opportunityRepository.getAll();
    const userProfile: UserProfile = {
      id: 'usr_test_budi',
      fullName: 'Budi',
      goal: 'start_new',
      availableCapital: 10000000,
      location: { province: 'Jawa Barat', regency: 'Bandung' },
      experience: 'beginner',
      preferredCategories: ['culinary'],
      updatedAt: new Date().toISOString(),
    };

    const prioritized = matchOpportunitiesForProfile(userProfile, catalog);
    expect(prioritized.length).toBe(10);
    // Item teratas harus berkategori kuliner dan modalnya <= 10.000.000
    const topOpportunity = prioritized[0];
    expect(topOpportunity.category).toBe('culinary');
    expect(topOpportunity.minCapital).toBeLessThanOrEqual(10000000);

    const explanation = generateMatchExplanation(topOpportunity, userProfile);
    expect(explanation).toContain('Sesuai dengan minat Anda pada kategori culinary');
    expect(explanation).toContain('mencukupi estimasi modal minimal');
  });

  it('generates transparent explanation when user capital is insufficient for opportunity', () => {
    const userProfile: UserProfile = {
      id: 'usr_test_low_capital',
      fullName: 'Andi',
      goal: 'start_new',
      availableCapital: 5000000,
      location: { province: 'DKI Jakarta', regency: 'Jakarta' },
      experience: 'beginner',
      preferredCategories: ['services'],
      updatedAt: new Date().toISOString(),
    };

    const expensiveServiceOpp: BusinessOpportunity = {
      id: 'opp-service-expensive',
      slug: 'servis-mahal',
      title: 'Jasa Cuci Mobil & Detailing',
      category: 'services',
      shortDescription: 'Cuci mobil profesional',
      fullDescription: 'Detail lengkap',
      minCapital: 25000000,
      maxCapital: 50000000,
      matchingRationale: 'Pangsa pasar kendaraan tinggi',
      targetCustomer: 'Pemilik mobil',
      riskLevel: 'medium',
      riskMitigationTips: [],
      defaultFinancialAssumptions: {
        sellingPricePerUnit: 50000,
        estimatedUnitsSoldPerDay: 15,
        operatingDaysPerMonth: 30,
        variableCostPerUnit: 12000,
        monthlyRent: 3000000,
        monthlyLaborCost: 4000000,
        monthlyUtilitiesCost: 800000,
        monthlyOtherFixedCost: 500000,
        initialInvestmentCapital: 25000000,
      },
      isSimulation: true,
      dataSourceLabel: 'Data Simulasi',
    };

    const explanation = generateMatchExplanation(expensiveServiceOpp, userProfile);
    expect(explanation).toContain('membutuhkan tambahan sekitar Rp 20.000.000');
  });
});
