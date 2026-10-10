import 'server-only'

import bcrypt from 'bcryptjs'

import { HTTP_STATUS } from '@/constants/http'
import type { SessionResponse, SessionUser } from '@/types/auth'

import {
  createRefreshToken,
  hashRefreshToken,
  refreshExpiry,
  signAccessToken,
} from '../auth/tokens'
import { prisma } from '../db'
import { HttpError } from '../http'

/**
 * Heš za poređenje kad korisnik ne postoji — da odgovor za nepostojeći e-mail ne stigne
 * merljivo brže od pogrešne lozinke (spisak naloga se inače meri štopericom).
 */
const DUMMY_HASH = '$2b$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinv'

const publicUser = (user: {
  id: string
  email: string
  name: string
  role: string
}): SessionUser => ({
  id: user.id,
  email: user.email,
  name: user.name,
  role: user.role,
})

export interface IssuedSession extends SessionResponse {
  refreshToken: string
  refreshExpiresAt: Date
}

const issueSession = async (
  user: { id: string; email: string; name: string; role: string },
  remembered: boolean,
): Promise<IssuedSession> => {
  const { token, tokenHash } = createRefreshToken()
  const refreshExpiresAt = refreshExpiry(remembered)
  await prisma.refreshToken.create({
    data: { tokenHash, userId: user.id, expiresAt: refreshExpiresAt },
  })

  return {
    user: publicUser(user),
    accessToken: signAccessToken({ sub: user.id, email: user.email, role: user.role }),
    refreshToken: token,
    refreshExpiresAt,
  }
}

/** Ista poruka za nepostojeći nalog i pogrešnu lozinku — namerno. */
export const login = async (email: string, password: string, rememberMe: boolean) => {
  const user = await prisma.user.findUnique({ where: { email } })
  const ok = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH)
  if (!user || !ok) throw new HttpError(HTTP_STATUS.UNAUTHORIZED, 'auth.errors.invalidCredentials')
  return issueSession(user, rememberMe)
}

/** Rotacija: stari red nestaje pre nego što novi nastane — isti token ne radi dvaput. */
export const refresh = async (token: string) => {
  const stored = await prisma.refreshToken.findUnique({
    where: { tokenHash: hashRefreshToken(token) },
    include: { user: true },
  })
  if (!stored || stored.expiresAt < new Date()) return null

  await prisma.refreshToken.delete({ where: { id: stored.id } })
  const remembered = stored.expiresAt.getTime() - stored.createdAt.getTime() > 2 * 24 * 3600 * 1000
  return issueSession(stored.user, remembered)
}

export const me = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  return user ? publicUser(user) : null
}

/** `deleteMany`: odjava sa već nevažećim tokenom ne sme da baci grešku. */
export const logout = async (token: string | undefined) => {
  if (token) await prisma.refreshToken.deleteMany({ where: { tokenHash: hashRefreshToken(token) } })
}
