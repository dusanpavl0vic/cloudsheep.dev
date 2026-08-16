import { cva } from 'class-variance-authority'

/**
 * Padding je 24px na svim širinama (`px-6`) — fiksan, ne skalira se po breakpointu,
 * da bi ivica sadržaja bila ista na svakoj stranici.
 */
export const containerVariants = cva('mx-auto w-full px-6', {
  variants: {
    width: {
      /** Puna širina sadržaja — 1400px */
      wide: 'max-w-[1400px]',
      /** Alias za `wide`; zadržan jer ga koristi većina stranica. */
      content: 'max-w-[1400px]',
      /** Uži tok za dugačak tekst — čitljivost pada preko ~80 znakova po redu */
      article: 'max-w-[1040px]',
      narrow: 'max-w-[760px]',
      text: 'max-w-[720px]',
    },
  },
  defaultVariants: {
    width: 'wide',
  },
})
