import { cva } from 'class-variance-authority'

/**
 * Oblačić misli — lebdeći ukras hero-a i 404 strane (docs/22 §3b).
 *
 * **Papir se ne invertuje** (`bg-plate`), pa ni mastilo ne sme (`text-plate-ink`). Unutra se
 * zato ne koristi `text-foreground` ni `text-muted-foreground`: u tamnoj temi bi pobeleli i
 * nestali sa svetlog papira. Obrazloženje `plate-*` tokena stoji u `theme.css`.
 */

/**
 * Omotač nosi POZICIJU, takt ulaza i senku; sam je providan.
 *
 * **Senka je `drop-shadow`, ne `box-shadow`.** Oblak je unija plohe i sedam ispupčenja; svako
 * bi sa `box-shadow` dobilo svoju senku, pa bi se unutar oblaka videli šavovi. `drop-shadow`
 * prati alfa-kanal cele grupe i baca jednu senku oko siluete.
 *
 * Rep je BRAT plohe, ne dete: dete bi nasledilo `opacity: 0` sa ulazne animacije roditelja,
 * pa bi kružići iskočili nevidljivi — a red (prvo kružići, pa oblak) je cela poenta.
 *
 * `--t` je zajednički pomeraj takta; kružići i ploha svoja kašnjenja računaju iz njega, pa se
 * stepenovanje podešava na jednom mestu umesto na četiri.
 */
export const thoughtVariants = cva(
  'relative text-plate-ink [filter:drop-shadow(0_2px_4px_rgb(0_0_0/0.05))_drop-shadow(0_18px_34px_rgb(0_0_0/0.14))]',
  {
    variants: {
      step: {
        0: '[--t:0ms]',
        1: '[--t:120ms]',
        2: '[--t:240ms]',
        3: '[--t:360ms]',
        4: '[--t:480ms]',
      },
      /** Mirno lebdenje — samo tamo gde oblak stoji duže od nekoliko sekundi. */
      drift: {
        true: 'animate-thought-drift motion-reduce:animate-none',
        false: '',
      },
    },
    defaultVariants: { step: 0, drift: false },
  },
)

/**
 * Prostor za tekst.
 *
 * **Nema ni pozadinu ni radijus** — podlogu crta maskirani sloj ispod (`thoughtSurfaceVariants`).
 * Padding je velikodušan jer silueta ulazi ka centru: na sredini visine oblak počinje na ~8%
 * širine, pa tekst bliži ivici završava izvan maske.
 *
 * Uspravni padding je veći od vodoravnog namerno: oblak treba da bude zaobljen, a ne
 * spljošten — tekst mu inače razvuče kutiju u traku i lukovi se izduže u ovale.
 */
export const thoughtBubbleVariants = cva(
  'animate-thought-in relative z-10 px-11 py-10 [animation-delay:calc(var(--t,0ms)+260ms)] motion-reduce:animate-none',
)

/**
 * Podloga — jedna nacrtana silueta oblaka, primenjena kao maska.
 *
 * Ranije su ovde bila ispupčenja od zasebnih krugova preko pravougaone plohe. To nikad nije
 * dalo oblak: bokovi su ostajali pravi, a krugovi blizu uglova su visili izvan plohe. Sada je
 * silueta jedna putanja (`--cloud-mask` u `theme.css`) koja se rasteže na kutiju, pa je
 * kontura zatvorena lukovima sa sve četiri strane i ne zavisi od širine sadržaja.
 *
 * Maska ide na **zaseban sloj**, ne na plohu sa tekstom: maskiran tekst bi se sekao o konturu.
 */
export const thoughtSurfaceVariants = cva(
  'animate-thought-in pointer-events-none absolute inset-0 -z-10 [animation-delay:calc(var(--t,0ms)+260ms)] [mask-image:var(--cloud-mask)] [mask-repeat:no-repeat] [mask-size:100%_100%] motion-reduce:animate-none [-webkit-mask-image:var(--cloud-mask)] [-webkit-mask-size:100%_100%]',
  {
    variants: {
      tone: {
        paper: 'bg-plate',
        /**
         * Žuta misao. Boja je sirov `oklch` i tu ostaje: nema tokena za taj papir, a ista
         * vrednost stoji i na 404 strani — dva različita žuta na istom sajtu bila bi gora
         * greška od jedne vrednosti bez tokena.
         */
        note: 'bg-[oklch(93%_0.09_98)]',
      },
    },
    defaultVariants: { tone: 'paper' },
  },
)

/**
 * Rep — tri kružića ka izvoru misli.
 *
 * Smer je uvek **ka naslovu**: oblak gore-levo ima rep u donjem-desnom uglu i obrnuto. Rep
 * koji pokazuje u prazno je crtež, ne znak (docs/22 §3b).
 *
 * **Odmak je namerno mali** (`mt-0.5`), jer maska uvlači siluetu unutar kutije: oblak počinje
 * tek na ~3% visine i ~9% širine, pa razmak od 12px izgleda kao 20 i rep se odlepi od oblaka.
 * Iz istog razloga je vodoravni pomak `10`, a ne `6` — bliže sredini, gde silueta stvarno jeste.
 */
export const thoughtTailVariants = cva('pointer-events-none absolute flex items-center gap-1', {
  variants: {
    tail: {
      br: 'end-10 top-full mt-0.5 origin-top-left rotate-[16deg]',
      bl: 'start-10 top-full mt-0.5 origin-top-right flex-row-reverse -rotate-[16deg]',
      tr: 'end-10 bottom-full mb-0.5 origin-bottom-left -rotate-[16deg]',
      tl: 'start-10 bottom-full mb-0.5 origin-bottom-right flex-row-reverse rotate-[16deg]',
    },
  },
  defaultVariants: { tail: 'br' },
})

/** Kružić repa. Isti materijal kao ploha, inače rep izgleda kao tuđ element. */
export const thoughtTailDotVariants = cva(
  'block shrink-0 animate-tail-pop rounded-full motion-reduce:animate-none',
  {
    variants: {
      tone: {
        paper: 'bg-plate',
        note: 'bg-[oklch(93%_0.09_98)]',
      },
      size: {
        lg: 'size-3.5',
        md: 'size-2.5',
        sm: 'size-1.5',
      },
      /** Kašnjenje se računa iz `--t`, pa ceo takt grupe pomera jedna varijanta na omotaču. */
      step: {
        1: '[animation-delay:var(--t,0ms)]',
        2: '[animation-delay:calc(var(--t,0ms)+90ms)]',
        3: '[animation-delay:calc(var(--t,0ms)+180ms)]',
      },
    },
    defaultVariants: { tone: 'paper', size: 'lg', step: 1 },
  },
)
