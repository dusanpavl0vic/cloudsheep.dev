import { screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

import { ProjectEditPage } from '@/pages/ProjectEditPage'
import { store } from '@/store'
import { API, renderWithApp, server } from '@/test/harness'

import { projectsApi } from '../api/projectsApi'
import type { AdminProject } from '../types'

const image = (overrides = {}) => ({
  id: 'i1',
  url: '/uploads/a.png',
  width: 800,
  height: 600,
  alt: { sr: '', en: '' },
  altSr: 'Prvi',
  altEn: 'First',
  sortOrder: 0,
  ...overrides,
})

const project = (images: unknown[] = [image()]): AdminProject =>
  ({
    id: 'p1',
    slug: 'atlas',
    category: 'fullStack',
    year: 2025,
    sortOrder: 0,
    isFeatured: false,
    isPublished: true,
    mediaSide: 'start',
    galleryLayout: 'grid',
    technologyIds: [],
    technologies: [],
    images,
    liveUrl: null,
    repoUrl: null,
    titleSr: 'Atlas',
    titleEn: 'Atlas',
    catSr: 'full-stack',
    catEn: 'full-stack',
    descSr: 'Opis',
    descEn: 'Desc',
    captionSr: '',
    captionEn: '',
    updatedAt: '2026-08-18T00:00:00.000Z',
  }) as AdminProject

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

const renderEdit = (images: unknown[] = [image()]) => {
  server.use(
    http.get(`${API}/admin/projects/p1`, () => HttpResponse.json(project(images))),
    http.get(`${API}/admin/technologies`, () => HttpResponse.json({ items: [] })),
  )

  return renderWithApp(<ProjectEditPage />, { path: '/projects/:id', entry: '/projects/p1' })
}

describe('slike projekta', () => {
  it('prikazuje postojeće slike sa dimenzijama', async () => {
    renderEdit()

    // `alt=""` je namerno: opis stoji u polju pored, pa je slika ovde ukras.
    // Zato je i ne traži `getByRole('img')` — dekorativna slika nije u a11y stablu.
    await screen.findByLabelText('projects.images.altSr')
    const img = document.querySelector('img[src="/uploads/a.png"]')

    // Bez `width`/`height` stranica poskakuje dok se slika učitava (docs/07 §7)
    expect(img).toHaveAttribute('width', '800')
    expect(img).toHaveAttribute('height', '600')
  })

  it('opis se čuva na blur, ne na svaki pritisak tastera', async () => {
    let patched: Record<string, unknown> | undefined
    server.use(
      http.patch(`${API}/admin/projects/p1/images/i1`, async ({ request }) => {
        patched = (await request.json()) as Record<string, unknown>
        return new HttpResponse(null, { status: 204 })
      }),
    )

    const { user } = renderEdit()

    const alt = await screen.findByLabelText('projects.images.altSr')
    await user.clear(alt)
    await user.type(alt, 'Novi opis')
    // Bez odlaska sa polja nema zahteva — inače bi bio jedan po znaku
    expect(patched).toBeUndefined()

    await user.tab()

    await waitFor(() => {
      expect(patched).toEqual({ altSr: 'Novi opis' })
    })
  })

  it('pomeranje šalje CEO novi poredak slika', async () => {
    let body: { ids?: string[] } | undefined
    server.use(
      http.patch(`${API}/admin/projects/p1/images/order`, async ({ request }) => {
        body = (await request.json()) as { ids: string[] }
        return new HttpResponse(null, { status: 204 })
      }),
    )

    const { user } = renderEdit([image(), image({ id: 'i2', sortOrder: 1 })])

    const down = await screen.findAllByRole('button', { name: 'projects.images.moveDown' })
    await user.click(down[0]!)

    await waitFor(() => {
      expect(body?.ids).toEqual(['i2', 'i1'])
    })
  })

  it('brisanje slike šalje DELETE', async () => {
    const onDelete = vi.fn()
    server.use(
      http.delete(`${API}/admin/projects/p1/images/i1`, () => {
        onDelete()
        return new HttpResponse(null, { status: 204 })
      }),
    )

    const { user } = renderEdit()

    // Prvo dugme „obriši" u sekciji slika
    const buttons = await screen.findAllByRole('button', { name: 'common.delete' })
    await user.click(buttons[buttons.length - 1]!)

    await waitFor(() => {
      expect(onDelete).toHaveBeenCalledOnce()
    })
  })

  it('otpremanje kači sliku na projekat u dva koraka', async () => {
    let attached: Record<string, unknown> | undefined
    server.use(
      http.post(`${API}/admin/uploads`, () =>
        HttpResponse.json(
          {
            id: 'a9',
            url: '/uploads/a9.png',
            width: 10,
            height: 10,
            sizeBytes: 5,
            mimeType: 'image/png',
            label: 'a.png',
          },
          { status: 201 },
        ),
      ),
      http.post(`${API}/admin/projects/p1/images`, async ({ request }) => {
        attached = (await request.json()) as Record<string, unknown>
        return HttpResponse.json({ id: 'i9' }, { status: 201 })
      }),
    )

    const { user } = renderEdit([])

    // Sačekaj da se forma razreši — pre toga je na ekranu spinner
    await screen.findByLabelText('projects.form.slug')

    const input = document.querySelector<HTMLInputElement>('input[type="file"]')
    if (!input) throw new Error('polje za datoteku nije nađeno')
    await user.upload(input, new File(['x'], 'a.png', { type: 'image/png' }))

    await waitFor(() => {
      // Kači se `assetId` iz prvog koraka; opis se popunjava posle
      expect(attached).toMatchObject({ assetId: 'a9' })
    })
  })
})
