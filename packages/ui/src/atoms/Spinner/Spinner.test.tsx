import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { describe, expect, it } from 'vitest'

import { Spinner } from './Spinner'

describe('Spinner', () => {
  // Vrteška bez teksta je za pomoćnu tehnologiju prazan element — korisnik ne zna
  // ni da se nešto dešava. Zato je `label` obavezan u tipu, a ovde i proveren.
  it('objavljuje šta se učitava kroz role="status"', () => {
    render(<Spinner label="Učitavanje projekata" />)

    expect(screen.getByRole('status')).toHaveTextContent('Učitavanje projekata')
  })

  it('nema axe povreda', async () => {
    const { container } = render(<Spinner label="Učitavanje" />)

    expect(await axe(container)).toHaveNoViolations()
  })
})
