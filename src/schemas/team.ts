import { z } from 'zod'

import { optionalText, requiredText, uuidOrNull } from './common'

export const teamMemberSchema = z.object({
  fullName: requiredText(80),
  roleSr: optionalText(80),
  roleEn: optionalText(80),
  avatarId: uuidOrNull,
  hasDiploma: z.boolean().default(false),
  universitySr: optionalText(120),
  universityEn: optionalText(120),
  degreeSr: optionalText(160),
  degreeEn: optionalText(160),
  programmeSr: optionalText(160),
  programmeEn: optionalText(160),
  facultySr: optionalText(120),
  facultyEn: optionalText(120),
  city: optionalText(80),
  sealId: uuidOrNull,
  isVisible: z.boolean().default(true),
})

export const updateTeamMemberSchema = teamMemberSchema.partial()

export type TeamMemberInput = z.input<typeof teamMemberSchema>
