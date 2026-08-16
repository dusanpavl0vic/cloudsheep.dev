import { cva } from 'class-variance-authority'

/** Dugme sa hamburgerom — vidi se samo ispod `lg`, gde puna navigacija ne staje. */
export const navTriggerVariants = cva(
  'grid size-10 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden',
)

/**
 * Panel.
 *
 * `max-h-none` i `max-w-none` NISU višak: pretraživači `<dialog>`-u podrazumevano daju
 * `max-width/max-height: calc(100% - 6px - 2em)`, pa panel bez toga staje nekoliko piksela
 * pre dna ekrana i ostavlja traku pozadine ispod sebe.
 *
 * Ulazna i izlazna animacija su u `animations.css` (`.nav-sheet--full` / `--side`) — moraju
 * tamo, jer `@starting-style` i `transition-behavior: allow-discrete` nemaju Tailwind ekvivalent.
 */
export const navSheetVariants = cva(
  'nav-sheet fixed m-0 max-h-none max-w-none border-0 bg-background p-0 text-foreground',
  {
    variants: {
      layout: {
        /** Telefon — preko celog ekrana, ulazi odozdo. Bočni panel na 380px ostavlja
         *  traku pozadine preusku da bi se kroz nju vratio, pa samo smeta. */
        full: 'nav-sheet--full inset-0 h-dvh w-screen',
        /** Tablet — sloj preko stranice, ulazi zdesna. Preko celog ekrana bi izgledao
         *  kao druga stranica, a ne kao meni. */
        side: 'nav-sheet--side inset-y-0 right-0 left-auto h-dvh w-[min(380px,86vw)] shadow-[-24px_0_60px_-24px_rgb(0_0_0/0.35)]',
      },
    },
    defaultVariants: { layout: 'side' },
  },
)

export const navSheetInnerVariants = cva('flex h-full flex-col gap-7 overflow-y-auto p-6')

export const navSheetHeadVariants = cva('flex items-center justify-between gap-4')

export const navCloseVariants = cva(
  'grid size-10 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
)

export const navSheetListVariants = cva('flex flex-col')

/**
 * Stavka je velika i puna širine: na dodir se cilja prstom, a ne kursorom.
 * 48px visine je donja granica preporučene mete (`docs/15`).
 */
export const navSheetLinkVariants = cva(
  'flex min-h-12 items-center border-b border-border/70 py-3 font-heading text-[19px] font-semibold tracking-tight text-muted-foreground transition-colors hover:text-foreground',
  {
    variants: {
      active: { true: 'text-foreground', false: '' },
    },
    defaultVariants: { active: false },
  },
)

/** Podnožje panela — prebacivači ostaju dole, van glavnog toka čitanja. */
export const navSheetFootVariants = cva(
  'mt-auto flex items-center gap-3 border-t border-border pt-5',
)
