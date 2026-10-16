import { describe, it, expect, beforeEach } from 'vitest';
import { formatRupiah, formatNumber, formatPercent, parseRupiah } from './formatters';
import { safeStorage } from './safe-storage';

describe('formatters utility', () => {
  it('formats positive numbers as Rupiah correctly', () => {
    const formatted = formatRupiah(15000000);
    expect(formatted).toContain('15.000.000');
    expect(formatted).toMatch(/^Rp\s15\.000\.000/);
  });

  it('formats zero or invalid numbers safely', () => {
    expect(formatRupiah(0)).toContain('0');
    expect(formatRupiah(NaN)).toBe('Rp 0');
  });

  it('formats number with Indonesian thousand separator', () => {
    expect(formatNumber(15000)).toBe('15.000');
    expect(formatNumber(1500000)).toBe('1.500.000');
  });

  it('formats percentages accurately', () => {
    expect(formatPercent(15.54, 1)).toBe('15.5%');
    expect(formatPercent(20, 0)).toBe('20%');
  });

  it('parses formatted Rupiah string back to number', () => {
    expect(parseRupiah('Rp 15.000.000')).toBe(15000000);
    expect(parseRupiah('Rp 500.000')).toBe(500000);
    expect(parseRupiah('')).toBe(0);
  });
});

describe('safeStorage utility', () => {
  beforeEach(() => {
    safeStorage.clear();
  });

  it('sets and gets item correctly with fallback', () => {
    const success = safeStorage.setItem('test_key', { name: 'Warung Kopi', modal: 15000000 });
    expect(success).toBe(true);

    const retrieved = safeStorage.getItem('test_key', null as { name: string; modal: number } | null);
    expect(retrieved).toEqual({ name: 'Warung Kopi', modal: 15000000 });
  });

  it('returns default value when key does not exist', () => {
    const value = safeStorage.getItem('non_existent', 'default_val');
    expect(value).toBe('default_val');
  });

  it('removes item correctly', () => {
    safeStorage.setItem('remove_me', 'data');
    expect(safeStorage.getItem('remove_me', '')).toBe('data');

    safeStorage.removeItem('remove_me');
    expect(safeStorage.getItem('remove_me', 'fallback')).toBe('fallback');
  });
});
