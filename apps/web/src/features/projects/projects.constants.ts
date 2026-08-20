/**
 * Kategorije po kojima se filtrira mreža projekata.
 *
 * Sam spisak projekata više NIJE ovde — živi u bazi i stiže sa API-ja kroz route loader
 * (`api/projectsApi.ts`). Ostale su samo kategorije, jer one nisu podatak nego deo UI-ja:
 * dugmad filtera se renderuju iz ovog niza, a svaka vrednost je i i18n ključ
 * (`projects.filters.fullStack`).
 */
export const PROJECT_CATEGORIES = ['all', 'frontend', 'backend', 'fullStack', 'openSource'] as const

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number]
