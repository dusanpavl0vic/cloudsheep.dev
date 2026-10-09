import type { ProjectCategory, ProjectSummary } from '@/types/project'

/**
 * Projekti za početnu: prvo istaknuti (`isFeatured`), pa ostali — redosled iz admin-a se
 * čuva unutar obe grupe. Bez ijednog istaknutog, početna ipak prikazuje prvih `count`.
 */
export const pickFeatured = (projects: readonly ProjectSummary[], count: number) =>
  [...projects.filter((p) => p.isFeatured), ...projects.filter((p) => !p.isFeatured)].slice(0, count)

/** Broj projekata po kategoriji — za filter (`Web 4`). Kategorije bez projekata se ne vraćaju. */
export const countByCategory = (projects: readonly ProjectSummary[]) => {
  const counts = new Map<ProjectCategory, number>()
  for (const p of projects) counts.set(p.category, (counts.get(p.category) ?? 0) + 1)
  return counts
}

/** Redni broj u dizajnu: `/ 01`. */
export const ordinal = (index: number) => `/ ${String(index + 1).padStart(2, '0')}`
