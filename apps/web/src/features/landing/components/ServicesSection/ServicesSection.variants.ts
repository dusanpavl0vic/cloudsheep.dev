import { cva } from 'class-variance-authority'

/**
 * Matrica 2×2, ne lista od četiri reda.
 *
 * Četiri jednaka panela, bez izdvojenog prvog: na dve kolone „featured" panel preko cele
 * širine ostavlja treći red sa jednom karticom i praznom polovinom. Ritam nose broj i
 * svetlo, ne veličina.
 */
export const servicesGridVariants = cva('grid gap-4 sm:gap-5 md:grid-cols-2')
