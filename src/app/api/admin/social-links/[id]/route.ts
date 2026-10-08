import { updateSocialLinkSchema } from '@/schemas/profile'
import { handleAdmin } from '@/server/auth/session'
import { json, noContent, readJson } from '@/server/http'
import { deleteSocialLink, updateSocialLink } from '@/server/services/profile'

export const PATCH = handleAdmin<{ id: string }>(async (request, { params }) =>
  json(
    await updateSocialLink(
      (await params).id,
      await readJson(request, updateSocialLinkSchema, 'profile.errors.invalid'),
    ),
  ),
)

export const DELETE = handleAdmin<{ id: string }>(async (_request, { params }) => {
  await deleteSocialLink((await params).id)
  return noContent()
})
