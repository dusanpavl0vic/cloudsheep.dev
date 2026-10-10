import { HTTP_STATUS } from '@/constants/http'
import { testimonialSchema } from '@/schemas/testimonial'
import { handleAdmin } from '@/server/auth/session'
import { json, readJson } from '@/server/http'
import { createTestimonial, listAdminTestimonials } from '@/server/services/testimonials'

export const GET = handleAdmin(async () => json({ items: await listAdminTestimonials() }))

export const POST = handleAdmin(async (request) =>
  json(
    await createTestimonial(
      await readJson(request, testimonialSchema, 'testimonials.errors.invalid'),
    ),
    HTTP_STATUS.CREATED,
  ),
)
