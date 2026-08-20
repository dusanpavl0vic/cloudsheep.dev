import { screen, waitFor, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

import { TechnologiesPage } from '@/pages/TechnologiesPage'
import { store } from '@/store'
import { API, renderWithApp, server } from '@/test/harness'

import { technologiesApi } from '../api/technologiesApi'

const tech = (overrides = {}) => ({
  id: 't1',
  slug: 'react',
  label: 'React',
  group: 'frontend',
  logoUrl: '/uploads/react.svg',
  ...overrides,
})

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
})
beforeEach(() => {
  store.dispatch(technologiesApi.util.resetApiState())
})
afterEach(() => {
  server.resetHandlers()
})
afterAll(() => {
  server.close()
})

const listOnce = (items: unknown[] = [tech()]) => {
  server.use(http.get(`${API}/admin/technologies`, () => HttpResponse.json({ items })))
}

describe('lista tehnologija', () => {
  it('prikazuje naziv, slug i logotip', async () => {
    listOnce()

    renderWithApp(<TechnologiesPage />)

    expect(await screen.findByText('React')).toBeInTheDocument()
    expect(screen.getByText('react')).toBeInTheDocument()
    expect(screen.getByRole('table')).toBeInTheDocument()
  })

  // Tehnologija bez logotipa nije greška — prikazuje se samo naziv
  it('tehnologija bez logotipa se prikazuje bez slike', async () => {
    listOnce([tech({ logoUrl: null })])

    renderWithApp(<TechnologiesPage />)

    await screen.findByText('React')
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('prazna lista nudi izlaz', async () => {
    listOnce([])

    renderWithApp(<TechnologiesPage />)

    expect(await screen.findByText('technologies.empty.title')).toBeInTheDocument()
  })

  it('greška servera se prijavljuje', async () => {
    server.use(http.get(`${API}/admin/technologies`, () => HttpResponse.json({}, { status: 500 })))

    renderWithApp(<TechnologiesPage />)

    expect(await screen.findByRole('alert')).toHaveTextContent('technologies.loadError')
  })
})

describe('dodavanje tehnologije', () => {
  it('slug se predlaže iz naziva', async () => {
    listOnce([])

    const { user } = renderWithApp(<TechnologiesPage />)

    await user.click(await screen.findByRole('button', { name: 'technologies.new' }))
    await user.type(screen.getByLabelText('technologies.form.label'), 'Node.js')

    // `Node.js` → `nodejs`: ista normalizacija koju koriste baza i migracija
    expect(screen.getByLabelText('technologies.form.slug')).toHaveValue('nodejs')
  })

  it('šalje POST i zatvara formu', async () => {
    listOnce([])
    let body: unknown
    server.use(
      http.post(`${API}/admin/technologies`, async ({ request }) => {
        body = await request.json()
        return HttpResponse.json(tech(), { status: 201 })
      }),
    )

    const { user } = renderWithApp(<TechnologiesPage />)

    await user.click(await screen.findByRole('button', { name: 'technologies.new' }))
    await user.type(screen.getByLabelText('technologies.form.label'), 'Svelte')
    await user.click(screen.getByRole('button', { name: 'common.save' }))

    await waitFor(() => {
      expect(body).toMatchObject({ slug: 'svelte', label: 'Svelte' })
    })
  })

  it('zauzet slug daje grešku NA POLJU, ne u toastu', async () => {
    listOnce([])
    server.use(
      http.post(`${API}/admin/technologies`, () =>
        HttpResponse.json(
          { messageKey: 'errors.conflict', details: { field: 'slug' } },
          { status: 409 },
        ),
      ),
    )

    const { user } = renderWithApp(<TechnologiesPage />)

    await user.click(await screen.findByRole('button', { name: 'technologies.new' }))
    await user.type(screen.getByLabelText('technologies.form.label'), 'React')
    await user.click(screen.getByRole('button', { name: 'common.save' }))

    expect(await screen.findByText('technologies.errors.slugTaken')).toBeInTheDocument()
  })

  it('prazna forma ne šalje zahtev', async () => {
    listOnce([])
    // Nema POST handlera — zahtev bi oborio test kroz onUnhandledRequest: 'error'
    const { user } = renderWithApp(<TechnologiesPage />)

    await user.click(await screen.findByRole('button', { name: 'technologies.new' }))
    await user.click(screen.getByRole('button', { name: 'common.save' }))

    expect((await screen.findAllByRole('alert')).length).toBeGreaterThan(0)
  })
})

describe('brisanje tehnologije', () => {
  it('traži potvrdu, pa šalje DELETE', async () => {
    listOnce()
    const onDelete = vi.fn()
    server.use(
      http.delete(`${API}/admin/technologies/t1`, () => {
        onDelete()
        return new HttpResponse(null, { status: 204 })
      }),
    )

    const { user } = renderWithApp(<TechnologiesPage />)

    await user.click(await screen.findByRole('button', { name: 'common.delete' }))

    const dialog = await screen.findByRole('dialog')
    expect(onDelete).not.toHaveBeenCalled()

    await user.click(within(dialog).getByRole('button', { name: 'technologies.delete.confirm' }))

    await waitFor(() => {
      expect(onDelete).toHaveBeenCalledOnce()
    })
  })
})

describe('otpremanje logotipa', () => {
  const file = () => new File(['<svg />'], 'react.svg', { type: 'image/svg+xml' })

  /*
   * Otpremanje je DVA koraka: datoteka na `/admin/uploads`, pa njen `id` u telu forme.
   *
   * Tako ista datoteka može stajati na dva mesta, a neuspelo čuvanje forme ne znači da je
   * otpremanje palo.
   */
  it('otpremljeni logotip se prikazuje i šalje kao id, ne kao datoteka', async () => {
    listOnce([])
    let body: Record<string, unknown> | undefined
    server.use(
      http.post(`${API}/admin/uploads`, () =>
        HttpResponse.json(
          {
            id: 'a1',
            url: '/uploads/a1.svg',
            width: 24,
            height: 24,
            sizeBytes: 120,
            mimeType: 'image/svg+xml',
            label: 'react.svg',
          },
          { status: 201 },
        ),
      ),
      http.post(`${API}/admin/technologies`, async ({ request }) => {
        body = (await request.json()) as Record<string, unknown>
        return HttpResponse.json(tech(), { status: 201 })
      }),
    )

    const { user } = renderWithApp(<TechnologiesPage />)

    await user.click(await screen.findByRole('button', { name: 'technologies.new' }))
    await user.type(screen.getByLabelText('technologies.form.label'), 'React')

    const input = document.querySelector<HTMLInputElement>('input[type="file"]')
    if (!input) throw new Error('polje za datoteku nije nađeno')
    await user.upload(input, file())

    // Pregled se pojavi tek kad server vrati adresu
    await waitFor(() => {
      expect(screen.getByRole('img')).toHaveAttribute('src', '/uploads/a1.svg')
    })

    await user.click(screen.getByRole('button', { name: 'common.save' }))

    await waitFor(() => {
      expect(body).toMatchObject({ logoId: 'a1' })
    })
  })

  it('odbijena datoteka daje poruku pored polja, ne pada', async () => {
    listOnce([])
    server.use(
      http.post(`${API}/admin/uploads`, () =>
        HttpResponse.json({ messageKey: 'uploads.errors.unsupportedType' }, { status: 415 }),
      ),
    )

    const { user } = renderWithApp(<TechnologiesPage />)

    await user.click(await screen.findByRole('button', { name: 'technologies.new' }))

    const input = document.querySelector<HTMLInputElement>('input[type="file"]')
    if (!input) throw new Error('polje za datoteku nije nađeno')
    await user.upload(input, file())

    expect(await screen.findByRole('alert')).toBeInTheDocument()
  })
})
