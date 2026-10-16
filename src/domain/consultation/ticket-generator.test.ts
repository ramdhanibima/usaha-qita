import { describe, it, expect } from 'vitest';
import {
  generateTicketReference,
  isValidTicketReference,
} from './ticket-generator';

describe('ticket-generator (AC-MANTRI-03.1)', () => {
  it('menghasilkan nomor tiket sesuai format standar UQ-MNT-[YYYYMM]-[XXXX]', () => {
    const ticket = generateTicketReference();
    const regex = /^UQ-MNT-\d{6}-[A-Z0-9]{4}$/;
    expect(ticket).toMatch(regex);
    expect(isValidTicketReference(ticket)).toBe(true);
  });

  it('menggunakan tahun dan bulan yang ditentukan secara deterministik', () => {
    // 15 Oktober 2026 -> YYYYMM = 202610
    const fixedDate = new Date(2026, 9, 15);
    const ticket = generateTicketReference(fixedDate, '8472');

    expect(ticket).toBe('UQ-MNT-202610-8472');
    expect(isValidTicketReference(ticket)).toBe(true);
  });

  it('menggunakan suffix kustom secara konsisten', () => {
    const fixedDate = new Date(2025, 0, 1); // Januari 2025 -> 202501
    const ticket = generateTicketReference(fixedDate, 'abcd');

    // Huruf kecil harus dikonversi ke uppercase
    expect(ticket).toBe('UQ-MNT-202501-ABCD');
  });

  it('menangani suffix yang kurang dari 4 karakter dengan padding aman', () => {
    const fixedDate = new Date(2026, 4, 1);
    const ticket = generateTicketReference(fixedDate, 'A1');

    expect(ticket).toBe('UQ-MNT-202605-A100');
    expect(isValidTicketReference(ticket)).toBe(true);
  });

  describe('isValidTicketReference', () => {
    it('mengembalikan true untuk format valid', () => {
      expect(isValidTicketReference('UQ-MNT-202610-8472')).toBe(true);
      expect(isValidTicketReference('UQ-MNT-202501-ABCD')).toBe(true);
    });

    it('mengembalikan false jika awalan salah atau format tidak cocok', () => {
      expect(isValidTicketReference('BRI-MNT-202610-8472')).toBe(false);
      expect(isValidTicketReference('UQ-MNT-2610-8472')).toBe(false); // bulan hanya 4 digit
      expect(isValidTicketReference('UQ-MNT-202610-847')).toBe(false); // suffix hanya 3 digit
      expect(isValidTicketReference('')).toBe(false);
    });
  });
});

