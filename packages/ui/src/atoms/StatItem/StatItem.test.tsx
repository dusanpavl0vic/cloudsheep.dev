import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { describe, expect, it } from 'vitest'

import { StatItem } from './StatItem'

describe('StatItem', () => {
  it('prikazuje vrednost i labelu', () => {
    render(<StatItem value="99.9%" label="Dostupnost" />)

    expect(screen.getByText('99.9%')).toBeInTheDocument()
    expect(screen.getByText('Dostupnost')).toBeInTheDocument()
  })

  it('prima ReactNode — tekst dolazi kroz t() iz app-e', () => {
    render(<StatItem value={<strong>12</strong>} label={<em>Projekata</em>} />)
    expect(screen.getByText('12')).toBeInTheDocument()
  })

  it('tone varijanta menja boju ivice', () => {
    const { container, rerender } = render(<StatItem value="1" label="L" tone="primary" />)
    expect(container.firstElementChild).toHaveClass('border-foreground')

    rerender(<StatItem value="1" label="L" tone="accent" />)
    expect(container.firstElementChild).toHaveClass('border-primary')
  })

  it('nema axe povreda', async () => {
    const { container } = render(<StatItem value="99.9%" label="Dostupnost" />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
