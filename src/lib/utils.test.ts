import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn utility', () => {
  it('combines classes properly', () => {
    expect(cn('px-2', 'py-1')).toBe('px-2 py-1');
  });

  it('handles conditional classes properly', () => {
    expect(cn('btn', true && 'btn-active', false && 'btn-hidden')).toBe('btn btn-active');
  });
});

