import { cva } from 'class-variance-authority'

/**
 * Traka sa brojkama (docs/22).
 *
 * Ranije je ovde bila bento mreža: plava CTA kartica plus panel sa prstenom. Kartica je
 * ponavljala poziv koji `ContactSection` na dnu već nosi — dva CTA-a na istoj stranici se
 * međusobno poništavaju. Prsten je nosio jednu brojku i tražio pola sekcije za nju.
 *
 * Sada je jedan red: četiri brojke razdvojene tankim uspravnim linijama, bez ijedne kartice.
 */
export const statStripVariants = cva('grid grid-cols-2 gap-y-10 lg:grid-cols-4 lg:gap-y-0')

/**
 * Razdelnik je `::before` na stavci, ne `border-l` — tako prva u redu ostaje bez linije
 * na svakom breakpointu, a da se ne računa indeks u JSX-u.
 */
export const statItemVariants = cva(
  "relative flex flex-col items-center gap-1.5 px-4 text-center before:absolute before:inset-y-1 before:left-0 before:w-px before:bg-border before:content-[''] [&:nth-child(odd)]:before:hidden lg:[&:nth-child(odd)]:before:block lg:[&:first-child]:before:hidden",
)

export const statValueVariants = cva(
  'font-heading text-[clamp(2.1rem,4vw,2.9rem)] leading-none font-bold tracking-[-0.03em] tabular-nums text-display',
)

/** Sufiks (`%`, `h`, `+`) je prigušen da broj ostane nosilac. */
export const statSuffixVariants = cva('text-faint')

export const statLabelVariants = cva(
  'font-mono text-[11.5px] tracking-[0.1em] text-faint lowercase',
)
