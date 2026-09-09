import { cva } from 'class-variance-authority'

/**
 * Spoljna podloga.
 *
 * `isolate` je obavezan, ne kozmetika: aurora stoji na `-z-10` i bez novog konteksta
 * slaganja propada iza podloge `body`-ja, pa se ne vidi nigde.
 *
 * Ranije je ovde bilo `bg-muted/70` — tamnija podloga da okvir ima na čemu da lebdi.
 * Sad to radi aurora: u razmaku oko okvira (`lg:p-3`) vidi se puna, nerazblažena.
 */
export const appBackdropVariants = cva('relative isolate min-h-dvh bg-background lg:p-3')

/**
 * Sam okvir stranice.
 *
 * `overflow-clip`, ne `overflow-hidden`: `hidden` pravi novi scroll kontejner i lomi
 * `position: sticky` na headeru. `clip` seče isto, a sticky nastavlja da radi.
 *
 * **Podloga je providna (`/50`), i to je uslov da redizajn uopšte radi.** Puna
 * `bg-background` bi prekrila auroru — element sa negativnim `z-index`-om crta se iza
 * sadržaja, ali ISPRED podloge roditelja, a iza podloge ovog okvira. Staklene kartice bi
 * onda mutile ravnu boju, što je ista ta boja, i cela izmena bi bila nevidljiva.
 *
 * Zašto baš `/50`, a ne providnije: aurora u punoj snazi obara `muted-foreground` na 3.97:1
 * za tekst koji stoji van kartice, ispod praga od 4.5 (docs/15). Okvir je zato veo koji
 * temperira svetlo POD sadržajem, dok se u razmaku oko njega (`lg:p-3`) aurora vidi
 * nerazblažena. Vrednost je izmerena, ne odabrana: na `/50` je najgori slučaj 4.56:1.
 *
 * Okvir NEMA `backdrop-blur`. Kartice ga imaju, i dvostruko zamućenje preko istog piksela
 * je duplo skuplje bez ijedne vidljive razlike.
 */
export const appFrameVariants = cva(
  'flex min-h-dvh flex-1 flex-col overflow-clip bg-background/50 lg:min-h-[calc(100dvh-1.5rem)] lg:rounded-[28px] lg:shadow-glass-lifted',
)
