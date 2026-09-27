import { cva } from 'class-variance-authority'

import { glassVariants } from '@app/ui'

/**
 * Disciplina kao PANEL, ne kao red u tabeli.
 *
 * Prethodna verzija je bila lista od četiri reda sa rasporedom `110px 1.1fr 1.4fr 40px`:
 * naslov levo, opis daleko desno, a između šuplja traka koja je na širokom ekranu bila
 * trećina reda. Čitalo se kao izvoz iz tabele, i imalo strelicu „→" koja je obećavala klik
 * na `<article>` bez ikakve akcije. Strelice više nema — lažna afordansa je gora od nikakve.
 *
 * `isolate` je obavezan: duh-numeral i svetlo stoje na `-z-10`, a bez novog konteksta
 * slaganja `-z-10` ih izbaci ISPOD podloge panela, pa se ne vide uopšte.
 */
export const panelVariants = cva(
  [
    glassVariants({ interactive: true }),
    'group relative isolate overflow-hidden p-7',
    // Ivica se na hover pali u plavo — jedini deo recepta koji panel dopunjuje.
    'duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-primary/30',
  ].join(' '),
)

/** Sloj svetla. Gradijent dolazi iz `DisciplineCard.constants.ts`, jer čita CSS promenljive. */
export const panelGlowVariants = cva(
  'pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100 motion-reduce:transition-none',
)

/** Nit koja se upali po gornjoj ivici — signal da je panel „aktivan", bez pomeranja sadržaja. */
export const panelScanVariants = cva(
  'pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 motion-reduce:transition-none',
)

/**
 * Ugaonici kao na nišanu. Dva su dovoljna — po jedan na suprotnim uglovima daje utisak
 * okvira, dok četiri zatvore panel u kutiju i vrate rešetkasti izgled stare liste.
 */
export const panelTickVariants = cva(
  'pointer-events-none absolute bottom-4 size-3 text-border-strong transition-colors duration-500 group-hover:text-primary/70 motion-reduce:transition-none',
  {
    variants: {
      corner: {
        end: 'end-4 border-b border-e border-current',
        start: 'start-4 border-b border-s border-current',
      },
    },
    defaultVariants: { corner: 'end' },
  },
)

/**
 * Redni broj kao duh, u gornjem uglu.
 *
 * Broj je i ranije postojao, ali kao `/01 design` u sitnom mono tekstu — dakle podatak koji
 * nosi istu težinu kao naslov. Ovde nosi dubinu: velik i skoro proziran.
 *
 * **Gore, ne dole**, i bez isecanja ivicom. Prva verzija ga je pustila da beži preko donje
 * ivice (`-bottom-6`): pola cifre je bilo odsečeno, pa je izgledalo kao greška u renderu, a
 * na prvoj kartici je stajao ispod oznaka tehnologija i tukao se sa njima.
 *
 * **Cifra dolazi iz `content: attr(data-no)`, ne kao tekst u DOM-u**, i to je zbog axe-a, ne
 * iz estetike. Kao tekstualni čvor je obarao `color-contrast`: 1.1 prema podlozi, a pravilo
 * za veliki tekst traži 3:1. `aria-hidden` tu ne pomaže — provera meri šta vidi oko, ne šta
 * čita čitač ekrana, i za tekst je u pravu. Rešenje nije potamniti duha (na 3:1 prestaje da
 * bude duh i počinje da se bije sa naslovom) nego priznati da ovo nije tekst nego pozadinski
 * ukras — a ukras pripada CSS-u. Broj je i dalje podatak u `DISCIPLINES`, samo putuje kroz
 * atribut.
 */
export const panelGhostVariants = cva(
  'pointer-events-none absolute top-4 end-5 -z-10 font-heading text-[62px] leading-none font-bold text-foreground/[0.055] transition-[transform,color] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] before:content-[attr(data-no)] group-hover:-translate-y-0.5 group-hover:text-primary/15 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0',
)

/** Oznaka discipline — mono i mala slova, isti rečnik kao hero terminal i `[ services ]`. */
export const panelSlugVariants = cva(
  'font-mono text-[11.5px] tracking-[0.16em] text-faint lowercase',
)

export const panelTitleVariants = cva(
  'mt-3 font-heading text-[20px] leading-tight font-semibold tracking-tight text-foreground',
)

export const panelTextVariants = cva(
  'mt-2.5 max-w-[46ch] text-[15px] leading-relaxed text-pretty text-muted-foreground',
)

export const panelTagsVariants = cva('mt-6')
