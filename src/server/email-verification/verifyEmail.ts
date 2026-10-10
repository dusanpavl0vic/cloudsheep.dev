import 'server-only'

import { isDisposableEmailDomain } from 'disposable-email-domains-js'
import { promises as dns } from 'node:dns'

import {
  EMAIL_DNS_CACHE_TTL_MS,
  EMAIL_DNS_TIMEOUT_MS,
  type EmailRejectReason,
} from '@/constants/email'
import { emailDomain, hasEmailShape, normalizeEmail, suggestEmail } from '@/helpers/email'

export type EmailVerdict =
  { ok: true; email: string } | { ok: false; reason: EmailRejectReason; suggestion: string | null }

/** Da li domen prima poštu: `yes`, `no` (sigurno ne) ili `unknown` (DNS nije odgovorio). */
type MailAcceptance = 'yes' | 'no' | 'unknown'

/** Ubacuje se u testu umesto pravog DNS-a. */
export interface DnsResolver {
  resolveMx: (domain: string) => Promise<{ exchange: string; priority: number }[]>
  resolve4: (domain: string) => Promise<string[]>
  resolve6: (domain: string) => Promise<string[]>
}

const SYSTEM_DNS: DnsResolver = {
  resolveMx: (domain) => dns.resolveMx(domain),
  resolve4: (domain) => dns.resolve4(domain),
  resolve6: (domain) => dns.resolve6(domain),
}

/** Domen ne postoji, ili postoji bez tražene vrste zapisa — sigurno „ne", ne kvar. */
const DEFINITE_NO = new Set(['ENOTFOUND', 'ENODATA', 'NXDOMAIN'])

const isDefiniteNo = (error: unknown) =>
  typeof error === 'object' &&
  error !== null &&
  DEFINITE_NO.has(String((error as { code?: unknown }).code))

const withTimeout = <T>(promise: Promise<T>) =>
  Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error('dns timeout'))
      }, EMAIL_DNS_TIMEOUT_MS)
    }),
  ])

/**
 * Ima li domen gde da isporuči poštu (RFC 5321 §5.1):
 * - MX zapis → da; jedini MX sa praznim exchange-om je „null MX" (RFC 7505) → ne;
 * - domen postoji bez MX-a → implicitni MX je njegov A/AAAA zapis;
 * - domen ne postoji → ne;
 * - timeout ili SERVFAIL → `unknown`: kvar NAŠEG DNS-a ne sme da odbije pravog posetioca.
 */
const checkDomain = async (domain: string, resolver: DnsResolver): Promise<MailAcceptance> => {
  try {
    const records = await withTimeout(resolver.resolveMx(domain))
    const isNullMx = records.length === 1 && records[0]?.exchange === ''
    if (records.length > 0) return isNullMx ? 'no' : 'yes'
  } catch (error) {
    if (!isDefiniteNo(error)) return 'unknown'
  }

  const fallback = await Promise.allSettled([
    withTimeout(resolver.resolve4(domain)),
    withTimeout(resolver.resolve6(domain)),
  ])
  if (fallback.some((r) => r.status === 'fulfilled' && r.value.length > 0)) return 'yes'
  return fallback.every((r) => r.status === 'rejected' && isDefiniteNo(r.reason)) ? 'no' : 'unknown'
}

const cache = new Map<string, { value: MailAcceptance; expiresAt: number }>()
const CACHE_LIMIT = 2_000

const cachedCheck = async (domain: string, resolver: DnsResolver) => {
  const now = Date.now()
  const hit = cache.get(domain)
  if (hit && hit.expiresAt > now) return hit.value

  const value = await checkDomain(domain, resolver)
  // `unknown` se ne pamti — sledeći pokušaj zaslužuje novu priliku.
  if (value !== 'unknown') {
    if (cache.size >= CACHE_LIMIT) cache.clear()
    cache.set(domain, { value, expiresAt: now + EMAIL_DNS_CACHE_TTL_MS })
  }
  return value
}

/**
 * Da li adresa može da primi poštu (ADR 0013): oblik → greška u kucanju poznatog provajdera →
 * privremeni (disposable) domen → MX. Sam sandučić se ne proverava — provajderi to namerno ne
 * otkrivaju, a port 25 je na serveru blokiran.
 */
interface VerifyOptions {
  /**
   * Posetilac je potvrdio da je adresa tačna iako liči na grešku u kucanju („zadrži kako sam
   * napisao"). Legitiman domen ne sme da ga zaključa; MX i disposable provera i dalje važe.
   */
  allowTypo?: boolean
  resolver?: DnsResolver
}

export const verifyEmail = async (
  raw: string,
  { allowTypo = false, resolver = SYSTEM_DNS }: VerifyOptions = {},
): Promise<EmailVerdict> => {
  const email = normalizeEmail(raw)
  const suggestion = suggestEmail(email)

  if (!hasEmailShape(email)) return { ok: false, reason: 'syntax', suggestion }
  if (suggestion && !allowTypo) return { ok: false, reason: 'typo', suggestion }

  const domain = emailDomain(email)
  if (isDisposableEmailDomain(domain)) return { ok: false, reason: 'disposable', suggestion: null }

  const accepts = await cachedCheck(domain, resolver)
  if (accepts === 'no') return { ok: false, reason: 'noMx', suggestion: null }

  return { ok: true, email }
}

/** Samo za testove: prazni keš između slučajeva. */
export const resetEmailVerificationCache = () => {
  cache.clear()
}
