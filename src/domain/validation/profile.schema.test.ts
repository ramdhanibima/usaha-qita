import { describe, it, expect } from 'vitest';
import { userProfileSchema } from './profile.schema';

describe('userProfileSchema validation (REQ-PROF-02, AC-PROF-02.1, AC-PROF-02.2)', () => {
  const validProfileInput = {
    fullName: 'Budi Santoso',
    goal: 'start_new' as const,
    availableCapital: 15000000,
    location: {
      province: 'Jawa Barat',
      regency: 'Kota Bandung',
      district: 'Coblong',
    },
    experience: 'beginner' as const,
    preferredCategories: ['culinary' as const, 'retail' as const],
  };

  it('passes validation with complete valid profile data', () => {
    const result = userProfileSchema.safeParse(validProfileInput);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.fullName).toBe('Budi Santoso');
      expect(result.data.availableCapital).toBe(15000000);
      expect(result.data.preferredCategories).toHaveLength(2);
    }
  });

  it('rejects capital below Rp 500.000 with exact error message (AC-PROF-02.1)', () => {
    const invalidInput = {
      ...validProfileInput,
      availableCapital: 499999,
    };
    const result = userProfileSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
    if (!result.success) {
      const capitalError = result.error.errors.find(
        (err) => err.path.includes('availableCapital')
      );
      expect(capitalError?.message).toBe(
        'Modal awal minimal Rp 500.000 untuk simulasi yang realistis'
      );
    }
  });

  it('rejects negative capital (AC-PROF-02.1)', () => {
    const invalidInput = {
      ...validProfileInput,
      availableCapital: -100000,
    };
    const result = userProfileSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
    if (!result.success) {
      const capitalError = result.error.errors.find(
        (err) => err.path.includes('availableCapital')
      );
      expect(capitalError?.message).toBe(
        'Modal awal minimal Rp 500.000 untuk simulasi yang realistis'
      );
    }
  });

  it('rejects empty preferred categories with exact error message (AC-PROF-02.2)', () => {
    const invalidInput = {
      ...validProfileInput,
      preferredCategories: [],
    };
    const result = userProfileSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
    if (!result.success) {
      const categoryError = result.error.errors.find(
        (err) => err.path.includes('preferredCategories')
      );
      expect(categoryError?.message).toBe(
        'Pilih minimal 1 kategori usaha yang menarik minat Anda'
      );
    }
  });

  it('rejects full name shorter than 3 characters', () => {
    const invalidInput = {
      ...validProfileInput,
      fullName: 'Al',
    };
    const result = userProfileSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
    if (!result.success) {
      const nameError = result.error.errors.find(
        (err) => err.path.includes('fullName')
      );
      expect(nameError?.message).toBe('Nama lengkap minimal 3 karakter');
    }
  });

  it('rejects invalid business goal enum', () => {
    const invalidInput = {
      ...validProfileInput,
      goal: 'invalid_goal',
    };
    const result = userProfileSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
  });

  it('rejects empty province and regency in location', () => {
    const invalidInput = {
      ...validProfileInput,
      location: {
        province: '',
        regency: '',
      },
    };
    const result = userProfileSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
  });
});
