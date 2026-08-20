import { z } from 'zod'

const text = (max: number) => z.string().trim().max(max, { message: 'team.errors.tooLong' })

/**
 * Polja diplome NISU obavezna ni kad je čekboks uključen.
 *
 * Razlog: podaci sa diplome se često unose u dva navrata (prvo ime i slika, pa zvanje kad
 * se dokument nađe). Obavezna polja bi značila da član ne može ni da se sačuva dok se sve
 * ne prekuca. Sajt prikazuje ono što je popunjeno.
 */
export const teamMemberSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, { message: 'team.errors.required' })
    .max(80, { message: 'team.errors.tooLong' }),
  roleSr: text(80),
  roleEn: text(80),
  avatarId: z.string().nullable(),

  hasDiploma: z.boolean(),
  universitySr: text(120),
  universityEn: text(120),
  degreeSr: text(160),
  degreeEn: text(160),
  programmeSr: text(160),
  programmeEn: text(160),
  facultySr: text(120),
  facultyEn: text(120),
  city: text(80),
  sealId: z.string().nullable(),

  isVisible: z.boolean(),
})

export type TeamMemberInput = z.infer<typeof teamMemberSchema>
