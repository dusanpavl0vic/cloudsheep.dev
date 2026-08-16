import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Container } from './container'

describe('Container', () => {
  it('renderuje decu', () => {
    render(<Container>Sadržaj</Container>)
    expect(screen.getByText('Sadržaj')).toBeInTheDocument()
  })

  it('podrazumevano je <div>', () => {
    const { container } = render(<Container>X</Container>)
    expect(container.firstElementChild?.tagName).toBe('DIV')
  })

  it('`as` menja element — bitno za semantiku (main, article, section)', () => {
    render(<Container as="main">X</Container>)
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('spaja className', () => {
    render(<Container className="py-8">X</Container>)
    expect(screen.getByText('X')).toHaveClass('py-8')
  })
})
