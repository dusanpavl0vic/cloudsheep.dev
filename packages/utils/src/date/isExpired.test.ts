import { describe, expect, it } from 'vitest';

import { isExpired } from './isExpired';

const NOW = Date.parse('2026-08-16T00:00:00Z');
const clock = () => NOW;

describe('isExpired', () => {
  it('prošlost je istekla', () => {
    expect(isExpired(new Date('2020-01-01'), clock)).toBe(true);
  });

  it('budućnost nije istekla', () => {
    expect(isExpired(new Date('2030-01-01'), clock)).toBe(false);
  });

  it('tačno sada nije isteklo', () => {
    expect(isExpired(new Date(NOW), clock)).toBe(false);
  });

  it('podrazumevano koristi stvarni sat', () => {
    expect(isExpired(new Date('2000-01-01'))).toBe(true);
  });
});
