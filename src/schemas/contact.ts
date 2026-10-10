import { z } from 'zod'

import { BRIEF_BUDGETS, BRIEF_TIMELINES, BRIEF_TYPES, CONTACT_LIMITS } from '@/constants/contact'
import {
  ESTIMATE_FEATURES,
  ESTIMATE_PACES,
  ESTIMATE_PLATFORMS,
  ESTIMATE_TYPES,
} from '@/constants/estimator'
import { LOCALES } from '@/constants/i18n'

import { emailField } from './email'

const keysOf = <T extends object>(source: T) =>
  Object.keys(source) as [keyof T & string, ...(keyof T & string)[]]

/** Izbor iz procene na početnoj — šalje se uz upit, da studio vidi šta je posetilac izabrao. */
export const estimateSchema = z.object({
  type: z.enum(keysOf(ESTIMATE_TYPES)),
  platforms: z.array(z.enum(keysOf(ESTIMATE_PLATFORMS))).max(3),
  features: z.array(z.enum(keysOf(ESTIMATE_FEATURES))).max(10),
  pace: z.enum(keysOf(ESTIMATE_PACES)),
})

export const briefSchema = z.object({
  projectType: z.enum(BRIEF_TYPES, 'validation.pick'),
  budget: z.enum(BRIEF_BUDGETS, 'validation.pick'),
  timeline: z.enum(BRIEF_TIMELINES, 'validation.pick'),
  name: z
    .string()
    .trim()
    .min(1, 'validation.required')
    .max(CONTACT_LIMITS.nameMax, 'validation.tooLong'),
  email: emailField,
  message: z
    .string()
    .trim()
    .min(CONTACT_LIMITS.messageMin, 'validation.messageMin')
    .max(CONTACT_LIMITS.messageMax, 'validation.tooLong'),
  /** Izabran termin uvodnog poziva; bez njega upit i dalje prolazi. */
  slotId: z.uuid().nullable().default(null),
  estimate: estimateSchema.nullable().default(null),
  locale: z.enum(LOCALES).default('en'),
  /** Posetilac je potvrdio adresu koja liči na grešku u kucanju (ADR 0013). */
  allowTypo: z.boolean().default(false),
  /**
   * Honeypot: skriveno od ljudi, vidljivo botovima. NE validira se kao prazno — popunjeno se
   * prihvata pa tiho odbacuje, uz isti 202 koji dobija i čovek (bot ne dobija signal).
   */
  website: z.string().max(200).optional(),
})

export type BriefInput = z.input<typeof briefSchema>
export type Brief = z.output<typeof briefSchema>

export const messageQuerySchema = z.object({
  status: z.enum(['all', 'unread']).default('all'),
})

export const markReadSchema = z.object({ isRead: z.boolean() })
