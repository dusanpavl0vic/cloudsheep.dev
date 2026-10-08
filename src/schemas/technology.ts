import { z } from 'zod'

import { TECHNOLOGY_GROUPS } from '@/types/technology'

import { requiredText, uuidOrNull } from './common'

export const technologySchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, 'validation.required')
    .max(40)
    .regex(/^[a-z0-9]+$/, 'validation.slug'),
  label: requiredText(40),
  group: z.enum(TECHNOLOGY_GROUPS).default('tooling'),
  logoId: uuidOrNull,
  sortOrder: z.number().int().min(0).default(0),
})

export const updateTechnologySchema = technologySchema.partial()

export type TechnologyInput = z.input<typeof technologySchema>
