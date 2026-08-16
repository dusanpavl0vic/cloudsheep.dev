import { describe, expect, it } from 'vitest';

import { bytes } from './bytes';

describe('bytes', () => {
  it.each([
    [0, '0 B'],
    [512, '512 B'],
    [1024, '1 KB'],
    [1536, '1.5 KB'],
    [1024 * 1024, '1 MB'],
    [1024 ** 3, '1 GB'],
    [1024 ** 4, '1 TB'],
    [1024 ** 5, '1 PB'],
  ])('bytes(%i) → %s', (value, expected) => {
    expect(bytes(value)).toBe(expected);
  });

  it('staje na najvećoj poznatoj jedinici', () => {
    expect(bytes(1024 ** 7)).toContain('PB');
  });

  it('poštuje broj decimala', () => {
    expect(bytes(1536, 0)).toBe('2 KB');
    expect(bytes(1536, 2)).toBe('1.5 KB');
  });

  it('podržava negativne vrednosti', () => {
    expect(bytes(-1024)).toBe('-1 KB');
    expect(bytes(-0.5)).toBe('-0 B');
  });

  it('vraća crticu za ne-konačne vrednosti', () => {
    expect(bytes(Number.NaN)).toBe('—');
    expect(bytes(Number.POSITIVE_INFINITY)).toBe('—');
  });
});
