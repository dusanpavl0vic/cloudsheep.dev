import type { Project, Technology } from '@/features/projects'
import { fetchProjects, fetchTechnologies } from '@/features/projects/api/projectsApi'
import { fetchSite, fetchTeam, type SiteProfile, type TeamMember } from '@/lib/siteApi'
import type { ProjectPageData } from '@/pages/ProjectPage'

/**
 * Podaci se traže u loader-u, PRE rendera — ne u `useEffect`-u posle njega.
 *
 * To nije zaobilaženje pravila iz `docs/07 §3` nego njegovo ispunjenje: nema bljeska
 * praznog sadržaja, nema `isLoading` grananja u komponenti, a stanje učitavanja daje
 * `useNavigation()` na nivou rute (ADR 0009).
 */
export const projectsLoader = (): Promise<Project[]> => fetchProjects()

/**
 * Izdvojeni projekti za početnu stranu.
 *
 * Zamenjuje `PROJECTS.slice(0, 3)` — broj više nije fiksan nego zavisi od toga šta je u
 * adminu označeno kao izdvojeno. `slice(0, 3)` je ostao kao GRANICA, ne kao definicija:
 * ako se označi šest projekata, početna strana ne postaje beskonačna.
 */
export const featuredLoader = async (): Promise<{
  featured: Project[]
  technologies: Technology[]
  site: SiteProfile
  team: TeamMember[]
}> => {
  // Paralelno: četiri nezavisna zahteva, pa ih ne treba lančati
  const [projects, technologies, site, team] = await Promise.all([
    fetchProjects(),
    fetchTechnologies(),
    fetchSite(),
    fetchTeam(),
  ])

  return {
    featured: projects.filter((p) => p.isFeatured).slice(0, 3),
    technologies,
    site,
    team,
  }
}

/**
 * Detaljna stranica čita iz LISTE, ne sa `/projects/:slug`.
 *
 * Jedan zahtev umesto dva: ista lista daje i traženi projekat i „sledeći po redu". Za
 * desetak projekata je to jeftinije od drugog kruga do servera. Kad ih bude sto, ovde ide
 * `fetchProject(slug)` uz zaseban poziv za susedni.
 */
export async function projectLoader({
  params,
}: {
  params: { slug?: string }
}): Promise<ProjectPageData> {
  const projects = await fetchProjects()
  const index = projects.findIndex((p) => p.slug === params.slug)

  /*
   * `throw new Response`, ne `return null`.
   *
   * To je ugovor React Router-a: bačen `Response` hvata `errorElement` i zadržava status,
   * pa nepostojeći projekat daje pravi 404 umesto prazne kutije sa HTTP 200. ESLint pravilo
   * `only-throw-error` to ne zna — ono traži `Error`, koji bi ovde izgubio status.
   */
  // eslint-disable-next-line @typescript-eslint/only-throw-error -- vidi gore
  if (index === -1) throw new Response('Not Found', { status: 404 })

  const project = projects[index]
  // eslint-disable-next-line @typescript-eslint/only-throw-error -- vidi gore
  if (!project) throw new Response('Not Found', { status: 404 })

  return {
    project,
    next: projects.length > 1 ? (projects[(index + 1) % projects.length] ?? null) : null,
  }
}

/**
 * Podaci ljuske — profil i kontakt linkovi.
 *
 * Stoje na LAYOUT ruti, ne na svakoj pojedinačnoj: podnožje je na svakoj stranici, pa bi
 * ponavljanje po ruti značilo isti zahtev pet puta i pet mesta da se zaboravi.
 */
export const siteLoader = (): Promise<SiteProfile> => fetchSite()
