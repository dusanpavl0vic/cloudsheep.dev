import { z } from 'zod'

import { GALLERY_LAYOUTS, MEDIA_SIDES, PROJECT_CATEGORIES } from '../types'

/**
 * Zod šema je jedini izvor istine — tip forme se izvodi iz nje, ne piše ručno.
 * Poruke su i18n ključevi, ne tekst (docs/10-forms-validation.md).
 *
 * Ista polja postoje i u `apps/api/src/schemas/project.schema.ts`. Ponavljanje je namerno:
 * server ne sme da veruje klijentskoj validaciji, a ova verzija nosi prevode i vezana je
 * za formu. Poklapati se moraju IMENA polja i granice — ne i poruke.
 */
const localized = (max: number, tooLong: string) =>
  z.string().trim().min(1, { message: 'projects.errors.required' }).max(max, { message: tooLong })

export const projectSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, { message: 'projects.errors.required' })
    .max(80, { message: 'projects.errors.slugTooLong' })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: 'projects.errors.slugFormat' }),

  category: z.enum(PROJECT_CATEGORIES),

  /**
   * `z.number()`, ne `z.coerce.number()`.
   *
   * `coerce` ulazni tip šeme pretvara u `unknown`, pa `zodResolver` prestaje da se poklapa
   * sa tipom forme i `tsc` puca. Pretvaranje teksta u broj radi `register('year',
   * { valueAsNumber: true })` — react-hook-form to ionako radi, i radi ranije.
   */
  year: z
    .number({ message: 'projects.errors.yearInvalid' })
    .int({ message: 'projects.errors.yearInvalid' })
    .min(2000, { message: 'projects.errors.yearRange' })
    .max(new Date().getFullYear() + 1, { message: 'projects.errors.yearRange' }),

  titleSr: localized(120, 'projects.errors.titleTooLong'),
  titleEn: localized(120, 'projects.errors.titleTooLong'),
  catSr: localized(80, 'projects.errors.catTooLong'),
  catEn: localized(80, 'projects.errors.catTooLong'),
  descSr: localized(600, 'projects.errors.descTooLong'),
  descEn: localized(600, 'projects.errors.descTooLong'),
  captionSr: z.string().trim().max(200, { message: 'projects.errors.captionTooLong' }),
  captionEn: z.string().trim().max(200, { message: 'projects.errors.captionTooLong' }),

  /** Tehnologije se biraju iz spiska (čekboksovi), pa su ovo id-evi, ne nazivi. */
  technologyIds: z.array(z.string()).max(12, { message: 'projects.errors.tooManyTech' }),

  /** Na kojoj strani stoji slika u sekciji „Radovi" na početnoj. */
  mediaSide: z.enum(MEDIA_SIDES),
  /** `none` = bez medija: projekat se prikazuje kao šira tekstualna kartica. */
  galleryLayout: z.enum(GALLERY_LAYOUTS),

  /** Prazno polje NIJE greška — projekat bez live linka je uobičajen. */
  liveUrl: z.union([z.url({ message: 'projects.errors.urlInvalid' }), z.literal('')]),
  repoUrl: z.union([z.url({ message: 'projects.errors.urlInvalid' }), z.literal('')]),

  isPublished: z.boolean(),
  isFeatured: z.boolean(),
})

export type ProjectInput = z.infer<typeof projectSchema>
