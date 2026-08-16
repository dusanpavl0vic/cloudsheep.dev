import { describe, expect, it } from 'vitest';

import { diffInDays } from './diffInDays';

describe('diffInDays', () => {
  it('računa razliku unapred', () => {
    expect(diffInDays(new Date('2026-08-16'), new Date('2026-08-20'))).toBe(4);
  });

  it('negativna je kad je b pre a', () => {
    expect(diffInDays(new Date('2026-08-20'), new Date('2026-08-16'))).toBe(-4);
  });

  it('isti dan je nula bez obzira na sat', () => {
    expect(diffInDays(new Date('2026-08-16T01:00:00Z'), new Date('2026-08-16T23:00:00Z'))).toBe(0);
  });

  it('prelazi granicu meseca', () => {
    expect(diffInDays(new Date('2026-01-31'), new Date('2026-02-01'))).toBe(1);
  });

  it('prelazi prestupnu godinu', () => {
    expect(diffInDays(new Date('2028-02-28'), new Date('2028-03-01'))).toBe(2);
  });
});
