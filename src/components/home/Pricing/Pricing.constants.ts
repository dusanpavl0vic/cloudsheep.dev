/** Tri paketa (dizajn `CS2.plans`); srednji je istaknut. Tekst u `home.pricing.plans.<key>`. */
export const PLANS = [
  { key: 'fixed', featured: false },
  { key: 'monthly', featured: true },
  { key: 'sprint', featured: false },
] as const

export const PLAN_FEATURES = ['one', 'two', 'three'] as const
