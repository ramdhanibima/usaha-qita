export type BusinessGoal = 'start_new' | 'grow_existing' | 'expand_region';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';
export type BusinessCategory = 'culinary' | 'retail' | 'services' | 'agribusiness' | 'creative';

export interface UserProfile {
  id: string;
  fullName: string;
  goal: BusinessGoal;
  availableCapital: number; // Dalam Rupiah, minimal Rp 500.000
  location: {
    province: string;
    regency: string; // Kota/Kabupaten
    district?: string; // Kecamatan (opsional)
  };
  experience: ExperienceLevel;
  preferredCategories: BusinessCategory[];
  updatedAt: string; // ISO Date String
}

