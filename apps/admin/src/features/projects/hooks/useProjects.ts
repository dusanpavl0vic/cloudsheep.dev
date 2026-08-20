import { useAdminProjectsQuery } from '../api/projectsApi'
import type { AdminProject } from '../types'

/**
 * Modul-konstanta, ne `data?.items ?? []`.
 *
 * `?? []` pravi NOV niz na svaki render, pa svaka komponenta koja ga dobija kroz props
 * ponovo renderuje bez razloga — a `useMemo` da se to zaobiđe bio bi memoizacija koju
 * `docs/07 §2` ne dozvoljava. Jedna zamrznuta konstanta rešava oboje.
 */
const EMPTY_PROJECTS: readonly AdminProject[] = []

export function useProjects() {
  const { data, isLoading, error } = useAdminProjectsQuery(undefined)

  return {
    projects: data?.items ?? EMPTY_PROJECTS,
    isLoading,
    error,
  }
}
