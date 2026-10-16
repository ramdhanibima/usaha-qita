'use client';

import { useState, useEffect, useCallback } from 'react';
import type { UserProfile } from '@/types/profile';
import type { UserProfileFormData } from '@/domain/validation/profile.schema';
import { safeStorage } from '@/lib/safe-storage';

export const USER_PROFILE_STORAGE_KEY = 'usaha_qita_profile';

export interface UseUserProfileReturn {
  profile: UserProfile | null;
  isLoading: boolean;
  isInitialized: boolean;
  saveProfile: (data: UserProfileFormData) => boolean;
  updateProfile: (updates: Partial<UserProfile>) => boolean;
  clearProfile: () => void;
}

/**
 * Custom Hook untuk mengelola state profil pengguna dan persistensi lokal (TASK-PROF-01, REQ-PROF-03, AC-PROF-03.1).
 * Menggunakan safeStorage untuk mencegah error pada mode penyamaran (incognito) atau SSR di Next.js.
 * Data disimpan secara lokal di peramban dan tidak dikirim ke server/cloud tanpa persetujuan.
 */
export function useUserProfile(): UseUserProfileReturn {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Memuat profil dari safeStorage setelah komponen ter-mount di browser (mencegah hydration mismatch)
  useEffect(() => {
    try {
      const stored = safeStorage.getItem<UserProfile | null>(
        USER_PROFILE_STORAGE_KEY,
        null
      );
      setProfile(stored);
    } catch {
      setProfile(null);
    } finally {
      setIsLoading(false);
      setIsInitialized(true);
    }
  }, []);

  /**
   * Menyimpan atau mengganti profil pengguna secara lokal.
   */
  const saveProfile = useCallback((data: UserProfileFormData): boolean => {
    try {
      const newProfile: UserProfile = {
        id: profile?.id || `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        fullName: data.fullName.trim(),
        goal: data.goal,
        availableCapital: data.availableCapital,
        location: {
          province: data.location.province.trim(),
          regency: data.location.regency.trim(),
          district: data.location.district?.trim() || undefined,
        },
        experience: data.experience,
        preferredCategories: data.preferredCategories,
        updatedAt: new Date().toISOString(),
      };

      const success = safeStorage.setItem(USER_PROFILE_STORAGE_KEY, newProfile);
      if (success) {
        setProfile(newProfile);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [profile?.id]);

  /**
   * Memperbarui sebagian field profil pengguna.
   */
  const updateProfile = useCallback(
    (updates: Partial<UserProfile>): boolean => {
      if (!profile) return false;

      try {
        const updated: UserProfile = {
          ...profile,
          ...updates,
          updatedAt: new Date().toISOString(),
        };

        const success = safeStorage.setItem(USER_PROFILE_STORAGE_KEY, updated);
        if (success) {
          setProfile(updated);
          return true;
        }
        return false;
      } catch {
        return false;
      }
    },
    [profile]
  );

  /**
   * Menghapus profil pengguna dari penyimpanan lokal (reset data).
   */
  const clearProfile = useCallback(() => {
    try {
      safeStorage.removeItem(USER_PROFILE_STORAGE_KEY);
      setProfile(null);
    } catch {
      setProfile(null);
    }
  }, []);

  return {
    profile,
    isLoading,
    isInitialized,
    saveProfile,
    updateProfile,
    clearProfile,
  };
}

