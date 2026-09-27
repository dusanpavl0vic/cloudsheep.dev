import { cva } from 'class-variance-authority'

import { glassVariants } from '../lib/surface.variants'

export const badgeVariants = cva(
  'inline-flex items-center gap-2 whitespace-nowrap transition-colors',
  {
    variants: {
      variant: {
        outline: 'border border-border-strong text-muted-foreground',
        /**
         * Staklena pilula. `soft` je ranije bila `bg-background` — puna podloga, koja je
         * nad aurorom bila vidljiva zakrpa. Zamućenje je plitko (`control`): 14px preko
         * pilule od 24px visine zamuti sve u mrlju.
         */
        soft: [
          glassVariants({ elevation: 'flat', radius: 'md', control: true }),
          'rounded-none border-glass-edge-soft text-muted-foreground shadow-glass',
        ].join(' '),
        solid: 'bg-primary text-primary-foreground',
        accent: 'bg-accent text-accent-foreground',
        plain: 'text-faint',
        inverse: 'border border-inverse-border text-inverse-muted',
        /**
         * Oznaka koju nosi logotip, ne okvir.
         *
         * Bez ivice i bez podloge namerno: boja dolazi od brend logotipa, a pilula oko
         * njega bila bi drugi sistem izdvajanja preko istog (docs/22 §3). Ide u paru
         * sa `size: 'bare'` — sa `sm` bi imala padding oko nepostojeće podloge.
         */
        logo: 'gap-1.5 text-foreground',
      },
      size: {
        sm: 'px-3 py-1 text-xs',
        md: 'px-3.5 py-1.5 text-[13px]',
        /** Bez padding-a — za oznake koje nemaju podlogu. */
        bare: 'text-[13px]',
      },
      shape: {
        pill: 'rounded-full',
        square: 'rounded-md',
      },
      font: {
        sans: 'font-sans',
        mono: 'font-mono tracking-wide lowercase',
      },
    },
    defaultVariants: {
      variant: 'outline',
      size: 'sm',
      shape: 'pill',
      font: 'mono',
    },
  },
)

/**
 * Marker ispred teksta — terminalni prompt, ne tačkica.
 *
 * Ranije je ovo bio okrugli indikator koji pulsira. Zamenjen je znakom `$` da bi status
 * oznaka delila jezik sa hero terminalom umesto da uvodi drugi vizuelni rečnik.
 */
export const badgeMarkerVariants = cva('shrink-0 font-mono leading-none select-none', {
  variants: {
    tone: {
      primary: 'text-primary',
      success: 'text-success',
      inverse: 'text-inverse-primary',
    },
  },
  defaultVariants: {
    tone: 'primary',
  },
})
