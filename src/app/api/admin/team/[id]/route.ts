import { updateTeamMemberSchema } from '@/schemas/team'
import { handleAdmin } from '@/server/auth/session'
import { json, noContent, readPatch } from '@/server/http'
import { deleteTeamMember, updateTeamMember } from '@/server/services/team'

export const PATCH = handleAdmin<{ id: string }>(async (request, { params }) =>
  json(
    await updateTeamMember(
      (await params).id,
      await readPatch(request, updateTeamMemberSchema, 'team.errors.invalid'),
    ),
  ),
)

export const DELETE = handleAdmin<{ id: string }>(async (_request, { params }) => {
  await deleteTeamMember((await params).id)
  return noContent()
})
