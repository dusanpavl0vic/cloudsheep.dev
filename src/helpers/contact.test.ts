import { describe, expect, it } from 'vitest'

import { parseContactPrefill } from './contact'

describe('parseContactPrefill', () => {
  it('procena sa početne postaje tip i procena upita', () => {
    const prefill = parseContactPrefill({ type: 'mobile', platforms: 'web,ios', features: 'auth,admin', pace: 'standard' })
    expect(prefill.projectType).toBe('mobile')
    expect(prefill.estimate).toEqual({ type: 'mobile', platforms: ['web', 'ios'], features: ['auth', 'admin'], pace: 'standard' })
  })

  it('nepoznate vrednosti se tiho odbacuju', () => {
    const prefill = parseContactPrefill({ type: 'hack', budget: '1M', plan: 'gold', platforms: 'web,<script>', pace: 'standard' })
    expect(prefill).toEqual({ projectType: null, budget: null, timeline: null, plan: null, estimate: null })
  })

  it('paket bez procene', () => {
    expect(parseContactPrefill({ plan: 'monthly' }).plan).toBe('monthly')
    expect(parseContactPrefill({ plan: 'monthly' }).estimate).toBeNull()
  })

  it('niz u query-ju (?type=a&type=b) se ne prihvata', () => {
    expect(parseContactPrefill({ type: ['webapp', 'site'] }).projectType).toBeNull()
  })
})
