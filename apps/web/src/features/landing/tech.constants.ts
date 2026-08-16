/**
 * Tehnologije — sadržaj kao PODATAK, ne ponovljeni JSX (`apps/web/CLAUDE.md`).
 *
 * `icon` je putanja do fajla u `public/tech/`, ne inline SVG. Obojeni brend logotipi ne mogu
 * kroz `currentColor`, a inline bi ih ubacio u JS bundle gde nema mesta (docs/07 §6).
 * Ovako ih browser kešira odvojeno i koštaju nula u initial chunk-u.
 *
 * **Spisak prati fajlove na disku.** Tehnologija bez logotipa se ne navodi — pločica sa
 * inicijalom pored pravih logotipa izgleda kao greška, ne kao izbor.
 * Dodavanje: `public/tech/<id>.svg` + jedan red ovde.
 *
 * Provera usklađenosti: `node scripts/check-tech-icons.mjs`
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
  tech('javascript', 'JavaScript', 'frontend'),
  tech('nextjs', 'Next.js', 'frontend'),

  tech('nodejs', 'Node.js', 'backend'),
  tech('dotnet', '.NET', 'backend'),
  tech('csharp', 'C#', 'backend'),
  tech('graphql', 'GraphQL', 'backend'),
  tech('postgresql', 'PostgreSQL', 'backend'),
  tech('mongodb', 'MongoDB', 'backend'),
  tech('redis', 'Redis', 'backend'),

  tech('reactnative', 'React Native', 'mobile'),

  tech('docker', 'Docker', 'tooling'),
  tech('github', 'GitHub', 'tooling'),
  tech('chrome', 'Chrome DevTools', 'tooling'),

  tech('figma', 'Figma', 'design'),
]

/** Istaknute u hero karticama — ostatak nosi mreža i traka. */
export const FEATURED_TECH = TECH_ITEMS.filter((item) =>
  ['react', 'typescript', 'nodejs'].includes(item.id),
)
