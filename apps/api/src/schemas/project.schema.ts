import { z } from 'zod'

/**
 * Serverska validacija projekta.
 *
 * Namerno se ponavlja sa `apps/admin/src/features/projects/schemas/project.schema.ts`
 * umesto da se deli iz `packages/`: klijentska verzija nosi i18n ključeve za poruke i
 * vezana je za formu, a server ne sme da veruje klijentskoj validaciji ni u jednom
 * slučaju. Jedino što mora da se poklapa su IMENA polja — isti dogovor kao kod prijave.
 */

/** Mala slova, cifre i crtice. Slug ide u URL, pa je sve ostalo problem nekome. */
const slug = z
  .string()
  .min(1)
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)

const localizedText = (max: number) => z.string().trim().min(1).max(max)

const projectCategories = ['frontend', 'backend', 'fullStack', 'openSource'] as const

export const createProjectSchema = z.object({
  slug,
  category: z.enum(projectCategories),
  /**
   * Donja granica je godina osnivanja, gornja „sledeća godina" — projekat najavljen pet
   * godina unapred je greška u kucanju, ne podatak.
   */
  year: z.coerce
    .number()
    .int()
    .min(2000)
    .max(new Date().getFullYear() + 1),

  titleSr: localizedText(120),
  titleEn: localizedText(120),
  catSr: localizedText(80),
  catEn: localizedText(80),
  descSr: localizedText(600),
  descEn: localizedText(600),
  captionSr: z.string().trim().max(200).default(''),
  captionEn: z.string().trim().max(200).default(''),

  /** Tehnologije se biraju iz spiska, ne kucaju — otud id-evi, ne nazivi. */
  technologyIds: z.array(z.uuid()).max(12).default([]),

  /** `none` znači „bez medija" — projekat se prikazuje kao šira tekstualna kartica. */
  galleryLayout: z.enum(['grid', 'feature', 'none']).default('grid'),

  /**
   * Prazan string iz forme znači „nema linka", pa se pretvara u `null` umesto da padne
   * na `z.url()`. Neispravan URL i dalje pada — samo prazno polje nije greška.
   */
  liveUrl: z
    .union([z.url(), z.literal('')])
    .nullable()
    .default(null),
  repoUrl: z
    .union([z.url(), z.literal('')])
    .nullable()
    .default(null),

  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  sortOrder: z.number().int().min(0).default(0),
})

/** Izmena je delimična — forma šalje samo ono što je dirano. */
export const updateProjectSchema = createProjectSchema.partial()

/** Prevlačenje redosleda šalje ceo niz id-eva u novom poretku. */
export const reorderSchema = z.object({
  ids: z.array(z.uuid()).min(1),
})

/** Dodavanje slike projektu: već otpremljena datoteka + opis. */
export const attachImageSchema = z.object({
  assetId: z.uuid(),
  altSr: z.string().trim().max(200).default(''),
  altEn: z.string().trim().max(200).default(''),
})

export const updateImageSchema = attachImageSchema.partial().omit({ assetId: true })

export type CreateProjectInput = z.infer<typeof createProjectSchema>
