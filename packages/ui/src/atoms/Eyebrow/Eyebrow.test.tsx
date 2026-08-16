import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { describe, expect, it } from 'vitest'

import { Eyebrow } from './Eyebrow'

describe('Eyebrow', () => {
  it('prikazuje sadržaj', () => {
    render(<Eyebrow>Usluge</Eyebrow>)
    expect(screen.getByText('Usluge')).toBeInTheDocument()
  })

  it('podrazumevani marker je //', () => {
    render(<Eyebrow>Usluge</Eyebrow>)
    expect(screen.getByText('//')).toBeInTheDocument()
  })

  it('marker se može zameniti', () => {
    render(<Eyebrow marker="→">Usluge</Eyebrow>)
    expect(screen.getByText('→')).toBeInTheDocument()
    expect(screen.queryByText('//')).not.toBeInTheDocument()
  })

  it('tone varijanta radi na tamnoj podlozi — ista komponenta, ne druga', () => {
    const { rerender } = render(<Eyebrow tone="primary">X</Eyebrow>)
    const before = screen.getByText('X').className

    rerender(<Eyebrow tone="inverse">X</Eyebrow>)
    expect(screen.getByText('X').className).not.toBe(before)
  })

  it('nema axe povreda', async () => {
    const { container } = render(<Eyebrow>Usluge</Eyebrow>)
    expect(await axe(container)).toHaveNoViolations()
  })
})
