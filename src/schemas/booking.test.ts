import { describe, expect, it } from 'vitest'

import { slotGeneratorFormSchema, toGenerateSlotsInput } from './booking'

const valid = { from: '2026-10-12', to: '2026-10-23', weekdays: [1, 3], times: '14:30, 10:00,10:00' }

describe('slotGeneratorFormSchema', () => {
  it('prihvata satnice odvojene zarezom, sa razmacima ili bez', () => {
    expect(slotGeneratorFormSchema.safeParse(valid).success).toBe(true)
  })

  it('odbija satnicu van formata HH:MM', () => {
    const result = slotGeneratorFormSchema.safeParse({ ...valid, times: '10:00, 9:30' })
    expect(result.error?.issues[0]?.message).toBe('validation.times')
  })

  it('traži bar jedan dan', () => {
    const result = slotGeneratorFormSchema.safeParse({ ...valid, weekdays: [] })
    expect(result.error?.issues[0]?.message).toBe('validation.pick')
  })

  it('kraj ne sme pre početka', () => {
    const result = slotGeneratorFormSchema.safeParse({ ...valid, to: '2026-10-01' })
    expect(result.error?.issues[0]?.path).toEqual(['to'])
  })
})

describe('toGenerateSlotsInput', () => {
  it('rastavlja, sortira i izbacuje duplikate satnica', () => {
    expect(toGenerateSlotsInput(valid).times).toEqual(['10:00', '14:30'])
  })
})
