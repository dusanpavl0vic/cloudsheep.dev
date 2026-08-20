import { z } from 'zod'

const text = (max: number) => z.string().trim().max(max)

/**
 * Profil se čuva u celosti (`PUT`), ne delimično: forma je jedna i šalje se cela, pa je
 * `upsert` po konstantnom id-u najjednostavnija tačna implementacija.
 */
export const profileSchema = z.object({
  fullName: z.string().trim().min(1).max(80),
  location: text(80),
  isAvailable: z.boolean(),
  headlineSr: text(160),
  headlineEn: text(160),
  bioSr: text(2000),
  bioEn: text(2000),
  universitySr: text(120),
  universityEn: text(120),
  degreeSr: text(120),
  degreeEn: text(120),
})

export const socialLinkSchema = z.object({
  platform: z
    .string()
    .trim()
    .min(1)
    .max(24)
    .regex(/^[a-z]+$/),
  /** `mailto:` je dozvoljen — mejl je link kao i svaki drugi. */
  url: z.union([
    z.url(),
    z
      .string()
      .trim()
      .regex(/^mailto:.+@.+$/),
  ]),
  label: z.string().trim().min(1).max(60),
  isVisible: z.boolean().default(true),
})

export const updateSocialLinkSchema = socialLinkSchema.partial()
