import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { describe, expect, it } from 'vitest'

import { CredentialSeal } from './CredentialSeal'

const props = {
  university: 'Univerzitet u Nišu',
  degree: 'Diplomirani inženjer elektrotehnike i računarstva',
  programme: 'Računarstvo i informatika',
  faculty: 'Elektronski fakultet',
  city: 'Niš, Srbija',
  logo: '/edu/elfak.webp',
}

describe('CredentialSeal', () => {
  it('prikazuje svih pet podataka sa dokumenta', () => {
    render(<CredentialSeal {...props} />)

    for (const value of [
      props.university,
      props.degree,
      props.programme,
      props.faculty,
      props.city,
    ]) {
      expect(screen.getByText(value)).toBeInTheDocument()
    }
  })

  it('svaki podatak stoji u pristupačnom stablu tačno jednom', () => {
    render(<CredentialSeal {...props} />)

    for (const value of [
      props.university,
      props.degree,
      props.programme,
      props.faculty,
      props.city,
    ]) {
      expect(screen.getAllByText(value)).toHaveLength(1)
    }
  })

  it('pečat je van pristupačnog stabla — sve sa grba piše i u tekstu', () => {
    const { container } = render(<CredentialSeal {...props} />)

    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(container.querySelector('img')).toHaveAttribute('alt', '')
  })

  it('pečat ima dimenzije — bez njih se raspored pomeri kad se slika učita', () => {
    const { container } = render(<CredentialSeal {...props} />)
    const image = container.querySelector('img')

    expect(image).toHaveAttribute('src', props.logo)
    expect(image).toHaveAttribute('width')
    expect(image).toHaveAttribute('height')
  })

  it('papir i mastilo su tokeni koji se ne invertuju', () => {
    // Da tekst koristi text-foreground, u tamnoj temi bi nestao sa svetlog papira
    const { container } = render(<CredentialSeal {...props} />)

    expect(container.querySelector('.bg-plate')).toBeInTheDocument()
    expect(container.querySelector('.text-plate-ink')).toBeInTheDocument()
  })

  it('zvanje je naslov, ne običan tekst — dokument ima hijerarhiju', () => {
    render(<CredentialSeal {...props} />)
    expect(screen.getByRole('heading', { name: props.degree })).toBeInTheDocument()
  })

  it('nema axe povreda', async () => {
    const { container } = render(<CredentialSeal {...props} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
