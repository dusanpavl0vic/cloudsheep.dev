import { cva } from 'class-variance-authority'

/**
 * Labela sekcije — pilula, ne `//` marker (docs/22-visual-language.md §2).
 *
 * Ranije je bio mono tekst sa `//` prefiksom. Pilula nosi isti podatak, a ne traži
 * od čitaoca da zna šta znak označava.
 *
 * Izdvaja se podlogom i mekom senkom, ne debelom ivicom — isti princip kao kartice (§3).
 */
export const eyebrowVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12.5px] font-medium tracking-wide',
  {
    variants: {
      tone: {
        muted:
          'bg-card text-muted-foreground shadow-[0_1px_2px_rgb(0_0_0/0.04),0_4px_14px_-6px_rgb(0_0_0/0.12)] ring-1 ring-border/70 ring-inset',
        primary: 'bg-primary/10 text-primary ring-1 ring-primary/20 ring-inset',
        inverse: 'bg-inverse-border/60 text-inverse-foreground ring-1 ring-inverse-border ring-inset',
      },
    },
    defaultVariants: {
      tone: 'muted',
    },
  },
)

/** Tačkica ispred teksta — zamenjuje `//`, ali je dekoracija i sme da se izgubi. */
export const eyebrowMarkerVariants = cva('size-1.5 shrink-0 rounded-full', {
  variants: {
    tone: {
      muted: 'bg-primary',
      primary: 'bg-primary',
      inverse: 'bg-inverse-primary',
    },
  },
  defaultVariants: {
    tone: 'muted',
  },
})
