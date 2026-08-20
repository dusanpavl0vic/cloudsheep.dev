import bcrypt from 'bcryptjs'
import { Router, type CookieOptions, type Response } from 'express'
import rateLimit from 'express-rate-limit'
import { z } from 'zod'

import { prisma } from '../db.ts'
import { env, isProd, isTest } from '../env.ts'
import {
  createRefreshToken,
  hashRefreshToken,
  refreshExpiry,
  signAccessToken,
} from '../lib/tokens.ts'
import { requireAuth } from '../middleware/auth.ts'
import { HttpError } from '../middleware/error.ts'

export const authRouter: Router = Router()

const REFRESH_COOKIE = 'refresh_token'

/**
 * Ista šema kao `apps/admin/src/features/auth/schemas/login.schema.ts`.
 *
 * Namerno se ponavlja umesto da se deli iz `packages/`: klijentska verzija nosi i18n
 * ključeve za poruke i vezana je za formu, a server ne sme da veruje klijentskoj validaciji
 * ni u jednom slučaju. Jedino što mora da se poklapa su IMENA polja, i to je ovde vidljivo.
 */
const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  rememberMe: z.boolean().default(false),
})

/**
 * Ograničenje pokušaja prijave.
 *
 * Broji po IP-u, što `trust proxy` čini tačnim iza Traefika — bez toga bi svi zahtevi
 * delili IP proxy-ja i prvi napadač bi zaključao ceo sajt.
 */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { messageKey: 'errors.tooManyRequests' },
  /*
   * U testovima se preskače.
   *
   * Limiter je modul-level konstanta, pa ga svi `createApp()` u istom procesu DELE —
   * brojač se prenosi iz testa u test. Test paket ionako radi devet prijava, dakle na
   * samoj granici, i padao bi zavisno od redosleda izvršavanja.
   */
  skip: () => isTest,
})

const cookieOptions = (expires: Date): CookieOptions => ({
  httpOnly: true,
  // `Secure` van produkcije bi razbio localhost preko običnog http-a
  secure: isProd,
  sameSite: 'lax',
  path: '/',
  expires,
  ...(env.COOKIE_DOMAIN ? { domain: env.COOKIE_DOMAIN } : {}),
})

const publicUser = (user: { id: string; email: string; name: string; role: string }) => ({
  id: user.id,
  email: user.email,
  name: user.name,
  role: user.role,
})

/** Izda nov par: pristupni token u telu, refresh u cookie-ju. */
async function issueSession(
  res: Response,
  user: { id: string; email: string; name: string; role: string },
  remembered: boolean,
) {
  const { token, tokenHash } = createRefreshToken()
  const expiresAt = refreshExpiry(remembered)

  await prisma.refreshToken.create({ data: { tokenHash, userId: user.id, expiresAt } })
  res.cookie(REFRESH_COOKIE, token, cookieOptions(expiresAt))

  return {
    user: publicUser(user),
    accessToken: signAccessToken({ sub: user.id, email: user.email, role: user.role }),
  }
}

authRouter.post('/auth/login', loginLimiter, async (req, res) => {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) throw new HttpError(400, 'auth.errors.invalidCredentials')

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } })

  /*
   * Heš se poredi i kad korisnik ne postoji, sa lažnom vrednošću.
   *
   * Bez toga odgovor za nepostojeći e-mail stiže osetno brže nego za postojeći sa
   * pogrešnom lozinkom, pa se spisak naloga može izmeriti štopericom. Poruka je iz istog
   * razloga ista u oba slučaja.
   */
  const hash = user?.passwordHash ?? '$2b$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinv'
  const ok = await bcrypt.compare(parsed.data.password, hash)

  if (!user || !ok) throw new HttpError(401, 'auth.errors.invalidCredentials')

  res.json(await issueSession(res, user, parsed.data.rememberMe))
})

authRouter.post('/auth/refresh', async (req, res) => {
  const token = (req.cookies as Record<string, string | undefined>)[REFRESH_COOKIE]
  if (!token) throw new HttpError(401, 'errors.unauthorized')

  const stored = await prisma.refreshToken.findUnique({
    where: { tokenHash: hashRefreshToken(token) },
    include: { user: true },
  })

  if (!stored || stored.expiresAt < new Date()) {
    res.clearCookie(REFRESH_COOKIE, cookieOptions(new Date(0)))
    throw new HttpError(401, 'errors.unauthorized')
  }

  // Rotacija: stari red nestaje pre nego što novi nastane, pa isti token ne radi dvaput
  await prisma.refreshToken.delete({ where: { id: stored.id } })

  const remembered = stored.expiresAt.getTime() - stored.createdAt.getTime() > 2 * 24 * 3600 * 1000
  res.json(await issueSession(res, stored.user, remembered))
})

authRouter.get('/auth/me', requireAuth, async (req, res) => {
  // `requireAuth` je već postavio `req.user`, ali tip to ne zna — provera umesto `!`
  const id = req.user?.sub
  if (!id) throw new HttpError(401, 'errors.unauthorized')

  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) throw new HttpError(401, 'errors.unauthorized')

  res.json(publicUser(user))
})

authRouter.post('/auth/logout', async (req, res) => {
  const token = (req.cookies as Record<string, string | undefined>)[REFRESH_COOKIE]

  // `deleteMany`, ne `delete`: odjava sa već nevažećim tokenom ne sme da baci grešku
  if (token) {
    await prisma.refreshToken.deleteMany({ where: { tokenHash: hashRefreshToken(token) } })
  }

  res.clearCookie(REFRESH_COOKIE, cookieOptions(new Date(0)))
  res.status(204).end()
})
