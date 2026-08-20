import { z } from 'zod'

import { TECHNOLOGY_GROUPS } from '../types'

/**
 * Ista polja kao serverska šema u `apps/api/src/schemas/technology.schema.ts`.
 * Ponavljanje je namerno: server ne sme da veruje klijentskoj validaciji, a ova verzija
 * nosi i18n ključeve poruka.
 */
export const technologySchema = z.object({
  /**
   * Slug ulazi u poređenja i u imena datoteka — otud samo mala slova i cifre.
   * Predlaže se iz naziva, ali ostaje izmenjiv.
   */
  slug: z
    .string()
    .trim()
    .min(1, { message: 'technologies.errors.required' })
    .max(40, { message: 'technologies.errors.slugTooLong' })
    .regex(/^[a-z0-9]+$/, { message: 'technologies.errors.slugFormat' }),
  label: z
    .string()
    .trim()
    .min(1, { message: 'technologies.errors.required' })
    .max(40, { message: 'technologies.errors.labelTooLong' }),
  group: z.enum(TECHNOLOGY_GROUPS),
  logoId: z.string().nullable(),
})

export type TechnologyInput = z.infer<typeof technologySchema>

/** `Node.js` → `nodejs`. Ista normalizacija koju koriste baza i migracija. */
export const toSlug = (label: string): string => label.toLowerCase().replace(/[^a-z0-9]/g, '')
