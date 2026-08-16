import { cva } from 'class-variance-authority'

/**
 * Papir.
 *
 * `bg-plate` i `text-plate-ink` idu zajedno: podloga se ne invertuje, pa ni mastilo ne
 * sme — `text-foreground` bi u tamnoj temi postao skoro beo i nestao sa svetlog papira.
 *
 * Blago zarotiran, kao dokument spušten na sto. `rotate` ne utiče na raspored, pa ništa
 * oko njega ne skače.
 */
export const paperVariants = cva(
  'relative isolate mx-auto w-full max-w-[560px] rotate-[-0.6deg] rounded-sm bg-plate px-7 py-6 text-start text-plate-ink shadow-[0_1px_2px_rgb(0_0_0/0.06),0_18px_40px_-14px_rgb(0_0_0/0.28)] sm:px-9 sm:py-8',
)

/**
 * Uokvireno polje na papiru — tanka linija uvučena od ivice, kao na štampanoj diplomi.
 *
 * Ivica je ovde **namerna, uprkos `docs/22 §3`**: diploma bez uokvirenog polja nije
 * dokument nego kartica. Zato linija, a papir ispod nje i dalje nosi senku, ne drugu ivicu.
 */
export const paperFrameVariants = cva(
  'relative flex flex-col gap-3 border border-plate-line/70 px-5 py-6 sm:px-7 sm:py-7',
)

/**
 * Hrapavost papira — isti `radial-gradient` idiom kao tačkasta tekstura sekcija
 * (`docs/22 §6`), samo gušći i bleđi da čita kao zrno, a ne kao uzorak. Statičan.
 */
export const paperGrainVariants = cva(
  "pointer-events-none absolute inset-0 -z-10 rounded-sm bg-[radial-gradient(currentColor_0.5px,transparent_0.5px)] bg-[length:6px_6px] text-plate-ink/10 content-['']",
)

/** Ustanova iznad zvanja — razmaknuta verzalna linija, kao zaglavlje dokumenta. */
export const paperUniversityVariants = cva(
  'font-mono text-[10.5px] tracking-[0.22em] text-plate-ink-muted uppercase',
)

/** Zvanje — nosivi podatak dokumenta, pa ide u naslovnom fontu i punom mastilu. */
export const paperDegreeVariants = cva(
  'font-heading text-[clamp(1.05rem,2.4vw,1.35rem)] leading-tight font-bold text-balance',
)

export const paperProgrammeVariants = cva('text-[14px] leading-snug text-plate-ink')

/** Linija iznad podnožja — deli zvanje od podataka o ustanovi. */
export const paperRuleVariants = cva('mt-1 h-px w-full bg-plate-line/60')

export const paperFooterVariants = cva(
  'flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11.5px] text-plate-ink-muted',
)

export const paperFooterSepVariants = cva('text-plate-line')

/**
 * Grb kao pečat — otisnut PREKO sadržaja, ne poređan pored njega.
 *
 * Zato `absolute` i zarotiran: pečat na dokumentu nikad ne stoji uspravno ni u koloni sa
 * tekstom. Providan je da se linija ispod njega nazire, kao kod otiska mastilom.
 *
 * `-end-2` ga gura preko desne ivice okvira — bez toga bi izgledao kao ikonica u uglu.
 */
export const paperStampVariants = cva(
  'pointer-events-none absolute -end-2 -bottom-3 size-[86px] rotate-[-11deg] opacity-[0.82] mix-blend-multiply sm:size-[104px]',
)

export const paperStampImageVariants = cva('size-full object-contain')
