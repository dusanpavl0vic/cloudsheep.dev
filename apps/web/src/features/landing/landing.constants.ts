/**
 * Sadržaj landing stranice kao podaci — sekcije ga renderuju kroz `.map()`.
 * Tekstovi idu preko i18n ključeva; tehnološke oznake su nazivi alata (ne prevode se).
 * Portfolio radovi žive u `features/projects/projects.constants.ts`.
 */

export const HERO_TERMINAL_KEYS = ['hero.term1', 'hero.term2', 'hero.term3', 'hero.term4'] as const

/**
 * Discipline studija.
 *
 * `no` i `slug` su razdvojeni, a ranije su bili jedan string (`'/01 design'`). Razdvojeni su
 * zato što ih novi raspored crta na dva različita mesta i u dve različite težine: broj je
 * veliki duh u pozadini panela, oznaka je sitan mono red nad naslovom.
 *
 * `slug` nije prevod — `design`, `web`, `mobile` i `ops` su isti na svakom jeziku, kao i
 * nazivi tehnologija u `tags`.
 */
export const DISCIPLINES = [
  {
    id: 'design',
    no: '01',
    slug: '/ design',
    titleKey: 'services.design.title',
    descriptionKey: 'services.design.description',
    tags: ['ux/ui', 'design systems', 'prototyping'],
  },
  {
    id: 'web',
    no: '02',
    slug: '/ web',
    titleKey: 'services.web.title',
    descriptionKey: 'services.web.description',
    tags: ['next.js', 'typescript', 'postgresql'],
  },
  {
    id: 'mobile',
    no: '03',
    slug: '/ mobile',
    titleKey: 'services.mobile.title',
    descriptionKey: 'services.mobile.description',
    tags: ['react native', 'kotlin', 'swift'],
  },
  {
    id: 'ops',
    no: '04',
    slug: '/ ops',
    titleKey: 'services.ops.title',
    descriptionKey: 'services.ops.description',
    tags: ['node.js', 'docker', 'ci/cd'],
  },
] as const

export const PROCESS_STEPS = [
  {
    id: 'discover',
    index: '/01',
    titleKey: 'process.discover.title',
    descriptionKey: 'process.discover.description',
    metaKey: 'process.discover.meta',
    tone: 'primary' as const,
  },
  {
    id: 'design',
    index: '/02',
    titleKey: 'process.design.title',
    descriptionKey: 'process.design.description',
    metaKey: 'process.design.meta',
    tone: 'violet' as const,
  },
  {
    id: 'build',
    index: '/03',
    titleKey: 'process.build.title',
    descriptionKey: 'process.build.description',
    metaKey: 'process.build.meta',
    tone: 'teal' as const,
  },
  {
    id: 'ship',
    index: '/04',
    titleKey: 'process.ship.title',
    descriptionKey: 'process.ship.description',
    metaKey: 'process.ship.meta',
    tone: 'amber' as const,
  },
] as const

export const PRICING_PLANS = [
  {
    id: 'fixed',
    titleKey: 'pricing.fixed.title',
    priceKey: 'pricing.fixed.price',
    descriptionKey: 'pricing.fixed.description',
    featureKeys: ['pricing.fixed.feature1', 'pricing.fixed.feature2', 'pricing.fixed.feature3'],
  },
  {
    id: 'monthly',
    titleKey: 'pricing.monthly.title',
    priceKey: 'pricing.monthly.price',
    descriptionKey: 'pricing.monthly.description',
    featureKeys: [
      'pricing.monthly.feature1',
      'pricing.monthly.feature2',
      'pricing.monthly.feature3',
    ],
    badgeKey: 'pricing.monthly.badge',
    featured: true,
  },
  {
    id: 'sprint',
    titleKey: 'pricing.sprint.title',
    priceKey: 'pricing.sprint.price',
    descriptionKey: 'pricing.sprint.description',
    featureKeys: ['pricing.sprint.feature1', 'pricing.sprint.feature2', 'pricing.sprint.feature3'],
  },
] as const

export const FAQ_ITEMS = [
  { id: 'onePerson', questionKey: 'faq.onePerson.q', answerKey: 'faq.onePerson.a' },
  { id: 'designDev', questionKey: 'faq.designDev.q', answerKey: 'faq.designDev.a' },
  { id: 'platforms', questionKey: 'faq.platforms.q', answerKey: 'faq.platforms.a' },
  { id: 'duration', questionKey: 'faq.duration.q', answerKey: 'faq.duration.a' },
  { id: 'ownership', questionKey: 'faq.ownership.q', answerKey: 'faq.ownership.a' },
  { id: 'location', questionKey: 'faq.location.q', answerKey: 'faq.location.a' },
] as const

/**
 * Brojke u traci ispod hero-a.
 *
 * `value` je broj, ne string — traka ga odbrojava, pa mora biti računljiv.
 * `suffix` se renderuje prigušeno da broj ostane nosilac.
 */
export interface StudioMetric {
  id: string
  value: number
  decimals: number
  suffix: string
  labelKey: string
}

export const STUDIO_METRICS: readonly StudioMetric[] = [
  { id: 'uptime', value: 99.95, decimals: 2, suffix: '%', labelKey: 'insight.stats.uptime' },
  { id: 'response', value: 48, decimals: 0, suffix: 'h', labelKey: 'insight.stats.response' },
  { id: 'products', value: 12, decimals: 0, suffix: '+', labelKey: 'insight.stats.products' },
  { id: 'years', value: 6, decimals: 0, suffix: '', labelKey: 'insight.stats.years' },
]
