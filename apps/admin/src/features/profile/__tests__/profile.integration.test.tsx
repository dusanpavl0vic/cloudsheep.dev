import { screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

import { ProfilePage } from '@/pages/ProfilePage'
import { store } from '@/store'
import { API, renderWithApp, server } from '@/test/harness'

import { profileApi } from '../api/profileApi'

const profile = {
  fullName: 'Dušan Pavlović',
  location: 'Niš, Srbija · CET',
  isAvailable: true,
  headlineSr: 'Studio',
  headlineEn: 'Studio EN',
  bioSr: 'Opis',
  bioEn: 'Bio',
  universitySr: 'UN',
  universityEn: 'UN EN',
  degreeSr: 'Inženjer',
  degreeEn: 'Engineer',
}

const link = (overrides = {}) => ({
  id: 'l1',
  platform: 'github',
  url: 'https://github.com/x',
  label: 'GitHub',
  sortOrder: 0,
  isVisible: true,
  ...overrides,
})

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
})
beforeEach(() => {
  store.dispatch(profileApi.util.resetApiState())
})
afterEach(() => {
  server.resetHandlers()
})
afterAll(() => {
  server.close()
})

const loadOnce = (
  body: { profile: typeof profile | null; links: ReturnType<typeof link>[] } = {
    profile,
    links: [link()],
  },
) => {
  server.use(http.get(`${API}/admin/profile`, () => HttpResponse.json(body)))
}

describe('profil', () => {
  it('popunjava formu podacima sa servera, oba jezika', async () => {
    loadOnce()

    renderWithApp(<ProfilePage />)

    await waitFor(() => {
      expect(screen.getByLabelText('profile.form.fullName')).toHaveValue('Dušan Pavlović')
    })
    // Dvojezična polja stoje jedno pored drugog, oba popunjena
    expect(screen.getByLabelText(/profile.form.headline.*profile.locales.En/)).toHaveValue(
      'Studio EN',
    )
  })

  /* Prazan profil NIJE greška — forma se otvara prazna, ne pada. */
  it('nepostojeći profil daje praznu formu', async () => {
    loadOnce({ profile: null, links: [] })

    renderWithApp(<ProfilePage />)

    await waitFor(() => {
      expect(screen.getByLabelText('profile.form.fullName')).toHaveValue('')
    })
  })

  it('čuvanje šalje PUT, ne PATCH', async () => {
    loadOnce()
    let method: string | undefined
    server.use(
      http.put(`${API}/admin/profile`, ({ request }) => {
        method = request.method
        return HttpResponse.json(profile)
      }),
    )

    const { user } = renderWithApp(<ProfilePage />)

    await waitFor(() => {
      expect(screen.getByLabelText('profile.form.fullName')).toHaveValue('Dušan Pavlović')
    })
    await user.click(screen.getByRole('button', { name: 'common.save' }))

    await waitFor(() => {
      expect(method).toBe('PUT')
    })
  })

  it('prazno ime zaustavlja čuvanje na klijentu', async () => {
    loadOnce({ profile: null, links: [] })
    // Nema PUT handlera — zahtev bi oborio test
    const { user } = renderWithApp(<ProfilePage />)

    await waitFor(() => {
      expect(screen.getByLabelText('profile.form.fullName')).toBeInTheDocument()
    })
    await user.click(screen.getByRole('button', { name: 'common.save' }))

    expect(await screen.findByText('profile.errors.required')).toBeInTheDocument()
  })
})

describe('kontakt linkovi', () => {
  it('prikazuje postojeće linkove', async () => {
    loadOnce()

    renderWithApp(<ProfilePage />)

    expect(await screen.findByText('GitHub')).toBeInTheDocument()
    expect(screen.getByText('https://github.com/x')).toBeInTheDocument()
  })

  it('prazna lista linkova nudi objašnjenje', async () => {
    loadOnce({ profile, links: [] })

    renderWithApp(<ProfilePage />)

    expect(await screen.findByText('profile.links.empty')).toBeInTheDocument()
  })

  it('dodavanje šalje POST i prazni formu', async () => {
    loadOnce({ profile, links: [] })
    let body: Record<string, unknown> | undefined
    server.use(
      http.post(`${API}/admin/social-links`, async ({ request }) => {
        body = (await request.json()) as Record<string, unknown>
        return HttpResponse.json(link(), { status: 201 })
      }),
    )

    const { user } = renderWithApp(<ProfilePage />)

    await user.type(await screen.findByLabelText('profile.links.platform'), 'linkedin')
    await user.type(screen.getByLabelText('profile.links.label'), 'LinkedIn')
    await user.type(screen.getByLabelText('profile.links.url'), 'https://linkedin.com/in/x')
    await user.click(screen.getByRole('button', { name: 'profile.links.add' }))

    await waitFor(() => {
      expect(body).toMatchObject({ platform: 'linkedin', label: 'LinkedIn' })
    })
    // Forma se prazni tek kad je link zaista sačuvan
    await waitFor(() => {
      expect(screen.getByLabelText('profile.links.platform')).toHaveValue('')
    })
  })

  // `mailto:` je link kao i svaki drugi — mejl nema poseban slučaj
  it('prihvata mailto: adresu', async () => {
    loadOnce({ profile, links: [] })
    const onPost = vi.fn()
    server.use(
      http.post(`${API}/admin/social-links`, () => {
        onPost()
        return HttpResponse.json(link(), { status: 201 })
      }),
    )

    const { user } = renderWithApp(<ProfilePage />)

    await user.type(await screen.findByLabelText('profile.links.platform'), 'email')
    await user.type(screen.getByLabelText('profile.links.label'), 'E-mail')
    await user.type(screen.getByLabelText('profile.links.url'), 'mailto:a@b.rs')
    await user.click(screen.getByRole('button', { name: 'profile.links.add' }))

    await waitFor(() => {
      expect(onPost).toHaveBeenCalledOnce()
    })
  })

  it('odbija adresu koja nije ni URL ni mailto', async () => {
    loadOnce({ profile, links: [] })

    const { user } = renderWithApp(<ProfilePage />)

    await user.type(await screen.findByLabelText('profile.links.platform'), 'github')
    await user.type(screen.getByLabelText('profile.links.label'), 'GitHub')
    await user.type(screen.getByLabelText('profile.links.url'), 'samo-tekst')
    await user.click(screen.getByRole('button', { name: 'profile.links.add' }))

    expect(await screen.findByText('profile.errors.urlInvalid')).toBeInTheDocument()
  })

  /* Sakrivanje umesto brisanja: adresa se ne mora ponovo kucati. */
  it('sakrivanje šalje PATCH, ne DELETE', async () => {
    loadOnce()
    let patched: Record<string, unknown> | undefined
    const onDelete = vi.fn()
    server.use(
      http.patch(`${API}/admin/social-links/l1`, async ({ request }) => {
        patched = (await request.json()) as Record<string, unknown>
        return HttpResponse.json(link({ isVisible: false }))
      }),
      http.delete(`${API}/admin/social-links/l1`, () => {
        onDelete()
        return new HttpResponse(null, { status: 204 })
      }),
    )

    const { user } = renderWithApp(<ProfilePage />)

    await user.click(await screen.findByLabelText('profile.links.visible'))

    await waitFor(() => {
      expect(patched).toEqual({ isVisible: false })
    })
    expect(onDelete).not.toHaveBeenCalled()
  })
})
