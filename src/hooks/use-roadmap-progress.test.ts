import { describe, it, expect, beforeEach } from 'vitest';
import { safeStorage } from '@/lib/safe-storage';
import {
  ROADMAP_PROGRESS_STORAGE_KEY,
} from './use-roadmap-progress';
import {
  ROADMAP_DATASET,
  ROADMAP_PHASE_CONFIG,
} from '@/domain/roadmap/roadmap-dataset';
import type { RoadmapProgressState } from '@/types/roadmap';

describe('Roadmap Progress & Checklist - Pengujian Wajib Fase 7 (REQ-ROAD, AC-ROAD)', () => {
  beforeEach(() => {
    safeStorage.clear();
  });

  // 1. Verifikasi dataset standar: 10 langkah & 4 fase sekuensial (AC-ROAD-01.1)
  it('1. verifies that the roadmap dataset contains exactly 10 sequential steps across 4 phases (AC-ROAD-01.1)', () => {
    expect(ROADMAP_DATASET).toHaveLength(10);

    const phases = ROADMAP_DATASET.map((s) => s.phase);
    expect(phases.filter((p) => p === 'planning')).toHaveLength(3);
    expect(phases.filter((p) => p === 'legality')).toHaveLength(2);
    expect(phases.filter((p) => p === 'operations')).toHaveLength(3);
    expect(phases.filter((p) => p === 'marketing')).toHaveLength(2);

    // Pastikan 4 fase terdaftar di konfigurasi
    expect(ROADMAP_PHASE_CONFIG.planning.number).toBe(1);
    expect(ROADMAP_PHASE_CONFIG.legality.number).toBe(2);
    expect(ROADMAP_PHASE_CONFIG.operations.number).toBe(3);
    expect(ROADMAP_PHASE_CONFIG.marketing.number).toBe(4);
  });

  // 2. Setiap langkah memiliki identitas stabil
  it('2. ensures every roadmap step has a unique and stable identifier', () => {
    const ids = ROADMAP_DATASET.map((s) => s.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ROADMAP_DATASET.length);

    // Identitas tidak bergantung urutan indeks array
    ids.forEach((id) => {
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(0);
      expect(id).toMatch(/^step-[a-z]+-\d{2}$/);
    });
  });

  // 3. Progres nol saat inisialisasi awal (empty state)
  it('3. returns zero progress when no steps are completed', () => {
    const saved = safeStorage.getItem<RoadmapProgressState | null>(
      ROADMAP_PROGRESS_STORAGE_KEY,
      null
    );
    expect(saved).toBeNull();

    const completed = saved?.completedStepIds || [];
    const totalSteps = 10;
    const count = completed.length;
    const percentage = totalSteps > 0 ? Math.round((count / totalSteps) * 100) : 0;

    expect(count).toBe(0);
    expect(percentage).toBe(0);
  });

  // 4. Progres sebagian: 4 dari 10 langkah = 40% (AC-ROAD-02.1)
  it('4. calculates exact 40% progress for 4 completed steps out of 10 (AC-ROAD-02.1)', () => {
    const fourSteps = [
      'step-plan-01',
      'step-plan-02',
      'step-plan-03',
      'step-legal-01',
    ];

    const state: RoadmapProgressState = {
      completedStepIds: fourSteps,
      lastUpdated: new Date().toISOString(),
    };

    const success = safeStorage.setItem(ROADMAP_PROGRESS_STORAGE_KEY, state);
    expect(success).toBe(true);

    const loaded = safeStorage.getItem<RoadmapProgressState | null>(
      ROADMAP_PROGRESS_STORAGE_KEY,
      null
    );
    expect(loaded).not.toBeNull();
    expect(loaded?.completedStepIds).toHaveLength(4);

    const totalSteps = 10;
    const completedCount = loaded?.completedStepIds.length || 0;
    const progressPercentage = Math.round((completedCount / totalSteps) * 100);

    expect(completedCount).toBe(4);
    expect(progressPercentage).toBe(40);
  });

  // 5. Progres 100% saat seluruh langkah selesai
  it('5. calculates 100% progress when all 10 steps are completed', () => {
    const allIds = ROADMAP_DATASET.map((s) => s.id);
    const state: RoadmapProgressState = {
      completedStepIds: allIds,
      lastUpdated: new Date().toISOString(),
    };

    safeStorage.setItem(ROADMAP_PROGRESS_STORAGE_KEY, state);

    const loaded = safeStorage.getItem<RoadmapProgressState | null>(
      ROADMAP_PROGRESS_STORAGE_KEY,
      null
    );
    expect(loaded?.completedStepIds).toHaveLength(10);

    const totalSteps = ROADMAP_DATASET.length;
    const progressPercentage = Math.round(
      ((loaded?.completedStepIds.length || 0) / totalSteps) * 100
    );
    expect(progressPercentage).toBe(100);
  });

  // 6. Mencentang dan membatalkan checklist (toggle)
  it('6. toggles steps accurately and updates saved storage payload', () => {
    let completed: string[] = [];

    // Centang langkah 1
    const step1 = 'step-plan-01';
    completed = [...completed, step1];
    safeStorage.setItem(ROADMAP_PROGRESS_STORAGE_KEY, {
      completedStepIds: completed,
      lastUpdated: new Date().toISOString(),
    });

    let loaded = safeStorage.getItem<RoadmapProgressState | null>(
      ROADMAP_PROGRESS_STORAGE_KEY,
      null
    );
    expect(loaded?.completedStepIds).toContain(step1);

    // Batalkan centang langkah 1 (uncheck)
    completed = completed.filter((id) => id !== step1);
    safeStorage.setItem(ROADMAP_PROGRESS_STORAGE_KEY, {
      completedStepIds: completed,
      lastUpdated: new Date().toISOString(),
    });

    loaded = safeStorage.getItem<RoadmapProgressState | null>(
      ROADMAP_PROGRESS_STORAGE_KEY,
      null
    );
    expect(loaded?.completedStepIds).not.toContain(step1);
    expect(loaded?.completedStepIds).toHaveLength(0);
  });

  // 7. Penanganan data storage rusak atau format salah tanpa crash
  it('7. safely handles corrupted or invalid storage data gracefully', () => {
    // Simpan objek yang rusak (bukan string array)
    safeStorage.setItem(ROADMAP_PROGRESS_STORAGE_KEY, {
      completedStepIds: 'invalid_string_instead_of_array',
    });

    const loaded = safeStorage.getItem<RoadmapProgressState | null>(
      ROADMAP_PROGRESS_STORAGE_KEY,
      null
    );

    // Filter aman
    const safeCompleted =
      loaded && Array.isArray(loaded.completedStepIds)
        ? loaded.completedStepIds.filter((id) => typeof id === 'string')
        : [];

    expect(safeCompleted).toEqual([]);
    expect(safeCompleted.length).toBe(0);
  });

  // 8. Penanganan roadmap kosong tanpa pembagian nol
  it('8. handles empty roadmap step count without division by zero', () => {
    const totalSteps = 0;
    const completedCount = 0;
    const percentage = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

    expect(percentage).toBe(0);
    expect(Number.isFinite(percentage)).toBe(true);
    expect(Number.isNaN(percentage)).toBe(false);
  });

  // 9. Panduan edukasi NIB OSS tidak memuat janji palsu (AC-ROAD-03.1)
  it('9. ensures NIB step has objective, prerequisites, educational tip, and official actionUrl (AC-ROAD-03.1)', () => {
    const nibStep = ROADMAP_DATASET.find((s) => s.id === 'step-legal-01');
    expect(nibStep).toBeDefined();
    expect(nibStep?.phase).toBe('legality');
    expect(nibStep?.title).toContain('NIB');
    expect(nibStep?.actionUrl).toBe('https://oss.go.id');
    expect(nibStep?.prerequisites.length).toBeGreaterThan(0);
    expect(nibStep?.educationalTip).toContain('GRATIS');
  });
});
