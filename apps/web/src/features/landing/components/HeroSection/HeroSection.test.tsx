import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { PropsWithChildren } from 'react'
import { I18nextProvider } from 'react-i18next'
import { MemoryRouter } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { SECTION_IDS } from '@/lib/navigation'
import { createI18n } from '@app/i18n'

import { HeroSection } from './HeroSection'

const i18n = createI18n({ resources: {}, storageKey: 'test.lang', lng: 'cimode' })

const wrapper = ({ children }: PropsWithChildren) => (
  <I18nextProvider i18n={i18n}>
    <MemoryRouter>{children}</MemoryRouter>
  </I18nextProvider>
)

/** jsdom nema matchMedia; hero ga koristi za prefers-reduced-motion. */
function stubMatchMedia(reduced: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({
      matches: reduced,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
    })),
  )
}

const renderHero = () => ({ user: userEvent.setup(), ...render(<HeroSection />, { wrapper }) })

describe('HeroSection — SCROLL dugme', () => {
  beforeEach(() => {
    stubMatchMedia(false)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    document.body.innerHTML = ''
  })

  it('SCROLL je dugme, ne dekorativni tekst', () => {
    renderHero()
    expect(screen.getByRole('button', { name: /hero\.scroll/ })).toBeInTheDocument()
  })

  it('klik skroluje na sledeću sekciju', async () => {
    const target = document.createElement('section')
    target.id = SECTION_IDS.STUDIO
    const scrollIntoView = vi.fn()
    target.scrollIntoView = scrollIntoView
    document.body.append(target)

    const { user } = renderHero()
    await user.click(screen.getByRole('button', { name: /hero\.scroll/ }))

    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' })
  })

  it('sa prefers-reduced-motion skroluje bez animacije', async () => {
    stubMatchMedia(true)

    const target = document.createElement('section')
    target.id = SECTION_IDS.STUDIO
    const scrollIntoView = vi.fn()
    target.scrollIntoView = scrollIntoView
    document.body.append(target)

    const { user } = renderHero()
    await user.click(screen.getByRole('button', { name: /hero\.scroll/ }))

    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'auto', block: 'start' })
  })

  it('ne pada kad ciljne sekcije nema u DOM-u', async () => {
    const { user } = renderHero()

    await expect(
      user.click(screen.getByRole('button', { name: /hero\.scroll/ })),
    ).resolves.toBeUndefined()
  })
})

describe('HeroSection — pristupačnost i sadržaj', () => {
  beforeEach(() => {
    stubMatchMedia(false)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('ima tačno jedan h1', () => {
    renderHero()
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
  })

  it('dekorativni slojevi pozadine su skriveni od screen readera', () => {
    const { container } = renderHero()

    // Mreža, horizont i izmaglica ne smeju da se čitaju
    const decorative = container.querySelectorAll('[aria-hidden="true"]')
    expect(decorative.length).toBeGreaterThan(0)
  })

  it('oba CTA linka postoje', () => {
    renderHero()
    expect(screen.getAllByRole('link')).toHaveLength(2)
  })
})
