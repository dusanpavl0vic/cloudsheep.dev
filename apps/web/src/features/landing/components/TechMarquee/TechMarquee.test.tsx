import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { describe, expect, it } from 'vitest'

import { TECH_ITEMS } from '@/features/landing/tech.constants'

import { TECH_ICONS } from './TechIcon'
import { TechMarquee } from './TechMarquee'

describe('TechMarquee', () => {
  it('renderuje svaku tehnologiju', () => {
    render(<TechMarquee />)

    for (const item of TECH_ITEMS) {
      // Dva puta jer traka sadrži dve kopije liste — druga je duplikat za petlju
      expect(screen.getAllByText(item.label)).toHaveLength(2)
    }
  })

  it('duplikat je aria-hidden — screen reader ne sme da čita spisak dvaput', () => {
    render(<TechMarquee />)

    const lists = screen.getAllByRole('list', { hidden: true })
    expect(lists).toHaveLength(2)
    expect(lists[0]).not.toHaveAttribute('aria-hidden')
    expect(lists[1]).toHaveAttribute('aria-hidden', 'true')
  })

  it('pristupačnom stablu je vidljiva tačno jedna lista', () => {
    render(<TechMarquee />)
    expect(screen.getAllByRole('list')).toHaveLength(1)
  })

  it('svaka stavka ima ikonu', () => {
    const { container } = render(<TechMarquee />)
    // 12 tehnologija × 2 kopije = 24 ikone + 2 gradijenta na krajevima (span, ne svg)
    expect(container.querySelectorAll('svg')).toHaveLength(TECH_ITEMS.length * 2)
  })

  it('svaki id iz konstanti ima svoju ikonu — inače bi stavka pukla u renderu', () => {
    for (const item of TECH_ITEMS) {
      expect(TECH_ICONS[item.id]).toBeDefined()
    }
  })

  it('nema axe povreda', async () => {
    const { container } = render(<TechMarquee />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
