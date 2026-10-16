import { describe, it, expect, beforeEach } from 'vitest';
import { USER_PROFILE_STORAGE_KEY } from './use-user-profile';
import { safeStorage } from '@/lib/safe-storage';
import type { UserProfile } from '@/types/profile';
import type { UserProfileFormData } from '@/domain/validation/profile.schema';

describe('Profile Persistence & Storage (REQ-PROF-03, AC-PROF-03.1)', () => {
  beforeEach(() => {
    safeStorage.clear();
  });

  const sampleProfile: UserProfile = {
    id: 'usr_test_123',
    fullName: 'Siti Rahma',
    goal: 'grow_existing',
    availableCapital: 25000000,
    location: {
      province: 'DKI Jakarta',
      regency: 'Jakarta Selatan',
      district: 'Tebet',
    },
    experience: 'intermediate',
    preferredCategories: ['culinary', 'services'],
    updatedAt: new Date().toISOString(),
  };

  it('returns null when no profile has been saved (empty state)', () => {
    const loaded = safeStorage.getItem<UserProfile | null>(USER_PROFILE_STORAGE_KEY, null);
    expect(loaded).toBeNull();
  });

  it('stores and retrieves profile correctly from local storage (AC-PROF-03.1)', () => {
    const success = safeStorage.setItem(USER_PROFILE_STORAGE_KEY, sampleProfile);
    expect(success).toBe(true);

    const loaded = safeStorage.getItem<UserProfile | null>(USER_PROFILE_STORAGE_KEY, null);
    expect(loaded).not.toBeNull();
    expect(loaded?.fullName).toBe('Siti Rahma');
    expect(loaded?.goal).toBe('grow_existing');
    expect(loaded?.availableCapital).toBe(25000000);
    expect(loaded?.location.regency).toBe('Jakarta Selatan');
    expect(loaded?.preferredCategories).toEqual(['culinary', 'services']);
  });

  it('updates partial fields of existing profile without losing other data', () => {
    safeStorage.setItem(USER_PROFILE_STORAGE_KEY, sampleProfile);

    const existing = safeStorage.getItem<UserProfile | null>(USER_PROFILE_STORAGE_KEY, null);
    expect(existing).not.toBeNull();

    const updatedProfile: UserProfile = {
      ...existing!,
      availableCapital: 30000000,
      updatedAt: new Date().toISOString(),
    };

    safeStorage.setItem(USER_PROFILE_STORAGE_KEY, updatedProfile);

    const reloaded = safeStorage.getItem<UserProfile | null>(USER_PROFILE_STORAGE_KEY, null);
    expect(reloaded?.availableCapital).toBe(30000000);
    expect(reloaded?.fullName).toBe('Siti Rahma');
  });

  it('clears stored profile on user reset request', () => {
    safeStorage.setItem(USER_PROFILE_STORAGE_KEY, sampleProfile);
    expect(safeStorage.getItem(USER_PROFILE_STORAGE_KEY, null)).not.toBeNull();

    safeStorage.removeItem(USER_PROFILE_STORAGE_KEY);
    expect(safeStorage.getItem(USER_PROFILE_STORAGE_KEY, null)).toBeNull();
  });

  it('transforms UserProfileFormData into complete UserProfile structure correctly', () => {
    const formData: UserProfileFormData = {
      fullName: '  Ahmad Fauzi  ',
      goal: 'start_new',
      availableCapital: 10000000,
      location: {
        province: ' Jawa Tengah ',
        regency: ' Kota Semarang ',
        district: ' Tembalang ',
      },
      experience: 'beginner',
      preferredCategories: ['retail'],
    };

    const transformed: UserProfile = {
      id: `usr_${Date.now()}_test`,
      fullName: formData.fullName.trim(),
      goal: formData.goal,
      availableCapital: formData.availableCapital,
      location: {
        province: formData.location.province.trim(),
        regency: formData.location.regency.trim(),
        district: formData.location.district?.trim(),
      },
      experience: formData.experience,
      preferredCategories: formData.preferredCategories,
      updatedAt: new Date().toISOString(),
    };

    expect(transformed.fullName).toBe('Ahmad Fauzi');
    expect(transformed.location.province).toBe('Jawa Tengah');
    expect(transformed.location.regency).toBe('Kota Semarang');
    expect(transformed.location.district).toBe('Tembalang');
    expect(transformed.id).toMatch(/^usr_\d+_test/);
  });
});

