import { cva } from 'class-variance-authority'

/**
 * Labela sekcije — mono u uglastim zagradama, `[ usluge ]` (docs/22 §2).
 *
 * Bila je pilula sa podlogom i senkom, pozajmljena iz SaaS reference. Nikad nije sedela:
 * sajt je studio, a hero već govori terminalskim jezikom (`$ prompt`). Zagrade nastavljaju
 * taj jezik i ne traže ni podlogu ni ivicu da bi se videle.
 *
 * Zagrade idu kroz `::before`/`::after`, ne kao čvorovi u JSX-u — tako ne ulaze u tekst
 * koji čita screen reader, a i dalje se vide.
 */
export const eyebrowVariants = cva(
  "inline-flex items-center font-mono text-[12.5px] tracking-[0.02em] lowercase before:mr-1.5 before:content-['['] after:ml-1.5 after:content-[']']",
  {
    variants: {
      tone: {
        muted: 'text-muted-foreground before:text-faint after:text-faint',
        primary: 'text-primary before:text-primary/50 after:text-primary/50',
        inverse: 'text-inverse-muted before:text-inverse-faint after:text-inverse-faint',
      },
    },
    defaultVariants: {
      tone: 'muted',
    },
  },
)
