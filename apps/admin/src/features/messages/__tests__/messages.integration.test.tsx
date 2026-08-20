import { screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

import { MessagesPage } from '@/pages/MessagesPage'
import { store } from '@/store'
import { API, renderWithApp, server } from '@/test/harness'

import { messagesApi } from '../api/messagesApi'

const message = (overrides = {}) => ({
  id: 'c1',
  name: 'Marko Marković',
  email: 'marko@primer.rs',
  subject: 'Saradnja',
  message: 'Zdravo, zanima me saradnja.',
  isRead: false,
  wasEmailed: true,
  emailError: null,
  createdAt: '2026-08-18T10:00:00.000Z',
  ...overrides,
})

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
})
beforeEach(() => {
  store.dispatch(messagesApi.util.resetApiState())
})
afterEach(() => {
  server.resetHandlers()
})
afterAll(() => {
  server.close()
})

const listOnce = (items: unknown[] = [message()], unread = 1) => {
  server.use(http.get(`${API}/admin/messages`, () => HttpResponse.json({ items, unread })))
}

describe('poruke', () => {
  it('prikazuje pošiljaoca, naslov i tekst', async () => {
    listOnce()

    renderWithApp(<MessagesPage />)

    expect(await screen.findByText('Marko Marković')).toBeInTheDocument()
    expect(screen.getByText('Saradnja')).toBeInTheDocument()
    expect(screen.getByText('Zdravo, zanima me saradnja.')).toBeInTheDocument()
  })

  it('adresa pošiljaoca je mailto link — odgovara se jednim klikom', async () => {
    listOnce()

    renderWithApp(<MessagesPage />)

    expect(await screen.findByRole('link', { name: 'marko@primer.rs' })).toHaveAttribute(
      'href',
      'mailto:marko@primer.rs',
    )
  })

  /*
   * Poruka postoji i kad mejl NIJE prošao — to je cela poenta upisa pre slanja.
   * Bez ove oznake pad SMTP-a bi bio nevidljiv.
   */
  it('poruka bez poslatog mejla nosi oznaku', async () => {
    listOnce([message({ wasEmailed: false, emailError: 'SMTP timeout' })])

    renderWithApp(<MessagesPage />)

    expect(await screen.findByText('messages.notEmailed')).toBeInTheDocument()
  })

  it('poslata poruka nema tu oznaku', async () => {
    listOnce()

    renderWithApp(<MessagesPage />)

    await screen.findByText('Marko Marković')
    expect(screen.queryByText('messages.notEmailed')).not.toBeInTheDocument()
  })

  it('prazna lista objašnjava odakle poruke stižu', async () => {
    listOnce([], 0)

    renderWithApp(<MessagesPage />)

    expect(await screen.findByText('messages.empty.title')).toBeInTheDocument()
  })

  it('greška servera se prijavljuje', async () => {
    server.use(http.get(`${API}/admin/messages`, () => HttpResponse.json({}, { status: 500 })))

    renderWithApp(<MessagesPage />)

    expect(await screen.findByRole('alert')).toHaveTextContent('messages.loadError')
  })

  it('označavanje kao pročitano šalje PATCH', async () => {
    listOnce()
    let body: Record<string, unknown> | undefined
    server.use(
      http.patch(`${API}/admin/messages/c1`, async ({ request }) => {
        body = (await request.json()) as Record<string, unknown>
        return new HttpResponse(null, { status: 204 })
      }),
    )

    const { user } = renderWithApp(<MessagesPage />)

    await user.click(await screen.findByRole('button', { name: 'messages.markRead' }))

    await waitFor(() => {
      expect(body).toEqual({ isRead: true })
    })
  })

  it('filter „nepročitane" menja upit ka serveru', async () => {
    let requested: string | undefined
    server.use(
      http.get(`${API}/admin/messages`, ({ request }) => {
        requested = new URL(request.url).searchParams.get('status') ?? undefined
        return HttpResponse.json({ items: [], unread: 0 })
      }),
    )

    const { user } = renderWithApp(<MessagesPage />)

    await user.click(await screen.findByRole('button', { name: 'messages.filters.unread' }))

    await waitFor(() => {
      expect(requested).toBe('unread')
    })
  })

  it('brisanje šalje DELETE', async () => {
    listOnce()
    const onDelete = vi.fn()
    server.use(
      http.delete(`${API}/admin/messages/c1`, () => {
        onDelete()
        return new HttpResponse(null, { status: 204 })
      }),
    )

    const { user } = renderWithApp(<MessagesPage />)

    await user.click(await screen.findByRole('button', { name: 'common.delete' }))

    await waitFor(() => {
      expect(onDelete).toHaveBeenCalledOnce()
    })
  })
})
