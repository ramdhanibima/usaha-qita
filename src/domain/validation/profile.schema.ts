import { z } from 'zod';

export const userProfileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, 'Nama lengkap minimal 3 karakter')
    .max(100, 'Nama lengkap maksimal 100 karakter'),
  goal: z.enum(['start_new', 'grow_existing', 'expand_region'], {
    errorMap: () => ({ message: 'Pilih salah satu tujuan usaha yang valid' }),
  }),
  availableCapital: z
    .number({ invalid_type_error: 'Modal awal harus berupa angka' })
    .min(500000, 'Modal awal minimal Rp 500.000 untuk simulasi yang realistis'),
  location: z.object({
    province: z.string().trim().min(1, 'Provinsi wajib dipilih'),
    regency: z.string().trim().min(1, 'Kota/Kabupaten wajib dipilih'),
    district: z.string().trim().optional(),
  }),
  experience: z.enum(['beginner', 'intermediate', 'advanced'], {
    errorMap: () => ({ message: 'Pilih tingkat pengalaman yang valid' }),
  }),
  preferredCategories: z
    .array(z.enum(['culinary', 'retail', 'services', 'agribusiness', 'creative']))
    .min(1, 'Pilih minimal 1 kategori usaha yang menarik minat Anda'),
});

export type UserProfileFormData = z.infer<typeof userProfileSchema>;

