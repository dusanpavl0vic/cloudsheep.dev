import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { describe, expect, it } from 'vitest'

import { TextLink } from './TextLink'

describe('TextLink', () => {
  it('renderuje se kao link', () => {
    render(<TextLink href="/kontakt">Kontakt</TextLink>)
    expect(screen.getByRole('link', { name: 'Kontakt' })).toHaveAttribute('href', '/kontakt')
  })

  it('asChild prosleđuje stil detetu — za React Router <Link>', () => {
    render(
      <TextLink asChild>
        <a href="/projekti" data-testid="router-link">
          Projekti
        </a>
      </TextLink>,
    )

    const link = screen.getByTestId('router-link')
    expect(link).toHaveAttribute('href', '/projekti')
    expect(link.className).not.toBe('')
  })

  it('tone varijanta menja stil', () => {
    const { rerender } = render(<TextLink href="#">X</TextLink>)
    const before = screen.getByRole('link').className

    rerender(
      <TextLink href="#" tone="inverse">
        X
      </TextLink>,
    )
    expect(screen.getByRole('link').className).not.toBe(before)
  })

  it('eksterni link zadržava rel', () => {
    render(
      <TextLink href="https://example.com" target="_blank" rel="noopener noreferrer">
        Spolja
      </TextLink>,
    )
    expect(screen.getByRole('link')).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('nema axe povreda', async () => {
    const { container } = render(<TextLink href="/x">Link</TextLink>)
    expect(await axe(container)).toHaveNoViolations()
  })
})
