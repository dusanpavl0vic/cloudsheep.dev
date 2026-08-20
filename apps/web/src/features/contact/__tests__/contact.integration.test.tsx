import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import type { PropsWithChildren } from 'react'
import { I18nextProvider } from 'react-i18next'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'

import { createI18n } from '@app/i18n'

import { ContactForm } from '../components/ContactForm'

const API = 'http://localhost:3000'
const server = setupServer()

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
})
afterEach(() => {
  server.resetHandlers()
})
afterAll(() => {
  server.close()
})

const i18n = createI18n({ resources: {}, storageKey: 'test.lang', lng: 'cimode' })

function Wrapper({ children }: PropsWithChildren) {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}

const renderForm = () => ({
  user: userEvent.setup(),
  ...render(<ContactForm />, { wrapper: Wrapper }),
})

const fill = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByLabelText('contact.form.name'), 'Marko')
  await user.type(screen.getByLabelText('contact.form.email'), 'marko@primer.rs')
  await user.type(screen.getByLabelText('contact.form.message'), 'Zdravo, zanima me saradnja.')
}

describe('kontakt forma', () => {
  /*
   * Ranije je forma odbacivala vrednosti i prikazivala potvrdu „stiglo je u studio inbox" —
   * poruku koja NIJE bila tačna. Ovaj test postoji da se to ne vrati.
   */
  it('šalje POST sa unetim vrednostima', async () => {
    let body: Record<string, unknown> | undefined
    server.use(
      http.post(`${API}/contact`, async ({ request }) => {
        body = (await request.json()) as Record<string, unknown>
        return HttpResponse.json({ ok: true }, { status: 202 })
      }),
    )

    const { user } = renderForm()

    await fill(user)
    await user.click(screen.getByRole('button', { name: 'contact.form.submit' }))

    await waitFor(() => {
      expect(body).toMatchObject({ name: 'Marko', email: 'marko@primer.rs' })
    })
  })

  it('potvrda se prikazuje TEK kad server prihvati', async () => {
    server.use(http.post(`${API}/contact`, () => HttpResponse.json({ ok: true }, { status: 202 })))

    const { user } = renderForm()

    await fill(user)
    expect(screen.queryByText('contact.form.sentTitle')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'contact.form.submit' }))

    expect(await screen.findByText('contact.form.sentTitle')).toBeInTheDocument()
  })

  it('prazna forma ne šalje zahtev', async () => {
    // Nema handlera — zahtev bi oborio test kroz onUnhandledRequest: 'error'
    const { user } = renderForm()

    await user.click(screen.getByRole('button', { name: 'contact.form.submit' }))

    expect((await screen.findAllByRole('alert')).length).toBeGreaterThan(0)
  })

  it('prekratka poruka se zaustavlja na klijentu', async () => {
    const { user } = renderForm()

    await user.type(screen.getByLabelText('contact.form.name'), 'Marko')
    await user.type(screen.getByLabelText('contact.form.email'), 'marko@primer.rs')
    await user.type(screen.getByLabelText('contact.form.message'), 'kratko')
    await user.click(screen.getByRole('button', { name: 'contact.form.submit' }))

    expect(await screen.findByText('contact.errors.messageTooShort')).toBeInTheDocument()
  })

  it('neispravan e-mail se zaustavlja na klijentu', async () => {
    const { user } = renderForm()

    await user.type(screen.getByLabelText('contact.form.email'), 'nije-email')
    await user.click(screen.getByRole('button', { name: 'contact.form.submit' }))

    expect(await screen.findByText('contact.errors.emailInvalid')).toBeInTheDocument()
  })

  /* 429 je jedini status koji korisniku znači nešto konkretno. */
  it('429 daje poruku o previše pokušaja, ne opštu grešku', async () => {
    server.use(http.post(`${API}/contact`, () => HttpResponse.json({}, { status: 429 })))

    const { user } = renderForm()

    await fill(user)
    await user.click(screen.getByRole('button', { name: 'contact.form.submit' }))

    expect(await screen.findByText('contact.errors.tooMany')).toBeInTheDocument()
  })

  it('greška servera NE prikazuje lažnu potvrdu', async () => {
    server.use(http.post(`${API}/contact`, () => HttpResponse.json({}, { status: 500 })))

    const { user } = renderForm()

    await fill(user)
    await user.click(screen.getByRole('button', { name: 'contact.form.submit' }))

    expect(await screen.findByText('contact.errors.failed')).toBeInTheDocument()
    expect(screen.queryByText('contact.form.sentTitle')).not.toBeInTheDocument()
  })

  it('prekinuta mreža daje svoju poruku', async () => {
    server.use(http.post(`${API}/contact`, () => HttpResponse.error()))

    const { user } = renderForm()

    await fill(user)
    await user.click(screen.getByRole('button', { name: 'contact.form.submit' }))

    expect(await screen.findByText('contact.errors.network')).toBeInTheDocument()
  })

  it('honeypot je skriven od korisnika, ali se šalje', async () => {
    let body: Record<string, unknown> | undefined
    server.use(
      http.post(`${API}/contact`, async ({ request }) => {
        body = (await request.json()) as Record<string, unknown>
        return HttpResponse.json({ ok: true }, { status: 202 })
      }),
    )

    const { user } = renderForm()

    // Nije u pristupačnom stablu — screen reader ga ne vidi kao polje
    expect(screen.queryByLabelText(/website/i)).not.toBeInTheDocument()

    await fill(user)
    await user.click(screen.getByRole('button', { name: 'contact.form.submit' }))

    await waitFor(() => {
      expect(body).toHaveProperty('website', '')
    })
  })

  it('„pošalji još jednu" vraća praznu formu', async () => {
    server.use(http.post(`${API}/contact`, () => HttpResponse.json({ ok: true }, { status: 202 })))

    const { user } = renderForm()

    await fill(user)
    await user.click(screen.getByRole('button', { name: 'contact.form.submit' }))
    await screen.findByText('contact.form.sentTitle')

    await user.click(screen.getByRole('button', { name: 'contact.form.sendAnother' }))

    expect(await screen.findByLabelText('contact.form.name')).toHaveValue('')
  })
})
