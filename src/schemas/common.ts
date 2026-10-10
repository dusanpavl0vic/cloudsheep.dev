import { z } from 'zod'

/**
 * Poruke grešaka su i18n KLJUČEVI (`validation.*`), ne tekst: ista šema validira formu na
 * klijentu (koji ih prevodi) i telo zahteva na serveru (koji vraća samo polje).
 */
export const slugSchema = z
  .string()
  .trim()
  .min(1, 'validation.required')
  .max(80, 'validation.tooLong')
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'validation.slug')

export const requiredText = (max: number) =>
  z.string().trim().min(1, 'validation.required').max(max, 'validation.tooLong')

export const optionalText = (max: number) =>
  z.string().trim().max(max, 'validation.tooLong').default('')

/** Prazan string iz forme znači „nema linka" → `null`; neispravan URL i dalje pada. */
export const optionalUrl = z
  .union([z.url('validation.url'), z.literal('')])
  .nullable()
  .default(null)
  .transform((value) => (value === '' ? null : value))

/** Prevlačenje redosleda šalje ceo niz id-eva u novom poretku. */
export const reorderSchema = z.object({ ids: z.array(z.uuid()).min(1) })

export const uuidOrNull = z.uuid().nullable().default(null)
