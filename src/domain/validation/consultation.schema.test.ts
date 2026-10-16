import { describe, it, expect } from 'vitest';
import {
  consultationRequestSchema,
  ConsultationFormData,
} from './consultation.schema';
import { BusinessTopic } from '@/types/consultation';

describe('consultationRequestSchema (AC-MANTRI-01.1, AC-MANTRI-02.1)', () => {
  const validData: ConsultationFormData = {
    fullName: 'Siti Aminah',
    phoneNumber: '081234567890',
    preferredLocation: 'Kecamatan Lowokwaru, Malang',
    businessTopic: 'financial_literacy',
    notes: 'Ingin berdiskusi cara mencatat pembukuan toko kelontong.',
    explicitConsentGiven: true,
    disclaimerAcknowledged: true,
  };

  it('menerima data formulir pengajuan konsultasi yang valid dan lengkap', () => {
    const result = consultationRequestSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  describe('Validasi Nama Lengkap', () => {
    it('menolak nama lengkap yang kurang dari 3 karakter', () => {
      const result = consultationRequestSchema.safeParse({
        ...validData,
        fullName: 'Al',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Nama lengkap minimal 3 karakter');
      }
    });

    it('menolak nama lengkap yang melebihi 100 karakter', () => {
      const result = consultationRequestSchema.safeParse({
        ...validData,
        fullName: 'A'.repeat(101),
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Nama lengkap maksimal 100 karakter');
      }
    });

    it('melakukan trim pada spasi nama lengkap', () => {
      const result = consultationRequestSchema.safeParse({
        ...validData,
        fullName: '   Budi Pratama   ',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.fullName).toBe('Budi Pratama');
      }
    });
  });

  describe('Validasi Nomor WhatsApp Indonesia (AC-MANTRI-01.1)', () => {
    it('menerima format nomor lokal berawalan 08 (misal: 081234567890)', () => {
      const result = consultationRequestSchema.safeParse({
        ...validData,
        phoneNumber: '081234567890',
      });
      expect(result.success).toBe(true);
    });

    it('menerima format nomor internasional berawalan +628 (misal: +6281234567890)', () => {
      const result = consultationRequestSchema.safeParse({
        ...validData,
        phoneNumber: '+6281234567890',
      });
      expect(result.success).toBe(true);
    });

    it('menerima format nomor tanpa simbol plus berawalan 628 (misal: 6281234567890)', () => {
      const result = consultationRequestSchema.safeParse({
        ...validData,
        phoneNumber: '6281234567890',
      });
      expect(result.success).toBe(true);
    });

    it('menolak nomor telepon rumah / kantor (misal: 021-5551234)', () => {
      const result = consultationRequestSchema.safeParse({
        ...validData,
        phoneNumber: '0215551234',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('Nomor WhatsApp tidak valid');
      }
    });

    it('menolak nomor yang mengandung huruf atau simbol acak', () => {
      const result = consultationRequestSchema.safeParse({
        ...validData,
        phoneNumber: '0812abcd3456',
      });
      expect(result.success).toBe(false);
    });

    it('menolak nomor ponsel yang terlalu pendek (< 9 digit)', () => {
      const result = consultationRequestSchema.safeParse({
        ...validData,
        phoneNumber: '0812345',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('Validasi Lokasi Unit Kerja Terdekat', () => {
    it('menolak jika lokasi kosong atau di bawah 3 karakter', () => {
      const result = consultationRequestSchema.safeParse({
        ...validData,
        preferredLocation: ' Bandung',
      });
      expect(result.success).toBe(true);

      const invalidResult = consultationRequestSchema.safeParse({
        ...validData,
        preferredLocation: '  ',
      });
      expect(invalidResult.success).toBe(false);
    });
  });

  describe('Validasi Topik Bimbingan Usaha', () => {
    it('menerima seluruh topik bimbingan terdaftar', () => {
      const topics = [
        'financial_literacy',
        'cashflow_management',
        'business_expansion',
        'general_advice',
      ] as const;

      for (const topic of topics) {
        const result = consultationRequestSchema.safeParse({
          ...validData,
          businessTopic: topic,
        });
        expect(result.success).toBe(true);
      }
    });

    it('menolak topik bimbingan di luar daftar', () => {
      const result = consultationRequestSchema.safeParse({
        ...validData,
        businessTopic: 'crypto_trading' as unknown as BusinessTopic,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Pilih topik bimbingan yang valid');
      }
    });
  });

  describe('Penegakan Persetujuan Eksplisit & Disclaimer (AC-MANTRI-02.1)', () => {
    it('menolak pengajuan jika explicitConsentGiven bernilai false', () => {
      const result = consultationRequestSchema.safeParse({
        ...validData,
        explicitConsentGiven: false,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain(
          'Anda wajib menyetujui ringkasan simulasi usaha'
        );
      }
    });

    it('menolak pengajuan jika disclaimerAcknowledged bernilai false', () => {
      const result = consultationRequestSchema.safeParse({
        ...validData,
        disclaimerAcknowledged: false,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain(
          'Anda wajib memahami bahwa konsultasi ini bukan jaminan persetujuan pinjaman'
        );
      }
    });
  });
});
