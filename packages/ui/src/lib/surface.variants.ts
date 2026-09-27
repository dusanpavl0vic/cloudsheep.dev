import { cva } from 'class-variance-authority'

/**
 * Staklena površina (docs/22 §3).
 *
 * Materijal ima četiri sastojka i nijedan nije opcion: providna podloga, zamućenje iza nje,
 * svetlosna ivica i široka bleda senka. Zato stoje ovde zajedno — recept sklapan ručno po
 * komponentama razilazi se već na prvoj izmeni, i uvek se zaboravi zamućenje.
 *
 * **Zamućenje je pod `supports-[backdrop-filter]`, a puna `bg-card` je osnova.** Redosled je
 * namerno takav: pretraživač bez `backdrop-filter` dobija neprovidnu karticu koja izgleda kao
 * stara verzija, umesto providne ploče kroz koju se čita tekst ispod. Providnost bez
 * zamućenja nije degradacija nego kvar.
 *
 * Ivica NIJE jedne boje: gornja hvata svetlo, ostale su senka mastila. Tako oko čita debljinu
 * ploče. Ivica u istoj boji sa sve četiri strane čita kao okvir, a okvir je ono što je stari
 * §3 s pravom zabranjivao.
 */
export const glassVariants = cva(
  [
    // Ivica je JEDNE boje, tanka i prigušena. Gornju svetlu liniju je ranije crtao
    // `border-t-glass-edge`, ali otkad `--shadow-glass` nosi `inset` spekular, to su bile
    // dve bele linije jedna na drugoj — debela pruga umesto odsjaja, i najgora na
    // zaobljenim uglovima gde se ravna linija ne poklapa sa lukom.
    // Debljinu ploče sad nosi isključivo spekular iz senke.
    'border border-glass-edge-soft',
    // `backdrop-saturate` je ono što razlikuje staklo od mlečnog plastika: zamućenje samo
    // razmaže boju ispod, saturacija je vrati. Bez nje ploča ispere auroru u sivo.
    'bg-card supports-[backdrop-filter]:bg-glass supports-[backdrop-filter]:backdrop-blur-glass supports-[backdrop-filter]:backdrop-saturate-[1.7]',
    'transition-[box-shadow,transform,background-color] duration-300',
  ].join(' '),
  {
    variants: {
      elevation: {
        /** Ravno — ploča leži na podlozi, bez senke. Ugnježdena polja, redovi liste. */
        flat: 'shadow-none',
        /** Podrazumevano za kartice. */
        raised: 'shadow-glass',
        /** Istaknuta ploča u grupi — vidno iznad ostalih. */
        floating: 'shadow-glass-lifted',
      },
      /**
       * Sloj IZNAD sadržaja (dijalog, mobilna navigacija, popover).
       *
       * Zatvara više i muti jače, jer se kroz njega vidi tekst stranice a ne samo podloga.
       * Providan dijalog kroz koji se čita stranica ispod nije materijal nego greška.
       */
      overlay: {
        true: 'supports-[backdrop-filter]:bg-glass-strong supports-[backdrop-filter]:backdrop-blur-glass-strong',
        false: '',
      },
      interactive: {
        true: 'hover:-translate-y-0.5 hover:shadow-glass-lifted motion-reduce:transition-none motion-reduce:hover:translate-y-0',
        false: '',
      },
      radius: {
        md: 'rounded-xl',
        lg: 'rounded-2xl',
        xl: 'rounded-3xl',
        /** Kapsula — kontrole i pilule. */
        full: 'rounded-full',
      },
      /**
       * Sitna kontrola (dugme, pilula, polje).
       *
       * Ranije je §3b-glass ovo zabranjivao. Zabrana je pala na merenju, ne na ukusu:
       * na 8px poluprečnika je trošak po ploči ispod praga merenja, a bez njih je stranica
       * bila staklena samo na karticama i to se videlo kao nedoslednost.
       *
       * Poluprečnik je manji jer je i površina manja: 14px preko dugmeta od 40px visine
       * zamuti sve do neprepoznatljivosti i pilula izgleda kao mrlja.
       */
      control: {
        true: 'supports-[backdrop-filter]:backdrop-blur-[8px]',
        false: '',
      },
    },
    defaultVariants: {
      elevation: 'raised',
      overlay: false,
      interactive: false,
      control: false,
      radius: 'lg',
    },
  },
)

/**
 * Ambijentalno svetlo iza stakla (docs/22 §3a).
 *
 * Bez ovoga cela izmena je nevidljiva: `backdrop-filter` preko ravne boje vraća tu istu
 * boju. Četiri velika meka svetla daju staklu šta da lomi, pa kartica dobija boju od mesta
 * na kom stoji.
 *
 * **Statično**, bez ijedne animacije — §6 nije popustio. **Jedan sloj na ceo dokument**, ne
 * po sekciji: četiri svetla po sekciji znače četrdeset na stranici i podloga postane kaša.
 *
 * `background-image` sa četiri radijala umesto četiri `div`-a: nema dodatnih čvorova u DOM-u
 * i nema šta da se sudari sa `z-index`-om sadržaja.
 */
export const auroraVariants = cva(
  [
    'pointer-events-none fixed inset-0 -z-10',
    // Prvi sloj je VEO — ravan poluprovidan pravougaonik preko svih radijala. Crta se
    // iznad njih (prvi u `background-image` je najgornji) i temperira svetlo jednako na
    // celom prozoru, uključujući razmak oko okvira. Ranije je stajao na okviru i pravio
    // vidljiv stepenik na njegovoj ivici.
    'bg-[linear-gradient(var(--color-aurora-veil),var(--color-aurora-veil)),radial-gradient(60vw_46vw_at_12%_-6%,var(--color-aurora-1),transparent_60%),radial-gradient(52vw_40vw_at_92%_8%,var(--color-aurora-2),transparent_62%),radial-gradient(58vw_44vw_at_78%_88%,var(--color-aurora-3),transparent_60%),radial-gradient(46vw_38vw_at_4%_82%,var(--color-aurora-4),transparent_64%)]',
  ].join(' '),
)

/**
 * Fina tačkasta tekstura (docs/22 §6).
 *
 * **Statična.** Animiran uzorak je već dvaput pao na performansama — vidi napomenu u docs/22.
 */
export const dottedSurfaceVariants = cva(
  'bg-[radial-gradient(currentColor_1px,transparent_1px)] bg-[length:22px_22px] text-border-strong/45',
)
