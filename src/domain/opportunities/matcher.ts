import { BusinessOpportunity } from '@/types/opportunity';
import { UserProfile } from '@/types/profile';

/**
 * Menghasilkan alasan kecocokan yang transparan dan objektif untuk pengguna
 * PENTING: Dilarang menjanjikan laba pasti atau kepastian persetujuan pinjaman.
 */
export function generateMatchExplanation(
  opportunity: BusinessOpportunity,
  profile: UserProfile
): string {
  const isCategoryMatch = profile.preferredCategories.includes(
    opportunity.category
  );
  const isCapitalAffordable =
    opportunity.minCapital <= profile.availableCapital;

  if (isCategoryMatch && isCapitalAffordable) {
    return `Sesuai dengan minat Anda pada kategori ${opportunity.category} dan modal yang Anda miliki (Rp ${profile.availableCapital.toLocaleString('id-ID')}) mencukupi estimasi modal minimal (Rp ${opportunity.minCapital.toLocaleString('id-ID')}).`;
  }

  if (isCategoryMatch && !isCapitalAffordable) {
    const shortage = opportunity.minCapital - profile.availableCapital;
    return `Sesuai dengan minat Anda pada kategori ${opportunity.category}, namun perkiraan modal awal membutuhkan tambahan sekitar Rp ${shortage.toLocaleString('id-ID')}.`;
  }

  if (!isCategoryMatch && isCapitalAffordable) {
    return `Kategori usaha alternatif yang berada dalam jangkauan modal Anda (Rp ${profile.availableCapital.toLocaleString('id-ID')}).`;
  }

  return `Peluang usaha kurasi yang dapat dipelajari sebagai referensi eksplorasi bisnis baru.`;
}

/**
 * Algoritma Pencocokan Peluang Usaha Deterministik (Pure Function)
 *
 * Logika Pengurutan & Prioritas:
 * 1. Prioritas Utama: Kategori sesuai minat DAN modal mencukupi (minCapital <= availableCapital).
 * 2. Prioritas Kedua: Kategori lain yang modalnya mencukupi.
 * 3. Prioritas Ketiga: Kategori sesuai minat namun modal membutuhkan penyesuaian (stretch capital).
 *
 * Penanganan Kasus Batas:
 * - Jika katalog kosong: mengembalikan array kosong.
 * - Jika profil tidak memiliki preferensi kategori: seluruh kategori dianggap relevan, diurutkan berdasarkan keterjangkauan modal.
 * - Jika modal pengguna di bawah seluruh peluang: mengembalikan peluang yang paling mendekati modal pengguna.
 */
export function matchOpportunitiesForProfile(
  profile: UserProfile | null | undefined,
  catalog: BusinessOpportunity[]
): BusinessOpportunity[] {
  if (!catalog || catalog.length === 0) {
    return [];
  }

  if (!profile) {
    return [...catalog];
  }

  const userCapital = Math.max(0, profile.availableCapital || 0);
  const userInterests = profile.preferredCategories || [];
  const hasSpecificInterests = userInterests.length > 0;

  // Skor kecocokan untuk setiap peluang
  const scoredItems = catalog.map((opp) => {
    const isCategoryMatch = hasSpecificInterests
      ? userInterests.includes(opp.category)
      : true;
    const isCapitalAffordable = opp.minCapital <= userCapital;

    let score = 0;

    if (isCategoryMatch && isCapitalAffordable) {
      // Prioritas 1: Minat cocok & modal cukup (Skor 300 - selisih rasio modal)
      score = 300 + (1 - opp.minCapital / Math.max(userCapital, 1)) * 50;
    } else if (isCategoryMatch && !isCapitalAffordable) {
      // Prioritas 2: Minat cocok tapi modal kurang sedikit
      const gapRatio = (opp.minCapital - userCapital) / opp.minCapital;
      score = 200 - Math.min(gapRatio * 50, 90);
    } else if (!isCategoryMatch && isCapitalAffordable) {
      // Prioritas 3: Minat beda tapi modal cukup
      score = 100 + (1 - opp.minCapital / Math.max(userCapital, 1)) * 20;
    } else {
      // Prioritas 4: Minat beda & modal tidak cukup
      score = 10;
    }

    return {
      opportunity: {
        ...opp,
        matchingRationale: generateMatchExplanation(opp, profile),
      },
      score,
    };
  });

  // Urutkan berdasarkan skor tertinggi
  scoredItems.sort((a, b) => b.score - a.score);

  return scoredItems.map((item) => item.opportunity);
}

