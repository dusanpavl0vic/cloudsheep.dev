/**
 * Ambijentalni sjaj — pozadina hero sekcije i 404 stranice.
 *
 * Stoji u `lib/`, a ne u jednom od dva feature-a, jer ga koriste **oba**: `landing` i
 * `notFound`. Feature ne sme da uvozi feature (root CLAUDE.md), a kopija gradijenata u dva
 * fajla bi se razišla prvom izmenom palete.
 *
 * Tri statična radijalna gradijenta. **Ništa se ne pomera samo od sebe** — dve prethodne
 * verzije hero pozadine su otpale baš zato što su bile uzorak koji se kreće: animira se
 * `background-position`, pa je svaki kadar novo crtanje cele površine, ne compositor.
 */
export const AMBIENT_GLOW = [
  'radial-gradient(ellipse 90% 60% at 18% 0%, color-mix(in oklch, var(--color-primary) 14%, transparent) 0%, transparent 60%)',
  'radial-gradient(ellipse 70% 50% at 86% 18%, color-mix(in oklch, var(--color-accent) 10%, transparent) 0%, transparent 58%)',
  'radial-gradient(ellipse 80% 55% at 50% 108%, color-mix(in oklch, var(--color-primary) 9%, transparent) 0%, transparent 62%)',
].join(', ')
