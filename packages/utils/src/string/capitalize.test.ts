import { describe, expect, it } from 'vitest';

import { capitalize } from './capitalize';

describe('capitalize', () => {
  it.each([
    ['zdravo', 'Zdravo'],
    ['čačak', 'Čačak'],
    ['ABC', 'ABC'],
    ['a', 'A'],
    ['', ''],
    ['1abc', '1abc'],
    ['zdravo svete', 'Zdravo svete'],
  ])('%s → %s', (input, expected) => {
    expect(capitalize(input)).toBe(expected);
  });
});
