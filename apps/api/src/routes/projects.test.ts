import request from 'supertest'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { ProjectWithRelations } from '../lib/serialize.ts'

/*
 * Prisma je mock, ne prava baza.
 *
 * Ove rute se testiraju zbog ugovora — status, oblik odgovora, ko sme da prođe — a ne zbog
 * SQL-a. Prava baza bi tražila pokrenut Postgres u CI-ju i čišćenje između testova, a ne bi
 * proverila ništa što ovde nije pokriveno.
 */
const prismaMock = {
  projectImage: {
    count: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  project: {
    findMany: vi.fn(),
    findFirst: vi.fn(),
    findUnique: vi.fn(),
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

/** `res.body` je `any`; sužava se kroz ova dva tipa umesto potiskivanja pravila po tvrdnji. */
interface ListBody {
  items: { slug: string; title: { sr: string; en: string }; isPublished?: boolean }[]
}
interface ItemBody {
  slug: string
}

const adminToken = signAccessToken({ sub: 'u1', email: 'a@b.c', role: 'admin' })
const viewerToken = signAccessToken({ sub: 'u2', email: 'v@b.c', role: 'viewer' })

const makeProject = (overrides: Partial<ProjectWithRelations> = {}): ProjectWithRelations => ({
  id: 'p1',
  slug: 'atlas-analytics',
  category: 'fullStack',
  year: 2025,
  sortOrder: 0,
  isFeatured: true,
  isPublished: true,
  titleSr: 'Atlas',
  titleEn: 'Atlas',
  catSr: 'full-stack',
  catEn: 'full-stack',
  descSr: 'Opis',
  descEn: 'Description',
  captionSr: '',
  captionEn: '',
  galleryLayout: 'grid',
  // Relacije su prazne u većini testova — serijalizacija ih mapira, ne izmišlja
  technologies: [],
  images: [],
  liveUrl: null,
  repoUrl: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
})

const validBody = {
  slug: 'novi-projekat',
  category: 'backend',
  year: 2026,
  titleSr: 'Novi',
  titleEn: 'New',
  catSr: 'backend',
  catEn: 'backend',
  descSr: 'Opis na srpskom',
  descEn: 'Description in English',
  technologyIds: [],
}

beforeEach(() => {
  prismaMock.project.findMany.mockResolvedValue([makeProject()])
})

afterEach(() => {
  vi.clearAllMocks()
})

describe('GET /projects', () => {
  it('vraća listu i oba jezika u istom odgovoru', async () => {
    const res = await request(app()).get('/projects')

    expect(res.status).toBe(200)
    expect((res.body as ListBody).items).toHaveLength(1)
    // Oba jezika odjednom je cela poenta: promena jezika na sajtu ne traži nov zahtev.
    expect((res.body as ListBody).items[0]?.title).toEqual({ sr: 'Atlas', en: 'Atlas' })
  })

  it('traži SAMO objavljene, sortirane po sortOrder', async () => {
    await request(app()).get('/projects')

    expect(prismaMock.project.findMany).toHaveBeenCalledWith({
      where: { isPublished: true },
      orderBy: [{ sortOrder: 'asc' }, { year: 'desc' }],
      include: expect.anything() as unknown,
    })
  })

  it('ne propušta polja koja javnost ne treba da vidi', async () => {
    const res = await request(app()).get('/projects')

    expect((res.body as ListBody).items[0]).not.toHaveProperty('isPublished')
    expect((res.body as ListBody).items[0]).not.toHaveProperty('sortOrder')
  })
})

describe('GET /projects/:slug', () => {
  it('vraća objavljen projekat', async () => {
    prismaMock.project.findFirst.mockResolvedValue(makeProject())

    const res = await request(app()).get('/projects/atlas-analytics')

    expect(res.status).toBe(200)
    expect((res.body as ItemBody).slug).toBe('atlas-analytics')
  })

  it('neobjavljen projekat je 404, ne 403 — javnost ne treba da zna da postoji', async () => {
    prismaMock.project.findFirst.mockResolvedValue(null)

    const res = await request(app()).get('/projects/skica')

    expect(res.status).toBe(404)
    expect(res.body).toEqual({ messageKey: 'errors.notFound' })
  })
})

describe('zaštita admin ruta', () => {
  it('bez tokena → 401', async () => {
    const res = await request(app()).get('/admin/projects')

    expect(res.status).toBe(401)
  })

  /*
   * 403, ne 401.
   *
   * Klijentski `createBaseApi` na 401 pokreće obnovu sesije i ponavlja zahtev — `viewer`
   * bi u petlji obnavljao potpuno važeću sesiju za zahtev koji nikad neće proći.
   */
  it('sa nedovoljnom ulogom → 403', async () => {
    const res = await request(app())
      .get('/admin/projects')
      .set('Authorization', `Bearer ${viewerToken}`)

    expect(res.status).toBe(403)
    expect(res.body).toEqual({ messageKey: 'errors.forbidden' })
  })

  it('admin prolazi i vidi i skice', async () => {
    prismaMock.project.findMany.mockResolvedValue([makeProject({ isPublished: false })])

    const res = await request(app())
      .get('/admin/projects')
      .set('Authorization', `Bearer ${adminToken}`)

    expect(res.status).toBe(200)
    expect((res.body as ListBody).items[0]?.isPublished).toBe(false)
  })
})

describe('POST /admin/projects', () => {
  it('kreira i vraća 201', async () => {
    prismaMock.project.create.mockResolvedValue(makeProject({ slug: 'novi-projekat' }))

    const res = await request(app())
      .post('/admin/projects')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(validBody)

    expect(res.status).toBe(201)
    expect((res.body as ItemBody).slug).toBe('novi-projekat')
  })

  it('odbija neispravan slug', async () => {
    const res = await request(app())
      .post('/admin/projects')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ ...validBody, slug: 'Veliko Slovo I Razmak' })

    expect(res.status).toBe(400)
    expect(prismaMock.project.create).not.toHaveBeenCalled()
  })

  it('odbija nepoznatu kategoriju', async () => {
    const res = await request(app())
      .post('/admin/projects')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ ...validBody, category: 'devops' })

    expect(res.status).toBe(400)
  })

  it('prazan URL postaje null, ne prazan string', async () => {
    prismaMock.project.create.mockResolvedValue(makeProject())

    await request(app())
      .post('/admin/projects')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ ...validBody, liveUrl: '', repoUrl: '' })

    expect(prismaMock.project.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ liveUrl: null, repoUrl: null }) as unknown,
      }),
    )
  })

  /* Bez prevoda Prisma grešaka ovo bi korisniku izgledalo kao pad servera. */
  it('zauzet slug → 409 sa imenom polja', async () => {
    const { Prisma } = await import('@prisma/client')
    prismaMock.project.create.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('duplikat', {
        code: 'P2002',
        clientVersion: 'test',
        meta: { target: ['slug'] },
      }),
    )

    const res = await request(app())
      .post('/admin/projects')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(validBody)

    expect(res.status).toBe(409)
    expect(res.body).toEqual({ messageKey: 'errors.conflict', details: { field: 'slug' } })
  })
})

describe('PATCH /admin/projects/order', () => {
  it('upisuje ceo novi redosled u jednoj transakciji', async () => {
    prismaMock.$transaction.mockResolvedValue([])
    prismaMock.project.update.mockReturnValue({})

    const res = await request(app())
      .patch('/admin/projects/order')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        ids: ['b3b7c1e2-8f4a-4c2e-9a1b-000000000001', 'b3b7c1e2-8f4a-4c2e-9a1b-000000000002'],
      })

    expect(res.status).toBe(204)
    // Transakcija, ne petlja: prekid usred prevlačenja ne sme da ostavi pola liste
    expect(prismaMock.$transaction).toHaveBeenCalledOnce()
    expect(prismaMock.project.update).toHaveBeenCalledTimes(2)
  })

  it('`order` se ne meša sa `:id` — ruta mora biti pre nje', async () => {
    prismaMock.$transaction.mockResolvedValue([])
    prismaMock.project.update.mockReturnValue({})

    await request(app())
      .patch('/admin/projects/order')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ ids: ['b3b7c1e2-8f4a-4c2e-9a1b-000000000001'] })

    // Da je `/projects/:id` prvi, ovo bi pokušalo izmenu projekta sa id-em „order"
    expect(prismaMock.project.update).toHaveBeenCalledWith({
      where: { id: 'b3b7c1e2-8f4a-4c2e-9a1b-000000000001' },
      data: { sortOrder: 0 },
    })
  })
})

describe('DELETE /admin/projects/:id', () => {
  it('vraća 204', async () => {
    prismaMock.project.delete.mockResolvedValue(makeProject())

    const res = await request(app())
      .delete('/admin/projects/p1')
      .set('Authorization', `Bearer ${adminToken}`)

    expect(res.status).toBe(204)
  })

  it('nepostojeći projekat → 404, ne 500', async () => {
    const { Prisma } = await import('@prisma/client')
    prismaMock.project.delete.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('nema ga', {
        code: 'P2025',
        clientVersion: 'test',
      }),
    )

    const res = await request(app())
      .delete('/admin/projects/nema-me')
      .set('Authorization', `Bearer ${adminToken}`)

    expect(res.status).toBe(404)
  })
})

describe('slike projekta', () => {
  const IMAGE_ID = 'b3b7c1e2-8f4a-4c2e-9a1b-000000000009'
  const ASSET_ID = 'b3b7c1e2-8f4a-4c2e-9a1b-00000000000a'

  it('dodaje sliku na kraj postojećih', async () => {
    prismaMock.projectImage.count.mockResolvedValue(2)
    prismaMock.projectImage.create.mockResolvedValue({ id: IMAGE_ID })

    const res = await request(app())
      .post('/admin/projects/p1/images')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ assetId: ASSET_ID, altSr: 'Opis', altEn: 'Alt' })

    expect(res.status).toBe(201)
    // `sortOrder` je broj postojećih — nova slika ide na kraj, ne na početak
    expect(prismaMock.projectImage.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ sortOrder: 2, projectId: 'p1' }) as unknown,
      }),
    )
  })

  it('odbija dodavanje bez ispravnog assetId', async () => {
    const res = await request(app())
      .post('/admin/projects/p1/images')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ assetId: 'nije-uuid' })

    expect(res.status).toBe(400)
    expect(prismaMock.projectImage.create).not.toHaveBeenCalled()
  })

  it('menja opis slike', async () => {
    prismaMock.projectImage.update.mockResolvedValue({})

    const res = await request(app())
      .patch(`/admin/projects/p1/images/${IMAGE_ID}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ altSr: 'Novi opis' })

    expect(res.status).toBe(204)
  })

  it('`/images/order` se ne meša sa `/images/:imageId`', async () => {
    prismaMock.$transaction.mockResolvedValue([])
    prismaMock.projectImage.update.mockReturnValue({})

    const res = await request(app())
      .patch('/admin/projects/p1/images/order')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ ids: [IMAGE_ID] })

    expect(res.status).toBe(204)
    // Da je `/:imageId` prvi, ovo bi menjalo opis slike sa id-em „order"
    expect(prismaMock.projectImage.update).toHaveBeenCalledWith({
      where: { id: IMAGE_ID },
      data: { sortOrder: 0 },
    })
  })

  it('briše sliku', async () => {
    prismaMock.projectImage.delete.mockResolvedValue({})

    const res = await request(app())
      .delete(`/admin/projects/p1/images/${IMAGE_ID}`)
      .set('Authorization', `Bearer ${adminToken}`)

    expect(res.status).toBe(204)
  })

  it('slike su iza iste zaštite kao i projekti', async () => {
    const res = await request(app())
      .post('/admin/projects/p1/images')
      .set('Authorization', `Bearer ${viewerToken}`)
      .send({ assetId: ASSET_ID })

    expect(res.status).toBe(403)
  })
})
