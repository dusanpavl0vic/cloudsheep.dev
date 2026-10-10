import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email('validation.email'),
  password: z.string().min(8, 'validation.passwordMin'),
  rememberMe: z.boolean().default(false),
})

export type LoginInput = z.input<typeof loginSchema>
