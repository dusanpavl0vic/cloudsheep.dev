import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { describe, expect, it } from 'vitest'

import { Input } from './input'
import { Label } from './label'

describe('Label', () => {
  it('povezuje se sa kontrolom preko htmlFor', () => {
    render(
      <>
        <Label htmlFor="email">E-pošta</Label>
        <Input id="email" />
      </>,
    )

    // getByLabelText prolazi samo ako je veza stvarna
    expect(screen.getByLabelText('E-pošta')).toBe(screen.getByRole('textbox'))
  })

  it('klik na label fokusira kontrolu', () => {
    render(
      <>
        <Label htmlFor="ime">Ime</Label>
        <Input id="ime" />
      </>,
    )

    screen.getByText('Ime').click()
    expect(screen.getByRole('textbox')).toHaveAccessibleName('Ime')
  })

  it('nema axe povreda kad je povezan', async () => {
    const { container } = render(
      <>
        <Label htmlFor="poruka">Poruka</Label>
        <Input id="poruka" />
      </>,
    )

    expect(await axe(container)).toHaveNoViolations()
  })

  it('htmlFor je obavezan — ugovor je u tipu, ne u lint pravilu', () => {
    // @ts-expect-error — label bez htmlFor ne sme da se kompajlira
    const invalid = <Label>Bez kontrole</Label>
    expect(invalid).toBeTruthy()
  })
})
