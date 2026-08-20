/**
 * Čita ime polja iz greške koju vrati server.
 *
 * **Dvostruko je ugnežđeno, i to nije očigledno.** Server šalje
 * `{ messageKey, details: { field } }`, a `normalizeError` iz `@app/core` CELO telo
 * odgovora stavi u svoje `details` polje. Krajnji oblik je zato
 * `error.details.details.field`.
 *
 * Bez ovoga `setError` nikad ne dobije ime polja, pa 409 „slug je zauzet" prođe bez ijedne
 * vidljive greške u formi — što se lako propusti, jer zahtev jeste vraćen kao neuspeo.
 */
export const fieldFromError = (error: unknown): string | undefined => {
  const body = (error as { details?: { details?: { field?: unknown } } } | undefined)?.details
    ?.details

  return typeof body?.field === 'string' ? body.field : undefined
}
