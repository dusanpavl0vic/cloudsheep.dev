import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { describe, expect, it } from 'vitest'

import { Badge } from './badge'

describe('Badge', () => {
  it('prikazuje sadržaj', () => {
    render(<Badge>React</Badge>)
    expect(screen.getByText('React')).toBeInTheDocument()
  })

  it('spaja className sa varijantama', () => {
    render(<Badge className="ms-2">X</Badge>)
    expect(screen.getByText('X')).toHaveClass('ms-2')
  })

  it('prosleđuje HTML atribute', () => {
    render(<Badge title="opis">X</Badge>)
    expect(screen.getByText('X')).toHaveAttribute('title', 'opis')
  })

  it('nema axe povreda', async () => {
    const { container } = render(<Badge>React</Badge>)
    expect(await axe(container)).toHaveNoViolations()
  })
})
