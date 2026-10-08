/** Najšira kolona sadržaja (header, sekcije). */
export const CONTAINER_MAX_WIDTH = 1280

/** Kolona za tekst koji se čita (beleška, studija slučaja). */
export const PROSE_MAX_WIDTH = 720

/** Visina plutajućeg headera; hero ga podvlači negativnom marginom. */
export const HEADER_HEIGHT = 84

/** Od ove širine hero prikazuje „oblake misli" oko naslova. */
export const HERO_THOUGHTS_MIN_WIDTH = 1200

export const Z_INDEX = {
  aurora: 0,
  content: 1,
  header: 40,
  popover: 50,
  overlay: 60,
  toast: 70,
} as const

export const TOAST_DURATION_MS = 5000

export const ANIMATION_MS = {
  fast: 150,
  base: 250,
  slow: 600,
  reveal: 1000,
} as const

/** Zakrivljenje za sve „pristajuće" animacije iz dizajna. */
export const EASE_OUT = 'cubic-bezier(.16, 1, .3, 1)'
