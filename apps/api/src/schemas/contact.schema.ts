import { z } from 'zod'

/**
 * Ista polja kao klijentska šema u `apps/web`. Ponavljanje je namerno — server ne sme da
 * veruje klijentskoj validaciji ni u jednom slučaju.
 */
export const contactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.email(),
  subject: z.string().trim().max(200).default(''),
  message: z.string().trim().min(10).max(5000),
  /**
   * Honeypot: polje skriveno od ljudi, ali vidljivo botovima koji popunjavaju sve.
   *
   * CAPTCHA bi tražila spoljni skript, što CSP zabranjuje (`script-src 'self'`).
   *
   * Polje se NE validira kao prazno (`max(0)`): tako bi popunjena vrednost pala kao
   * validaciona greška sa statusom 400, a bot bi iz odgovora zaključio da polje postoji.
   * Ruta ga umesto toga prihvata pa tiho odbacuje, uz isti 202 koji dobija i čovek.
   */
  website: z.string().optional(),

  /** Jezik sa kog je forma poslata — određuje jezik automatskog odgovora. */
  locale: z.enum(['sr', 'en']).default('sr'),
})

export const messageQuerySchema = z.object({
  status: z.enum(['all', 'unread']).default('all'),
})
