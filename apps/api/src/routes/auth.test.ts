import bcrypt from 'bcryptjs'
import request from 'supertest'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const prismaMock = {
  user: { findUnique: vi.fn() },
  refreshToken: {
    create: vi.fn(),
    findUnique: vi.fn(),
    delete: vi.fn(),
    deleteMany: vi.fn(),
  },
}

vi.mock('../db.ts', () => ({ prisma: prismaMock }))

const { createApp } = await import('../app.ts')
const { signAccessToken } = await import('../lib/tokens.ts')

const app = () => createApp()

const PASSWORD = 'lozinka123'

const user = {
  id: 'u1',
  email: 'a@b.rs',
  name: 'Marko',
  role: 'admin',
  passwordHash: bcrypt.hashSync(PASSWORD, 4),
}

interface SessionBody {
  user: { id: string; email: string; name: string; role: string }
  accessToken: string
}

const login = (body: Record<string, unknown>) => request(app()).post('/auth/login').send(body)

beforeEach(() => {
  prismaMock.refreshToken.create.mockResolvedValue({})
})

afterEach(() => {
  vi.clearAllMocks()
})

describe('POST /auth/login', () => {
  it('ispravni podaci vraćaju sesiju', async () => {
    prismaMock.user.findUnique.mockResolvedValue(user)

    const res = await login({ email: user.email, password: PASSWORD, rememberMe: false })

    expect(res.status).toBe(200)
    expect((res.body as SessionBody).user).toEqual({
      id: 'u1',
      email: 'a@b.rs',
      name: 'Marko',
      role: 'admin',
    })
    expect((res.body as SessionBody).accessToken).toBeTypeOf('string')
  })

  /* Heš lozinke ne sme napolje ni u jednom odgovoru — `publicUser` je granica. */
  it('odgovor NIKAD ne sadrži passwordHash', async () => {
    prismaMock.user.findUnique.mockResolvedValue(user)

    const res = await login({ email: user.email, password: PASSWORD })

    expect(JSON.stringify(res.body)).not.toContain('passwordHash')
    expect(JSON.stringify(res.body)).not.toContain(user.passwordHash)
  })

  it('refresh token ide u httpOnly cookie, ne u telo odgovora', async () => {
    prismaMock.user.findUnique.mockResolvedValue(user)

    const res = await login({ email: user.email, password: PASSWORD })

    const cookie = res.headers['set-cookie']?.[0] ?? ''
    expect(cookie).toContain('refresh_token=')
    expect(cookie).toContain('HttpOnly')
    expect(cookie).toContain('SameSite=Lax')
    expect(res.body).not.toHaveProperty('refreshToken')
  })

  it('u bazu se upisuje HEŠ refresh tokena, ne sam token', async () => {
    prismaMock.user.findUnique.mockResolvedValue(user)

    const res = await login({ email: user.email, password: PASSWORD })

    const cookie = res.headers['set-cookie']?.[0] ?? ''
    const raw = /refresh_token=([^;]+)/.exec(cookie)?.[1]

    const written = prismaMock.refreshToken.create.mock.calls[0]?.[0] as
      { data: { tokenHash: string } } | undefined

    expect(written?.data.tokenHash).toBeTypeOf('string')
    expect(written?.data.tokenHash).not.toBe(raw)
  })

  it('pogrešna lozinka vraća 401', async () => {
    prismaMock.user.findUnique.mockResolvedValue(user)

    const res = await login({ email: user.email, password: 'pogresna-lozinka' })

    expect(res.status).toBe(401)
  })

  /*
   * Nepostojeći nalog i pogrešna lozinka daju ISTI odgovor.
   *
   * Različite poruke bi dozvolile da se spisak naloga izmeri odgovorima servera.
   */
  it('nepostojeći nalog daje isti odgovor kao pogrešna lozinka', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null)

    const res = await login({ email: 'nema@me.rs', password: PASSWORD })

    expect(res.status).toBe(401)
    expect(res.body).toEqual({ messageKey: 'auth.errors.invalidCredentials' })
  })

  it('neispravan e-mail se odbija pre dodira sa bazom', async () => {
    const res = await login({ email: 'nije-email', password: PASSWORD })

    expect(res.status).toBe(400)
    expect(prismaMock.user.findUnique).not.toHaveBeenCalled()
  })

  it('prekratka lozinka se odbija pre dodira sa bazom', async () => {
    const res = await login({ email: user.email, password: 'kratka' })

    expect(res.status).toBe(400)
    expect(prismaMock.user.findUnique).not.toHaveBeenCalled()
  })

  it('„zapamti me" produžava rok trajanja cookie-ja', async () => {
    prismaMock.user.findUnique.mockResolvedValue(user)

    const short = await login({ email: user.email, password: PASSWORD, rememberMe: false })
    const long = await login({ email: user.email, password: PASSWORD, rememberMe: true })

    const expiry = (res: { headers: Record<string, unknown> }) => {
      const cookies = res.headers['set-cookie'] as string[] | undefined
      return new Date(/Expires=([^;]+)/.exec(cookies?.[0] ?? '')?.[1] ?? 0).getTime()
    }

    expect(expiry(long)).toBeGreaterThan(expiry(short))
  })
})

describe('GET /auth/me', () => {
  it('bez tokena vraća 401', async () => {
    const res = await request(app()).get('/auth/me')

    expect(res.status).toBe(401)
  })

  it('sa neispravnim tokenom vraća 401', async () => {
    const res = await request(app()).get('/auth/me').set('Authorization', 'Bearer nije-token')

    expect(res.status).toBe(401)
  })

  it('sa ispravnim tokenom vraća korisnika bez heša lozinke', async () => {
    prismaMock.user.findUnique.mockResolvedValue(user)
    const token = signAccessToken({ sub: user.id, email: user.email, role: user.role })

    const res = await request(app()).get('/auth/me').set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(JSON.stringify(res.body)).not.toContain('passwordHash')
  })
})

describe('POST /auth/refresh', () => {
  it('bez cookie-ja vraća 401', async () => {
    const res = await request(app()).post('/auth/refresh')

    expect(res.status).toBe(401)
  })

  it('nepoznat token vraća 401', async () => {
    prismaMock.refreshToken.findUnique.mockResolvedValue(null)

    const res = await request(app()).post('/auth/refresh').set('Cookie', 'refresh_token=izmisljen')

    expect(res.status).toBe(401)
  })

  /* Istekao token je isto što i nepostojeći — rok se proverava u kodu, ne samo u bazi. */
  it('istekao token vraća 401', async () => {
    prismaMock.refreshToken.findUnique.mockResolvedValue({
      id: 'rt1',
      tokenHash: 'h',
      userId: user.id,
      user,
      expiresAt: new Date(Date.now() - 1000),
      createdAt: new Date(),
    })

    const res = await request(app()).post('/auth/refresh').set('Cookie', 'refresh_token=star')

    expect(res.status).toBe(401)
  })
})
