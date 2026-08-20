/**
 * Pozadina hero sekcije — mirno svetlo, bez šare.
 *
 * Prethodne dve verzije su otpale iz istog razloga: bile su **uzorak koji se kreće**.
 * Oblaci su promicali po dijagonali, mreža je klizila po Z osi — oboje vuče pogled sa
 * naslova i na slabijem uređaju se trza, jer se animira `background-position`
 * (svaki kadar je novo crtanje cele površine, ne compositor).
 *
 * Sada su to dva statična radijalna gradijenta. Ništa se ne pomera samo od sebe;
 * jedino svetlo prati kursor, a ono je `transform`/`mask`, dakle jeftino.
 */

/**
 * Topli sjaj gore-levo i hladniji dole-desno — dubina bez ijedne linije.
 *
 * Vrednost živi u `@/lib/ambient`, jer isti sjaj nosi i 404 stranica, a feature ne sme da
 * uvozi feature. Re-eksport stoji da `HeroSection.tsx` i dalje uvozi sve iz jednog mesta.
 */
export { AMBIENT_GLOW } from '@/lib/ambient'

/**
 * Svetlo koje prati kursor.
 *
 * Pozicija dolazi iz `--mx`/`--my` koje `mousemove` postavlja direktno na stil čvora —
 * bez rerendera. Podrazumevano je van ekrana, pa je ugašeno dok se miš ne pojavi.
 */
export const CURSOR_GLOW =
  'radial-gradient(circle 320px at var(--mx, -600px) var(--my, -600px), color-mix(in oklch, var(--color-primary) 16%, transparent) 0%, transparent 70%)'
