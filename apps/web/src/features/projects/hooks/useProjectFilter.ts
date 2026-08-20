import { useSearchParams } from 'react-router'

import { PROJECT_CATEGORIES, type ProjectCategory } from '../projects.constants'
import type { Project } from '../types'

const PARAM = 'category'

const isCategory = (value: string | null): value is ProjectCategory =>
  value !== null && (PROJECT_CATEGORIES as readonly string[]).includes(value)

/**
 * Filter po kategoriji, sa stanjem u URL-u.
 *
 * Ranije je ovo bio `useState` u `ProjectsPage`, što je značilo da se filtrirani pogled ne
 * može ni podeliti linkom ni indeksirati, i da se gubi pri povratku unazad. `docs/04` i
 * `docs/05` zato traže `useSearchParams` za filtere.
 *
 * Filtriranje je na klijentu: sajt ionako povuče sve projekte za početnu stranu, pa je
 * server-side upit jedan zahtev više za posao koji traje mikrosekunde.
 */
export function useProjectFilter(projects: readonly Project[]) {
  const [params, setParams] = useSearchParams()

  const raw = params.get(PARAM)
  // Nepoznata vrednost u URL-u se tretira kao „sve" umesto da isprazni stranicu
  const active: ProjectCategory = isCategory(raw) ? raw : 'all'

  const visible = active === 'all' ? projects : projects.filter((p) => p.category === active)

  const setCategory = (category: ProjectCategory) => {
    // „sve" ne ostavlja parametar u URL-u — čist link je podrazumevano stanje
    setParams(category === 'all' ? {} : { [PARAM]: category }, { replace: true })
  }

  return { active, visible, setCategory }
}
