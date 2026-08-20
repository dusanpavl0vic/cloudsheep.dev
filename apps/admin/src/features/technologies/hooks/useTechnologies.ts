import { useTechnologiesQuery } from '../api/technologiesApi'
import type { Technology } from '../types'

/** Modul-konstanta, ne `?? []` — inače je svaki render nov niz (docs/07 §2). */
const EMPTY: readonly Technology[] = []

export function useTechnologies() {
  const { data, isLoading, error } = useTechnologiesQuery(undefined)

  return { technologies: data?.items ?? EMPTY, isLoading, error }
}
