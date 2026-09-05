import { screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

import { TeamCvPage } from '@/pages/TeamCvPage'
import { store } from '@/store'
import { API, renderWithApp, server } from '@/test/harness'

import { teamApi } from '../api/teamApi'

const cv = (overrides = {}) => ({
  memberId: 'm1',
  fullName: 'Dušan Pavlović',
  roleSr: 'Razvoj',
  roleEn: 'Development',
  email: 'dusan@primer.dev',
  phone: '',
  githubUrl: '',
  linkedinUrl: '',
  websiteUrl: '',
  locationSr: 'Niš',
  locationEn: 'Nish',
  summarySr: 'Sažetak',
  summaryEn: 'Summary',
  hasDiploma: true,
  universitySr: 'Univerzitet u Nišu',
  universityEn: 'University of Niš',
  degreeSr: 'Inženjer',
  degreeEn: 'Engineer',
  programmeSr: 'Računarstvo',
  programmeEn: 'Computer Science',
  facultySr: 'Elektronski fakultet',
  facultyEn: 'Faculty of Electronic Engineering',
  city: 'Niš',
  educationStatusSr: 'Student',
  educationStatusEn: 'Student',
  gpa: '8.57/10.0',
  educationStartYear: 2020,
  educationEndYear: 2025,
  siteProjects: [],
  experiences: [],
  languages: [],
  ...overrides,
})

const experience = (overrides = {}) => ({
  company: 'Tremium Software',
  positionSr: 'Junior inženjer',
  positionEn: 'Junior Engineer',
  locationSr: 'Niš',
  locationEn: 'Nish',
  startYear: 2025,
  startMonth: 1,
  endYear: null,
  endMonth: null,
  summarySr: 'Sažetak posla',
  summaryEn: 'Job summary',
  bulletsSr: ['Radio na API-jima.', 'Pisao testove.'],
  bulletsEn: ['Worked on APIs.'],
  technologies: ['.NET', 'PostgreSQL'],
  ...overrides,
})

const project = (overrides = {}) => ({
  id: 'p1',
  slug: 'booksphere',
  titleSr: 'BookSphere',
  titleEn: 'BookSphere',
  descSr: 'Opis projekta',
  descEn: 'Project description',
  year: 2025,
  technologies: [{ id: 't1', label: 'React' }],
  images: [],
  ...overrides,
})

/** `TeamCvPage` čita `id` iz rute, pa se render uvek radi kroz šablon. */
const renderPage = () =>
  renderWithApp(<TeamCvPage />, { path: '/team/:id/cv', entry: '/team/m1/cv' })

const mock = ({ body = cv(), projects = [project()] } = {}) => {
  server.use(
    http.get(`${API}/admin/team/m1/cv`, () => HttpResponse.json(body)),
    http.get(`${API}/admin/projects`, () => HttpResponse.json({ items: projects })),
  )
}

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
})
beforeEach(() => {
  store.dispatch(teamApi.util.resetApiState())
})
afterEach(() => {
  server.resetHandlers()
  vi.restoreAllMocks()
})
afterAll(() => {
  server.close()
})

describe('CV — učitavanje', () => {
  it('do dolaska podataka stoji indikator, ne prazna forma', () => {
    mock()
    renderPage()

    expect(screen.getByText('common.loading')).toBeInTheDocument()
  })

  it('ime člana stoji iznad forme — CV se uređuje po članu', async () => {
    mock()
    renderPage()

    expect(await screen.findByText('Dušan Pavlović')).toBeInTheDocument()
    expect(screen.getByText('cv.title')).toBeInTheDocument()
  })

  it('postojeće vrednosti pune polja', async () => {
    mock()
    renderPage()

    expect(await screen.findByDisplayValue('dusan@primer.dev')).toBeInTheDocument()
    expect(screen.getByDisplayValue('8.57/10.0')).toBeInTheDocument()
    expect(screen.getByDisplayValue('2020')).toBeInTheDocument()
  })

  it('nizovi se u formi prikazuju kao tekst — stavke po redu, tehnologije zarezom', async () => {
    mock({ body: cv({ experiences: [experience()] }) })
    renderPage()

    const bullets = await screen.findByLabelText('cv.experience.bullets')

    // `.value`, ne `findByDisplayValue`: matcher normalizuje beline i novi red bi postao razmak
    expect((bullets as HTMLTextAreaElement).value).toBe('Radio na API-jima.\nPisao testove.')
    expect(screen.getByDisplayValue('.NET, PostgreSQL')).toBeInTheDocument()
  })
})

describe('CV — čuvanje', () => {
  it('tekst se vraća u nizove pre slanja', async () => {
    mock({ body: cv({ experiences: [experience()] }) })
    let sent: Record<string, unknown> | null = null
    server.use(
      http.put(`${API}/admin/team/m1/cv`, async ({ request }) => {
        sent = (await request.json()) as Record<string, unknown>
        return HttpResponse.json(cv())
      }),
    )

    const { user } = renderPage()
    await user.click(await screen.findByRole('button', { name: 'cv.form.save' }))

    await waitFor(() => {
      expect(sent).not.toBeNull()
    })
    expect(sent).toMatchObject({
      experiences: [
        {
          bulletsSr: ['Radio na API-jima.', 'Pisao testove.'],
          bulletsEn: ['Worked on APIs.'],
          technologies: ['.NET', 'PostgreSQL'],
        },
      ],
    })
  })

  it('prazna godina ostaje `null`, ne `NaN` — prazno polje nije greška', async () => {
    mock({ body: cv({ educationEndYear: null }) })
    let sent: Record<string, unknown> | null = null
    server.use(
      http.put(`${API}/admin/team/m1/cv`, async ({ request }) => {
        sent = (await request.json()) as Record<string, unknown>
        return HttpResponse.json(cv())
      }),
    )

    const { user } = renderPage()
    await user.click(await screen.findByRole('button', { name: 'cv.form.save' }))

    await waitFor(() => {
      expect(sent).not.toBeNull()
    })
    expect(sent).toMatchObject({ educationEndYear: null })
  })

  it('uspeh se vidi — forma je duga, pa ćutanje izgleda kao kvar', async () => {
    mock()
    server.use(http.put(`${API}/admin/team/m1/cv`, () => HttpResponse.json(cv())))

    const { user } = renderPage()
    await user.click(await screen.findByRole('button', { name: 'cv.form.save' }))

    expect(await screen.findByText('cv.form.saved')).toBeInTheDocument()
  })

  it('neuspeh se vidi isto tako', async () => {
    mock()
    server.use(
      http.put(`${API}/admin/team/m1/cv`, () =>
        HttpResponse.json({ message: 'pao' }, { status: 500 }),
      ),
    )

    const { user } = renderPage()
    await user.click(await screen.findByRole('button', { name: 'cv.form.save' }))

    expect(await screen.findByText('cv.form.failed')).toBeInTheDocument()
  })

  it('prazan obavezan red zaustavlja slanje', async () => {
    mock()
    const put = vi.fn(() => HttpResponse.json(cv()))
    server.use(http.put(`${API}/admin/team/m1/cv`, put))

    const { user } = renderPage()

    // Nov red jezika je prazan, a naziv je obavezan — forma ne sme da ga pusti
    await user.click(await screen.findByRole('button', { name: 'cv.languages.add' }))
    await user.click(screen.getByRole('button', { name: 'cv.form.save' }))

    expect(await screen.findByText('cv.form.invalid')).toBeInTheDocument()
    expect(put).not.toHaveBeenCalled()
  })
})

describe('CV — redovi', () => {
  it('bez iskustva stoji poruka, ne prazan prostor', async () => {
    mock()
    renderPage()

    expect(await screen.findByText('cv.experience.empty')).toBeInTheDocument()
    expect(screen.getByText('cv.languages.empty')).toBeInTheDocument()
  })

  it('dodavanje iskustva otvara red sa tekućom godinom', async () => {
    mock()
    const { user } = renderPage()

    await user.click(await screen.findByRole('button', { name: 'cv.experience.add' }))

    expect(screen.getByText('cv.experience.row 1')).toBeInTheDocument()
    expect(screen.getByDisplayValue(String(new Date().getFullYear()))).toBeInTheDocument()
  })

  it('uklanjanje reda ga stvarno sklanja', async () => {
    mock({
      body: cv({
        languages: [{ nameSr: 'Engleski', nameEn: 'English', levelSr: 'B2', levelEn: 'B2' }],
      }),
    })
    const { user } = renderPage()

    expect(await screen.findByDisplayValue('Engleski')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'cv.form.remove' }))

    expect(screen.queryByDisplayValue('Engleski')).not.toBeInTheDocument()
    expect(screen.getByText('cv.languages.empty')).toBeInTheDocument()
  })

  it('projekat sa sajta se bira dugmetom i ispada iz ponude — isti rad dvaput je greška', async () => {
    mock()
    const { user } = renderPage()

    const pick = await screen.findByRole('button', { name: '+ BookSphere' })
    await user.click(pick)

    expect(screen.getByText('BookSphere · 2025')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '+ BookSphere' })).not.toBeInTheDocument()
    expect(screen.getByText('Opis projekta')).toBeInTheDocument()
  })

  it('kad projekata nema, ponuda to i kaže', async () => {
    mock({ projects: [] })
    renderPage()

    expect(await screen.findByText('cv.siteProjects.none')).toBeInTheDocument()
  })
})

describe('CV — preuzimanje', () => {
  it('nesačuvane izmene zaključavaju preuzimanje — server crta iz baze', async () => {
    mock()
    const { user } = renderPage()

    const download = await screen.findByRole('button', { name: 'cv.form.downloadSr' })
    expect(download).toBeEnabled()

    await user.type(screen.getByLabelText('cv.contact.phone'), '+381')

    expect(download).toBeDisabled()
    expect(screen.getByText('cv.form.saveFirst')).toBeInTheDocument()
  })

  it('preuzimanje traži PDF na traženom jeziku i nudi ga kao datoteku', async () => {
    mock()
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined)
    let asked: string | null = null
    server.use(
      http.get(`${API}/admin/team/m1/cv.pdf`, ({ request }) => {
        asked = new URL(request.url).searchParams.get('lang')
        return HttpResponse.text('%PDF-', { headers: { 'Content-Type': 'application/pdf' } })
      }),
    )

    const { user } = renderPage()
    await user.click(await screen.findByRole('button', { name: 'cv.form.downloadEn' }))

    await waitFor(() => {
      expect(click).toHaveBeenCalled()
    })
    expect(asked).toBe('en')
  })
})
