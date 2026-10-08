/**
 * Četiri mrlje aurore iz dizajna: položaj, veličina, boja (token) i putanja kretanja.
 * Kretanje je CSS animacija (alternate, beskonačno) — dizajn je koristio JS, ovde je nula JS-a.
 */
export const AURORA_BLOBS = [
  { size: '62vw', left: '-14vw', top: '-22vw', color: 'aurora1', blur: 90, dx: '8vw', dy: '6vh', scale: 1.15, durationS: 18 },
  { size: '48vw', right: '-12vw', top: '4vw', color: 'aurora2', blur: 90, dx: '-10vw', dy: '8vh', scale: 0.9, durationS: 22 },
  { size: '44vw', left: '22vw', top: '38vh', color: 'aurora3', blur: 100, dx: '6vw', dy: '-8vh', scale: 1.1, durationS: 20 },
  { size: '36vw', right: '6vw', bottom: '-16vw', color: 'aurora4', blur: 100, dx: '-6vw', dy: '-5vh', scale: 1.2, durationS: 16 },
] as const

export type AuroraBlob = (typeof AURORA_BLOBS)[number]
