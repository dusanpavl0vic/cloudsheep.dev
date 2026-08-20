import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { describe, expect, it } from 'vitest'

import { ProgressBar } from './ProgressBar'

describe('ProgressBar', () => {
  it('neaktivna ne renderuje trag i ne govori ništa', () => {
    render(<ProgressBar active={false} label="Učitavanje" />)

    expect(screen.getByRole('status')).toBeEmptyDOMElement()
  })

  it('aktivna objavljuje šta se učitava', () => {
    render(<ProgressBar active label="Učitavanje stranice" />)

    expect(screen.getByRole('status')).toHaveTextContent('Učitavanje stranice')
  })

  /*
   * Živa oblast mora postojati i kad je traka neaktivna. Da se montira zajedno sa trakom,
   * čitač ekrana najavu ne bi izgovorio — zato je ovaj test o PRISUSTVU, ne o sadržaju.
   */
  it('živa oblast postoji i pre nego što učitavanje počne', () => {
    const { rerender } = render(<ProgressBar active={false} label="Učitavanje" />)
    const region = screen.getByRole('status')

    rerender(<ProgressBar active label="Učitavanje" />)

    expect(screen.getByRole('status')).toBe(region)
  })

  it('nema axe povreda', async () => {
    const { container } = render(<ProgressBar active label="Učitavanje" />)

    expect(await axe(container)).toHaveNoViolations()
  })
})
