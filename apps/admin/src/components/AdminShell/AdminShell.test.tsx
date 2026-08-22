import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { I18nextProvider } from 'react-i18next'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'

import { createI18n } from '@app/i18n'

import { AdminShell } from './AdminShell'

const i18n = createI18n({ resources: {}, storageKey: 'test.lang', lng: 'cimode' })

const renderShell = (props: Partial<Parameters<typeof AdminShell>[0]> = {}) =>
  render(
    <AdminShell userName="Dušan" onSignOut={vi.fn()} isSigningOut={false} {...props}>
      <p>sadržaj</p>
    </AdminShell>,
    {
      wrapper: ({ children }) => (
        <I18nextProvider i18n={i18n}>
          <MemoryRouter initialEntries={['/projects']}>{children}</MemoryRouter>
        </I18nextProvider>
      ),
    },
  )

describe('AdminShell', () => {
  it('prikazuje sve stavke navigacije', () => {
    renderShell()

    for (const key of [
      'nav.dashboard',
      'nav.projects',
      'nav.technologies',
      'nav.profile',
      'nav.team',
    ]) {
      expect(screen.getByRole('link', { name: key })).toBeInTheDocument()
    }
  })

  it('trenutna stavka je označena kao aktivna', () => {
    renderShell()

    expect(screen.getByRole('link', { name: 'nav.projects' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('renderuje sadržaj stranice', () => {
    renderShell()

    expect(screen.getByText('sadržaj')).toBeInTheDocument()
  })

  it('prikazuje ime korisnika', () => {
    renderShell()

    expect(screen.getByText('Dušan')).toBeInTheDocument()
  })

  it('odjava zove prosleđenu funkciju — ljuska ne zna za auth', async () => {
    const onSignOut = vi.fn()
    const user = userEvent.setup()
    renderShell({ onSignOut })

    await user.click(screen.getByRole('button', { name: 'common.signOut' }))

    expect(onSignOut).toHaveBeenCalledOnce()
  })

  it('dugme je zaključano dok odjava traje', () => {
    renderShell({ isSigningOut: true })

    expect(screen.getByRole('button', { name: 'common.signOut' })).toBeDisabled()
  })

  it('sadržaj je u <main> landmarku', () => {
    renderShell()

    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  /*
   * Bez `jest-axe` — on je zavisnost `packages/ui`, gde i žive a11y provere deljenih
   * komponenti. Ovde se proverava ono što je specifično za ljusku: landmark i `aria-current`.
   */
  it('bočna navigacija je <nav> landmark sa imenom', () => {
    renderShell()

    // `nav.label`, ne `nav.dashboard`: traka je ranije bila označena imenom PRVE stavke,
    // pa je čitač ekrana najavljivao „Kontrolna tabla, navigacija" za celu navigaciju.
    expect(screen.getByRole('navigation', { name: 'nav.label' })).toBeInTheDocument()
  })

  /*
   * Ispod `lg` bočna traka je sakrivena i navigacija ide kroz panel. jsdom nema CSS, pa se
   * ovde ne proverava ŠTA se vidi — nego da hamburger postoji, da je ispravno ožičen za
   * čitač ekrana i da otvara panel.
   */
  it('hamburger je ožičen za čitač ekrana', () => {
    renderShell()

    const trigger = screen.getByRole('button', { name: 'nav.openMenu' })

    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(trigger).toHaveAttribute('aria-controls', 'admin-nav-sheet')
  })

  it('klik na hamburger otvara panel', async () => {
    const user = userEvent.setup()
    renderShell()

    await user.click(screen.getByRole('button', { name: 'nav.openMenu' }))

    expect(screen.getByRole('button', { name: 'nav.openMenu' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
    expect(screen.getByRole('button', { name: 'nav.closeMenu' })).toBeInTheDocument()
  })
})
