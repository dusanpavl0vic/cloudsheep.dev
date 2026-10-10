import { HOME_SECTIONS } from '@/constants/routes'

/** Fraze terminala — ključevi u `home.hero.terms`. */
export const TERM_KEYS = ['whoami', 'stack', 'status', 'work'] as const

export type ThoughtKind = 'note' | 'tasks' | 'deploy' | 'score' | 'stack'

export interface ThoughtPlacement {
  kind: ThoughtKind
  position: { top?: string; bottom?: string; left?: string; right?: string }
  rotate: string
  /** Pomeraj za parallax kursora (px na ivici ekrana); negativan ide suprotno. */
  depth: number
  driftS: number
}

/** Pet oblaka oko naslova (dizajn `POS`): položaj, nagib, dubina, trajanje lebdenja. */
export const THOUGHTS: readonly ThoughtPlacement[] = [
  { kind: 'note', position: { top: '12%', left: '3%' }, rotate: '-6deg', depth: 26, driftS: 9 },
  { kind: 'tasks', position: { bottom: '13%', left: '3.5%' }, rotate: '3deg', depth: -18, driftS: 10 },
  { kind: 'deploy', position: { top: '17%', right: '4%' }, rotate: '4deg', depth: -28, driftS: 8.5 },
  { kind: 'score', position: { top: '45%', right: '9.5%' }, rotate: '-3deg', depth: 16, driftS: 11 },
  { kind: 'stack', position: { bottom: '14%', right: '3.5%' }, rotate: '-4deg', depth: -12, driftS: 9.5 },
]

/** Kašnjenje pojavljivanja oblaka: prvi posle 0,9 s, svaki sledeći 0,14 s kasnije. */
export const thoughtDelay = (index: number) => 0.9 + index * 0.14 + 0.26

/** Reči naslova se podižu jedna za drugom (dizajn: start 0,15 s, korak 0,09 s). */
export const WORD_START_S = 0.15
export const WORD_STEP_S = 0.09

/** Strelica „SCROLL" vodi na prvu sekciju posle hero-a. */
export const SCROLL_TARGET = `#${HOME_SECTIONS.INSIGHT}`

/** Trake zadataka u oblaku „in progress". */
export const TASKS = [
  { key: 'taskShip', width: '82%', tone: 'deep' },
  { key: 'taskReview', width: '46%', tone: 'blue' },
] as const
