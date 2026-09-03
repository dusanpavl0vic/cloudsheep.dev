import type { CSSProperties } from 'react'

type Tail = 'tl' | 'tr' | 'bl' | 'br'

/**
 * Pozicije lebdećih misli, isti obrazac kao `FLOAT_POSITION` u hero-u.
 *
 * Tri, ne pet: naslov `404` je viši od hero naslova, a strana ne sme da skroluje — sa pet
 * oblačića bi se sudarali sa gigantom u sredini i sa stazom kojom ovca hoda.
 *
 * `bottom` vrednosti stoje IZNAD staze (`bottom-8`, visina `h-16`, dakle do ~96px), pa
 * oblačić ne seda ovci na put.
 *
 * Rep gleda ka naslovu (docs/22 §3b), pa smer stoji uz poziciju: misao gore-levo nosi rep u
 * donjem-desnom uglu, misli desno nose rep na levoj strani.
 */
export const THOUGHT_POSITION: Record<string, { style: CSSProperties; tail: Tail }> = {
  note: { style: { top: '15%', left: '4%', rotate: '-6deg' }, tail: 'br' },
  status: { style: { top: '21%', right: '6%', rotate: '-4deg' }, tail: 'bl' },
  log: { style: { bottom: '17%', right: '4%', rotate: '3deg' }, tail: 'tl' },
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
