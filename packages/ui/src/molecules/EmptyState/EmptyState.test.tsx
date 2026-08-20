import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { describe, expect, it } from 'vitest'

import { EmptyState } from './EmptyState'

describe('EmptyState', () => {
  it('prikazuje naslov', () => {
    render(<EmptyState title="Još nema projekata" />)

    expect(screen.getByText('Još nema projekata')).toBeInTheDocument()
  })

  it('opis i radnja su opcioni', () => {
    const { rerender } = render(<EmptyState title="Prazno" />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()

    rerender(
      <EmptyState
        title="Prazno"
        description="Dodaj prvi"
        action={<button type="button">Dodaj</button>}
      />,
    )
    expect(screen.getByText('Dodaj prvi')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Dodaj' })).toBeInTheDocument()
  })

  it('nema axe povreda', async () => {
    const { container } = render(
      <EmptyState
        title="Prazno"
        description="Dodaj prvi"
        action={<button type="button">Dodaj</button>}
      />,
    )

    expect(await axe(container)).toHaveNoViolations()
  })
})
