import { BusinessOpportunity } from '@/types/opportunity';
import { UserProfile } from '@/types/profile';
import { BUSINESS_CATALOG_DATA } from '@/adapters/mock-data/business-catalog';
import { matchOpportunitiesForProfile } from '@/domain/opportunities/matcher';

/**
 * Antarmuka Repository Peluang Usaha (Port)
 * Memisahkan kontrak pengambilan data dari lapisan tampilan (UI)
 * sehingga siap dialihkan ke API nyata di masa mendatang tanpa mengubah komponen UI.
 */
export interface IOpportunityRepository {
  getAll(): Promise<BusinessOpportunity[]>;
  getById(id: string): Promise<BusinessOpportunity | null>;
  getBySlug(slug: string): Promise<BusinessOpportunity | null>;
  getRecommendedForProfile(profile: UserProfile): Promise<BusinessOpportunity[]>;
}

/**
 * Implementasi Mock Repository dengan Simulasi Latensi & Metadata Transparan
 */
export class MockOpportunityRepository implements IOpportunityRepository {
  private readonly dataset: BusinessOpportunity[];
  private readonly artificialDelayMs: number;

  constructor(
    dataset: BusinessOpportunity[] = BUSINESS_CATALOG_DATA,
    artificialDelayMs: number = 300
  ) {
    this.dataset = dataset;
    // Pada lingkungan pengujian otomatis (vitest), latensi dinonaktifkan agar tes berjalan instan
    this.artificialDelayMs =
      process.env.NODE_ENV === 'test' ? 0 : artificialDelayMs;
  }

  private async simulateLatency(): Promise<void> {
    if (this.artificialDelayMs > 0) {
      await new Promise((resolve) =>
        setTimeout(resolve, this.artificialDelayMs)
      );
    }
  }

  async getAll(): Promise<BusinessOpportunity[]> {
    await this.simulateLatency();
    // Kembalikan salinan baru untuk menjaga immutability
    return this.dataset.map((item) => ({ ...item }));
  }

  async getById(id: string): Promise<BusinessOpportunity | null> {
    await this.simulateLatency();
    const opportunity = this.dataset.find((item) => item.id === id);
    return opportunity ? { ...opportunity } : null;
  }

  async getBySlug(slug: string): Promise<BusinessOpportunity | null> {
    await this.simulateLatency();
    const opportunity = this.dataset.find((item) => item.slug === slug);
    return opportunity ? { ...opportunity } : null;
  }

  async getRecommendedForProfile(
    profile: UserProfile
  ): Promise<BusinessOpportunity[]> {
    await this.simulateLatency();
    return matchOpportunitiesForProfile(profile, this.dataset);
  }
}

// Instance bawaan (singleton) untuk penggunaan standar aplikasi
export const opportunityRepository = new MockOpportunityRepository();

