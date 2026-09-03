import { z } from 'zod'

import { PROJECT_CATEGORIES } from './projects.constants'

/**
 * Dvojezično polje. API vraća OBA jezika u istom odgovoru, pa prebacivanje jezika na
 * sajtu ne izaziva nijedan novi zahtev — cena je nekoliko kilobajta u telu odgovora.
 */
const localizedSchema = z.object({ sr: z.string(), en: z.string() })

/** Tehnologija sa logotipom. `logoUrl` je `null` kad logotip nije otpremljen. */
const technologySchema = z.object({
  id: z.string(),
  slug: z.string(),
  label: z.string(),
  group: z.string(),
  logoUrl: z.string().nullable(),
})

/**
 * Slika projekta. `width` i `height` NISU opcioni: bez njih `<img>` nema eksplicitne
 * dimenzije i stranica poskakuje dok se slika učitava (docs/07 §7).
 */
const imageSchema = z.object({
  id: z.string(),
  url: z.string(),
  width: z.number(),
  height: z.number(),
  alt: localizedSchema,
})

export const projectSchema = z.object({
  id: z.string(),
  slug: z.string(),
  category: z.enum(PROJECT_CATEGORIES.filter((c) => c !== 'all') as [string, ...string[]]),
  year: z.number(),
  isFeatured: z.boolean(),
  /** Na kojoj strani stoji slika u sekciji „Radovi" — bira se po projektu u adminu. */
  /** `none` = projekat se prikazuje bez medija, kao šira tekstualna kartica. */
  galleryLayout: z.enum(['grid', 'feature', 'none']),
  liveUrl: z.string().nullable(),
  repoUrl: z.string().nullable(),
  title: localizedSchema,
  cat: localizedSchema,
  desc: localizedSchema,
  caption: localizedSchema,
  technologies: z.array(technologySchema),
  images: z.array(imageSchema),
})

export const projectListSchema = z.object({ items: z.array(projectSchema) })

export const technologyListSchema = z.object({ items: z.array(technologySchema) })

export type Localized = z.infer<typeof localizedSchema>
export type Technology = z.infer<typeof technologySchema>
export type ProjectImage = z.infer<typeof imageSchema>
export type Project = z.infer<typeof projectSchema>
