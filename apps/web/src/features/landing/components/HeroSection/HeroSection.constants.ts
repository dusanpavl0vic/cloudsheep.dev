/**
 * Pozadina hero sekcije — perspektivna mreža koja beži u horizont.
 *
 * Sve je CSS: dva `repeating-linear-gradient` sloja u kontejneru sa `perspective` + `rotateX`.
 * Nula bajtova u JS bundle-u, i nema DOM čvorova po liniji mreže.
 *
 * Boje idu kroz `currentColor`, ne kroz hex. Prethodna verzija (oblaci) je imala hardkodovan
 * `#133E87` i `#1E56E0`, pa je u tamnoj temi crtala svetloplavo po tamnoplavom — nevidljivo.
 */

/** Razmak linija mreže. Isti broj koristi `cs-grid-drift` da bi petlja bila neprimetna. */
export const GRID_CELL = '56px'

/** Vertikale + horizontale. `currentColor` uzima boju od kontejnera, pa tema radi sama. */
export const GRID_LINES = [
  `repeating-linear-gradient(to right, currentColor 0 1px, transparent 1px ${GRID_CELL})`,
  `repeating-linear-gradient(to bottom, currentColor 0 1px, transparent 1px ${GRID_CELL})`,
].join(', ')

/**
 * Gasi mrežu ka horizontu, da ne bi izgledala kao milimetarski papir.
 * Bez ovoga perspektiva deluje kao greška, a ne kao dubina.
 */
export const GRID_FADE =
  'linear-gradient(to bottom, transparent 0%, #000 22%, #000 55%, transparent 88%)'

/**
 * Svetlo koje prati kursor. Pozicija dolazi iz `--mx`/`--my` koje `mousemove` postavlja
 * direktno na stil čvora — bez rerendera po pomeraju miša.
 *
 * Podrazumevano je van ekrana (`-600px`), pa je svetlo ugašeno dok se miš ne pojavi.
 */
export const SPOTLIGHT_MASK =
  'radial-gradient(circle 260px at var(--mx, -600px) var(--my, -600px), #000 0%, rgb(0 0 0 / 0.45) 45%, transparent 72%)'

/** Meka izmaglica iza teksta — odvaja naslov od mreže bez pune podloge. */
export const TEXT_HALO =
  'radial-gradient(ellipse 62% 46% at 50% 46%, var(--background) 0%, var(--background) 38%, transparent 78%)'
