/**
 * Procena projekta (dizajn: „Scope your project in 30 seconds"). Težine su NEDELJE rada, tačno
 * iz dizajna; račun je u `helpers/estimator.ts`.
 */
export const ESTIMATE_TYPES = { site: 3, webapp: 8, mobile: 10, design: 3 } as const
export type EstimateType = keyof typeof ESTIMATE_TYPES

/** Platforme se dodaju samo za web i mobilnu aplikaciju. */
export const ESTIMATE_PLATFORMS = { web: 0, ios: 1, android: 1 } as const
export type EstimatePlatform = keyof typeof ESTIMATE_PLATFORMS

export const ESTIMATE_FEATURES = {
  auth: 1,
  pay: 1.5,
  admin: 2,
  cms: 1,
  integr: 1,
  i18n: 0.5,
  rt: 1.5,
} as const
export type EstimateFeature = keyof typeof ESTIMATE_FEATURES

/** Množilac trajanja: prioritetni rad je kraći za petinu. */
export const ESTIMATE_PACES = { standard: 1, priority: 0.8 } as const
export type EstimatePace = keyof typeof ESTIMATE_PACES

export const ESTIMATE_DEFAULTS = {
  type: 'webapp' as EstimateType,
  platforms: ['web'] as EstimatePlatform[],
  features: ['auth', 'admin'] as EstimateFeature[],
  pace: 'standard' as EstimatePace,
}

/** Raspon oko izračunate vrednosti i najkraći mogući projekat (nedelje). */
export const ESTIMATE_RANGE = { low: 0.9, high: 1.15, min: 2 } as const
