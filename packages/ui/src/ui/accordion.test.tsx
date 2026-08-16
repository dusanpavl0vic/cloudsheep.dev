import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { describe, expect, it } from 'vitest'

import { Accordion } from './accordion'

const items = [
  { id: 'a', question: 'Koliko traje projekat?', answer: 'Od četiri do osam nedelja.' },
  { id: 'b', question: 'Kako se naplaćuje?', answer: 'Fiksno ili po sprintu.' },
]

describe('Accordion', () => {
  it('renderuje sva pitanja', () => {
    render(<Accordion items={items} />)
    expect(screen.getByText('Koliko traje projekat?')).toBeInTheDocument()
    expect(screen.getByText('Kako se naplaćuje?')).toBeInTheDocument()
  })

  it('koristi native <details> — otvaranje radi browser, bez state-a (docs/08)', () => {
    const { container } = render(<Accordion items={items} />)
    expect(container.querySelectorAll('details')).toHaveLength(2)
  })

  it('sadržaj je zatvoren dok se ne otvori', () => {
    const { container } = render(<Accordion items={items} />)
    const first = container.querySelector('details')
    expect(first?.open).toBe(false)
  })

  it('klik na pitanje otvara odgovor', async () => {
    const user = userEvent.setup()
    const { container } = render(<Accordion items={items} />)

    await user.click(screen.getByText('Koliko traje projekat?'))
    expect(container.querySelector('details')?.open).toBe(true)
  })

  it('prazna lista ne pada', () => {
    const { container } = render(<Accordion items={[]} />)
    expect(container.querySelectorAll('details')).toHaveLength(0)
  })

  it('nema axe povreda', async () => {
    const { container } = render(<Accordion items={items} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
