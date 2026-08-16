/**
 * Sadržaj landing stranice kao podaci — sekcije ga renderuju kroz `.map()`.
 * Tekstovi idu preko i18n ključeva; tehnološke oznake su nazivi alata (ne prevode se).
 * Portfolio radovi žive u `features/projects/projects.constants.ts`.
 */

export const HERO_TERMINAL_KEYS = [
  'hero.term1',
  'hero.term2',
  'hero.term3',
  'hero.term4',
] as const

export const HERO_STATS = [
  { id: 'years', valueKey: 'studio.stats.yearsValue', labelKey: 'studio.stats.yearsLabel', tone: 'primary' },
  { id: 'products', valueKey: 'studio.stats.productsValue', labelKey: 'studio.stats.productsLabel', tone: 'primary' },
  { id: 'platforms', valueKey: 'studio.stats.platformsValue', labelKey: 'studio.stats.platformsLabel', tone: 'primary' },
  { id: 'person', valueKey: 'studio.stats.personValue', labelKey: 'studio.stats.personLabel', tone: 'accent' },
] as const

export const TECH_STACK = [
  { id: 'frontend', labelKey: 'studio.stack.frontend', tags: ['React', 'Next.js', 'TypeScript'] },
  { id: 'backend', labelKey: 'studio.stack.backend', tags: ['Node.js', 'PostgreSQL', 'MongoDB'] },
  { id: 'mobile', labelKey: 'studio.stack.mobile', tags: ['React Native', 'Kotlin', 'Swift'] },
  { id: 'design', labelKey: 'studio.stack.design', tags: ['Figma', 'Design systems', 'Prototyping'] },
] as const

export const DISCIPLINES = [
  {
    id: 'design',
    index: '/01 design',
    titleKey: 'services.design.title',
    descriptionKey: 'services.design.description',
    tags: ['ux/ui', 'design systems', 'prototyping'],
  },
  {
    id: 'web',
    index: '/02 web',
    titleKey: 'services.web.title',
    descriptionKey: 'services.web.description',
    tags: ['next.js', 'typescript', 'postgresql'],
  },
  {
    id: 'mobile',
    index: '/03 mobile',
    titleKey: 'services.mobile.title',
    descriptionKey: 'services.mobile.description',
    tags: ['react native', 'kotlin', 'swift'],
  },
  {
    id: 'ops',
    index: '/04 ops',
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
    featureKeys: ['pricing.monthly.feature1', 'pricing.monthly.feature2', 'pricing.monthly.feature3'],
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
