import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const sendMail = vi.fn()
const createTransport = vi.fn(() => ({ sendMail }))

vi.mock('nodemailer', () => ({ default: { createTransport } }))

const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined)

const load = async () => {
  vi.resetModules()
  return import('./mailer.ts')
}

const mail = {
  name: 'Marko Marković',
  email: 'marko@primer.rs',
  subject: 'Saradnja',
  message: 'Poruka.',
}

beforeEach(() => {
  sendMail.mockResolvedValue({})
})
afterEach(() => {
  vi.clearAllMocks()
  vi.unstubAllEnvs()
})

describe('bez SMTP kredencijala', () => {
  /*
   * Lokalni razvoj bez Google App Password-a je NORMALNO stanje.
   *
   * Da ovde puca, `pnpm dev` ne bi radio nikome ko nema pristup nalogu — a poruka se
   * ionako upisuje u bazu i vidi u adminu.
   */
  it('ne pokušava slanje i ne baca grešku', async () => {
    const { sendContactMail, isMailConfigured } = await load()

    expect(isMailConfigured()).toBe(false)
    await expect(sendContactMail(mail)).resolves.toBeUndefined()
    expect(sendMail).not.toHaveBeenCalled()
  })

  it('poruku ispisuje u log umesto da je tiho proguta', async () => {
    const { sendContactMail } = await load()

    await sendContactMail(mail)

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('marko@primer.rs'))
  })

  it('ni potvrda se ne šalje', async () => {
    const { sendAutoReply } = await load()

    await sendAutoReply(mail, 'sr')

    expect(sendMail).not.toHaveBeenCalled()
  })
})

describe('sa SMTP kredencijalima', () => {
  beforeEach(() => {
    vi.stubEnv('SMTP_USER', 'studio@primer.dev')
    vi.stubEnv('SMTP_PASS', 'tajna')
    vi.stubEnv('CONTACT_TO', 'studio@primer.dev')
  })

  /*
   * Adresa pošiljaoca mora biti NAŠA: Gmail dozvoljava slanje samo sa autentifikovanog
   * naloga, a prikazano tuđe ime uz našu adresu je obrazac koji filteri boduju kao krađu
   * identiteta i šalju u nepoželjnu poštu.
   */
  it('šalje sa naše adrese, a odgovor vodi posetiocu', async () => {
    const { sendContactMail } = await load()

    await sendContactMail(mail)

    const sent = sendMail.mock.calls[0]?.[0] as { from: { address: string }; replyTo: string }
    expect(sent.from.address).toBe('studio@primer.dev')
    expect(sent.replyTo).toContain('marko@primer.rs')
  })

  it('telo poruke tebi je čist tekst, bez HTML-a', async () => {
    const { sendContactMail } = await load()

    await sendContactMail(mail)

    const sent = sendMail.mock.calls[0]?.[0] as { text: string; html?: string }
    // Poruka dolazi od nepoznatog čoveka — HTML bi bio injektovanje u tuđ mejl klijent
    expect(sent.html).toBeUndefined()
    expect(sent.text).toContain('marko@primer.rs')
  })

  it('potvrda ide posetiocu, sa odgovorom na nas', async () => {
    const { sendAutoReply } = await load()

    await sendAutoReply(mail, 'sr')

    const sent = sendMail.mock.calls[0]?.[0] as { to: string; replyTo: string }
    expect(sent.to).toBe('marko@primer.rs')
    expect(sent.replyTo).toBe('studio@primer.dev')
  })

  /* Bez `text` verzije poruka osetno češće završi u nepoželjnoj pošti. */
  it('potvrda nosi i HTML i čist tekst', async () => {
    const { sendAutoReply } = await load()

    await sendAutoReply(mail, 'sr')

    const sent = sendMail.mock.calls[0]?.[0] as { text: string; html: string }
    expect(sent.html).toContain('<table')
    expect(sent.text).toContain('Zdravo Marko Marković')
  })

  /* RFC 3834: bez ovoga dva automatska odgovora mogu doživotno da se dopisuju. */
  it('potvrda nosi zaglavlje koje sprečava petlju automatskih odgovora', async () => {
    const { sendAutoReply } = await load()

    await sendAutoReply(mail, 'sr')

    const sent = sendMail.mock.calls[0]?.[0] as { headers: Record<string, string> }
    expect(sent.headers['Auto-Submitted']).toBe('auto-replied')
  })

  it('jezik potvrde bira tekst', async () => {
    const { sendAutoReply } = await load()

    await sendAutoReply(mail, 'en')

    const sent = sendMail.mock.calls[0]?.[0] as { subject: string; text: string }
    expect(sent.subject).toContain('Thanks')
    expect(sent.text).toContain('Hi Marko')
  })

  it('transporter se pravi jednom, ne po poruci', async () => {
    const { sendContactMail } = await load()

    await sendContactMail(mail)
    await sendContactMail(mail)

    // `createTransport` otvara pool konekcija — po pozivu bi ostavljao otvorene veze
    expect(createTransport).toHaveBeenCalledOnce()
  })
})
