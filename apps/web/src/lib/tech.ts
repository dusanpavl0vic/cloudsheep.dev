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
 *
 * **Zašto `lib/`, a ne `features/landing/`:** spisak sada traže dva feature-a — `landing`
 * ga crta u mreži i traci, `projects` iz njega vadi logotipe za tagove. Feature ne sme da
 * uvozi iz feature-a (`/CLAUDE.md`), pa deljeno unutar app-e ide u `lib/`, isto kao
 * `lib/navigation.ts`.
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

/**
 * `'Next.js'` i `'next.js'` i `'React Native'` vode na isti unos.
 *
 * Tagovi projekata su slobodan tekst (`projects.constants.ts`), a discipline ih pišu malim
 * slovima — pa poređenje mora da pređe preko velikih slova, tačaka i razmaka. Bez ovoga bi
 * poklapanje zavisilo od toga da li je neko otkucao `Node.js` ili `node.js`.
 */
const normalize = (value: string) => value.toLowerCase().replace(/[\s.\-_]/g, '')

const ICON_BY_LABEL = new Map(TECH_ITEMS.map((item) => [normalize(item.label), item.icon]))

/**
 * Logotip za slobodan tekst taga — `'Next.js'` → `/tech/nextjs.svg`.
 *
 * Vraća `undefined` kad tehnologija nema logotip (npr. `GTFS`, `Stripe`); pozivalac tada
 * renderuje samo tekst. Namerno bez rezerve sa inicijalom: u sitnom tagu bi slovo u kružiću
 * izgledalo kao pokvaren logo, a ne kao izbor.
 */
export const techIconFor = (label: string): string | undefined =>
  ICON_BY_LABEL.get(normalize(label))

/**
 * Spisak tagova → oblik koji `TagList` očekuje.
 *
 * Stoji ovde, a ne u komponentama, da se isti `.map()` ne bi ponovio na tri mesta i da
 * `TagList` ostao bez znanja o tome koja tehnologija ima koji logotip.
 */
export const techTags = (labels: readonly string[]) =>
  labels.map((label) => ({ label, icon: techIconFor(label) }))
