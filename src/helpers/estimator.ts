import {
  ESTIMATE_DESIGN_SHARE,
  ESTIMATE_FEATURES,
  ESTIMATE_FIXED_PHASE_WEEKS,
  ESTIMATE_PACES,
  ESTIMATE_PLATFORMS,
  ESTIMATE_RANGE,
  ESTIMATE_TEAM,
  ESTIMATE_TYPES,
  type EstimateFeature,
  type EstimatePace,
  type EstimatePhase,
  type EstimatePlatform,
  type EstimateType,
} from '@/constants/estimator'

export interface EstimateInput {
  type: EstimateType
  platforms: readonly EstimatePlatform[]
  features: readonly EstimateFeature[]
  pace: EstimatePace
}

export interface EstimateResult {
  /** Raspon u nedeljama. */
  low: number
  high: number
  /** Faze sa trajanjem > 0, redom. */
  phases: { key: EstimatePhase; weeks: number }[]
  /** Specijalisti uz vođu projekta (0 = samo vođa). */
  specialists: number
}

const sum = (values: readonly number[]) => values.reduce((total, value) => total + value, 0)

/** Procena trajanja (dizajn `est()`): težine su nedelje rada, tempo je množilac. */
export const estimate = ({ type, platforms, features, pace }: EstimateInput): EstimateResult => {
  const platformWeeks = type === 'webapp' || type === 'mobile' ? sum(platforms.map((p) => ESTIMATE_PLATFORMS[p])) : 0
  const weeks = (ESTIMATE_TYPES[type] + platformWeeks + sum(features.map((f) => ESTIMATE_FEATURES[f]))) * ESTIMATE_PACES[pace]

  const design = Math.max(1, Math.round(weeks * ESTIMATE_DESIGN_SHARE))
  const build = type === 'design' ? 0 : Math.max(1, Math.round(weeks - 2 * ESTIMATE_FIXED_PHASE_WEEKS - design))
  const phases: EstimateResult['phases'] = [
    { key: 'discover' as const, weeks: ESTIMATE_FIXED_PHASE_WEEKS },
    { key: 'design' as const, weeks: design },
    { key: 'build' as const, weeks: build },
    { key: 'launch' as const, weeks: ESTIMATE_FIXED_PHASE_WEEKS },
  ].filter((phase) => phase.weeks > 0)

  const specialists =
    (platforms.length > 1 ? 1 : 0) +
    (features.length >= ESTIMATE_TEAM.manyFeatures ? 1 : 0) +
    (type === 'design' ? 0 : 1) -
    (type === 'site' && features.length < ESTIMATE_TEAM.smallSiteFeatures ? 1 : 0)

  return {
    low: Math.max(ESTIMATE_RANGE.min, Math.round(weeks * ESTIMATE_RANGE.low)),
    high: Math.ceil(weeks * ESTIMATE_RANGE.high),
    phases,
    specialists: Math.max(0, specialists),
  }
}

/** Uključi/isključi stavku višestrukog izbora (platforme, funkcionalnosti). */
export const toggleItem = <T>(items: readonly T[], item: T): T[] =>
  items.includes(item) ? items.filter((value) => value !== item) : [...items, item]
