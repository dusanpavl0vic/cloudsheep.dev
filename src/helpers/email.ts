import { COMMON_EMAIL_DOMAINS, EMAIL_MAX_LENGTH, EMAIL_TYPO_RULES } from '@/constants/email'

/**
 * Oblik adrese: jedan `@`, bez razmaka, domen sa tačkom i TLD-om od bar dva slova.
 * Namerno strože od RFC-a (bez navodnika i IP literala) — takve adrese u kontakt formi nisu
 * stvarnost, a jesu omiljene botovima.
 */
const EMAIL_SHAPE = /^[^\s@"(),:;<>[\\\]]+@(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,24}$/i

/** Razmaci okolo i velika slova u domenu ne menjaju adresu — normalizuje se pre svega. */
export const normalizeEmail = (raw: string) => {
  const trimmed = raw.trim()
  const at = trimmed.lastIndexOf('@')
  return at === -1 ? trimmed : `${trimmed.slice(0, at)}@${trimmed.slice(at + 1).toLowerCase()}`
}

export const emailDomain = (email: string) => email.slice(email.lastIndexOf('@') + 1).toLowerCase()

export const hasEmailShape = (email: string) =>
  email.length <= EMAIL_MAX_LENGTH && EMAIL_SHAPE.test(email)

/** Broj izmena (umetanje, brisanje, zamena, zamena susednih) između dva niza. */
const editDistance = (a: string, b: string) => {
  // Tri reda matrice su dovoljna: tekući, prethodni i onaj pre njega (za zamenu susednih).
  let beforePrevious: number[] = []
  let previous = Array.from({ length: b.length + 1 }, (_, j) => j)

  for (let i = 1; i <= a.length; i += 1) {
    const current = [i]
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      let value = Math.min(
        (previous[j] ?? 0) + 1,
        (current[j - 1] ?? 0) + 1,
        (previous[j - 1] ?? 0) + cost,
      )
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        value = Math.min(value, (beforePrevious[j - 2] ?? 0) + 1)
      }
      current.push(value)
    }
    beforePrevious = previous
    previous = current
  }
  return previous[b.length] ?? 0
}

/**
 * Predlog ispravke za domen sličan poznatom provajderu: `marko@gmial.com` → `marko@gmail.com`.
 * `null` kad je domen poznat ili nijedan nije dovoljno blizu. Čista funkcija — klijent je
 * koristi za predlog dok se kuca, server za odbijanje (ADR 0013).
 */
export const suggestEmail = (email: string): string | null => {
  const at = email.lastIndexOf('@')
  if (at < 1) return null

  const domain = email.slice(at + 1).toLowerCase()
  if ((COMMON_EMAIL_DOMAINS as readonly string[]).includes(domain)) return null

  const isCloseEnough = (distance: number, candidate: string) =>
    distance > 0 &&
    EMAIL_TYPO_RULES.some((rule) => distance <= rule.distance && candidate.length >= rule.minLength)

  let best: { domain: string; distance: number } | null = null
  for (const candidate of COMMON_EMAIL_DOMAINS) {
    const distance = editDistance(domain, candidate)
    if (isCloseEnough(distance, candidate) && (!best || distance < best.distance)) {
      best = { domain: candidate, distance }
    }
  }

  return best ? `${email.slice(0, at)}@${best.domain}` : null
}
