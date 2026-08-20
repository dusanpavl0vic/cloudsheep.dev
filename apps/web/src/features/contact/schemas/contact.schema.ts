import { z } from 'zod'

/**
 * Zod šema je jedini izvor istine — tip forme se izvodi iz nje, ne piše ručno.
 * Poruke su i18n ključevi, ne tekst (docs/10-forms-validation.md).
 *
 * Ranije je ova šema stajala INLINE u komponenti, sa porukama na engleskom. Time je
 * prekršila tri pravila odjednom: mesto, jezik poruka i to što se nije mogla testirati
 * odvojeno od rendera.
 */
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: 'contact.errors.required' })
    .max(120, { message: 'contact.errors.tooLong' }),
  email: z.email({ message: 'contact.errors.emailInvalid' }),
  subject: z.string().trim().max(200, { message: 'contact.errors.tooLong' }),
  message: z
    .string()
    .trim()
    .min(10, { message: 'contact.errors.messageTooShort' })
    .max(5000, { message: 'contact.errors.tooLong' }),
  /**
   * Honeypot — polje skriveno od ljudi, ali vidljivo botovima koji popunjavaju sve.
   *
   * CAPTCHA bi tražila spoljni skript, a CSP ga zabranjuje (`script-src 'self'`).
   */
  website: z.string().max(0),
})

export type ContactInput = z.infer<typeof contactSchema>
