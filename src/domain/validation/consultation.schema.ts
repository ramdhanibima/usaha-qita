import { z } from 'zod';

export const consultationRequestSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, 'Nama lengkap minimal 3 karakter')
    .max(100, 'Nama lengkap maksimal 100 karakter'),
  phoneNumber: z
    .string()
    .trim()
    .regex(
      /^(\+62|62|0)8[1-9][0-9]{6,10}$/,
      'Nomor WhatsApp tidak valid (contoh: 081234567890 atau +6281234567890)'
    ),
  preferredLocation: z
    .string()
    .trim()
    .min(3, 'Lokasi unit kerja / kecamatan wajib diisi minimal 3 karakter'),
  businessTopic: z.enum(
    ['financial_literacy', 'cashflow_management', 'business_expansion', 'general_advice'],
    {
      errorMap: () => ({ message: 'Pilih topik bimbingan yang valid' }),
    }
  ),
  notes: z.string().trim().max(500, 'Catatan tambahan maksimal 500 karakter').optional(),
  explicitConsentGiven: z.literal(true, {
    errorMap: () => ({
      message: 'Anda wajib menyetujui ringkasan simulasi usaha dibagikan untuk keperluan konsultasi',
    }),
  }),
  disclaimerAcknowledged: z.literal(true, {
    errorMap: () => ({
      message: 'Anda wajib memahami bahwa konsultasi ini bukan jaminan persetujuan pinjaman/kredit',
    }),
  }),
});

export type ConsultationFormData = z.infer<typeof consultationRequestSchema>;

