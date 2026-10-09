import { describe, expect, it } from 'vitest'

import { addDays, dayInZone, daysBetween, isoWeekday, zonedTimeToUtc, formatDate } from './date'

const TZ = 'Europe/Belgrade'

describe('zonedTimeToUtc', () => {
  it('zimsko vreme: Beograd je UTC+1', () => {
    expect(zonedTimeToUtc('2026-01-15', '13:00', TZ).toISOString()).toBe('2026-01-15T12:00:00.000Z')
  })

  it('letnje vreme: Beograd je UTC+2', () => {
    expect(zonedTimeToUtc('2026-07-15', '13:00', TZ).toISOString()).toBe('2026-07-15T11:00:00.000Z')
  })

  it('dan prelaza na zimsko vreme (25. 10. 2026)', () => {
    expect(zonedTimeToUtc('2026-10-25', '10:00', TZ).toISOString()).toBe('2026-10-25T09:00:00.000Z')
  })
})

describe('kalendar', () => {
  it('ISO dan u nedelji', () => {
    expect(isoWeekday('2026-10-12')).toBe(1) // ponedeljak
    expect(isoWeekday('2026-10-18')).toBe(7) // nedelja
  })

  it('dani od–do, uključivo', () => {
    expect(daysBetween('2026-10-30', '2026-11-02')).toEqual([
      '2026-10-30',
      '2026-10-31',
      '2026-11-01',
      '2026-11-02',
    ])
  })
})

describe('formatDate', () => {
  it('srpski je latinica, ne ćirilica', () => {
    const text = formatDate('2026-09-08T10:00:00Z', 'sr', { dateStyle: 'long' })
    expect(text).toContain('septembar')
    expect(text).not.toMatch(/[\u0400-\u04FF]/)
  })

  it('engleski (en-GB)', () => {
    expect(formatDate('2026-09-08T10:00:00Z', 'en', { dateStyle: 'long' })).toBe('8 September 2026')
  })
})

describe('dayInZone', () => {
  it('posle ponoći u Beogradu je već sledeći dan, iako je u UTC-u još prethodni', () => {
    expect(dayInZone(new Date('2026-10-09T22:30:00Z'), TZ)).toBe('2026-10-10')
  })
})

describe('addDays', () => {
  it('prelazi preko kraja meseca i godine', () => {
    expect(addDays('2026-12-30', 3)).toBe('2027-01-02')
  })

  it('ne pomera dan pri prelasku na zimsko vreme', () => {
    expect(addDays('2026-10-24', 2)).toBe('2026-10-26')
  })
})
