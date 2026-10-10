import { describe, expect, it } from 'vitest'

import { groupSlotsByDay } from './booking'

const slot = (id: string, startsAt: string) => ({ id, startsAt, durationMin: 30 })

describe('groupSlotsByDay', () => {
  it('grupiše po danu u Beogradu (23:30 UTC je već sledeći dan) i sortira', () => {
    const days = groupSlotsByDay([slot('b', '2026-10-12T23:30:00Z'), slot('a', '2026-10-12T08:00:00Z')], 'en', 5)
    expect(days.map((d) => d.key)).toEqual(['2026-10-12', '2026-10-13'])
    expect(days[0]?.slots[0]?.time).toBe('10:00')
  })

  it('poštuje letnje vreme: 08:00 UTC u januaru je 09:00', () => {
    expect(groupSlotsByDay([slot('a', '2027-01-12T08:00:00Z')], 'sr', 5)[0]?.slots[0]?.time).toBe('09:00')
  })

  it('najviše maxDays dana', () => {
    const slots = ['10', '11', '12', '13'].map((d) => slot(d, `2026-10-${d}T08:00:00Z`))
    expect(groupSlotsByDay(slots, 'en', 2)).toHaveLength(2)
  })

  it('srpski dan u nedelji je latinicom', () => {
    expect(groupSlotsByDay([slot('a', '2026-10-12T08:00:00Z')], 'sr', 5)[0]?.weekday).not.toMatch(/[Ѐ-ӿ]/)
  })
})
