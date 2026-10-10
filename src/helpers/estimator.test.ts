import { describe, expect, it } from 'vitest'

import { ESTIMATE_DEFAULTS } from '@/constants/estimator'

import { estimate, toggleItem } from './estimator'

describe('estimate', () => {
  it('podrazumevani izbor iz dizajna: web aplikacija, nalozi + admin → 10–13 nedelja', () => {
    // (8 + 0 + 1 + 2) × 1 = 11 → 0,9 × 11 ≈ 10, 1,15 × 11 → 13
    const result = estimate(ESTIMATE_DEFAULTS)
    expect([result.low, result.high]).toEqual([10, 13])
    expect(result.phases).toEqual([
      { key: 'discover', weeks: 1 },
      { key: 'design', weeks: 3 },
      { key: 'build', weeks: 6 },
      { key: 'launch', weeks: 1 },
    ])
    expect(result.specialists).toBe(1)
  })

  it('platforme se računaju samo za web i mobilnu aplikaciju', () => {
    const site = estimate({ type: 'site', platforms: ['ios', 'android'], features: [], pace: 'standard' })
    expect(site.high).toBe(Math.ceil(3 * 1.15))
  })

  it('samo dizajn nema fazu izrade i nema specijalistu', () => {
    const result = estimate({ type: 'design', platforms: [], features: [], pace: 'standard' })
    expect(result.phases.map((p) => p.key)).not.toContain('build')
    expect(result.specialists).toBe(0)
  })

  it('prioritetni tempo skraćuje, a najkraći projekat je 2 nedelje', () => {
    const result = estimate({ type: 'site', platforms: [], features: [], pace: 'priority' })
    expect(result.low).toBe(2)
  })

  it('mali sajt ne traži specijalistu, a broj nikad nije negativan', () => {
    expect(estimate({ type: 'site', platforms: [], features: ['cms'], pace: 'standard' }).specialists).toBe(0)
  })
})

describe('toggleItem', () => {
  it('dodaje i uklanja', () => {
    expect(toggleItem(['a'], 'b')).toEqual(['a', 'b'])
    expect(toggleItem(['a', 'b'], 'a')).toEqual(['b'])
  })
})
