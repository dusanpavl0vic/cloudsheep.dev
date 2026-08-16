import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { describe, expect, it } from 'vitest'

import { CredentialSeal } from './CredentialSeal'

const props = {
  degree: 'Diplomirani inženjer elektrotehnike i računarstva',
  institution: 'Elektronski fakultet · Univerzitet u Nišu',
  logo: '/edu/elfak.webp',
}

describe('CredentialSeal', () => {
  it('prikazuje zvanje i ustanovu', () => {
    render(<CredentialSeal {...props} />)

    expect(screen.getByText(props.degree)).toBeInTheDocument()
    expect(screen.getByText(props.institution)).toBeInTheDocument()
  })

  it('grb je van pristupačnog stabla — tekst pored njega nosi isto značenje', () => {
    const { container } = render(<CredentialSeal {...props} />)

    // Nijedna slika ne sme da se pojavi kao `img` uloga: alt="" + aria-hidden
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(container.querySelector('img')).toHaveAttribute('alt', '')
  })

  it('diploma se u pristupačnom stablu pojavljuje tačno jednom', () => {
    render(<CredentialSeal {...props} />)
    expect(screen.getAllByText(props.degree)).toHaveLength(1)
  })

  it('grb ima dimenzije — bez njih tekst poskoči kad se slika učita', () => {
    const { container } = render(<CredentialSeal {...props} />)
    const image = container.querySelector('img')

    expect(image).toHaveAttribute('width')
    expect(image).toHaveAttribute('height')
  })

  it('grb stoji na podlozi koja se ne invertuje — inače nestane u tamnoj temi', () => {
    const { container } = render(<CredentialSeal {...props} />)
    expect(container.querySelector('.bg-plate')).toBeInTheDocument()
  })

  it('nema axe povreda', async () => {
    const { container } = render(<CredentialSeal {...props} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
