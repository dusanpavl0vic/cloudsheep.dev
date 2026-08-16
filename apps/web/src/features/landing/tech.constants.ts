import type { TechIconId } from './components/TechMarquee/TechIcon'

/**
 * Tehnologije u traci — sadržaj kao PODATAK, ne ponovljeni JSX (`apps/web/CLAUDE.md`).
 *
 * `label` je namerno običan string, ne i18n ključ: nazivi tehnologija se ne prevode.
 * Dodavanje tehnologije = jedan objekat ovde + jedna ikona u `TECH_ICONS`.
 */
export interface TechItem {
  id: TechIconId
  label: string
}

export const TECH_ITEMS: readonly TechItem[] = [
  { id: 'react', label: 'React' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'next', label: 'Next.js' },
  { id: 'node', label: 'Node.js' },
  { id: 'postgres', label: 'PostgreSQL' },
  { id: 'mongo', label: 'MongoDB' },
  { id: 'reactNative', label: 'React Native' },
  { id: 'kotlin', label: 'Kotlin' },
  { id: 'swift', label: 'Swift' },
  { id: 'tailwind', label: 'Tailwind CSS' },
  { id: 'vitest', label: 'Vitest' },
  { id: 'figma', label: 'Figma' },
]
