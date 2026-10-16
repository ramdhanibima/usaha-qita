import { describe, it, expect } from 'vitest';
import { MockOpportunityRepository } from './opportunity.repository';
import { UserProfile } from '@/types/profile';

describe('MockOpportunityRepository', () => {
  const repo = new MockOpportunityRepository();

  it('mengambil seluruh katalog peluang usaha dengan metadata simulasi (AC-DATA-02.1)', async () => {
    const items = await repo.getAll();

    expect(items.length).toBeGreaterThanOrEqual(10);
    // Verifikasi kepatuhan etis: setiap peluang wajib memiliki flag simulasi
    for (const item of items) {
      expect(item.isSimulation).toBe(true);
      expect(item.dataSourceLabel).toContain('Data Simulasi');
      expect(item.defaultFinancialAssumptions).toBeDefined();
      expect(item.defaultFinancialAssumptions.sellingPricePerUnit).toBeGreaterThan(0);
    }
  });

  it('mengambil peluang usaha berdasarkan ID spesifik', async () => {
    const item = await repo.getById('opp-culinary-01');

    expect(item).not.toBeNull();
    expect(item?.slug).toBe('kedai-kopi-susu');
    expect(item?.category).toBe('culinary');

    const nonExistent = await repo.getById('non-existent-id');
    expect(nonExistent).toBeNull();
  });

  it('mengambil peluang usaha berdasarkan slug URL', async () => {
    const item = await repo.getBySlug('kedai-kopi-susu');

    expect(item).not.toBeNull();
    expect(item?.id).toBe('opp-culinary-01');
    expect(item?.minCapital).toBe(8000000);

    const nonExistent = await repo.getBySlug('non-existent-slug');
    expect(nonExistent).toBeNull();
  });

  it('mengambil rekomendasi terfilter untuk profil pengguna (AC-OPP-01.1)', async () => {
    const profile: UserProfile = {
      id: 'test-user',
      fullName: 'Budi Test',
      goal: 'start_new',
      availableCapital: 10000000, // Rp 10.000.000
      location: { province: 'Jawa Barat', regency: 'Bandung' },
      experience: 'beginner',
      preferredCategories: ['culinary'],
      updatedAt: new Date().toISOString(),
    };

    const recommended = await repo.getRecommendedForProfile(profile);

    expect(recommended.length).toBeGreaterThan(0);
    // Peluang kuliner terjangkau harus berada di urutan teratas
    expect(recommended[0].category).toBe('culinary');
    expect(recommended[0].minCapital).toBeLessThanOrEqual(10000000);
    expect(recommended[0].matchingRationale).toBeDefined();
    expect(recommended[0].matchingRationale.length).toBeGreaterThan(0);
  });
});

