import { z } from 'zod'

import { LOCALES } from '@/constants/i18n'

import { emailField } from './email'

export const subscribeSchema = z.object({
  email: emailField,
  locale: z.enum(LOCALES).default('en'),
  allowTypo: z.boolean().default(false),
  /** Honeypot — isto kao u upitu. */
  website: z.string().max(200).optional(),
})

export type SubscribeInput = z.input<typeof subscribeSchema>
