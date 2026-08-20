import type { ErrorRequestHandler, RequestHandler } from 'express'

/**
 * Greška sa namernim statusom i i18n ključem.
 *
 * `messageKey` je ključ, ne tekst: prevod bira klijent, koji jedini zna izabran jezik.
 * Isti dogovor koji već koristi `normalizeError` u `packages/core`.
 */
export class HttpError extends Error {
  constructor(
    readonly status: number,
    readonly messageKey: string,
    /**
     * Koje polje je krivo, kad se zna. Klijent to prosleđuje `setError`-u na to polje —
     * `docs/10-forms-validation.md` traži grešku NA POLJU, ne toast.
     *
     * Bez ovoga server ume da kaže „sukob", ali ne i „slug je zauzet", pa korisnik gleda
     * formu bez ijedne označene greške.
     */
    readonly details?: { field: string },
  ) {
    super(messageKey)
    this.name = 'HttpError'
  }
}

export const notFound: RequestHandler = (_req, res) => {
  res.status(404).json({ messageKey: 'errors.notFound' })
}

/**
 * Poslednji sloj — sve što procuri završava ovde.
 *
 * Detalj greške ide u log, a klijentu se šalje samo ključ. Poruka iz baze ili steka
 * u odgovoru je curenje informacija (docs/20-security.md).
 *
 * Četvrti parametar je neiskorišćen ali OBAVEZAN: Express prepoznaje error handler
 * isključivo po arnosti od 4. Bez njega bi ovo bio običan middleware i greške bi tiho
 * prolazile dalje, do podrazumevanog Express handlera koji vraća stek trag.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- vidi gore
export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  if (err instanceof HttpError) {
    // `details` se izostavlja kad ga nema — odgovor bez njega ostaje `{ messageKey }`,
    // tačno onakav kakav `normalizeError` u `packages/core` već očekuje.
    res.status(err.status).json({
      messageKey: err.messageKey,
      ...(err.details ? { details: err.details } : {}),
    })
    return
  }

  /*
   * Greške iz Express middleware-a nose `status`, ali nisu `HttpError`.
   *
   * `express.static` uz `fallthrough: false` na nepostojeću datoteku baca grešku sa
   * `status: 404`. Bez ove grane svaka zastarela adresa slike vraćala bi **500** i
   * upisivala se u log kao neuhvaćena greška — pa bi jedan crawler zatrpao log.
   */
  const status = (err as { status?: unknown }).status
  if (typeof status === 'number' && status >= 400 && status < 500) {
    res
      .status(status)
      .json({ messageKey: status === 404 ? 'errors.notFound' : 'errors.badRequest' })
    return
  }

  req.log.error({ err }, 'neuhvaćena greška')
  res.status(500).json({ messageKey: 'errors.unexpected' })
}
