import { beforeEach, describe, expect, it } from 'vitest'

import {
  clearFormatterCache,
  formatCurrency,
  formatDate,
  formatNumber,
  formatPercent,
  formatRelative,
} from './formatters'

const NOW = Date.parse('2026-08-16T12:00:00Z')
const clock = () => NOW

/** Intl ubacuje neprekidne razmake — poređenje po znakovima bi bilo krhko. */
const normalize = (value: string) => value.replace(/[\u00a0\u202f]/g, ' ')

describe('formatNumber', () => {
  beforeEach(() => { clearFormatterCache() })

  it('koristi srpski format sa tačkom kao separatorom hiljada', () => {
    expect(normalize(formatNumber(1234567.89, 'sr'))).toBe('1.234.567,89')
  })

  it('koristi engleski format sa zarezom', () => {
    expect(normalize(formatNumber(1234567.89, 'en'))).toBe('1,234,567.89')
  })

  it('prihvata Intl opcije', () => {
    expect(formatNumber(0.5, 'en', { minimumFractionDigits: 2 })).toBe('0.50')
  })
})

describe('formatCurrency', () => {
  beforeEach(() => { clearFormatterCache() })

  it('formatira evro po lokalu', () => {
    expect(normalize(formatCurrency(1234.5, 'sr'))).toContain('1.234,50')
    expect(normalize(formatCurrency(1234.5, 'en'))).toContain('1,234.50')
  })

  it('prihvata drugu valutu', () => {
    expect(formatCurrency(100, 'en', 'USD')).toContain('100')
  })
})

describe('formatPercent', () => {
  beforeEach(() => { clearFormatterCache() })

  it('formatira procenat bez decimala', () => {
    expect(normalize(formatPercent(0.42, 'en'))).toBe('42%')
  })

  it('poštuje broj decimala', () => {
    expect(normalize(formatPercent(0.4256, 'en', 2))).toBe('42.56%')
  })
})

describe('formatDate', () => {
  beforeEach(() => { clearFormatterCache() })

  it('formatira datum po lokalu', () => {
    const date = new Date('2026-08-16T00:00:00Z')
    expect(formatDate(date, 'en', { dateStyle: 'short', timeZone: 'UTC' })).toBeTruthy()
    expect(formatDate(date, 'sr', { dateStyle: 'short', timeZone: 'UTC' })).toBeTruthy()
  })

  it('srpski i engleski daju različit ispis', () => {
    const date = new Date('2026-08-16T00:00:00Z')
    const options: Intl.DateTimeFormatOptions = { dateStyle: 'long', timeZone: 'UTC' }
    expect(formatDate(date, 'sr', options)).not.toBe(formatDate(date, 'en', options))
  })
})

describe('formatRelative', () => {
  beforeEach(() => { clearFormatterCache() })

  it.each([
    ['pre nekoliko dana', new Date(NOW - 3 * 86_400_000)],
    ['za nekoliko meseci', new Date(NOW + 62 * 86_400_000)],
    ['pre sat vremena', new Date(NOW - 3_600_000)],
    ['pre nekoliko minuta', new Date(NOW - 300_000)],
  ])('daje relativan opis za %s', (_opis, date) => {
    expect(formatRelative(date, 'sr', clock)).toBeTruthy()
  })

  it('bira jedinicu prema veličini razlike', () => {
    expect(formatRelative(new Date(NOW - 3 * 86_400_000), 'en', clock)).toContain('day')
    expect(formatRelative(new Date(NOW - 2 * 3_600_000), 'en', clock)).toContain('hour')
    expect(formatRelative(new Date(NOW - 400 * 86_400_000), 'en', clock)).toContain('year')
  })

  it('razlika manja od sekunde daje „sada"', () => {
    expect(formatRelative(new Date(NOW), 'en', clock)).toBeTruthy()
    expect(formatRelative(new Date(NOW - 100), 'en', clock)).toBeTruthy()
  })

  it('razlikuje prošlost i budućnost', () => {
    const past = formatRelative(new Date(NOW - 2 * 86_400_000), 'en', clock)
    const future = formatRelative(new Date(NOW + 2 * 86_400_000), 'en', clock)
    expect(past).not.toBe(future)
  })
})

describe('keširanje', () => {
  beforeEach(() => { clearFormatterCache() })

  it('ponovljen poziv daje isti rezultat — keš ne kvari izlaz', () => {
    const first = formatNumber(1234.5, 'sr')
    const second = formatNumber(1234.5, 'sr')
    expect(first).toBe(second)
  })

  it('različite opcije ne dele keš', () => {
    expect(formatNumber(0.5, 'en')).not.toBe(formatNumber(0.5, 'en', { minimumFractionDigits: 2 }))
  })
})
