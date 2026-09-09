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
 * **Okvir NEMA podlogu.** Puna
 * `bg-background` bi prekrila auroru — element sa negativnim `z-index`-om crta se iza
 * sadržaja, ali ISPRED podloge roditelja, a iza podloge ovog okvira. Staklene kartice bi
 * onda mutile ravnu boju, što je ista ta boja, i cela izmena bi bila nevidljiva.
 *
 * Veo koji temperira auroru je premešten na sam sloj aurore, da bi važio i u razmaku oko
 * okvira (`lg:p-3`). Dok je stajao ovde, ivica okvira je bila najgrublji rez na stranici:
 * 97 nivoa razlike na jednom pikselu, jer je spolja bila puna aurora a unutra veo.
 *
 * Okvir se od podloge razdvaja samo radijusom i senkom — što je i pisalo u njegovom
 * prvobitnom opisu, pre nego što je dobio podlogu.
 *
 * Okvir NEMA `backdrop-blur`. Kartice ga imaju, i dvostruko zamućenje preko istog piksela
 * je duplo skuplje bez ijedne vidljive razlike.
 */
export const appFrameVariants = cva(
  'flex min-h-dvh flex-1 flex-col overflow-clip lg:min-h-[calc(100dvh-1.5rem)] lg:rounded-[28px] lg:shadow-glass-lifted',
)
