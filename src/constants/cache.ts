/**
 * Tagovi serverskog keša podataka (`unstable_cache`). Admin izmena poziva `revalidateTag`,
 * pa javna stranica vidi novo stanje bez rebuild-a (docs/11-data-fetching.md §2).
 *
 * Ovo NISU RTK Query tagovi (`API_TAGS`) — ti žive u pregledaču, ovi na serveru.
 */
export const CACHE_TAGS = {
  PROFILE: 'profile',
  PROJECTS: 'projects',
  TECHNOLOGIES: 'technologies',
  TEAM: 'team',
  NOTES: 'notes',
  TESTIMONIALS: 'testimonials',
  SLOTS: 'slots',
} as const

export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS]

/** Gornja granica starosti keša, za slučaj da revalidacija negde izostane. */
export const CACHE_REVALIDATE_S = 60 * 60
