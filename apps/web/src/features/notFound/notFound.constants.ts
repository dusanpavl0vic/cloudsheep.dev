import type { CSSProperties } from 'react'

/**
 * Pozicije lebdećih kartica, isti obrazac kao `FLOAT_POSITION` u hero-u.
 *
 * Tri, ne pet: naslov `404` je viši od hero naslova, a strana ne sme da skroluje — sa pet
 * kartica bi se sudarale sa gigantom u sredini i sa stazom kojom ovca hoda.
 *
 * `bottom` vrednosti stoje IZNAD staze (`bottom-8`, visina `h-16`, dakle do ~96px), pa
 * kartica ne seda ovci na put.
 */
export const CARD_POSITION: Record<string, CSSProperties> = {
  note: { top: '15%', left: '4%', rotate: '-6deg' },
  status: { top: '21%', right: '6%', rotate: '-4deg' },
  log: { bottom: '17%', right: '4%', rotate: '3deg' },
}

/**
 * Redovi u kartici sa zahtevima. **Nisu podaci** — to je ilustracija onoga što se upravo
 * desilo: dve rute postoje, treća ne.
 *
 * Putanje i kodovi nisu prevodivi, pa stoje ovde a ne u i18n-u: `/projects` je `/projects`
 * na svakom jeziku, i `404` je numeral.
 */
export const REQUEST_LOG = [
  { path: '/', code: '200', failed: false },
  { path: '/projects', code: '200', failed: false },
  { path: '/this-page', code: '404', failed: true },
] as const
