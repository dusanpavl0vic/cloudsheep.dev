import { z } from 'zod'

const text = (max: number, tooLong: string) => z.string().trim().max(max, { message: tooLong })

/** Ista polja kao serverska šema; poruke su i18n ključevi (docs/10). */
export const profileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, { message: 'profile.errors.required' })
    .max(80, { message: 'profile.errors.tooLong' }),
  location: text(80, 'profile.errors.tooLong'),
  isAvailable: z.boolean(),
  headlineSr: text(160, 'profile.errors.tooLong'),
  headlineEn: text(160, 'profile.errors.tooLong'),
  bioSr: text(2000, 'profile.errors.tooLong'),
  bioEn: text(2000, 'profile.errors.tooLong'),
  universitySr: text(120, 'profile.errors.tooLong'),
  universityEn: text(120, 'profile.errors.tooLong'),
  degreeSr: text(120, 'profile.errors.tooLong'),
  degreeEn: text(120, 'profile.errors.tooLong'),
})

export const socialLinkSchema = z.object({
  platform: z
    .string()
    .trim()
    .min(1, { message: 'profile.errors.required' })
    .regex(/^[a-z]+$/, { message: 'profile.errors.platformFormat' }),
  /** `mailto:` je dozvoljen — mejl je link kao i svaki drugi. */
  url: z
    .string()
    .trim()
    .min(1, { message: 'profile.errors.required' })
    .refine((value) => /^https?:\/\/.+/.test(value) || /^mailto:.+@.+/.test(value), {
      message: 'profile.errors.urlInvalid',
    }),
  label: z
    .string()
    .trim()
    .min(1, { message: 'profile.errors.required' })
    .max(60, { message: 'profile.errors.tooLong' }),
  isVisible: z.boolean(),
})

export type ProfileInput = z.infer<typeof profileSchema>
export type SocialLinkInput = z.infer<typeof socialLinkSchema>
