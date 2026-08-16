import { z } from 'zod'

/**
 * Zod šema je jedini izvor istine — tip se izvodi iz nje, ne piše ručno.
 * Poruke su i18n ključevi, ne tekst (docs/10-forms-validation.md).
 */
export const loginSchema = z.object({
  email: z.email({ message: 'auth.errors.emailInvalid' }),
  password: z.string().min(8, { message: 'auth.errors.passwordTooShort' }),
  rememberMe: z.boolean(),
})

export type LoginInput = z.infer<typeof loginSchema>
