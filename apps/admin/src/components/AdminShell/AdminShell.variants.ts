import { cva } from 'class-variance-authority'

export const shellVariants = cva('flex min-h-dvh')

/**
 * Bočna navigacija — vidi se tek od `lg`.
 *
 * Ispod te širine 240px oduzima previše od sadržaja: tabele projekata i poruka imaju
 * kolone koje se ne mogu suziti, pa se navigacija seli u panel (`AdminNav`). Granica je
 * ista kao na javnom sajtu, namerno — dve app-e koje se prelamaju na različitim širinama
 * deluju kao dva proizvoda.
 */
export const sidebarVariants = cva(
  'hidden w-60 shrink-0 flex-col gap-1 border-e border-border bg-card p-4 lg:flex',
)

/** Logotip u vrhu bočne trake. Razmak prati `p-4` trake, pa je vertikalni, ne puni. */
export const brandVariants = cva('px-3 py-4')

export const navLinkVariants = cva(
  'rounded-lg px-3 py-2 text-[15px] font-medium transition-colors',
  {
    variants: {
      active: {
        true: 'bg-primary/10 text-primary',
        false: 'text-muted-foreground hover:bg-muted hover:text-foreground',
      },
    },
    defaultVariants: { active: false },
  },
)

export const mainVariants = cva('flex min-w-0 flex-1 flex-col')

/**
 * Zaglavlje. Levo hamburger i znak (samo ispod `lg`), desno korisnik i odjava.
 *
 * `justify-between` bi sa tri deteta razbacao i ime na sredinu, pa se desna grupa gura
 * kroz `ms-auto` na njoj samoj — tako raspored ostaje isti i kad levi deo nestane na `lg`.
 *
 * `px-4 lg:px-8` — na telefonu je 32px sa strane previše kad je ekran 360px širok.
 */
export const topbarVariants = cva(
  'flex items-center gap-3 border-b border-border px-4 py-4 lg:px-8',
)

/** Desna grupa: ime i odjava. `min-w-0` da `truncate` na imenu uopšte proradi. */
export const topbarTailVariants = cva('flex min-w-0 items-center gap-2 ms-auto')

/** Ime prijavljenog. Na uskom ekranu se skraćuje umesto da gura dugme van ekrana. */
export const userNameVariants = cva('truncate text-[15px] text-muted-foreground')

/** Levi deo zaglavlja postoji SAMO ispod `lg` — iznad toga znak stoji u bočnoj traci. */
export const topbarLeadVariants = cva('flex min-w-0 items-center gap-2 lg:hidden')

export const contentVariants = cva('flex-1 px-4 py-8 lg:px-8')
