import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { describe, expect, it } from 'vitest'

import { PageHeader } from './PageHeader'

describe('PageHeader', () => {
  it('naslov je h1 — tačno jedan po stranici (docs/15)', () => {
    render(<PageHeader eyebrow="Radovi" title="Projekti" />)

    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent('Projekti')
  })

  it('renderuje se kao <header> landmark', () => {
    render(<PageHeader eyebrow="Radovi" title="Projekti" />)
    expect(screen.getByRole('banner')).toBeInTheDocument()
  })

  it('prikazuje eyebrow', () => {
    render(<PageHeader eyebrow="Radovi" title="Projekti" />)
    expect(screen.getByText('Radovi')).toBeInTheDocument()
  })

  it('podnaslov je opcion', () => {
    const { rerender } = render(<PageHeader eyebrow="E" title="T" />)
    expect(screen.queryByText('Opis')).not.toBeInTheDocument()

    rerender(<PageHeader eyebrow="E" title="T" subtitle="Opis" />)
    expect(screen.getByText('Opis')).toBeInTheDocument()
  })

  it('prima ReactNode, ne samo string — tekst dolazi iz app-e kroz t()', () => {
    render(<PageHeader eyebrow={<em>Radovi</em>} title={<>Projekti</>} />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Projekti')
  })

  it('nema axe povreda', async () => {
    const { container } = render(<PageHeader eyebrow="Radovi" title="Projekti" subtitle="Opis" />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
