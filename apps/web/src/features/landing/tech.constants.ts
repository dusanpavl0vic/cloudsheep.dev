/**
 * Tehnologije — sadržaj kao PODATAK, ne ponovljeni JSX (`apps/web/CLAUDE.md`).
 *
 * `icon` je putanja do fajla u `public/tech/`, ne inline SVG. Obojeni brend logotipi ne mogu
 * kroz `currentColor`, a inline bi ih ubacio u JS bundle gde nema mesta (docs/07 §6).
 * Ovako ih browser kešira odvojeno i koštaju nula u initial chunk-u.
 *
 * Dodavanje tehnologije = jedan red ovde + `public/tech/<id>.svg`.
 * Ako fajl fali, `TechTile` prikazuje inicijal — nikad rupu u rasporedu.
 */
export interface TechItem {
  id: string
  label: string
  group: 'frontend' | 'backend' | 'mobile' | 'tooling' | 'design'
  icon: string
}

const tech = (id: string, label: string, group: TechItem['group']): TechItem => ({
  id,
  label,
  group,
  icon: `/tech/${id}.svg`,
})

export const TECH_ITEMS: readonly TechItem[] = [
  tech('react', 'React', 'frontend'),
  tech('typescript', 'TypeScript', 'frontend'),
  tech('nextjs', 'Next.js', 'frontend'),
  tech('tailwind', 'Tailwind', 'frontend'),
  tech('redux', 'Redux', 'frontend'),
  tech('vite', 'Vite', 'frontend'),

  tech('nodejs', 'Node.js', 'backend'),
  tech('dotnet', '.NET', 'backend'),
  tech('csharp', 'C#', 'backend'),
  tech('postgresql', 'PostgreSQL', 'backend'),
  tech('mongodb', 'MongoDB', 'backend'),
  tech('redis', 'Redis', 'backend'),
  tech('graphql', 'GraphQL', 'backend'),

  tech('reactnative', 'React Native', 'mobile'),
  tech('kotlin', 'Kotlin', 'mobile'),
  tech('swift', 'Swift', 'mobile'),

  tech('docker', 'Docker', 'tooling'),
  tech('git', 'Git', 'tooling'),
  tech('github', 'GitHub', 'tooling'),
  tech('vitest', 'Vitest', 'tooling'),
  tech('playwright', 'Playwright', 'tooling'),
  tech('vercel', 'Vercel', 'tooling'),

  tech('figma', 'Figma', 'design'),
]

/** Istaknute u hero karticama — ostatak nosi mreža i traka. */
export const FEATURED_TECH = TECH_ITEMS.filter((item) =>
  ['react', 'typescript', 'nodejs'].includes(item.id),
)
