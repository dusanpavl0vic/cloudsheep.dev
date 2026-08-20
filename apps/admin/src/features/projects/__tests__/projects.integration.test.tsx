import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import type { PropsWithChildren } from 'react'
import { I18nextProvider } from 'react-i18next'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

import { ProjectsPage } from '@/pages/ProjectsPage'
import { ModalRoot } from '@/providers/ModalRoot'
import { store } from '@/store'
import { createI18n } from '@app/i18n'

import { projectsApi } from '../api/projectsApi'
import type { AdminProject } from '../types'

const API = 'http://localhost:3000'

const makeProject = (overrides: Partial<AdminProject> = {}): AdminProject => ({
  id: 'p1',
  slug: 'atlas-analytics',
  category: 'fullStack',
  year: 2025,
  sortOrder: 0,
  isFeatured: true,
  isPublished: true,
  mediaSide: 'start',
  galleryLayout: 'grid',
  technologyIds: [],
  technologies: [],
  images: [],
  liveUrl: null,
  repoUrl: null,
  titleSr: 'Atlas',
  titleEn: 'Atlas',
  catSr: 'full-stack',
  catEn: 'full-stack',
  descSr: 'Opis',
  descEn: 'Description',
  captionSr: '',
  captionEn: '',
  updatedAt: '2026-08-17T00:00:00.000Z',
  ...overrides,
})

// MSW presreće na MREŽNOM nivou — test prolazi kroz pravi baseQuery, prave tagove
// i pravu normalizaciju grešaka (docs/12-testing.md)
const server = setupServer()

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
})

/*
 * Keš se briše u `beforeEach`, NE u `afterEach`.
 *
 * U `afterEach` komponente su još montirane (RTL `cleanup` je registrovan globalno i ide
 * svojim redom), pa `resetApiState` odmah pokrene ponovni zahtev — a handleri su tada već
 * obrisani. Rezultat: „unhandled request", keš ostane u stanju greške, i SLEDEĆI test se
 * pretplati na tu grešku umesto da povuče svoje podatke.
 */
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

function Wrapper({ children }: PropsWithChildren) {
  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          {children}
          {/* Modali se renderuju kroz ModalRoot, kao u pravoj app-i */}
          <ModalRoot />
        </MemoryRouter>
      </I18nextProvider>
    </Provider>
  )
}

const renderPage = () => ({
  user: userEvent.setup(),
  ...render(<ProjectsPage />, { wrapper: Wrapper }),
})

describe('lista projekata', () => {
  it('prikazuje projekte sa servera', async () => {
    server.use(
      http.get(`${API}/admin/projects`, () =>
        HttpResponse.json({ items: [makeProject(), makeProject({ id: 'p2', slug: 'pulse-api' })] }),
      ),
    )

    renderPage()

    expect(await screen.findByText('atlas-analytics')).toBeInTheDocument()
    expect(screen.getByText('pulse-api')).toBeInTheDocument()
  })

  it('razlikuje objavljeno od skice', async () => {
    server.use(
      http.get(`${API}/admin/projects`, () =>
        HttpResponse.json({ items: [makeProject({ isPublished: false })] }),
      ),
    )

    renderPage()

    expect(await screen.findByText('projects.status.draft')).toBeInTheDocument()
    expect(screen.queryByText('projects.status.published')).not.toBeInTheDocument()
  })

  it('prazna lista nudi izlaz, ne samo prazan ekran', async () => {
    server.use(http.get(`${API}/admin/projects`, () => HttpResponse.json({ items: [] })))

    renderPage()

    expect(await screen.findByText('projects.empty.title')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'projects.empty.action' })).toBeInTheDocument()
  })

  it('greška servera se prijavljuje, ne ostavlja prazan ekran', async () => {
    server.use(http.get(`${API}/admin/projects`, () => HttpResponse.json({}, { status: 500 })))

    renderPage()

    expect(await screen.findByRole('alert')).toHaveTextContent('projects.loadError')
  })

  it('tokom učitavanja objavljuje stanje pomoćnoj tehnologiji', () => {
    server.use(
      http.get(`${API}/admin/projects`, async () => {
        await new Promise((resolve) => setTimeout(resolve, 50))
        return HttpResponse.json({ items: [] })
      }),
    )

    renderPage()

    expect(screen.getByRole('status')).toHaveTextContent('projects.loading')
  })
})

describe('brisanje projekta', () => {
  const listOnce = () => {
    server.use(
      http.get(`${API}/admin/projects`, () => HttpResponse.json({ items: [makeProject()] })),
    )
  }

  it('traži potvrdu pre brisanja — dijalog, ne odmah DELETE', async () => {
    listOnce()
    const onDelete = vi.fn()
    server.use(
      http.delete(`${API}/admin/projects/p1`, () => {
        onDelete()
        return new HttpResponse(null, { status: 204 })
      }),
    )

    const { user } = renderPage()

    await user.click(await screen.findByRole('button', { name: 'common.delete' }))

    expect(await screen.findByRole('dialog')).toBeInTheDocument()
    expect(onDelete).not.toHaveBeenCalled()
  })

  it('potvrda šalje DELETE i sklanja projekat iz liste', async () => {
    const items = [makeProject()]
    server.use(
      http.get(`${API}/admin/projects`, () => HttpResponse.json({ items })),
      http.delete(`${API}/admin/projects/p1`, () => {
        items.length = 0
        return new HttpResponse(null, { status: 204 })
      }),
    )

    const { user } = renderPage()

    await user.click(await screen.findByRole('button', { name: 'common.delete' }))

    const dialog = await screen.findByRole('dialog')
    await user.click(within(dialog).getByRole('button', { name: 'projects.delete.confirm' }))

    // `invalidatesTags` povlači listu ponovo — prazno stanje je dokaz da je keš osvežen
    await waitFor(() => {
      expect(screen.getByText('projects.empty.title')).toBeInTheDocument()
    })
  })

  it('odustajanje NE šalje DELETE', async () => {
    listOnce()
    const onDelete = vi.fn()
    server.use(
      http.delete(`${API}/admin/projects/p1`, () => {
        onDelete()
        return new HttpResponse(null, { status: 204 })
      }),
    )

    const { user } = renderPage()

    await user.click(await screen.findByRole('button', { name: 'common.delete' }))

    const dialog = await screen.findByRole('dialog')
    await user.click(within(dialog).getByRole('button', { name: 'common.cancel' }))

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
    expect(onDelete).not.toHaveBeenCalled()
    expect(screen.getByText('atlas-analytics')).toBeInTheDocument()
  })
})
