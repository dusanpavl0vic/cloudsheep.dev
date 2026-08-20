import request from 'supertest'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const prismaMock = {
  teamMember: {
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

const member = (overrides = {}) => ({
  id: 'm1',
  fullName: 'Dušan Pavlović',
  roleSr: 'Razvoj',
  roleEn: 'Development',
  avatarId: null,
  avatar: null,
  hasDiploma: true,
  universitySr: 'Univerzitet u Nišu',
  universityEn: 'University of Niš',
  degreeSr: 'Diplomirani inženjer',
  degreeEn: 'Graduate Engineer',
  programmeSr: 'Računarstvo',
  programmeEn: 'Computer Science',
  facultySr: 'Elektronski fakultet',
  facultyEn: 'Faculty of Electronic Engineering',
  city: 'Niš',
  sealId: 'a1',
  seal: { storageKey: 'pecat.webp', width: 200, height: 200 },
  sortOrder: 0,
  isVisible: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
})

interface TeamBody {
  items: {
    fullName: string
    role: { sr: string; en: string }
    avatar: { url: string } | null
    diploma: { sealUrl: string | null; city: string } | null
  }[]
}

const validBody = { fullName: 'Ana Anić' }

beforeEach(() => {
  prismaMock.teamMember.findMany.mockResolvedValue([member()])
  prismaMock.teamMember.count.mockResolvedValue(0)
})
afterEach(() => {
  vi.clearAllMocks()
})

describe('GET /team', () => {
  it('javno je i vraća oba jezika', async () => {
    const res = await request(app()).get('/team')

    expect(res.status).toBe(200)
    expect((res.body as TeamBody).items[0]?.role).toEqual({ sr: 'Razvoj', en: 'Development' })
  })

  it('traži samo vidljive članove', async () => {
    await request(app()).get('/team')

    expect(prismaMock.teamMember.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { isVisible: true } }),
    )
  })

  it('pečat se vraća kao URL, ne kao id datoteke', async () => {
    const res = await request(app()).get('/team')

    expect((res.body as TeamBody).items[0]?.diploma?.sealUrl).toBe('/uploads/pecat.webp')
  })

  /*
   * Bez diplome se `diploma` IZOSTAVLJA u celosti, ne šalje kao prazni stringovi.
   *
   * Tako frontend ne mora da pogađa da li ima šta da prikaže — `null` je jednoznačan
   * odgovor da kartica diplome ne treba da se renderuje.
   */
  it('član bez diplome ima `diploma: null`, ne prazna polja', async () => {
    prismaMock.teamMember.findMany.mockResolvedValue([member({ hasDiploma: false })])

    const res = await request(app()).get('/team')

    expect((res.body as TeamBody).items[0]?.diploma).toBeNull()
    // Ime i uloga ostaju — član se i dalje prikazuje
    expect((res.body as TeamBody).items[0]?.fullName).toBe('Dušan Pavlović')
  })

  it('član bez slike ima `avatar: null`', async () => {
    const res = await request(app()).get('/team')

    expect((res.body as TeamBody).items[0]?.avatar).toBeNull()
  })

  it('podaci sa diplome ne izlaze kao ravna polja — samo grupisano', async () => {
    const res = await request(app()).get('/team')

    expect(res.body).not.toHaveProperty('items[0].universitySr')
    expect(JSON.stringify(res.body)).not.toContain('sortOrder')
  })
})

describe('zaštita admin ruta', () => {
  it('bez tokena → 401', async () => {
    expect((await request(app()).get('/admin/team')).status).toBe(401)
  })

  it('nedovoljna uloga → 403', async () => {
    const res = await request(app())
      .get('/admin/team')
      .set('Authorization', `Bearer ${viewerToken}`)

    expect(res.status).toBe(403)
  })

  it('admin vidi i sakrivene članove', async () => {
    prismaMock.teamMember.findMany.mockResolvedValue([member({ isVisible: false })])

    const res = await request(app()).get('/admin/team').set('Authorization', `Bearer ${adminToken}`)

    expect(res.status).toBe(200)
    expect(prismaMock.teamMember.findMany).toHaveBeenCalledWith(
      expect.not.objectContaining({ where: expect.anything() as unknown }),
    )
  })
})

describe('POST /admin/team', () => {
  it('novi član ide na kraj liste', async () => {
    prismaMock.teamMember.count.mockResolvedValue(3)
    prismaMock.teamMember.create.mockResolvedValue(member({ fullName: 'Ana Anić' }))

    const res = await request(app())
      .post('/admin/team')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(validBody)

    expect(res.status).toBe(201)
    expect(prismaMock.teamMember.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ sortOrder: 3 }) as unknown,
      }),
    )
  })

  /* Polja diplome NISU obavezna — podaci se često unose u dva navrata. */
  it('član se može sačuvati samo sa imenom', async () => {
    prismaMock.teamMember.create.mockResolvedValue(member())

    const res = await request(app())
      .post('/admin/team')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ fullName: 'Ana Anić' })

    expect(res.status).toBe(201)
  })

  it('bez imena → 400, i ništa se ne upisuje', async () => {
    const res = await request(app())
      .post('/admin/team')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ roleSr: 'Razvoj' })

    expect(res.status).toBe(400)
    expect(prismaMock.teamMember.create).not.toHaveBeenCalled()
  })
})

describe('PATCH /admin/team/order', () => {
  it('`order` se ne meša sa `:id` — ruta mora biti pre nje', async () => {
    prismaMock.$transaction.mockResolvedValue([])
    prismaMock.teamMember.update.mockReturnValue({})

    const res = await request(app())
      .patch('/admin/team/order')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ ids: ['b3b7c1e2-8f4a-4c2e-9a1b-000000000001'] })

    expect(res.status).toBe(204)
    expect(prismaMock.teamMember.update).toHaveBeenCalledWith({
      where: { id: 'b3b7c1e2-8f4a-4c2e-9a1b-000000000001' },
      data: { sortOrder: 0 },
    })
  })
})

describe('DELETE /admin/team/:id', () => {
  it('nepostojeći član → 404, ne 500', async () => {
    const { Prisma } = await import('@prisma/client')
    prismaMock.teamMember.delete.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('nema', { code: 'P2025', clientVersion: 'test' }),
    )

    const res = await request(app())
      .delete('/admin/team/nema-me')
      .set('Authorization', `Bearer ${adminToken}`)

    expect(res.status).toBe(404)
  })
})
