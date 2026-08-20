import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { describe, expect, it } from 'vitest'

import { FormField } from './FormField'
import { Input } from '../../ui/input'

describe('FormField', () => {
  it('labela je povezana sa kontrolom', () => {
    render(<FormField label="E-mail">{(field) => <Input {...field} />}</FormField>)

    // getByLabelText prolazi samo ako htmlFor i id zaista pokazuju jedno na drugo
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument()
  })

  it('bez greške nema `aria-invalid` — atribut se izostavlja, ne postavlja na false', () => {
    render(<FormField label="E-mail">{(field) => <Input {...field} />}</FormField>)

    expect(screen.getByLabelText('E-mail')).not.toHaveAttribute('aria-invalid')
  })

  it('greška postavlja `aria-invalid` i vezuje poruku', () => {
    render(
      <FormField label="E-mail" error="Neispravna adresa">
        {(field) => <Input {...field} />}
      </FormField>,
    )

    const input = screen.getByLabelText('E-mail')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAccessibleDescription('Neispravna adresa')
  })

  it('poruka greške ima role="alert" — čita se čim se pojavi', () => {
    render(
      <FormField label="E-mail" error="Neispravna adresa">
        {(field) => <Input {...field} />}
      </FormField>,
    )

    expect(screen.getByRole('alert')).toHaveTextContent('Neispravna adresa')
  })

  it('opis se vezuje kroz aria-describedby', () => {
    render(
      <FormField label="Slug" description="Mala slova i crtice">
        {(field) => <Input {...field} />}
      </FormField>,
    )

    expect(screen.getByLabelText('Slug')).toHaveAccessibleDescription('Mala slova i crtice')
  })

  it('kad postoje i opis i greška, kontrola upućuje na oba', () => {
    render(
      <FormField label="Slug" description="Mala slova i crtice" error="Zauzet">
        {(field) => <Input {...field} />}
      </FormField>,
    )

    expect(screen.getByLabelText('Slug')).toHaveAccessibleDescription('Mala slova i crtice Zauzet')
  })

  it('dva polja na istoj strani dobijaju različite id-eve', () => {
    render(
      <>
        <FormField label="Prvo">{(field) => <Input {...field} />}</FormField>
        <FormField label="Drugo">{(field) => <Input {...field} />}</FormField>
      </>,
    )

    expect(screen.getByLabelText('Prvo').id).not.toBe(screen.getByLabelText('Drugo').id)
  })

  it('prima ReactNode — prevod stiže iz app-e kroz t()', () => {
    render(<FormField label={<em>E-mail</em>}>{(field) => <Input {...field} />}</FormField>)

    expect(screen.getByLabelText('E-mail')).toBeInTheDocument()
  })

  it('nema axe povreda, ni u stanju greške', async () => {
    const { container } = render(
      <FormField label="E-mail" description="Poslovna adresa" error="Neispravna adresa">
        {(field) => <Input {...field} />}
      </FormField>,
    )

    expect(await axe(container)).toHaveNoViolations()
  })
})
