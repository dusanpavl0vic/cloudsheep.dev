import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { describe, expect, it } from 'vitest'

import { TagList } from './TagList'

describe('TagList', () => {
  it('renderuje sve oznake kao listu', () => {
    render(<TagList tags={['React', 'TypeScript', 'Vite']} />)

    expect(screen.getByRole('list')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })

  it('prikazuje tekst svake oznake', () => {
    render(<TagList tags={['React', 'Vite']} />)

    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('Vite')).toBeInTheDocument()
  })

  it('prazna lista renderuje praznu listu, ne pada', () => {
    render(<TagList tags={[]} />)
    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
  })

  it('prosleđuje className', () => {
    render(<TagList tags={['A']} className="mt-4" />)
    expect(screen.getByRole('list')).toHaveClass('mt-4')
  })

  it('nema axe povreda — <ul> mora sadržati samo <li>', async () => {
    const { container } = render(<TagList tags={['React', 'TypeScript']} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
