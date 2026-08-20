import request from 'supertest'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const prismaMock = {
  technology: {
    findMany: vi.fn(),
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

const tech = (overrides = {}) => ({
  id: 't1',
  slug: 'react',
  label: 'React',
  group: 'frontend',
  logoId: 'a1',
  logo: { storageKey: 'abc.svg' },
  sortOrder: 0,
  createdAt: new Date(),
  ...overrides,
})

interface ListBody {
  items: { slug: string; label: string; logoUrl: string | null }[]
}

const validBody = { slug: 'svelte', label: 'Svelte', group: 'frontend' }

beforeEach(() => {
  prismaMock.technology.findMany.mockResolvedValue([tech()])
})
afterEach(() => {
  vi.clearAllMocks()
})

describe('GET /technologies', () => {
  it('javno je — sajt ga koristi za sekciju Stack', async () => {
    const res = await request(app()).get('/technologies')

    expect(res.status).toBe(200)
    expect((res.body as ListBody).items[0]?.label).toBe('React')
  })

  it('logotip se vraća kao URL, ne kao id datoteke', async () => {
    const res = await request(app()).get('/technologies')

    expect((res.body as ListBody).items[0]?.logoUrl).toBe('/uploads/abc.svg')
  })

  // Tehnologija bez logotipa se prikazuje samo kao naziv — to nije greška
  it('tehnologija bez logotipa daje null, ne pada', async () => {
    prismaMock.technology.findMany.mockResolvedValue([tech({ logo: null, logoId: null })])

    const res = await request(app()).get('/technologies')

    expect((res.body as ListBody).items[0]?.logoUrl).toBeNull()
  })
})

describe('zaštita admin ruta', () => {
  it('bez tokena → 401', async () => {
    expect((await request(app()).get('/admin/technologies')).status).toBe(401)
  })

  it('nedovoljna uloga → 403, ne 401', async () => {
    const res = await request(app())
      .get('/admin/technologies')
      .set('Authorization', `Bearer ${viewerToken}`)

    expect(res.status).toBe(403)
  })
})

describe('POST /admin/technologies', () => {
  it('kreira i vraća 201', async () => {
    prismaMock.technology.create.mockResolvedValue(tech({ slug: 'svelte', label: 'Svelte' }))

    const res = await request(app())
      .post('/admin/technologies')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(validBody)

    expect(res.status).toBe(201)
  })

  /* Slug ide u poređenja i u imena fajlova — velika slova i razmaci bi razbili oboje. */
  it('odbija slug sa velikim slovima ili razmakom', async () => {
    for (const slug of ['React JS', 'React', 'react-js']) {
      const res = await request(app())
        .post('/admin/technologies')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ ...validBody, slug })

      expect(res.status).toBe(400)
    }
    expect(prismaMock.technology.create).not.toHaveBeenCalled()
  })

  it('odbija nepoznatu grupu', async () => {
    const res = await request(app())
      .post('/admin/technologies')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ ...validBody, group: 'izmisljeno' })

    expect(res.status).toBe(400)
  })

  it('zauzet slug → 409 sa imenom polja', async () => {
    const { Prisma } = await import('@prisma/client')
    prismaMock.technology.create.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('duplikat', {
        code: 'P2002',
        clientVersion: 'test',
        meta: { target: ['slug'] },
      }),
    )

    const res = await request(app())
      .post('/admin/technologies')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(validBody)

    expect(res.status).toBe(409)
    expect(res.body).toEqual({ messageKey: 'errors.conflict', details: { field: 'slug' } })
  })
})

describe('PATCH /admin/technologies/order', () => {
  it('`order` se ne meša sa `:id` — ruta mora biti pre nje', async () => {
    prismaMock.$transaction.mockResolvedValue([])
    prismaMock.technology.update.mockReturnValue({})

    const res = await request(app())
      .patch('/admin/technologies/order')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ ids: ['b3b7c1e2-8f4a-4c2e-9a1b-000000000001'] })

    expect(res.status).toBe(204)
    // Da je `/:id` prvi, ovo bi pokušalo izmenu tehnologije sa id-em „order"
    expect(prismaMock.technology.update).toHaveBeenCalledWith({
      where: { id: 'b3b7c1e2-8f4a-4c2e-9a1b-000000000001' },
      data: { sortOrder: 0 },
    })
  })
})

describe('DELETE /admin/technologies/:id', () => {
  it('vraća 204', async () => {
    prismaMock.technology.delete.mockResolvedValue(tech())

    const res = await request(app())
      .delete('/admin/technologies/t1')
      .set('Authorization', `Bearer ${adminToken}`)

    expect(res.status).toBe(204)
  })

  it('nepostojeća tehnologija → 404, ne 500', async () => {
    const { Prisma } = await import('@prisma/client')
    prismaMock.technology.delete.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('nema', { code: 'P2025', clientVersion: 'test' }),
    )

    const res = await request(app())
      .delete('/admin/technologies/nema-me')
      .set('Authorization', `Bearer ${adminToken}`)

    expect(res.status).toBe(404)
  })
})
