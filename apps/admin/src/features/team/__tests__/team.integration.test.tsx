import { screen, waitFor, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

import { TeamPage } from '@/pages/TeamPage'
import { store } from '@/store'
import { API, renderWithApp, server } from '@/test/harness'

import { teamApi } from '../api/teamApi'

const member = (overrides = {}) => ({
  id: 'm1',
  fullName: 'Dušan Pavlović',
  roleSr: 'Razvoj',
  roleEn: 'Development',
  avatarId: null,
  avatarUrl: null,
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
  sealId: null,
  sealUrl: null,
  sortOrder: 0,
  isVisible: true,
  ...overrides,
})

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
})
beforeEach(() => {
  store.dispatch(teamApi.util.resetApiState())
})
afterEach(() => {
  server.resetHandlers()
})
afterAll(() => {
  server.close()
})

const listOnce = (items: unknown[] = [member()]) => {
  server.use(http.get(`${API}/admin/team`, () => HttpResponse.json({ items })))
}

describe('lista tima', () => {
  it('prikazuje ime, ulogu i oznaku diplome', async () => {
    listOnce()

    renderWithApp(<TeamPage />)

    expect(await screen.findByText('Dušan Pavlović')).toBeInTheDocument()
    expect(screen.getByText('Razvoj')).toBeInTheDocument()
    expect(screen.getByText('team.list.hasDiploma')).toBeInTheDocument()
  })

  // Član bez diplome ostaje u timu — samo oznaka je druga
  it('član bez diplome se prikazuje sa drugom oznakom', async () => {
    listOnce([member({ hasDiploma: false })])

    renderWithApp(<TeamPage />)

    expect(await screen.findByText('team.list.noDiploma')).toBeInTheDocument()
    expect(screen.getByText('Dušan Pavlović')).toBeInTheDocument()
  })

  it('bez avatara prikazuje inicijale, ne praznu sliku', async () => {
    listOnce([member({ avatarUrl: null })])

    renderWithApp(<TeamPage />)

    expect(await screen.findByText('DP')).toBeInTheDocument()
  })

  it('prazna lista nudi izlaz', async () => {
    listOnce([])

    renderWithApp(<TeamPage />)

    expect(await screen.findByText('team.empty.title')).toBeInTheDocument()
  })
})

describe('forma člana', () => {
  /*
   * Polja diplome su SKRIVENA dok čekboks nije uključen.
   *
   * Bez toga je forma zid od jedanaest praznih polja i za člana koji diplomu nema.
   */
  it('polja diplome se pojavljuju tek kad se čekira', async () => {
    listOnce([])

    const { user } = renderWithApp(<TeamPage />)

    await user.click(await screen.findByRole('button', { name: 'team.new' }))

    // Labele nose i jezik: `team.form.faculty (team.locales.Sr)`
    expect(screen.queryByLabelText(/team\.form\.faculty/)).not.toBeInTheDocument()

    await user.click(screen.getByLabelText('team.form.hasDiploma'))

    expect((await screen.findAllByLabelText(/team\.form\.faculty/)).length).toBe(2)
  })

  it('član se može sačuvati samo sa imenom', async () => {
    listOnce([])
    let body: Record<string, unknown> | undefined
    server.use(
      http.post(`${API}/admin/team`, async ({ request }) => {
        body = (await request.json()) as Record<string, unknown>
        return HttpResponse.json(member(), { status: 201 })
      }),
    )

    const { user } = renderWithApp(<TeamPage />)

    await user.click(await screen.findByRole('button', { name: 'team.new' }))
    await user.type(screen.getByLabelText('team.form.fullName'), 'Ana Anić')
    await user.click(screen.getByRole('button', { name: 'common.save' }))

    await waitFor(() => {
      expect(body).toBeDefined()
    })
    expect(body?.fullName).toBe('Ana Anić')
    // Diploma nije čekirana, pa server dobija `false` — kartica se na sajtu ne renderuje
    expect(body?.hasDiploma).toBe(false)
  })

  it('prazna forma ne šalje zahtev', async () => {
    listOnce([])

    const { user } = renderWithApp(<TeamPage />)

    await user.click(await screen.findByRole('button', { name: 'team.new' }))
    await user.click(screen.getByRole('button', { name: 'common.save' }))

    expect((await screen.findAllByRole('alert')).length).toBeGreaterThan(0)
  })

  it('izmena popunjava formu podacima sa servera', async () => {
    listOnce()

    const { user } = renderWithApp(<TeamPage />)

    await user.click(await screen.findByRole('button', { name: 'common.edit' }))

    expect(await screen.findByLabelText('team.form.fullName')).toHaveValue('Dušan Pavlović')
  })
})

describe('redosled i brisanje', () => {
  it('prva strelica gore je onemogućena', async () => {
    listOnce([member(), member({ id: 'm2', fullName: 'Ana Anić' })])

    renderWithApp(<TeamPage />)

    const up = await screen.findAllByRole('button', { name: 'team.list.moveUp' })
    expect(up[0]).toBeDisabled()
    expect(up[1]).toBeEnabled()
  })

  it('pomeranje šalje CEO novi poredak', async () => {
    listOnce([member(), member({ id: 'm2', fullName: 'Ana Anić' })])
    let body: { ids?: string[] } | undefined
    server.use(
      http.patch(`${API}/admin/team/order`, async ({ request }) => {
        body = (await request.json()) as { ids: string[] }
        return new HttpResponse(null, { status: 204 })
      }),
    )

    const { user } = renderWithApp(<TeamPage />)

    const down = await screen.findAllByRole('button', { name: 'team.list.moveDown' })
    await user.click(down[0]!)

    await waitFor(() => {
      expect(body?.ids).toEqual(['m2', 'm1'])
    })
  })

  it('brisanje traži potvrdu', async () => {
    listOnce()
    const onDelete = vi.fn()
    server.use(
      http.delete(`${API}/admin/team/m1`, () => {
        onDelete()
        return new HttpResponse(null, { status: 204 })
      }),
    )

    const { user } = renderWithApp(<TeamPage />)

    await user.click(await screen.findByRole('button', { name: 'common.delete' }))

    const dialog = await screen.findByRole('dialog')
    expect(onDelete).not.toHaveBeenCalled()

    await user.click(within(dialog).getByRole('button', { name: 'team.delete.confirm' }))

    await waitFor(() => {
      expect(onDelete).toHaveBeenCalledOnce()
    })
  })
})
