import { z } from 'zod'

import { optionalText, requiredText, uuidOrNull } from './common'

export const testimonialSchema = z.object({
  quoteSr: requiredText(600),
  quoteEn: requiredText(600),
  authorName: requiredText(80),
  authorRoleSr: optionalText(80),
  authorRoleEn: optionalText(80),
  company: optionalText(80),
  avatarId: uuidOrNull,
  projectId: uuidOrNull,
  isPublished: z.boolean().default(true),
})

export const updateTestimonialSchema = testimonialSchema.partial()

export type TestimonialInput = z.input<typeof testimonialSchema>
