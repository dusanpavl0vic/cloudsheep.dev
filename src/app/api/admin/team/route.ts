import { HTTP_STATUS } from '@/constants/http'
import { teamMemberSchema } from '@/schemas/team'
import { handleAdmin } from '@/server/auth/session'
import { json, readJson } from '@/server/http'
import { createTeamMember, listAdminTeam } from '@/server/services/team'

export const GET = handleAdmin(async () => json({ items: await listAdminTeam() }))

export const POST = handleAdmin(async (request) =>
  json(
    await createTeamMember(await readJson(request, teamMemberSchema, 'team.errors.invalid')),
    HTTP_STATUS.CREATED,
  ),
)
