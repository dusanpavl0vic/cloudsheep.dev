import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import type { PropsWithChildren } from 'react'
import { I18nextProvider } from 'react-i18next'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest'

import { ProjectEditPage } from '@/pages/ProjectEditPage'
import { store } from '@/store'
import { createI18n } from '@app/i18n'

import { projectsApi } from '../api/projectsApi'
import type { AdminProject } from '../types'

const API = 'http://localhost:3000'

const existing: AdminProject = {
  id: 'p1',
  slug: 'atlas-analytics',
  category: 'fullStack',
  year: 2025,
  sortOrder: 0,
  isFeatured: true,
  isPublished: true,
  galleryLayout: 'grid',
  technologyIds: [],
  technologies: [],
  images: [],
  liveUrl: null,
  repoUrl: null,
  titleSr: 'Atlas',
  titleEn: 'Atlas EN',
  catSr: 'full-stack',
  catEn: 'full-stack',
  descSr: 'Opis',
  descEn: 'Description',
  captionSr: '',
  captionEn: '',
  updatedAt: '2026-08-17T00:00:00.000Z',
}

const server = setupServer()

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
})
beforeEach(() => {
  store.dispatch(projectsApi.util.resetApiState())
})
afterEach(() => {
  server.resetHandlers()
})
afterAll(() => {
  server.close()
})

const i18n = createI18n({ resources: {}, storageKey: 'test.lang', lng: 'cimode' })

/** `path` i `entry` se razlikuju: forma za NOVI projekat nema `:id`, izmena ga ima. */
function makeWrapper(path: string, entry: string) {
  return function Wrapper({ children }: PropsWithChildren) {
    return (
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <MemoryRouter initialEntries={[entry]}>
            <Routes>
              <Route path={path} element={children} />
            </Routes>
          </MemoryRouter>
        </I18nextProvider>
      </Provider>
    )
  }
}

const renderNew = () => ({
  user: userEvent.setup(),
  ...render(<ProjectEditPage />, { wrapper: makeWrapper('/projects/new', '/projects/new') }),
})

const renderEdit = () => ({
  user: userEvent.setup(),
  ...render(<ProjectEditPage />, { wrapper: makeWrapper('/projects/:id', '/projects/p1') }),
})

/** Polja se biraju po `name`: oba jezika stoje u DOM-u i dele iste labele. */
const field = (name: string) => document.querySelector<HTMLElement>(`[name="${name}"]`)

const fillValid = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByLabelText('projects.form.slug'), 'novi-projekat')
  await user.clear(screen.getByLabelText('projects.form.year'))
  await user.type(screen.getByLabelText('projects.form.year'), '2026')

  for (const [name, value] of [
    ['titleSr', 'Novi'],
    ['catSr', 'backend'],
    ['descSr', 'Opis na srpskom'],
    ['titleEn', 'New'],
    ['catEn', 'backend'],
    ['descEn', 'Description in English'],
  ] as const) {
    const input = field(name)
    if (input) await user.type(input, value)
  }
}

describe('nov projekat', () => {
  it('prazna forma ne šalje zahtev — validacija je pre mreže', async () => {
    // Nema POST handlera: svaki zahtev bi oborio test kroz onUnhandledRequest: 'error'
    const { user } = renderNew()

    await user.click(screen.getByRole('button', { name: 'common.save' }))

    expect((await screen.findAllByRole('alert')).length).toBeGreaterThan(0)
  })

  it('ispravna forma šalje POST sa tehnologijama kao NIZOM', async () => {
    let body: unknown
    server.use(
      http.post(`${API}/admin/projects`, async ({ request }) => {
        body = await request.json()
        return HttpResponse.json(existing, { status: 201 })
      }),
    )

    const { user } = renderNew()

    await fillValid(user)
    await user.click(screen.getByRole('button', { name: 'common.save' }))

    await waitFor(() => {
      expect(body).toBeDefined()
    })
    // Tehnologije idu kao id-evi iz izbora, ne kao ukucani nazivi
    expect(body).toMatchObject({ slug: 'novi-projekat', technologyIds: [] })
  })

  it('prazan URL se šalje kao null, ne kao prazan string', async () => {
    let body: Record<string, unknown> | undefined
    server.use(
      http.post(`${API}/admin/projects`, async ({ request }) => {
        body = (await request.json()) as Record<string, unknown>
        return HttpResponse.json(existing, { status: 201 })
      }),
    )

    const { user } = renderNew()

    await fillValid(user)
    await user.click(screen.getByRole('button', { name: 'common.save' }))

    await waitFor(() => {
      expect(body).toBeDefined()
    })
    expect(body?.liveUrl).toBeNull()
    expect(body?.repoUrl).toBeNull()
  })

  it('neispravan slug se zaustavlja na klijentu', async () => {
    const { user } = renderNew()

    await user.type(screen.getByLabelText('projects.form.slug'), 'Veliko Slovo')
    await user.click(screen.getByRole('button', { name: 'common.save' }))

    expect(await screen.findByText('projects.errors.slugFormat')).toBeInTheDocument()
  })
})

describe('izmena postojećeg projekta', () => {
  const loadExisting = () => {
    server.use(http.get(`${API}/admin/projects/p1`, () => HttpResponse.json(existing)))
  }

  it('popunjava formu podacima sa servera, oba jezika', async () => {
    loadExisting()

    renderEdit()

    await waitFor(() => {
      expect(field('titleSr')).toHaveValue('Atlas')
    })
    // Engleski panel je skriven, ali podaci su u DOM-u — zato se greška na skrivenom
    // tabu uopšte može prikazati
    expect(field('titleEn')).toHaveValue('Atlas EN')
  })

  it('raspored galerije dolazi sa servera, ne iz podrazumevane vrednosti', async () => {
    server.use(
      http.get(`${API}/admin/projects/p1`, () =>
        HttpResponse.json({ ...existing, galleryLayout: 'feature' }),
      ),
    )

    renderEdit()

    await waitFor(() => {
      expect(screen.getByLabelText('projects.form.galleryLayout')).toHaveValue('feature')
    })
  })

  it('čuvanje šalje PATCH, ne POST', async () => {
    loadExisting()
    let method: string | undefined
    server.use(
      http.patch(`${API}/admin/projects/p1`, ({ request }) => {
        method = request.method
        return HttpResponse.json(existing)
      }),
    )

    const { user } = renderEdit()

    await waitFor(() => {
      expect(field('titleSr')).toHaveValue('Atlas')
    })
    await user.click(screen.getByRole('button', { name: 'common.save' }))

    await waitFor(() => {
      expect(method).toBe('PATCH')
    })
  })
})
