import request from 'supertest'
import { afterEach, describe, expect, it, vi } from 'vitest'

const prismaMock = { asset: { create: vi.fn() } }
vi.mock('../db.ts', () => ({ prisma: prismaMock }))
vi.mock('node:fs/promises', () => ({ writeFile: vi.fn(), mkdir: vi.fn() }))

const { createApp } = await import('../app.ts')
const { signAccessToken } = await import('../lib/tokens.ts')

const app = () => createApp()
const adminToken = signAccessToken({ sub: 'u1', email: 'a@b.c', role: 'admin' })
const viewerToken = signAccessToken({ sub: 'u2', email: 'v@b.c', role: 'viewer' })

const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  (() => {
    const b = Buffer.alloc(25)
    b.writeUInt32BE(13, 0)
    b.write('IHDR', 4)
    b.writeUInt32BE(320, 8)
    b.writeUInt32BE(240, 12)
    b[16] = 8
    b[17] = 6
    return b
  })(),
])

afterEach(() => {
  vi.clearAllMocks()
})

describe('POST /admin/uploads', () => {
  it('bez tokena → 401', async () => {
    const res = await request(app()).post('/admin/uploads').attach('file', png, 'a.png')

    expect(res.status).toBe(401)
  })

  it('nedovoljna uloga → 403', async () => {
    const res = await request(app())
      .post('/admin/uploads')
      .set('Authorization', `Bearer ${viewerToken}`)
      .attach('file', png, 'a.png')

    expect(res.status).toBe(403)
  })

  it('otprema sliku i vraća URL sa dimenzijama', async () => {
    prismaMock.asset.create.mockImplementation(({ data }: { data: Record<string, unknown> }) => ({
      id: 'a1',
      ...data,
      createdAt: new Date(),
    }))

    const res = await request(app())
      .post('/admin/uploads')
      .set('Authorization', `Bearer ${adminToken}`)
      .attach('file', png, 'snimak.png')

    expect(res.status).toBe(201)
    // Dimenzije su OBAVEZNE — bez njih `<img>` nema width/height i stranica poskakuje
    expect(res.body).toMatchObject({ width: 320, height: 240, mimeType: 'image/png' })
    expect((res.body as { url: string }).url).toMatch(/^\/uploads\/[0-9a-f-]{36}\.png$/)
  })

  it('bez datoteke → 400', async () => {
    const res = await request(app())
      .post('/admin/uploads')
      .set('Authorization', `Bearer ${adminToken}`)

    expect(res.status).toBe(400)
  })

  /* Tip se čita iz sadržaja, ne iz imena — preimenovan fajl ne prolazi. */
  it('fajl koji nije slika → 415, i ništa se ne upisuje u bazu', async () => {
    const res = await request(app())
      .post('/admin/uploads')
      .set('Authorization', `Bearer ${adminToken}`)
      .attach('file', Buffer.from('MZ\x90\x00 exe'), 'slika.png')

    expect(res.status).toBe(415)
    expect(prismaMock.asset.create).not.toHaveBeenCalled()
  })
})

describe('GET /uploads/:file', () => {
  it('nepostojeća datoteka → 404, ne prazan 200', async () => {
    const res = await request(app()).get('/uploads/nema-me.png')

    expect(res.status).toBe(404)
  })
})
