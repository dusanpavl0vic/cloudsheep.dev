import { z } from 'zod'

import { DEVICE_KINDS, GALLERY_LAYOUTS, PROJECT_CATEGORIES } from '@/types/project'

import { optionalText, optionalUrl, requiredText, slugSchema } from './common'

const metricSchema = z.object({
  value: requiredText(16),
  labelSr: requiredText(60),
  labelEn: requiredText(60),
})

const chapterSchema = z.object({
  titleSr: requiredText(100),
  titleEn: requiredText(100),
  bodySr: requiredText(2000),
  bodyEn: requiredText(2000),
})

export const projectSchema = z.object({
  slug: slugSchema,
  category: z.enum(PROJECT_CATEGORIES),
  /** Od osnivanja do „sledeće godine" — projekat najavljen pet godina unapred je greška u kucanju. */
  year: z.coerce
    .number()
    .int()
    .min(2000)
    .max(new Date().getFullYear() + 1),
  titleSr: requiredText(120),
  titleEn: requiredText(120),
  catSr: requiredText(80),
  catEn: requiredText(80),
  descSr: requiredText(600),
  descEn: requiredText(600),
  captionSr: optionalText(200),
  captionEn: optionalText(200),
  roleSr: optionalText(120),
  roleEn: optionalText(120),
  timelineSr: optionalText(60),
  timelineEn: optionalText(60),
  client: optionalText(80),
  metrics: z.array(metricSchema).max(6).default([]),
  chapters: z.array(chapterSchema).max(8).default([]),
  growth: z.array(z.number().int().min(0)).max(24).default([]),
  /** Tehnologije se biraju iz spiska, ne kucaju — otud id-evi. */
  technologyIds: z.array(z.uuid()).max(12).default([]),
  galleryLayout: z.enum(GALLERY_LAYOUTS).default('grid'),
  liveUrl: optionalUrl,
  repoUrl: optionalUrl,
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  sortOrder: z.number().int().min(0).default(0),
})

export const updateProjectSchema = projectSchema.partial()

export const attachImageSchema = z.object({
  assetId: z.uuid(),
  altSr: optionalText(200),
  altEn: optionalText(200),
  device: z.enum(DEVICE_KINDS).nullable().default(null),
})

export const updateImageSchema = attachImageSchema.omit({ assetId: true }).partial()

export type ProjectInput = z.input<typeof projectSchema>
export type AttachImageInput = z.input<typeof attachImageSchema>
export type UpdateImageInput = z.input<typeof updateImageSchema>

/**
 * Forma projekta u admin-u: grafikon rasta je tekst odvojen zarezom; redosled se menja
 * strelicama u spisku, ne formom (inače bi čuvanje vratilo 0).
 */
export const projectFormSchema = projectSchema.omit({ sortOrder: true }).extend({
  growth: z.string().regex(/^\s*(\d+(\s*,\s*\d+)*)?\s*$/, 'validation.numbers'),
})

export type ProjectForm = z.input<typeof projectFormSchema>

/** Forma → telo zahteva (grafikon postaje niz brojeva). */
export const toProjectInput = ({ growth, ...rest }: z.output<typeof projectFormSchema>): Omit<ProjectInput, 'sortOrder'> => ({
  ...rest,
  growth: growth
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
    .map(Number),
})
