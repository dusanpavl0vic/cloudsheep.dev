/**
 * Tipovi i pomoćne funkcije za podatke ljuske — **bez zoda**.
 *
 * Razdvojeno od `siteApi.ts` namerno: podnožje je u početnom chunk-u, a uvoz bilo koje
 * VREDNOSTI iz modula koji uvozi zod vratio bi ~18 KB u početni bundle i oborio budžet.
 * `export type` se pri buildu briše, pa tipovi ne nose nikakvu težinu.
 *
 * Šeme i `fetch` su u `siteApi.ts` i uvoze ih samo route loader-i.
 */
export type { SiteLink, SiteProfile, TeamMember } from './siteApi'

import type { SiteLink, SiteProfile } from './siteApi'

/** Prvi `email` link — podnožje ga prikazuje odvojeno od ostalih. */
export const emailOf = (site: SiteProfile): SiteLink | undefined =>
  site.links.find((link) => link.platform === 'email')
