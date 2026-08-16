import { describe, expect, it } from 'vitest';

import { toISODate } from './toISODate';

describe('toISODate', () => {
  it('vraća YYYY-MM-DD', () => {
    expect(toISODate(new Date('2026-08-16T13:45:00Z'))).toBe('2026-08-16');
  });

  it('radi na granici godine', () => {
    expect(toISODate(new Date('2025-12-31T23:59:59Z'))).toBe('2025-12-31');
  });

  it('baca za neispravan datum', () => {
    expect(() => toISODate(new Date('nije datum'))).toThrow(RangeError);
  });
});
