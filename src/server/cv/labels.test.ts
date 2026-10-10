import { describe, expect, it, vi } from 'vitest'

import { CV_LABELS, formatDuration, formatRange, label, monthsBetween } from './labels'

describe('label', () => {
  it('vraća natpis na traženom jeziku', () => {
    expect(label('experience', 'sr')).toBe('ISKUSTVO')
    expect(label('experience', 'en')).toBe('EXPERIENCE')
  })

  it('svaki ključ postoji na oba jezika — prazan natpis u PDF-u je nevidljiv kvar', () => {
    for (const [key, value] of Object.entries(CV_LABELS)) {
      expect(value.sr, key).toBeTruthy()
      expect(value.en, key).toBeTruthy()
    }
  })
})

describe('formatRange', () => {
  it('meseci se skraćuju po jeziku', () => {
    expect(formatRange(2023, 3, 2024, 8, 'sr')).toBe('mar 2023 — avg 2024')
    expect(formatRange(2023, 3, 2024, 8, 'en')).toBe('Mar 2023 — Aug 2024')
  })

  it('bez meseca ostaje gola godina', () => {
    expect(formatRange(2023, null, 2024, null, 'sr')).toBe('2023 — 2024')
  })

  it('otvoren kraj daje „danas", ne praznu stranu crtice', () => {
    expect(formatRange(2024, 1, null, null, 'sr')).toBe('jan 2024 — danas')
    expect(formatRange(2024, 1, null, null, 'en')).toBe('Jan 2024 — present')
  })

  it('mesec van opsega ne ostavlja `undefined` u tekstu', () => {
    expect(formatRange(2023, 13, 2024, 1, 'sr')).toBe('2023 — jan 2024')
  })
})

describe('monthsBetween', () => {
  it('broji uključivo — januar do marta je tri meseca, ne dva', () => {
    expect(monthsBetween(2024, 1, 2024, 3)).toBe(3)
  })

  it('isti mesec je jedan mesec', () => {
    expect(monthsBetween(2024, 5, 2024, 5)).toBe(1)
  })

  it('bez meseca uzima pun opseg godina — januar do decembra', () => {
    expect(monthsBetween(2023, null, 2023, null)).toBe(12)
  })

  it('otvoren kraj se računa do danas', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-15T00:00:00Z'))

    expect(monthsBetween(2026, 1, null, null)).toBe(3)
    vi.useRealTimers()
  })

  it('obrnut redosled datuma daje nulu, ne negativan broj', () => {
    expect(monthsBetween(2024, 6, 2023, 1)).toBe(0)
  })
})

describe('formatDuration', () => {
  it.each([
    [1, '1 mesec'],
    [2, '2 meseca'],
    [4, '4 meseca'],
    [5, '5 meseci'],
    [11, '11 meseci'],
    [12, '1 godina'],
    [13, '1 godina 1 mesec'],
    [24, '2 godine'],
    [27, '2 godine 3 meseca'],
    [60, '5 godina'],
  ])('srpski: %i meseci → %s', (months, expected) => {
    expect(formatDuration(months, 'sr')).toBe(expected)
  })

  it('izuzetak 11–14: ide treći oblik, ne prvi po poslednjoj cifri', () => {
    expect(formatDuration(11 * 12, 'sr')).toBe('11 godina')
    expect(formatDuration(12 * 12, 'sr')).toBe('12 godina')
    expect(formatDuration(21 * 12, 'sr')).toBe('21 godina')
    expect(formatDuration(22 * 12, 'sr')).toBe('22 godine')
  })

  it('engleski ima dva oblika', () => {
    expect(formatDuration(1, 'en')).toBe('1 month')
    expect(formatDuration(3, 'en')).toBe('3 months')
    expect(formatDuration(12, 'en')).toBe('1 year')
    expect(formatDuration(30, 'en')).toBe('2 years 6 months')
  })

  it('nula je uvek greška u datumima — prikazuje se kao jedan mesec', () => {
    expect(formatDuration(0, 'sr')).toBe('1 mesec')
    expect(formatDuration(-5, 'en')).toBe('1 month')
  })

  it('pune godine ne vuku „0 meseci" za sobom', () => {
    expect(formatDuration(36, 'sr')).toBe('3 godine')
  })
})
