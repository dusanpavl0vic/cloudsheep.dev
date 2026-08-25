import { cva } from 'class-variance-authority'

/**
 * Papir.
 *
 * `bg-plate` i `text-plate-ink` idu zajedno: podloga se ne invertuje, pa ni mastilo ne
 * sme — `text-foreground` bi u tamnoj temi postao skoro beo i nestao sa svetlog papira.
 *
 * Blago zarotiran, kao dokument spušten na sto. `rotate` ne utiče na raspored, pa ništa
 * oko njega ne skače.
 */
export const paperVariants = cva(
  // Senka tek od `sm`. Na telefonu je papir skoro pune širine ekrana, pa se meki oreol
  // od 40px razliva do ivica i čita kao zamućenje, ne kao dubina. Na širem ekranu papir
  // ima vazduha oko sebe i senka radi ono zbog čega postoji.
  'relative isolate rotate-[-0.6deg] rounded-sm bg-plate px-7 py-6 text-start text-plate-ink sm:px-9 sm:py-8 sm:shadow-[0_1px_2px_rgb(0_0_0/0.06),0_18px_40px_-14px_rgb(0_0_0/0.28)]',
  {
    variants: {
      /**
       * `standalone` je zatečeni izgled: centriran, širok koliko roditelj dozvoli.
       *
       * `slide` postoji jer u `flex` traci karusela `w-full` kolabira — slajd mora imati
       * svoju širinu i `shrink-0`, inače se sve kartice zbiju u jednu kolonu.
       */
      /**
       * `standalone` je zatečeni izgled: centriran, širok koliko roditelj dozvoli.
       *
       * `slide` prati širinu KARTICE (`w-full`), ne prozora.
       *
       * Ranije je bio `w-[min(86vw,520px)]`, dok je karusel bio `flex` traka u kojoj `w-full`
       * kolabira. Karusel je od tada mreža sa `flex-col` karticama, gde `w-full` radi — a
       * vezivanje za `vw` je od 535px naviše pravilo diplomu ŠIRU od kartice na kojoj stoji,
       * do 60px. Papir je virio ispod imena i sekao se o `overflow-hidden` scene.
       */
      layout: {
        standalone: 'mx-auto w-full max-w-[560px]',
        slide: 'w-full max-w-[520px] shrink-0',
      },
    },
    defaultVariants: { layout: 'standalone' },
  },
)

/**
 * Uokvireno polje na papiru — tanka linija uvučena od ivice, kao na štampanoj diplomi.
 *
 * Ivica je ovde **namerna, uprkos `docs/22 §3`**: diploma bez uokvirenog polja nije
 * dokument nego kartica. Zato linija, a papir ispod nje i dalje nosi senku, ne drugu ivicu.
 */
export const paperFrameVariants = cva(
  'relative flex flex-col gap-3 border border-plate-line/70 px-5 py-6 sm:px-7 sm:py-7',
)

/**
 * Hrapavost papira — isti `radial-gradient` idiom kao tačkasta tekstura sekcija
 * (`docs/22 §6`), samo gušći i bleđi da čita kao zrno, a ne kao uzorak. Statičan.
 */
export const paperGrainVariants = cva(
  "pointer-events-none absolute inset-0 -z-10 rounded-sm bg-[radial-gradient(currentColor_0.5px,transparent_0.5px)] bg-[length:6px_6px] text-plate-ink/10 content-['']",
)

/** Ustanova iznad zvanja — razmaknuta verzalna linija, kao zaglavlje dokumenta. */
export const paperUniversityVariants = cva(
  'font-mono text-[10.5px] tracking-[0.22em] text-plate-ink-muted uppercase',
)

/** Zvanje — nosivi podatak dokumenta, pa ide u naslovnom fontu i punom mastilu. */
export const paperDegreeVariants = cva(
  'font-heading text-[clamp(1.05rem,2.4vw,1.35rem)] leading-tight font-bold text-balance',
)

export const paperProgrammeVariants = cva('text-[14px] leading-snug text-plate-ink')

/** Linija iznad podnožja — deli zvanje od podataka o ustanovi. */
export const paperRuleVariants = cva('mt-1 h-px w-full bg-plate-line/60')

/**
 * Podnožje dokumenta — ustanova i grad.
 *
 * **Običan tok teksta, ne `flex`.** Kao `flex flex-wrap` je separator bio zaseban element,
 * pa je pri prelamanju završavao na POČETKU reda: „· Niš, Srbija". Sada se prelama kao
 * rečenica, a tačka je nelomljivim razmakom vezana za reč pre sebe.
 *
 * `stamped` sklanja tekst ispod pečata. Pečat je `absolute` u donjem desnom uglu i preklapa
 * tekstualnu kolonu za `veličina − 8px − padding okvira`, dakle ~58px odnosno ~68px od `sm`;
 * uz rotaciju od 11° to je ~65 / ~75px. Otud 4.5rem odnosno 5.25rem, sa malim zazorom.
 * Bez toga je „Niš, Srbija" nestajalo iza grba. Na desktopu se nije videlo jer
 * je papir dovoljno širok da se red završi pre pečata.
 *
 * Razmak se dodaje samo kad pečat postoji — član sa diplomom bez otpremljenog grba je
 * normalno stanje, a tamo bi prazan pojas desno izgledao kao greška u poravnanju.
 */
export const paperFooterVariants = cva(
  'font-mono text-[11.5px] leading-relaxed text-plate-ink-muted',
  {
    variants: {
      stamped: { true: 'pe-[4.5rem] sm:pe-[5.25rem]', false: '' },
    },
    defaultVariants: { stamped: false },
  },
)

/** Separator nosi NELOMLJIVI razmak ispred sebe (`CredentialSeal.tsx`), da ne padne u nov red. */
export const paperFooterSepVariants = cva('text-plate-line')

/**
 * Grb kao pečat — otisnut PREKO sadržaja, ne poređan pored njega.
 *
 * Zato `absolute` i zarotiran: pečat na dokumentu nikad ne stoji uspravno ni u koloni sa
 * tekstom. Providan je da se linija ispod njega nazire, kao kod otiska mastilom.
 *
 * `-end-2` ga gura preko desne ivice okvira — bez toga bi izgledao kao ikonica u uglu.
 */
export const paperStampVariants = cva(
  'pointer-events-none absolute -end-2 -bottom-3 size-[86px] rotate-[-11deg] opacity-[0.82] mix-blend-multiply sm:size-[104px]',
)

export const paperStampImageVariants = cva('size-full object-contain')
