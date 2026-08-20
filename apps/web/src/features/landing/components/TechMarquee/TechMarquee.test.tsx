import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { describe, expect, it } from 'vitest'

import { TechMarquee } from './TechMarquee'

/** Tehnologije više nisu statični niz — test ih daje kao podatak, kao i API. */
const TECHNOLOGIES = [
  { id: 't1', slug: 'react', label: 'React', group: 'frontend', logoUrl: '/uploads/react.svg' },
  { id: 't2', slug: 'nodejs', label: 'Node.js', group: 'backend', logoUrl: '/uploads/nodejs.svg' },
  { id: 't3', slug: 'gtfs', label: 'GTFS', group: 'tooling', logoUrl: null },
]

describe('TechMarquee', () => {
  it('renderuje svaku tehnologiju', () => {
    render(<TechMarquee technologies={TECHNOLOGIES} />)

    for (const item of TECHNOLOGIES) {
      // Dva puta jer traka sadrži dve kopije liste — druga je duplikat za petlju
      expect(screen.getAllByText(item.label)).toHaveLength(2)
    }
  })

  it('duplikat je aria-hidden — screen reader ne sme da čita spisak dvaput', () => {
    render(<TechMarquee technologies={TECHNOLOGIES} />)

    const lists = screen.getAllByRole('list', { hidden: true })
    expect(lists).toHaveLength(2)
    expect(lists[0]).not.toHaveAttribute('aria-hidden')
    expect(lists[1]).toHaveAttribute('aria-hidden', 'true')
  })

  it('pristupačnom stablu je vidljiva tačno jedna lista', () => {
    render(<TechMarquee technologies={TECHNOLOGIES} />)
    expect(screen.getAllByRole('list')).toHaveLength(1)
  })

  it('svaka stavka ima logotip iz public/, ne inline SVG', () => {
    const { container } = render(<TechMarquee technologies={TECHNOLOGIES} />)
    const images = container.querySelectorAll('img')

    // Samo tehnologije SA logotipom daju `<img>`; ona bez njega prikazuje inicijal.
    // Traka ima dve kopije spiska, otud puta dva.
    const withLogo = TECHNOLOGIES.filter((tech) => tech.logoUrl !== null)
    expect(images).toHaveLength(withLogo.length * 2)
    expect(images[0]).toHaveAttribute('src', withLogo[0]?.logoUrl ?? '')
  })

  it('logotipi imaju dimenzije — bez njih CLS skače dok se učitavaju', () => {
    const { container } = render(<TechMarquee technologies={TECHNOLOGIES} />)

    for (const img of container.querySelectorAll('img')) {
      expect(img).toHaveAttribute('width')
      expect(img).toHaveAttribute('height')
    }
  })

  it('nema axe povreda', async () => {
    const { container } = render(<TechMarquee technologies={TECHNOLOGIES} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
