import { z } from 'zod'

import { optionalText, requiredText } from './common'

export const profileSchema = z.object({
  fullName: requiredText(80),
  location: optionalText(80),
  isAvailable: z.boolean(),
  headlineSr: optionalText(160),
  headlineEn: optionalText(160),
  bioSr: optionalText(2000),
  bioEn: optionalText(2000),
  universitySr: optionalText(120),
  universityEn: optionalText(120),
  degreeSr: optionalText(120),
  degreeEn: optionalText(120),
})

export const socialLinkSchema = z.object({
  platform: z
    .string()
    .trim()
    .min(1, 'validation.required')
    .max(24)
    .regex(/^[a-z]+$/, 'validation.slug'),
  url: z.union([
    z.url('validation.url'),
    z
      .string()
      .trim()
      .regex(/^mailto:.+@.+$/, 'validation.url'),
  ]),
  label: requiredText(60),
  isVisible: z.boolean().default(true),
})

export const updateSocialLinkSchema = socialLinkSchema.partial()

export type ProfileInput = z.input<typeof profileSchema>
export type SocialLinkInput = z.input<typeof socialLinkSchema>
