import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { describe, expect, it } from 'vitest'

import { Eyebrow } from './Eyebrow'

describe('Eyebrow', () => {
  it('prikazuje sadržaj', () => {
    render(<Eyebrow>Usluge</Eyebrow>)
    expect(screen.getByText('Usluge')).toBeInTheDocument()
  })

  it('zagrade idu kroz ::before/::after, ne kao tekst', () => {
    render(<Eyebrow>Usluge</Eyebrow>)

    // Da su zagrade čvorovi, screen reader bi čitao "[ Usluge ]" umesto "Usluge"
    expect(screen.getByText('Usluge')).toHaveTextContent(/^Usluge$/)
    expect(screen.getByText('Usluge').className).toContain("before:content-['[']")
  })

  it('renderuje se mono fontom, malim slovima', () => {
    render(<Eyebrow>Usluge</Eyebrow>)

    const el = screen.getByText('Usluge')
    expect(el).toHaveClass('font-mono')
    expect(el).toHaveClass('lowercase')
  })

  it('tone varijanta radi na tamnoj podlozi — ista komponenta, ne druga', () => {
    const { rerender } = render(<Eyebrow tone="primary">X</Eyebrow>)
    const before = screen.getByText('X').className

    rerender(<Eyebrow tone="inverse">X</Eyebrow>)
    expect(screen.getByText('X').className).not.toBe(before)
  })

  it('nema podlogu ni ivicu — pilula je uklonjena (docs/22 §2)', () => {
    render(<Eyebrow>Usluge</Eyebrow>)

    const cls = screen.getByText('Usluge').className
    expect(cls).not.toContain('rounded-full')
    expect(cls).not.toContain('ring-1')
  })

  it('nema axe povreda', async () => {
    const { container } = render(<Eyebrow>Usluge</Eyebrow>)
    expect(await axe(container)).toHaveNoViolations()
  })
})
