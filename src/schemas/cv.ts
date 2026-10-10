import { z } from 'zod'

import { optionalText } from './common'

const year = () =>
  z
    .number({ error: 'validation.year' })
    .int('validation.year')
    .min(1950, 'validation.year')
    .max(new Date().getFullYear() + 1, 'validation.year')
const month = () => z.number({ error: 'validation.month' }).int('validation.month').min(1, 'validation.month').max(12, 'validation.month')
const bullets = () => z.array(z.string().trim().min(1).max(300)).max(12).default([])

export const cvExperienceSchema = z.object({
  company: z.string().trim().min(1, 'validation.required').max(120),
  positionSr: optionalText(120),
  positionEn: optionalText(120),
  locationSr: optionalText(80),
  locationEn: optionalText(80),
  startYear: year(),
  startMonth: month().nullable().default(null),
  endYear: year().nullable().default(null),
  endMonth: month().nullable().default(null),
  summarySr: optionalText(600),
  summaryEn: optionalText(600),
  bulletsSr: bullets(),
  bulletsEn: bullets(),
  technologies: z.array(z.string().trim().min(1).max(40)).max(24).default([]),
})

export const cvSchema = z.object({
  email: optionalText(120),
  phone: optionalText(40),
  githubUrl: optionalText(300),
  linkedinUrl: optionalText(300),
  websiteUrl: optionalText(300),
  locationSr: optionalText(80),
  locationEn: optionalText(80),
  summarySr: optionalText(900),
  summaryEn: optionalText(900),
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
  educationStatusSr: optionalText(120),
  educationStatusEn: optionalText(120),
  gpa: optionalText(20),
  educationStartYear: year().nullable().default(null),
  educationEndYear: year().nullable().default(null),
  siteProjects: z
    .array(z.object({ projectId: z.uuid(), noteSr: optionalText(160), noteEn: optionalText(160) }))
    .max(40)
    .default([]),
  experiences: z.array(cvExperienceSchema).max(20).default([]),
  languages: z
    .array(
      z.object({
        nameSr: z.string().trim().min(1).max(60),
        nameEn: z.string().trim().min(1).max(60),
        levelSr: optionalText(40),
        levelEn: optionalText(40),
      }),
    )
    .max(10)
    .default([]),
})

export type CvInput = z.input<typeof cvSchema>

/**
 * Forma CV-a u admin-u: postignuća su tekst (jedno po redu), tehnologije tekst odvojen
 * zarezom — `toCvInput` ih pretvara u nizove koje API prima.
 */
export const cvFormSchema = cvSchema.extend({
  experiences: z
    .array(
      cvExperienceSchema.extend({
        bulletsSr: z.string().max(4000),
        bulletsEn: z.string().max(4000),
        technologies: z.string().max(1000),
      }),
    )
    .max(20),
})

export type CvForm = z.input<typeof cvFormSchema>
