import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { describe, expect, it } from 'vitest'

import { Eyebrow } from './Eyebrow'

describe('Eyebrow', () => {
  it('prikazuje sadržaj', () => {
    render(<Eyebrow>Usluge</Eyebrow>)
    expect(screen.getByText('Usluge')).toBeInTheDocument()
  })

  it('podrazumevano prikazuje tačkicu — dekoraciju, ne tekst', () => {
    const { container } = render(<Eyebrow>Usluge</Eyebrow>)
    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(1)
  })

  it('tačkica se može isključiti', () => {
    const { container } = render(<Eyebrow marker={false}>Usluge</Eyebrow>)
    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(0)
  })

  it('renderuje se kao pilula, ne kao goli tekst', () => {
    render(<Eyebrow>Usluge</Eyebrow>)
    expect(screen.getByText('Usluge')).toHaveClass('rounded-full')
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
