import { describe, expect, it } from 'vitest';

import { truncate } from './truncate';

describe('truncate', () => {
  it('ne dira tekst kraći od granice', () => {
    expect(truncate('kratko', 10)).toBe('kratko');
  });

  it('ne dira tekst tačno na granici', () => {
    expect(truncate('12345', 5)).toBe('12345');
  });

  it('skraćuje i dodaje sufiks unutar granice', () => {
    expect(truncate('abcdefghij', 5)).toBe('abcd…');
    expect(truncate('abcdefghij', 5)).toHaveLength(5);
  });

  it('seče viseći razmak pre sufiksa', () => {
    expect(truncate('abc defghij', 7)).toBe('abc de…');
  });

  it('prihvata sopstveni sufiks', () => {
    expect(truncate('abcdefghij', 6, '...')).toBe('abc...');
  });

  it('vraća prazno za nepozitivnu granicu', () => {
    expect(truncate('abc', 0)).toBe('');
    expect(truncate('abc', -1)).toBe('');
  });

  it('seče sam sufiks kad je duži od granice', () => {
    expect(truncate('abcdef', 2, '...')).toBe('..');
  });
});
