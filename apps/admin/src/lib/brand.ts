/**
 * Nazivi koji se NE prevode.
 *
 * Postoje kao konstante, a ne kao literali u JSX-u, da bi `i18next/no-literal-string`
 * ostao uključen kao greška. Isti obrazac kao `BRAND` u `apps/web/src/lib/glyphs.ts`.
 */
export const BRAND = {
  NAME: 'CloudSheep',
} as const
