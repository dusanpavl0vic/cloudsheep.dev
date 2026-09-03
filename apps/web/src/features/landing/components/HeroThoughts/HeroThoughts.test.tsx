import { render, screen } from '@testing-library/react'
import type { PropsWithChildren } from 'react'
import { I18nextProvider } from 'react-i18next'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { createI18n } from '@app/i18n'

import { HeroThoughts } from './HeroThoughts'

const TECHNOLOGIES = [
  { id: 't1', slug: 'react', label: 'React', group: 'frontend', logoUrl: '/uploads/react.svg' },
]

const i18n = createI18n({ resources: {}, storageKey: 'test.lang', lng: 'cimode' })

const wrapper = ({ children }: PropsWithChildren) => (
  <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
)

/** jsdom nema `matchMedia`; `useDevice` ga koristi za granicu `xl`. */
const stubMatchMedia = (wide: boolean) => {
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({
      matches: wide,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
    })),
  )
}

const renderThoughts = () => render(<HeroThoughts technologies={TECHNOLOGIES} />, { wrapper })

describe('HeroThoughts', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('na xl lebde sve misli', () => {
    stubMatchMedia(true)
    renderThoughts()

    expect(screen.getByText('hero.cards.note')).toBeInTheDocument()
    expect(screen.getByText('hero.cards.deployTitle')).toBeInTheDocument()
    expect(screen.getByText('hero.cards.scoreTitle')).toBeInTheDocument()
  })

  /**
   * Ispod `xl` se ne crta NIŠTA, i to se proverava kroz DOM a ne kroz klasu: `hidden` bi
   * ostavio pet oblaka koji se crtaju i animiraju bez ijednog vidljivog piksela.
   */
  it('ispod xl ne renderuje ništa', () => {
    stubMatchMedia(false)
    const { container } = renderThoughts()

    expect(container).toBeEmptyDOMElement()
    expect(screen.queryByText('hero.cards.note')).not.toBeInTheDocument()
  })
})
