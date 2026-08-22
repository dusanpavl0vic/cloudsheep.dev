import { cva } from 'class-variance-authority'

/** Hamburger — postoji samo ispod `lg`, gde bočna traka ne postoji. */
export const navTriggerVariants = cva(
  'grid size-10 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden',
)

/**
 * Panel. Klase `nav-sheet*` dolaze iz `@app/tailwind-config/sheet.css` — isti fajl koji
 * koristi javni sajt, pa se panel u obe app-e kreće identično.
 *
 * `max-h-none` i `max-w-none` NISU višak: pretraživači `<dialog>`-u podrazumevano daju
 * `max-width/max-height: calc(100% - 6px - 2em)`, pa panel bez toga staje nekoliko piksela
 * pre dna ekrana i ostavlja traku pozadine ispod sebe.
 */
export const navSheetVariants = cva(
  'nav-sheet fixed m-0 max-h-none max-w-none border-0 bg-background p-0 text-foreground',
  {
    variants: {
      layout: {
        /** Telefon — preko celog ekrana, ulazi odozdo. */
        full: 'nav-sheet--full inset-0 h-dvh w-screen',
        /** Tablet — bočni sloj zdesna, kao na javnom sajtu. */
        side: 'nav-sheet--side inset-y-0 right-0 left-auto h-dvh w-[min(340px,86vw)] shadow-[-24px_0_60px_-24px_rgb(0_0_0/0.35)]',
      },
    },
    defaultVariants: { layout: 'side' },
  },
)

export const navSheetInnerVariants = cva('flex h-full flex-col gap-6 overflow-y-auto p-6')

export const navSheetHeadVariants = cva('flex items-center justify-between gap-4')

export const navCloseVariants = cva(
  'grid size-10 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
)

export const navSheetListVariants = cva('flex flex-col')

/**
 * Stavka je puna širine i visoka bar 48px — donja granica preporučene mete za dodir
 * (`docs/15`). Zato se ne koristi ista klasa kao u bočnoj traci, gde se cilja kursorom.
 */
export const navSheetLinkVariants = cva(
  'flex min-h-12 items-center border-b border-border/70 py-3 font-heading text-[17px] font-semibold tracking-tight text-muted-foreground transition-colors hover:text-foreground',
  {
    variants: {
      active: { true: 'text-foreground', false: '' },
    },
    defaultVariants: { active: false },
  },
)
