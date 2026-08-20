import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Logo } from './Logo'

describe('Logo', () => {
  it('crta znak i naziv', () => {
    const { container } = render(<Logo label="cloudsheep" />)

    expect(container.querySelector('svg')).not.toBeNull()
    expect(screen.getByText('cloudsheep')).toBeInTheDocument()
  })

  /*
   * `viewBox` marke je 136×126, dakle nekvadratan, pa je `size-*` sabija. `docs/22` to
   * izričito zabranjuje — a greška je čisto vizuelna i ne bi je uhvatio nijedan drugi test.
   */
  it('znak se dimenzioniše visinom, ne kvadratom', () => {
    const { container } = render(<Logo label="cloudsheep" />)
    const className = container.querySelector('svg')?.getAttribute('class') ?? ''

    expect(className).toContain('w-auto')
    expect(className).not.toMatch(/\bsize-/)
  })

  /* Znak je ukras — naziv pored njega nosi isto značenje, pa bi ga čitač pročitao dvaput. */
  it('znak je van pristupačnog stabla', () => {
    const { container } = render(<Logo label="cloudsheep" />)

    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })

  it('`showMark={false}` ostavlja samo naziv', () => {
    const { container } = render(<Logo label="cloudsheep" showMark={false} />)

    expect(container.querySelector('svg')).toBeNull()
    expect(screen.getByText('cloudsheep')).toBeInTheDocument()
  })
})
