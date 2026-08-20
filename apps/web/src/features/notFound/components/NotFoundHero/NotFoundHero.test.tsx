import { render, screen } from '@testing-library/react'
import type { PropsWithChildren } from 'react'
import { I18nextProvider } from 'react-i18next'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'

import { ROUTES } from '@/lib/routes'
import { createI18n } from '@app/i18n'

import { NotFoundHero } from './NotFoundHero'

const i18n = createI18n({ resources: {}, storageKey: 'test.lang', lng: 'cimode' })

const wrapper = ({ children }: PropsWithChildren) => (
  <I18nextProvider i18n={i18n}>
    <MemoryRouter>{children}</MemoryRouter>
  </I18nextProvider>
)

describe('NotFoundHero', () => {
  it('naslov je 404, ne prevodiv ključ', () => {
    render(<NotFoundHero />, { wrapper })

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('404')
  })

  /*
   * Oba izlaza su obavezna: strana na koju se dolazi greškom bez linka je ćorsokak.
   * Test proverava PUTANJE, ne tekst — tekst je u `cimode` sam ključ.
   */
  it('nudi put na početnu i na radove', () => {
    render(<NotFoundHero />, { wrapper })

    const hrefs = screen.getAllByRole('link').map((link) => link.getAttribute('href'))

    expect(hrefs).toEqual([ROUTES.HOME, ROUTES.PROJECTS])
  })

  /*
   * Pozadinski slojevi su dekoracija: tekstura, sjaj i kartice. Da nisu `aria-hidden`, čitač
   * ekrana bi na strani greške čitao prazne elemente pre poruke koja jedina nešto znači.
   */
  it('dekoracija je van pristupačnog stabla', () => {
    const { container } = render(<NotFoundHero />, { wrapper })

    expect(container.querySelectorAll('section > span[aria-hidden="true"]').length).toBeGreaterThan(
      1,
    )
  })

  /*
   * Marke NEMA na ovoj strani, i to je odluka: logotip na strani greške vuče pažnju na brend
   * umesto na izlaz. Test čuva tu odluku — inače se `SheepMark` vrati prvom izmenom i niko
   * ne primeti.
   */
  it('ne renderuje brend marku', () => {
    const { container } = render(<NotFoundHero />, { wrapper })

    expect(container.querySelector('svg')).toBeNull()
  })

  /*
   * Naslov je čist tekst „404" — bez cifara kao zasebnih elemenata, bez slike i bez
   * animacije. Probano je i jedno i drugo pa odbačeno; test čuva taj izbor, jer bi zamena
   * pseudo-sadržajem ili `aria-label`-om tiho pokvarila i čitač ekrana i e2e proveru.
   */
  it('naslov ima tekst tačno „404"', () => {
    render(<NotFoundHero />, { wrapper })

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/^404$/)
  })
})
