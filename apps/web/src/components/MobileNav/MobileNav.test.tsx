import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'

import { MAIN_NAV } from '@/lib/navigation'
import { store } from '@/store'

import { MobileNav } from './MobileNav'

// `matchMedia` i `<dialog>` stubovi su u `vitest.setup.ts` — jsdom rupe koje pogađaju
// ceo app, ne samo ovaj test.
const setup = () =>
  render(
    <Provider store={store}>
      <MemoryRouter>
        <MobileNav activeSection={null} />
      </MemoryRouter>
    </Provider>,
  )

describe('MobileNav', () => {
  it('panel je zatvoren dok se dugme ne pritisne', () => {
    setup()
    expect(screen.getByRole('button', { name: 'nav.openMenu' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
  })

  it('otvara panel i javlja to pomoćnoj tehnologiji', async () => {
    const user = userEvent.setup()
    setup()

    await user.click(screen.getByRole('button', { name: 'nav.openMenu' }))
    expect(screen.getByRole('button', { name: 'nav.openMenu' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
  })

  it('panel sadrži svaku stavku glavne navigacije', async () => {
    const user = userEvent.setup()
    setup()
    await user.click(screen.getByRole('button', { name: 'nav.openMenu' }))

    // i18n nije podignut u testu, pa `t()` vraća ključ — proveravamo strukturu, ne tekst
    expect(screen.getByRole('dialog').querySelectorAll('nav a')).toHaveLength(MAIN_NAV.length)
  })

  it('zatvaranje vraća aria-expanded — stanje ide iz native `close`, ne iz klika', async () => {
    const user = userEvent.setup()
    setup()

    await user.click(screen.getByRole('button', { name: 'nav.openMenu' }))
    await user.click(screen.getByRole('button', { name: 'nav.closeMenu' }))

    expect(screen.getByRole('button', { name: 'nav.openMenu' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
  })

  it('klik na stavku zatvara panel — inače ostaje otvoren preko nove strane', async () => {
    const user = userEvent.setup()
    setup()

    await user.click(screen.getByRole('button', { name: 'nav.openMenu' }))
    const first = screen.getByRole('dialog').querySelector('nav a')
    if (first) await user.click(first)

    expect(screen.getByRole('button', { name: 'nav.openMenu' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
  })

  it('nema axe povreda dok je otvoren', async () => {
    const user = userEvent.setup()
    const { container } = setup()
    await user.click(screen.getByRole('button', { name: 'nav.openMenu' }))

    expect(await axe(container)).toHaveNoViolations()
  })
})
