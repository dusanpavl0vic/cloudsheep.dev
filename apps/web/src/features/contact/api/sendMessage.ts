import { env } from '@/lib/env'

import type { ContactInput } from '../schemas/contact.schema'

/**
 * Jedini `fetch` van route loader-a u celoj `apps/web`.
 *
 * ADR 0009 dozvoljava tačno ovaj izuzetak: slanje forme je **event handler**, ne dohvat
 * podataka za render. `useEffect` + `fetch` ostaje zabranjen — ovde ga i nema.
 */
export type SendResult = { ok: true } | { ok: false; messageKey: string }

/**
 * @param locale jezik sa kog je forma poslata — određuje jezik potvrde koju posetilac dobije
 */
export async function sendMessage(input: ContactInput, locale: string): Promise<SendResult> {
  let response: Response

  try {
    response = await fetch(`${env.VITE_API_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // `sr` je podrazumevan: nepoznat kod jezika ne sme da obori validaciju na serveru
      body: JSON.stringify({ ...input, locale: locale.startsWith('en') ? 'en' : 'sr' }),
    })
  } catch {
    return { ok: false, messageKey: 'contact.errors.network' }
  }

  if (response.ok) return { ok: true }

  // 429 je jedini status koji korisniku znači nešto konkretno — ostalo je „pokušaj opet"
  return {
    ok: false,
    messageKey: response.status === 429 ? 'contact.errors.tooMany' : 'contact.errors.failed',
  }
}
