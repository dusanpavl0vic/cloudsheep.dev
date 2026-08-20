import { cva } from 'class-variance-authority'

/**
 * 404 preslikava hero skalu, jer je to jedina strana na koju se dolazi greškom — a greška
 * ne bi trebalo da izgleda kao da je sajt nedovršen.
 *
 * Šta je preuzeto iz hero-a: visina od jednog ekrana, tačkasta tekstura, ambijentalni sjaj,
 * terminal red sa kursorom, i `text-display` na gigant naslovu.
 *
 * Šta NIJE, i zašto:
 * - **svetlo koje prati kursor** — nosi `mousemove` + rAF i keširan `rect`; na strani greške
 *   je to trošak bez svrhe
 * - **typewriter** — ispis se kuca dok se čita „nema takvog fajla", pa poruka kasni
 * - **lebdeće kartice** — one govore šta studio radi; ovde bi bile ukras preko poruke
 */
/**
 * `flex-1`, ne `min-h-[calc(100svh-72px)]`.
 *
 * Sekcija koja sama traži skoro ceo ekran **dodaje** na visinu zaglavlja i podnožja, pa
 * strana skroluje — 404 je tako radila. Ovako je obrnuto: `main` u `MainLayout`-u je
 * `flex flex-col`, pa `flex-1` popuni tačno ono što je ostalo i strana stane u jedan ekran.
 *
 * `min-h-[480px]` je zaštita za niske prozore: tamo je bolje da se skroluje nego da
 * `overflow-hidden` odseče poziv na akciju.
 */
export const notFoundVariants = cva(
  'relative flex min-h-[480px] w-full flex-1 flex-col items-center justify-center overflow-hidden px-5 py-10 text-center',
)

/**
 * Tačke iz dizajn sistema (`dottedSurfaceVariants`), a ne kvadratna mreža od 56px koju je
 * ova strana imala do sada — bila je jedini uzorak te vrste u celom sajtu, i to zapisan kao
 * inline `style` sa sirovim tokenom `var(--border)`.
 *
 * Maska gasi tačke ka centru, pa tekst stoji na čistoj podlozi.
 */
export const notFoundDotsVariants = cva(
  'pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_75%_70%_at_50%_45%,transparent_35%,#000_100%)]',
)

export const notFoundGlowVariants = cva('pointer-events-none absolute inset-0')

export const notFoundTerminalVariants = cva(
  'relative z-10 mb-6 inline-flex flex-wrap items-center justify-center gap-2 font-mono text-[clamp(12px,1.4vw,14px)] text-foreground',
)

/** `text-display` kao hero `h1` — do sada je bio `text-foreground`, pa je gigant bio plav. */
export const notFoundTitleVariants = cva(
  'relative z-10 m-0 mb-4 font-heading text-[clamp(6rem,18vw,12rem)] leading-[0.88] font-bold tracking-[-0.055em] text-display',
)

export const notFoundCtaVariants = cva(
  'relative z-10 flex flex-wrap items-center justify-center gap-3.5',
)
