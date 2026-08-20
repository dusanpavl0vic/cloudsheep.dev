import { Router } from 'express'
import rateLimit from 'express-rate-limit'

import { prisma } from '../db.ts'
import { isTest } from '../env.ts'
import { sendAutoReply, sendContactMail } from '../lib/mailer.ts'
import { withPrismaErrors } from '../lib/prismaError.ts'
import { requireAuth, requireRole } from '../middleware/auth.ts'
import { HttpError } from '../middleware/error.ts'
import { contactSchema, messageQuerySchema } from '../schemas/contact.schema.ts'

export const contactRouter: Router = Router()

/**
 * 5 poruka na sat po IP-u.
 *
 * Strože od prijave (10 / 15 min) jer je forma javna i nema lozinku koja bi zaustavila
 * bota. `trust proxy` čini brojanje po IP-u tačnim iza Traefika.
 */
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { messageKey: 'errors.tooManyRequests' },
  skip: () => isTest,
})

contactRouter.post('/contact', contactLimiter, async (req, res) => {
  const parsed = contactSchema.safeParse(req.body)
  if (!parsed.success) throw new HttpError(400, 'contact.errors.invalid')

  const { website, locale, ...data } = parsed.data

  /*
   * Honeypot: botu se vraća 202 kao i svima.
   *
   * Poruka „odbijeno" bi mu rekla da polje postoji i da ga treba preskočiti. Ovako ne
   * dobija nikakav signal — a poruka se nigde ne upisuje.
   */
  if (website) {
    res.status(202).json({ ok: true })
    return
  }

  /*
   * PRVO upis, PA slanje.
   *
   * Obrnut redosled znači da pad SMTP-a izgubi poruku bez traga. Ovako endpoint vraća 202
   * i kad mejl ne prođe — posetilac je poslao poruku i ona postoji, a greška se vidi u
   * adminu, na zapisu.
   */
  const message = await withPrismaErrors(() =>
    prisma.contactMessage.create({
      data: {
        ...data,
        ip: req.ip ?? null,
        userAgent: req.headers['user-agent'] ?? null,
      },
    }),
  )

  try {
    await sendContactMail(data)
    await prisma.contactMessage.update({
      where: { id: message.id },
      data: { emailSentAt: new Date() },
    })
  } catch (error) {
    req.log.error({ err: error }, 'slanje kontakt mejla nije uspelo')
    await prisma.contactMessage.update({
      where: { id: message.id },
      data: {
        emailError: error instanceof Error ? error.message.slice(0, 500) : 'nepoznata greška',
      },
    })
  }

  /*
   * Potvrda pošiljaocu ide u ZASEBNOM `try`, posle tvoje kopije.
   *
   * Razlog: adresa posetioca je nepouzdana — može biti pogrešno ukucana, sandučić pun, ili
   * server na drugoj strani odbija prvi pokušaj. Da su u istom bloku, njegov problem bi
   * poništio zapis o tvojoj kopiji, koja je već otišla.
   *
   * Neuspeh se samo loguje: posetilac je poruku poslao i to mu je potvrđeno na ekranu.
   */
  try {
    await sendAutoReply(data, locale)
  } catch (error) {
    req.log.warn({ err: error }, 'automatski odgovor pošiljaocu nije poslat')
  }

  // 202, ne 200: poruka je primljena; da li je mejl stigao ne zna se u ovom trenutku
  res.status(202).json({ ok: true })
})

const adminRouter: Router = Router()
adminRouter.use(requireAuth, requireRole('admin'))

adminRouter.get('/messages', async (req, res) => {
  const parsed = messageQuerySchema.safeParse(req.query)
  if (!parsed.success) throw new HttpError(400, 'contact.errors.invalid')

  const messages = await prisma.contactMessage.findMany({
    ...(parsed.data.status === 'unread' ? { where: { isRead: false } } : {}),
    orderBy: { createdAt: 'desc' },
    take: 200,
  })

  res.json({
    items: messages.map((m) => ({
      id: m.id,
      name: m.name,
      email: m.email,
      subject: m.subject,
      message: m.message,
      isRead: m.isRead,
      /** `false` znači da SMTP nije prošao — poruka je i dalje tu. */
      wasEmailed: m.emailSentAt !== null,
      emailError: m.emailError,
      createdAt: m.createdAt,
    })),
    unread: await prisma.contactMessage.count({ where: { isRead: false } }),
  })
})

adminRouter.patch('/messages/:id', async (req, res) => {
  const isRead = (req.body as { isRead?: unknown }).isRead
  if (typeof isRead !== 'boolean') throw new HttpError(400, 'contact.errors.invalid')

  await withPrismaErrors(() =>
    prisma.contactMessage.update({ where: { id: req.params.id }, data: { isRead } }),
  )

  res.status(204).end()
})

adminRouter.delete('/messages/:id', async (req, res) => {
  await withPrismaErrors(() => prisma.contactMessage.delete({ where: { id: req.params.id } }))

  res.status(204).end()
})

contactRouter.use('/admin', adminRouter)
