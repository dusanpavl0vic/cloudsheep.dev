/**
 * Mere dokumenta, u tačkama (1/72 inča) — jedinica koju pdfkit koristi svuda.
 *
 * **A4, ne Letter.** Uzorak je bio Letter (612×792), što je podrazumevana veličina alata
 * kojim je napravljen. CV se šalje poslodavcima u Srbiji i Evropi, gde se štampa na A4;
 * Letter na A4 štampaču ostavlja traku ili se skalira.
 */
export const PAGE = { size: 'A4', margin: 52 } as const

/**
 * Leva kolona nosi samo naslov sekcije. 104pt staje „OBRAZOVANJE" u 9.5pt verzalu, a to je
 * najduži natpis na oba jezika — proveravano na `CV_LABELS`, ne procenjeno.
 */
export const LABEL_WIDTH = 104
export const GUTTER = 18

export const FONT = { regular: 'cv-regular', bold: 'cv-bold' } as const

export const SIZE = {
  name: 26,
  role: 11,
  sectionLabel: 9.5,
  heading: 11,
  body: 9.5,
  meta: 8.5,
} as const

/**
 * Boje. Crna se ne koristi: puna crna na belom papiru je oštra pri štampi, a i ekran je
 * čita kao težu nego što jeste. `ink` je ista dubina koju sajt koristi za tekst.
 */
export const COLOR = {
  ink: '#12203A',
  muted: '#5A6478',
  rule: '#D8DCE4',
  link: '#1E56E0',
} as const

export const GAP = {
  /** Razmak iznad linije koja odvaja sekciju. */
  section: 18,
  /** Između dve stavke unutar iste sekcije (dva posla, dva projekta). */
  entry: 12,
  line: 3,
  bullet: 2,
} as const

/** Uvlačenje bulete i razmak do teksta. */
export const BULLET = { indent: 10, gap: 6 } as const
