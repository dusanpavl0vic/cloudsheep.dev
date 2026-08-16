import { describe, expect, it } from 'vitest';

import { isPhoneRS } from './isPhoneRS';

describe('isPhoneRS', () => {
  it.each([
    '+381641234567',
    '00381641234567',
    '0641234567',
    '011234567',
    '064 123 4567',
    '064-123-4567',
    '(064) 123-4567',
    '+381 64 123 45 67',
  ])('prihvata %s', (value) => {
    expect(isPhoneRS(value)).toBe(true);
  });

  it.each([
    ['prazan', ''],
    ['prekratak', '064123'],
    ['predugačak', '06412345678901'],
    ['strani pozivni', '+491234567890'],
    ['sa slovima', '064ABCDEFG'],
    ['bez vodeće nule', '641234567'],
  ])('odbija %s', (_opis, value) => {
    expect(isPhoneRS(value)).toBe(false);
  });

  it('odbija +381 sa suvišnom nulom — dvostruka nacionalna oznaka', () => {
    expect(isPhoneRS('+3810641234567')).toBe(false);
  });
});
