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

  it('oznaka sa ikonicom renderuje logotip sa dimenzijama', () => {
    const { container } = render(<TagList tags={[{ label: 'React', icon: '/tech/react.svg' }]} />)
    const image = container.querySelector('img')

    expect(image).toHaveAttribute('src', '/tech/react.svg')
    expect(image).toHaveAttribute('width')
    expect(image).toHaveAttribute('height')
  })

  it('logotip je van pristupačnog stabla — naziv stoji odmah pored njega', () => {
    const { container } = render(<TagList tags={[{ label: 'React', icon: '/tech/react.svg' }]} />)

    expect(container.querySelector('img')).toHaveAttribute('alt', '')
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(screen.getAllByText('React')).toHaveLength(1)
  })

  it('oznaka bez ikonice je čist tekst — GTFS i Stripe nemaju logotip', () => {
    const { container } = render(
      <TagList tags={[{ label: 'GTFS' }, { label: 'React', icon: '/tech/react.svg' }]} />,
    )

    // Samo jedna od dve oznake ima logotip; druga se ne renderuje kao pokvarena slika
    expect(container.querySelectorAll('img')).toHaveLength(1)
    expect(screen.getByText('GTFS')).toBeInTheDocument()
  })

  it('nema axe povreda — <ul> mora sadržati samo <li>', async () => {
    const { container } = render(<TagList tags={['React', 'TypeScript']} />)
    expect(await axe(container)).toHaveNoViolations()
  })

  it('nema axe povreda ni sa logotipima', async () => {
    const { container } = render(
      <TagList
        variant="logo"
        size="bare"
        tags={[{ label: 'React', icon: '/tech/react.svg' }, { label: 'GTFS' }]}
      />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
