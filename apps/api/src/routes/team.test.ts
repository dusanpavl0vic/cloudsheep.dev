import request from 'supertest'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const cvModelMock = () => ({ deleteMany: vi.fn(), createMany: vi.fn() })

const prismaMock = {
  teamMember: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    findUniqueOrThrow: vi.fn(),
    count: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  cvExperience: cvModelMock(),
  cvProject: cvModelMock(),
  cvSkill: cvModelMock(),
  cvLanguage: cvModelMock(),
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

describe('CV', () => {
  /** Član sa praznim CV kolekcijama — `cvInclude` ih uvek vraća, makar kao prazne nizove. */
  const withCv = (overrides = {}) => ({
    ...member(),
    email: 'dusan@primer.dev',
    phone: '+381 60 000',
    githubUrl: 'https://github.com/x',
    linkedinUrl: '',
    websiteUrl: '',
    locationSr: 'Niš, Srbija',
    locationEn: 'Niš, Serbia',
    summarySr: 'Sažetak',
    summaryEn: 'Summary',
    educationStatusSr: 'Student završne godine',
    educationStatusEn: 'Final-year student',
    gpa: '8.57/10.0',
    educationStartYear: 2020,
    educationEndYear: 2025,
    cvExperiences: [],
    cvProjects: [],
    cvSkills: [],
    cvLanguages: [],
    ...overrides,
  })

  const validCv = {
    email: 'dusan@primer.dev',
    experiences: [
      {
        company: 'Tremium Software',
        positionSr: 'Junior inženjer',
        positionEn: 'Junior Engineer',
        startYear: 2025,
        bulletsSr: ['Radio na API-jima.'],
        bulletsEn: ['Worked on APIs.'],
        technologies: ['.NET'],
      },
    ],
    skills: [{ name: '.NET', groupSr: 'Backend', groupEn: 'Backend', years: 2 }],
    languages: [{ nameSr: 'Srpski', nameEn: 'Serbian', levelSr: 'maternji', levelEn: 'native' }],
  }

  beforeEach(() => {
    prismaMock.teamMember.findUnique.mockResolvedValue(withCv())
    prismaMock.teamMember.findUniqueOrThrow.mockResolvedValue(withCv())
    // `$transaction` dobija funkciju (interaktivna transakcija), pa joj se prosleđuje mock
    prismaMock.$transaction.mockImplementation((fn: unknown) =>
      typeof fn === 'function' ? (fn as (tx: unknown) => unknown)(prismaMock) : fn,
    )
  })

  it('GET /admin/team/:id/cv vraća ravan oblik za formu', async () => {
    const res = await request(app())
      .get('/admin/team/m1/cv')
      .set('Authorization', `Bearer ${adminToken}`)

    expect(res.status).toBe(200)
    const body = res.body as { gpa: string; experiences: unknown[]; memberId: string }
    expect(body.memberId).toBe('m1')
    expect(body.gpa).toBe('8.57/10.0')
    expect(body.experiences).toEqual([])
  })

  it('GET /admin/team/:id/cv daje 404 za nepostojećeg člana', async () => {
    prismaMock.teamMember.findUnique.mockResolvedValue(null)

    const res = await request(app())
      .get('/admin/team/nema/cv')
      .set('Authorization', `Bearer ${adminToken}`)

    expect(res.status).toBe(404)
  })

  it('PUT /admin/team/:id/cv briše stare kolekcije pre upisa novih', async () => {
    const res = await request(app())
      .put('/admin/team/m1/cv')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(validCv)

    expect(res.status).toBe(200)
    // Zamena u celini je ceo ugovor ove rute — bez brisanja bi se stavke gomilale
    expect(prismaMock.cvExperience.deleteMany).toHaveBeenCalledWith({ where: { memberId: 'm1' } })
    expect(prismaMock.cvProject.deleteMany).toHaveBeenCalled()
    expect(prismaMock.cvSkill.deleteMany).toHaveBeenCalled()
    expect(prismaMock.cvLanguage.deleteMany).toHaveBeenCalled()
  })

  it('PUT upisuje sortOrder iz redosleda u nizu', async () => {
    await request(app())
      .put('/admin/team/m1/cv')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        ...validCv,
        skills: [
          { name: 'A', years: null },
          { name: 'B', years: null },
        ],
      })

    expect(prismaMock.cvSkill.createMany).toHaveBeenCalledWith({
      data: [
        expect.objectContaining({ name: 'A', sortOrder: 0 }) as unknown,
        expect.objectContaining({ name: 'B', sortOrder: 1 }) as unknown,
      ],
    })
  })

  it('PUT odbija godinu van opsega', async () => {
    const res = await request(app())
      .put('/admin/team/m1/cv')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ experiences: [{ company: 'X', startYear: 12 }] })

    expect(res.status).toBe(400)
  })

  it('GET /admin/team/:id/cv.pdf vraća PDF sa imenom datoteke bez dijakritike', async () => {
    const res = await request(app())
      .get('/admin/team/m1/cv.pdf?lang=en')
      .set('Authorization', `Bearer ${adminToken}`)
      .buffer(true)
      .parse((response, callback) => {
        const chunks: Buffer[] = []
        response.on('data', (c: Buffer) => chunks.push(c))
        response.on('end', () => {
          callback(null, Buffer.concat(chunks))
        })
      })

    expect(res.status).toBe(200)
    expect(res.headers['content-type']).toBe('application/pdf')
    // `Content-Disposition` je latin-1 po RFC-u, pa „Dušan" mora izaći kao „Dusan"
    expect(res.headers['content-disposition']).toContain('Dusan-Pavlovic-CV-en.pdf')
    expect((res.body as Buffer).subarray(0, 5).toString()).toBe('%PDF-')
  })

  it('CV rute traže prijavu i ulogu admina', async () => {
    expect((await request(app()).get('/admin/team/m1/cv')).status).toBe(401)
    expect(
      (await request(app()).get('/admin/team/m1/cv').set('Authorization', `Bearer ${viewerToken}`))
        .status,
    ).toBe(403)
  })
})
