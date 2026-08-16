import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { describe, expect, it } from 'vitest'

import { TECH_ITEMS } from '@/features/landing/tech.constants'

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

  it('svaka stavka ima logotip iz public/, ne inline SVG', () => {
    const { container } = render(<TechMarquee />)
    const images = container.querySelectorAll('img')

    expect(images).toHaveLength(TECH_ITEMS.length * 2)
    expect(images[0]).toHaveAttribute('src', TECH_ITEMS[0]?.icon ?? '')
  })

  it('logotipi imaju dimenzije — bez njih CLS skače dok se učitavaju', () => {
    const { container } = render(<TechMarquee />)

    for (const img of container.querySelectorAll('img')) {
      expect(img).toHaveAttribute('width')
      expect(img).toHaveAttribute('height')
    }
  })

  it('nema axe povreda', async () => {
    const { container } = render(<TechMarquee />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
