'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { safeStorage } from '@/lib/safe-storage';
import { ROADMAP_DATASET } from '@/domain/roadmap/roadmap-dataset';
import type { RoadmapProgressState } from '@/types/roadmap';

export const ROADMAP_PROGRESS_STORAGE_KEY = 'usaha_qita_roadmap_progress';

export interface UseRoadmapProgressReturn {
  completedStepIds: string[];
  totalSteps: number;
  completedCount: number;
  progressPercentage: number;
  isLoading: boolean;
  isInitialized: boolean;
  isStepCompleted: (stepId: string) => boolean;
  toggleStep: (stepId: string) => boolean;
  markStepCompleted: (stepId: string) => boolean;
  unmarkStepCompleted: (stepId: string) => boolean;
  resetProgress: () => void;
}

/**
 * Custom Hook Pengelola Checklist Progres Roadmap (TASK-ROAD-02, REQ-ROAD-02, AC-ROAD-02.1).
 * Menggunakan safeStorage dengan identitas step stabil ('step-plan-01', dll)
 * dan mencegah hydration mismatch saat Server-Side Rendering di Next.js.
 */
export function useRoadmapProgress(
  totalStepsCount: number = ROADMAP_DATASET.length
): UseRoadmapProgressReturn {
  const [completedStepIds, setCompletedStepIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Muat status centang dari storage setelah mount di browser
  useEffect(() => {
    try {
      const stored = safeStorage.getItem<RoadmapProgressState | null>(
        ROADMAP_PROGRESS_STORAGE_KEY,
        null
      );

      if (stored && Array.isArray(stored.completedStepIds)) {
        // Filter agar hanya berisi string id yang valid
        const validIds = stored.completedStepIds.filter(
          (id): id is string => typeof id === 'string'
        );
        setCompletedStepIds(validIds);
      } else {
        setCompletedStepIds([]);
      }
    } catch {
      setCompletedStepIds([]);
    } finally {
      setIsLoading(false);
      setIsInitialized(true);
    }
  }, []);

  // Simpan progres ke safeStorage
  const persistProgress = useCallback((newCompletedIds: string[]): boolean => {
    const payload: RoadmapProgressState = {
      completedStepIds: newCompletedIds,
      lastUpdated: new Date().toISOString(),
    };
    return safeStorage.setItem(ROADMAP_PROGRESS_STORAGE_KEY, payload);
  }, []);

  /**
   * Cek apakah sebuah langkah berstatus selesai
   */
  const isStepCompleted = useCallback(
    (stepId: string): boolean => {
      return completedStepIds.includes(stepId);
    },
    [completedStepIds]
  );

  /**
   * Tandai langkah sebagai selesai
   */
  const markStepCompleted = useCallback(
    (stepId: string): boolean => {
      if (!stepId || completedStepIds.includes(stepId)) return true;

      const next = [...completedStepIds, stepId];
      setCompletedStepIds(next);
      return persistProgress(next);
    },
    [completedStepIds, persistProgress]
  );

  /**
   * Batalkan tanda selesai sebuah langkah
   */
  const unmarkStepCompleted = useCallback(
    (stepId: string): boolean => {
      if (!stepId || !completedStepIds.includes(stepId)) return true;

      const next = completedStepIds.filter((id) => id !== stepId);
      setCompletedStepIds(next);
      return persistProgress(next);
    },
    [completedStepIds, persistProgress]
  );

  /**
   * Toggle status centang langkah
   */
  const toggleStep = useCallback(
    (stepId: string): boolean => {
      if (completedStepIds.includes(stepId)) {
        return unmarkStepCompleted(stepId);
      } else {
        return markStepCompleted(stepId);
      }
    },
    [completedStepIds, markStepCompleted, unmarkStepCompleted]
  );

  /**
   * Mengatur ulang seluruh progres centang
   */
  const resetProgress = useCallback(() => {
    setCompletedStepIds([]);
    safeStorage.removeItem(ROADMAP_PROGRESS_STORAGE_KEY);
  }, []);

  // Hitung jumlah selesai dan persentase secara deterministik
  const completedCount = completedStepIds.length;
  const totalSteps = Math.max(0, totalStepsCount);
  const progressPercentage = useMemo(() => {
    if (totalSteps <= 0) return 0;
    return Math.min(100, Math.round((completedCount / totalSteps) * 100));
  }, [completedCount, totalSteps]);

  return {
    completedStepIds,
    totalSteps,
    completedCount,
    progressPercentage,
    isLoading,
    isInitialized,
    isStepCompleted,
    toggleStep,
    markStepCompleted,
    unmarkStepCompleted,
    resetProgress,
  };
}

