import { updateTestimonialSchema } from '@/schemas/testimonial'
import { handleAdmin } from '@/server/auth/session'
import { json, noContent, readPatch } from '@/server/http'
import { deleteTestimonial, updateTestimonial } from '@/server/services/testimonials'

export const PATCH = handleAdmin<{ id: string }>(async (request, { params }) =>
  json(
    await updateTestimonial(
      (await params).id,
      await readPatch(request, updateTestimonialSchema, 'testimonials.errors.invalid'),
    ),
  ),
)

export const DELETE = handleAdmin<{ id: string }>(async (_request, { params }) => {
  await deleteTestimonial((await params).id)
  return noContent()
})
