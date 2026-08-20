import { z } from 'zod'

/**
 * Serverska validacija tehnologije. Ponavlja se sa klijentskom verzijom namerno —
 * server ne sme da veruje klijentskoj validaciji (isti dogovor kao kod prijave).
 */
export const createTechnologySchema = z.object({
  /**
   * Slug se izvodi iz naziva, ali ostaje izmenjiv: `Node.js` → `nodejs`, što je i ime
   * postojećih SVG fajlova, pa se stari logotipi mogu prepoznati po njemu.
   */
  slug: z
    .string()
    .trim()
    .min(1)
    .max(40)
    .regex(/^[a-z0-9]+$/),
  label: z.string().trim().min(1).max(40),
  group: z.enum(['frontend', 'backend', 'mobile', 'tooling', 'design']).default('tooling'),
  /** `null` je dozvoljen — tehnologija bez logotipa se prikazuje samo kao naziv. */
  logoId: z.uuid().nullable().default(null),
  sortOrder: z.number().int().min(0).default(0),
})

export const updateTechnologySchema = createTechnologySchema.partial()
