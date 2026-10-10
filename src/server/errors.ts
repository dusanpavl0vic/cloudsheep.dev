/**
 * Greške servera BEZ zavisnosti od Next-a. Uvoze ih servisi i `uploads/storage`, a njih uvozi i
 * seed, koji se u image-u pokreće van Next servera (`dist/seed.cjs`). Tamo `next/server` ne
 * postoji, jer ga standalone ne prati. Route handler-i ih uvoze kroz `server/http.ts`.
 */

/** Šta klijent dobija uz grešku: ključ prevoda i, kad se zna, polje forme koje je krivo. */
export interface ErrorDetails {
  field?: string
  /** Predlog ispravke (npr. „gmail.com" za „gmial.com"). */
  suggestion?: string
}

/**
 * Greška sa namernim statusom i i18n ključem (`messageKey` je ključ, ne tekst — prevod bira
 * klijent, jedini koji zna izabran jezik). `details.field` klijent prosleđuje `setError`-u na
 * to polje: greška NA POLJU, ne toast (docs/10-forms-validation.md).
 */
export class HttpError extends Error {
  constructor(
    readonly status: number,
    readonly messageKey: string,
    readonly details?: ErrorDetails,
  ) {
    super(messageKey)
    this.name = 'HttpError'
  }
}
