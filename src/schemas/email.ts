import { z } from 'zod'

import { EMAIL_MAX_LENGTH } from '@/constants/email'

/**
 * Oblik je samo prvi filter; postojanje domena proverava server (`verifyEmail`, ADR 0013).
 * `allowTypo`: posetilac je potvrdio adresu koja liči na grešku u kucanju.
 */
export const emailField = z
  .string()
  .trim()
  .min(1, 'validation.required')
  .max(EMAIL_MAX_LENGTH, 'validation.tooLong')
  .pipe(z.email('validation.email'))

export const emailCheckSchema = z.object({
  email: z.string().trim().max(EMAIL_MAX_LENGTH),
  allowTypo: z.boolean().default(false),
})
