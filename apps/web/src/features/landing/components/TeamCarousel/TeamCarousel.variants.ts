import { cva } from 'class-variance-authority'

export const carouselWrapVariants = cva('relative mx-auto w-full max-w-[1100px] px-4 sm:px-12')

/**
 * Sve kartice dele ISTU ćeliju mreže (`col-start-1 row-start-1`).
 *
 * Time se dobija ono što apsolutno pozicioniranje ne daje: kontejner sam dobije visinu
 * najviše kartice, pa se ništa ne odseca i ništa ne traži ručno podešenu visinu. Kartice
 * se zatim samo `transform`-išu — a `transform` ne utiče na raspored, pa ni jedna ne gura
 * drugu dok se vrte.
 *
 * `items-start`, ne `place-items-center`: kartice nisu iste visine (član bez diplome nema
 * pečat), pa bi centriranje po vertikali razmaklo njihove vrhove i ringišpil bi izgledao
 * kao razbacane kartice. Ovako svima počinje na istoj liniji.
 *
 * `pb-12` pravi mesta pečatu, koji je `absolute -bottom-3` i namerno visi izvan kartice.
 */
export const carouselStageVariants = cva(
  // `pb` je manji na telefonu: tamo pečat nije `absolute` nego stoji u toku ispod podnožja
  // (`CredentialSeal.variants.ts`), pa mesto za njegovo visenje izvan kartice nije potrebno.
  'grid items-start justify-items-center overflow-hidden pt-2 pb-6 sm:pb-12',
)

/**
 * Jedna kartica u ringišpilu.
 *
 * Pomeranje, umanjenje i providnost idu kroz inline `transform` (računa se iz rastojanja
 * do centra), a ovde stoji samo ono što je zajedničko.
 *
 * `origin-top` je nužan: `scale()` podrazumevano umanjuje oko SREDINE, pa vrh bočne kartice
 * padne niže od centralne i ringišpil izgleda kao razbacane kartice. Ovako sve počinju na
 * istoj liniji, a umanjuju se nadole. `transition` pokriva i `transform`
 * i `opacity` — obe se menjaju u istom kadru, pa moraju istom krivom.
 */
export const carouselCardVariants = cva(
  // `w-full max-w-[460px]`, ne `w-[min(86vw,460px)]`. Na 375px je `86vw` = 322px, a scena je
  // tamo široka 295px (`px-4` na omotaču): kartica je bila 27px šira od svog okvira, pa ju je
  // `overflow-hidden` sekao zdesna — a `justify-items-center` stavku širu od trake poravnava
  // na POČETAK, pa je uz to izgledala i pomereno ulevo. Vezivanje za `vw` ovde nema šta da
  // reši: širinu diktira scena, ne prozor.
  'col-start-1 row-start-1 flex w-full max-w-[460px] origin-top flex-col items-center gap-5 transition-[transform,opacity,filter] duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)] motion-reduce:transition-none',
  {
    variants: {
      /** Bočne kartice ne primaju klik na svoj sadržaj — klik na njih pomera ringišpil. */
      active: {
        true: '',
        false: 'pointer-events-none cursor-pointer select-none',
      },
    },
    defaultVariants: { active: true },
  },
)

export const memberHeadVariants = cva('flex flex-col items-center gap-3 text-center')

export const avatarVariants = cva(
  // Sitna površina: providnost bez `backdrop-blur` (docs/22 §3b-glass).
  'flex size-20 items-center justify-center overflow-hidden rounded-full border border-glass-edge-soft border-t-glass-edge bg-glass font-heading text-[22px] font-bold text-muted-foreground',
)

export const memberNameVariants = cva(
  'font-heading text-[19px] font-semibold tracking-tight text-foreground',
)

export const memberRoleVariants = cva('font-mono text-[13px] text-muted-foreground')

/**
 * Prazan okvir umesto diplome.
 *
 * Visina je namerno bliska pečatu: bez toga je kartica bez diplome upola niža, pa ringišpil
 * poskakuje pri svakom okretanju i deluje pokvareno.
 */
export const noDiplomaVariants = cva(
  'flex min-h-[15rem] w-full items-center justify-center rounded-xl border border-dashed border-border/70 px-6 text-center font-mono text-[12.5px] text-faint',
)

/**
 * Strelice postoje SAMO od `sm` naviše (`hidden sm:flex`).
 *
 * Ispod te širine kartica zauzima 86vw, pa između nje i ivice ostane 8–12px — a strelica je
 * 44px. Stajale su preko kartice, 13–22px, i to tačno na visini diplome. Na dodir se ionako
 * prevlači prstom, a tačkice ispod vode direktno na člana, pa se ništa ne gubi.
 *
 * `top` je FIKSNA razdaljina od vrha, ne procenat.
 *
 * Sa `top-[42%]` su strelice poskakivale 18px pri svakoj promeni člana. Uzrok nije bio u
 * njima: diploma se renderuje samo na centralnoj kartici, pa scena bude 456–497px zavisno
 * od toga da li član u centru ima diplomu — a procenat promenljive visine daje promenljivu
 * poziciju. Izmereno, ne procenjeno.
 *
 * Fiksna vrednost radi zato što sve kartice počinju na istoj liniji (`items-start` +
 * `origin-top`), pa je razmak od vrha do avatara i imena uvek isti; menja se samo ono ispod.
 */
export const arrowVariants = cva(
  'absolute top-[12.5rem] z-30 hidden size-11 sm:flex -translate-y-1/2 items-center justify-center rounded-full border border-glass-edge-soft border-t-glass-edge bg-glass-strong text-[18px] text-foreground shadow-glass transition-colors hover:border-primary hover:text-primary focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none',
  {
    variants: { side: { start: 'start-0 sm:start-2', end: 'end-0 sm:end-2' } },
  },
)

/** Tačkice ispod — pokazuju gde si u nizu i vode direktno na članicu. */
export const dotsVariants = cva('mt-2 flex justify-center gap-2')

export const dotVariants = cva('size-2 rounded-full transition-colors', {
  variants: {
    active: { true: 'bg-primary', false: 'bg-border-strong hover:bg-muted-foreground' },
  },
  defaultVariants: { active: false },
})
