import request from 'supertest'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const prismaMock = {
  contactMessage: {
    create: vi.fn(),
    update: vi.fn(),
    findMany: vi.fn(),
    count: vi.fn(),
    delete: vi.fn(),
  },
}
const sendContactMail = vi.fn()
const sendAutoReply = vi.fn()

vi.mock('../db.ts', () => ({ prisma: prismaMock }))
vi.mock('../lib/mailer.ts', () => ({
  sendContactMail,
  sendAutoReply,
  isMailConfigured: () => true,
}))

const { createApp } = await import('../app.ts')
const { signAccessToken } = await import('../lib/tokens.ts')

const app = () => createApp()
const adminToken = signAccessToken({ sub: 'u1', email: 'a@b.c', role: 'admin' })

const valid = {
  name: 'Marko Marković',
  email: 'marko@primer.rs',
  subject: 'Saradnja',
  message: 'Zdravo, zanima me saradnja na projektu.',
}

beforeEach(() => {
  prismaMock.contactMessage.create.mockResolvedValue({ id: 'c1' })
  prismaMock.contactMessage.update.mockResolvedValue({})
  prismaMock.contactMessage.count.mockResolvedValue(0)
  prismaMock.contactMessage.findMany.mockResolvedValue([])
  sendContactMail.mockResolvedValue(undefined)
  sendAutoReply.mockResolvedValue(undefined)
})
afterEach(() => {
  vi.clearAllMocks()
})

describe('POST /contact', () => {
  it('prima poruku i vraća 202', async () => {
    const res = await request(app()).post('/contact').send(valid)

    expect(res.status).toBe(202)
    expect(sendContactMail).toHaveBeenCalledOnce()
  })

  /*
   * PRVO upis, PA slanje — i to je cela poenta.
   *
   * Obrnut redosled znači da pad SMTP-a izgubi poruku bez traga.
   */
  it('upisuje poruku PRE nego što pokuša slanje', async () => {
    const order: string[] = []
    prismaMock.contactMessage.create.mockImplementation(() => {
      order.push('db')
      return { id: 'c1' }
    })
    sendContactMail.mockImplementation(() => {
      order.push('mail')
    })

    await request(app()).post('/contact').send(valid)

    expect(order).toEqual(['db', 'mail'])
  })

  it('pad SMTP-a NE gubi poruku i ne obara zahtev', async () => {
    sendContactMail.mockRejectedValue(new Error('SMTP timeout'))

    const res = await request(app()).post('/contact').send(valid)

    expect(res.status).toBe(202)
    expect(prismaMock.contactMessage.create).toHaveBeenCalledOnce()
    // Greška se beleži NA ZAPISU, da se vidi u adminu
    expect(prismaMock.contactMessage.update).toHaveBeenCalledWith({
      where: { id: 'c1' },
      data: { emailError: 'SMTP timeout' },
    })
  })

  it('uspešno slanje beleži vreme', async () => {
    await request(app()).post('/contact').send(valid)

    expect(prismaMock.contactMessage.update).toHaveBeenCalledWith({
      where: { id: 'c1' },
      data: { emailSentAt: expect.any(Date) as unknown },
    })
  })

  /*
   * Botu se vraća isti odgovor kao i čoveku.
   *
   * Poruka „odbijeno" bi mu rekla da polje postoji i da ga treba preskočiti.
   */
  it('honeypot tiho odbacuje — 202, ali bez upisa i bez mejla', async () => {
    const res = await request(app())
      .post('/contact')
      .send({ ...valid, website: 'http://spam.example' })

    expect(res.status).toBe(202)
    expect(prismaMock.contactMessage.create).not.toHaveBeenCalled()
    expect(sendContactMail).not.toHaveBeenCalled()
  })

  it('odbija neispravan e-mail pre dodira sa bazom', async () => {
    const res = await request(app())
      .post('/contact')
      .send({ ...valid, email: 'nije-email' })

    expect(res.status).toBe(400)
    expect(prismaMock.contactMessage.create).not.toHaveBeenCalled()
  })

  it('odbija prekratku poruku', async () => {
    const res = await request(app())
      .post('/contact')
      .send({ ...valid, message: 'kratko' })

    expect(res.status).toBe(400)
  })

  it('naslov je opcion', async () => {
    const res = await request(app())
      .post('/contact')
      .send({ name: valid.name, email: valid.email, message: valid.message })

    expect(res.status).toBe(202)
  })
})

describe('GET /admin/messages', () => {
  it('bez tokena → 401', async () => {
    expect((await request(app()).get('/admin/messages')).status).toBe(401)
  })

  it('vraća broj nepročitanih uz listu', async () => {
    prismaMock.contactMessage.count.mockResolvedValue(3)

    const res = await request(app())
      .get('/admin/messages')
      .set('Authorization', `Bearer ${adminToken}`)

    expect(res.status).toBe(200)
    expect((res.body as { unread: number }).unread).toBe(3)
  })

  it('filter `unread` menja upit', async () => {
    await request(app())
      .get('/admin/messages?status=unread')
      .set('Authorization', `Bearer ${adminToken}`)

    expect(prismaMock.contactMessage.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { isRead: false } }),
    )
  })

  it('nepoznat status → 400', async () => {
    const res = await request(app())
      .get('/admin/messages?status=izmisljeno')
      .set('Authorization', `Bearer ${adminToken}`)

    expect(res.status).toBe(400)
  })
})

describe('PATCH /admin/messages/:id', () => {
  it('označava kao pročitano', async () => {
    prismaMock.contactMessage.update.mockResolvedValue({})

    const res = await request(app())
      .patch('/admin/messages/c1')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ isRead: true })

    expect(res.status).toBe(204)
  })

  it('odbija telo bez `isRead`', async () => {
    const res = await request(app())
      .patch('/admin/messages/c1')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({})

    expect(res.status).toBe(400)
  })
})

describe('automatski odgovor pošiljaocu', () => {
  it('šalje potvrdu na adresu posetioca', async () => {
    await request(app()).post('/contact').send(valid)

    expect(sendAutoReply).toHaveBeenCalledWith(
      expect.objectContaining({ email: 'marko@primer.rs' }),
      'sr',
    )
  })

  it('jezik potvrde dolazi iz forme', async () => {
    await request(app())
      .post('/contact')
      .send({ ...valid, locale: 'en' })

    expect(sendAutoReply).toHaveBeenCalledWith(expect.anything(), 'en')
  })

  it('nepoznat jezik pada na srpski umesto da obori zahtev', async () => {
    const res = await request(app())
      .post('/contact')
      .send({ ...valid, locale: 'de' })

    // `de` nije u enumu — zahtev pada na validaciji, što je bolje od tihog slanja na
    // pogrešnom jeziku. Klijent šalje samo `sr` ili `en`.
    expect(res.status).toBe(400)
  })

  /*
   * Adresa posetioca je NEPOUZDANA: pogrešno ukucana, pun sandučić, greylisting.
   * Da su u istom `try`, njegov problem bi poništio zapis o tvojoj kopiji.
   */
  it('pad potvrde NE ruši zahtev i ne briše zapis o poslatoj kopiji', async () => {
    sendAutoReply.mockRejectedValue(new Error('mailbox full'))

    const res = await request(app()).post('/contact').send(valid)

    expect(res.status).toBe(202)
    expect(sendContactMail).toHaveBeenCalledOnce()
    // Tvoja kopija je otišla — zapis o tome ostaje
    expect(prismaMock.contactMessage.update).toHaveBeenCalledWith({
      where: { id: 'c1' },
      data: { emailSentAt: expect.any(Date) as unknown },
    })
  })

  it('honeypot ne dobija potvrdu', async () => {
    await request(app())
      .post('/contact')
      .send({ ...valid, website: 'http://spam.example' })

    expect(sendAutoReply).not.toHaveBeenCalled()
  })
})

describe('isporučivost — zaštita od nepoželjne pošte', () => {
  it('ime pošiljaoca u `from` NIJE posetiočevo', async () => {
    // Prikazano ime jedne osobe uz adresu druge je obrazac krađe identiteta; filteri ga
    // boduju kao sumnjiv i poruka češće završi u spamu.
    await request(app()).post('/contact').send(valid)

    expect(sendContactMail).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Marko Marković' }),
    )
  })
})
