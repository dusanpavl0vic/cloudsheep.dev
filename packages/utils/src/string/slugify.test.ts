import { describe, expect, it } from 'vitest';

import { slugify } from './slugify';

describe('slugify', () => {
  it.each([
    ['Zdravo Svete', 'zdravo-svete'],
    ['Čačak i Šabac', 'cacak-i-sabac'],
    ['Đorđe Žikić', 'djordje-zikic'],
    ['  razmaci  ', 'razmaci'],
    ['a---b', 'a-b'],
    ['Ćao! Kako si?', 'cao-kako-si'],
    ['ÉÀÜ', 'eau'],
    ['', ''],
    ['---', ''],
    ['123 ABC', '123-abc'],
  ])('%s → %s', (input, expected) => {
    expect(slugify(input)).toBe(expected);
  });
});
