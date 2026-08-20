import { z } from 'zod'

/**
 * Prazan string je podrazumevana vrednost, ne greška.
 *
 * Član se često unese samo sa imenom i slikom, a podaci sa diplome se dopune kad se
 * dokument nađe. Bez `.default('')` server bi tražio svih jedanaest polja pri kreiranju.
 */
const text = (max: number) => z.string().trim().max(max).default('')

/**
 * Serverska validacija člana tima.
 *
 * Polja diplome su uvek opciona na nivou tipa, a prazna kad `hasDiploma` nije uključen.
 * Server ne traži da su popunjena: sajt kartu diplome ionako ne renderuje bez te zastavice,
 * pa bi obavezna polja samo sprečila da se član sačuva pre nego što se podaci pronađu.
 */
export const teamMemberSchema = z.object({
  fullName: z.string().trim().min(1).max(80),
  roleSr: text(80),
  roleEn: text(80),
  avatarId: z.uuid().nullable().default(null),

  hasDiploma: z.boolean().default(false),
  universitySr: text(120),
  universityEn: text(120),
  degreeSr: text(160),
  degreeEn: text(160),
  programmeSr: text(160),
  programmeEn: text(160),
  facultySr: text(120),
  facultyEn: text(120),
  city: text(80),
  sealId: z.uuid().nullable().default(null),

  isVisible: z.boolean().default(true),
})

export const updateTeamMemberSchema = teamMemberSchema.partial()
