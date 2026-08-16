import { describe, expect, it } from 'vitest';

import { mask } from './mask';

describe('mask', () => {
  it('krije sve osim poslednja četiri znaka', () => {
    expect(mask('1234567890123456')).toBe('************3456');
  });

  it('ne dira tekst kraći ili jednak vidljivom delu', () => {
    expect(mask('1234')).toBe('1234');
    expect(mask('123')).toBe('123');
  });

  it('poštuje broj vidljivih znakova', () => {
    expect(mask('abcdefgh', 2)).toBe('******gh');
  });

  it('krije sve kad je vidljivih nula ili manje', () => {
    expect(mask('abcd', 0)).toBe('****');
    expect(mask('abcd', -1)).toBe('****');
  });

  it('prihvata sopstveni znak maske', () => {
    expect(mask('abcdef', 2, '#')).toBe('####ef');
  });

  it('radi sa praznim tekstom', () => {
    expect(mask('', 0)).toBe('');
  });
});
