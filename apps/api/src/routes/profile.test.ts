import request from 'supertest'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const prismaMock = {
  profile: { findUnique: vi.fn(), upsert: vi.fn() },
  socialLink: {
    findMany: vi.fn(),
    count: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  $transaction: vi.fn(),
}

vi.mock('../db.ts', () => ({ prisma: prismaMock }))

const { createApp } = await import('../app.ts')
const { signAccessToken } = await import('../lib/tokens.ts')

const app = () => createApp()
const adminToken = signAccessToken({ sub: 'u1', email: 'a@b.c', role: 'admin' })
const viewerToken = signAccessToken({ sub: 'u2', email: 'v@b.c', role: 'viewer' })

const profile = {
  id: 'singleton',
  fullName: 'Dušan Pavlović',
  location: 'Niš',
  isAvailable: true,
  headlineSr: 'Studio',
  headlineEn: 'Studio',
  bioSr: 'Opis',
  bioEn: 'Bio',
  universitySr: 'UN',
  universityEn: 'UN',
  degreeSr: 'Inženjer',
  degreeEn: 'Engineer',
  updatedAt: new Date(),
}

const link = {
  id: 'l1',
  platform: 'github',
  url: 'https://github.com/x',
  label: 'GitHub',
  sortOrder: 0,
  isVisible: true,
}

interface ProfileBody {
  profile: { fullName: string; headline: { sr: string; en: string } } | null
  links: { platform: string }[]
}

const validProfile = {
  fullName: 'Dušan Pavlović',
  location: 'Niš',
  isAvailable: true,
  headlineSr: 'Studio',
  headlineEn: 'Studio',
  bioSr: 'Opis',
  bioEn: 'Bio',
  universitySr: '',
  universityEn: '',
  degreeSr: '',
  degreeEn: '',
}

beforeEach(() => {
  prismaMock.profile.findUnique.mockResolvedValue(profile)
  prismaMock.socialLink.findMany.mockResolvedValue([link])
  prismaMock.socialLink.count.mockResolvedValue(0)
})
afterEach(() => {
  vi.clearAllMocks()
})

describe('GET /profile', () => {
  it('javno je, i vraća profil i linkove u JEDNOM zahtevu', async () => {
    const res = await request(app()).get('/profile')

    expect(res.status).toBe(200)
    expect((res.body as ProfileBody).profile?.headline).toEqual({ sr: 'Studio', en: 'Studio' })
    expect((res.body as ProfileBody).links).toHaveLength(1)
  })

  it('traži samo vidljive linkove', async () => {
    await request(app()).get('/profile')

    expect(prismaMock.socialLink.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { isVisible: true } }),
    )
  })

  /* Prazan profil NIJE greška — sajt tada prikazuje ono što ima. */
  it('nepostojeći profil daje `null`, ne 404', async () => {
    prismaMock.profile.findUnique.mockResolvedValue(null)

    const res = await request(app()).get('/profile')

    expect(res.status).toBe(200)
    expect((res.body as ProfileBody).profile).toBeNull()
  })
})

describe('PUT /admin/profile', () => {
  it('bez tokena → 401', async () => {
    expect((await request(app()).put('/admin/profile').send(validProfile)).status).toBe(401)
  })

  it('nedovoljna uloga → 403', async () => {
    const res = await request(app())
      .put('/admin/profile')
      .set('Authorization', `Bearer ${viewerToken}`)
      .send(validProfile)

    expect(res.status).toBe(403)
  })

  /* `upsert` po konstantnom id-u: singleton ne može da dobije drugi red. */
  it('čuva kroz upsert na konstantan id', async () => {
    prismaMock.profile.upsert.mockResolvedValue(profile)

    const res = await request(app())
      .put('/admin/profile')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(validProfile)

    expect(res.status).toBe(200)
    expect(prismaMock.profile.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 'singleton' } }),
    )
  })

  it('bez imena → 400', async () => {
    const res = await request(app())
      .put('/admin/profile')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ ...validProfile, fullName: '' })

    expect(res.status).toBe(400)
    expect(prismaMock.profile.upsert).not.toHaveBeenCalled()
  })
})

describe('kontakt linkovi', () => {
  it('novi link ide na kraj', async () => {
    prismaMock.socialLink.count.mockResolvedValue(2)
    prismaMock.socialLink.create.mockResolvedValue(link)

    const res = await request(app())
      .post('/admin/social-links')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ platform: 'github', url: 'https://github.com/x', label: 'GitHub' })

    expect(res.status).toBe(201)
    expect(prismaMock.socialLink.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ sortOrder: 2 }) as unknown,
    })
  })

  /* `mailto:` je link kao i svaki drugi — mejl nema poseban slučaj. */
  it('prihvata mailto: adresu', async () => {
    prismaMock.socialLink.create.mockResolvedValue(link)

    const res = await request(app())
      .post('/admin/social-links')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ platform: 'email', url: 'mailto:a@b.rs', label: 'E-mail' })

    expect(res.status).toBe(201)
  })

  it('odbija adresu koja nije ni URL ni mailto', async () => {
    const res = await request(app())
      .post('/admin/social-links')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ platform: 'github', url: 'samo-tekst', label: 'GitHub' })

    expect(res.status).toBe(400)
  })

  it('odbija platformu sa velikim slovima', async () => {
    const res = await request(app())
      .post('/admin/social-links')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ platform: 'GitHub', url: 'https://github.com/x', label: 'GitHub' })

    expect(res.status).toBe(400)
  })

  it('`/order` se ne meša sa `/:id`', async () => {
    prismaMock.$transaction.mockResolvedValue([])
    prismaMock.socialLink.update.mockReturnValue({})

    const res = await request(app())
      .patch('/admin/social-links/order')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ ids: ['b3b7c1e2-8f4a-4c2e-9a1b-000000000001'] })

    expect(res.status).toBe(204)
    expect(prismaMock.socialLink.update).toHaveBeenCalledWith({
      where: { id: 'b3b7c1e2-8f4a-4c2e-9a1b-000000000001' },
      data: { sortOrder: 0 },
    })
  })

  it('sakrivanje ide kroz PATCH, ne kroz brisanje', async () => {
    prismaMock.socialLink.update.mockResolvedValue({ ...link, isVisible: false })

    const res = await request(app())
      .patch('/admin/social-links/l1')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ isVisible: false })

    expect(res.status).toBe(200)
    expect(prismaMock.socialLink.delete).not.toHaveBeenCalled()
  })

  it('brisanje vraća 204', async () => {
    prismaMock.socialLink.delete.mockResolvedValue(link)

    const res = await request(app())
      .delete('/admin/social-links/l1')
      .set('Authorization', `Bearer ${adminToken}`)

    expect(res.status).toBe(204)
  })
})
