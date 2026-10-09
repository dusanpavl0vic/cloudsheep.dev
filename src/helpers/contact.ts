import { BRIEF_BUDGETS, BRIEF_TIMELINES, BRIEF_TYPES, type BriefBudget, type BriefTimeline, type BriefType } from '@/constants/contact'
import {
  ESTIMATE_FEATURES,
  ESTIMATE_PACES,
  ESTIMATE_PLATFORMS,
  ESTIMATE_TYPES,
  type EstimateFeature,
  type EstimatePace,
  type EstimatePlatform,
} from '@/constants/estimator'

import type { EstimateInput } from './estimator'

export const PLAN_KEYS = ['fixed', 'monthly', 'sprint'] as const
export type PlanKey = (typeof PLAN_KEYS)[number]

export interface ContactPrefill {
  projectType: BriefType | null
  budget: BriefBudget | null
  timeline: BriefTimeline | null
  plan: PlanKey | null
  estimate: EstimateInput | null
}

type Query = Record<string, string | string[] | undefined>

const one = <T extends string>(value: Query[string], allowed: readonly T[]): T | null =>
  typeof value === 'string' && (allowed as readonly string[]).includes(value) ? (value as T) : null

const list = <T extends string>(value: Query[string], allowed: readonly T[]): T[] =>
  typeof value === 'string' ? value.split(',').filter((item): item is T => (allowed as readonly string[]).includes(item)) : []

/**
 * Query sa početne (procena ili cenovni paket) → početne vrednosti upita. Nepoznata vrednost se
 * tiho odbacuje — URL je javni ulaz, ne sme da pukne forma.
 */
export const parseContactPrefill = (query: Query): ContactPrefill => {
  const estimateType = one(query.type, Object.keys(ESTIMATE_TYPES) as (keyof typeof ESTIMATE_TYPES)[])
  const pace = one(query.pace, Object.keys(ESTIMATE_PACES) as EstimatePace[])
  const hasEstimate = Boolean(estimateType && pace)

  return {
    projectType: one(query.type, BRIEF_TYPES),
    budget: one(query.budget, BRIEF_BUDGETS),
    timeline: one(query.timeline, BRIEF_TIMELINES),
    plan: one(query.plan, PLAN_KEYS),
    estimate:
      hasEstimate && estimateType && pace
        ? {
            type: estimateType,
            platforms: list(query.platforms, Object.keys(ESTIMATE_PLATFORMS) as EstimatePlatform[]),
            features: list(query.features, Object.keys(ESTIMATE_FEATURES) as EstimateFeature[]),
            pace,
          }
        : null,
  }
}
