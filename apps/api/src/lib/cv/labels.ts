/**
 * Natpisi u PDF-u, na oba jezika.
 *
 * `api` nema i18n i neće ga dobiti zbog jednog dokumenta: i18next nosi detekciju jezika,
 * interpolaciju i učitavanje resursa, a ovde treba mapa od dvadeset ključeva. Jezik stiže
 * kao parametar rute, pa nema ni šta da se detektuje.
 *
 * Ovo su JEDINI stringovi koje server ispisuje korisniku. Sve ostalo u CV-u je sadržaj koji
 * je admin uneo na oba jezika.
 */
export type CvLang = 'sr' | 'en'

export const CV_LABELS = {
  contact: { sr: 'KONTAKT', en: 'CONTACT' },
  summary: { sr: 'O MENI', en: 'SUMMARY' },
  experience: { sr: 'ISKUSTVO', en: 'EXPERIENCE' },
  education: { sr: 'OBRAZOVANJE', en: 'EDUCATION' },
  projects: { sr: 'PROJEKTI', en: 'PROJECTS' },
  skills: { sr: 'VEŠTINE', en: 'SKILLS' },
  languages: { sr: 'JEZICI', en: 'LANGUAGES' },

  phone: { sr: 'Telefon', en: 'Phone' },
  email: { sr: 'E-mail', en: 'Email' },
  location: { sr: 'Lokacija', en: 'Location' },

  /** Otvoren kraj zaposlenja. */
  present: { sr: 'danas', en: 'present' },
  gpa: { sr: 'Prosek', en: 'GPA' },
  technologies: { sr: 'Tehnologije', en: 'Technologies' },
  /** Uz veštinu: „3 god." / „3 yrs". Kratko, jer stoji u zagradi iza naziva. */
  yearsShort: { sr: 'god.', en: 'yrs' },
  /** Zbir svih zaposlenja, iznad spiska. */
  totalExperience: { sr: 'Ukupno radno iskustvo', en: 'Total experience' },
} as const

export const label = (key: keyof typeof CV_LABELS, lang: CvLang): string => CV_LABELS[key][lang]

/**
 * Meseci u genitivu za srpski („15. januara") nisu potrebni — u CV-u stoji „jan 2024",
 * dakle skraćenica bez padeža. Engleske skraćenice su iste kao svuda.
 */
const MONTHS = {
  sr: ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'avg', 'sep', 'okt', 'nov', 'dec'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
} as const

/** `2024` kad meseca nema, `mar 2024` kad ga ima. */
export const formatMonthYear = (
  year: number | null,
  month: number | null,
  lang: CvLang,
): string => {
  if (year === null) return ''
  if (month === null) return String(year)

  return `${MONTHS[lang][month - 1] ?? ''} ${String(year)}`.trim()
}

/**
 * Raspon datuma. Prazan kraj znači da posao traje, pa ide „danas" umesto praznine —
 * crtica bez ičega iza sebe izgleda kao nedovršen unos.
 */
export const formatRange = (
  startYear: number,
  startMonth: number | null,
  endYear: number | null,
  endMonth: number | null,
  lang: CvLang,
): string => {
  const from = formatMonthYear(startYear, startMonth, lang)
  const to = endYear === null ? label('present', lang) : formatMonthYear(endYear, endMonth, lang)

  return `${from} — ${to}`
}

/**
 * Broj meseci između dva datuma. Otvoren kraj se računa do DANAS.
 *
 * Meseci se broje kao razlika kalendarskih meseci, uvećana za jedan: posao od januara do
 * marta traje tri meseca, ne dva. Kad meseca nema, uzima se januar odnosno decembar — tako
 * unos „samo godina" daje pun opseg umesto nule.
 */
export const monthsBetween = (
  startYear: number,
  startMonth: number | null,
  endYear: number | null,
  endMonth: number | null,
): number => {
  const now = new Date()
  const from = startYear * 12 + (startMonth ?? 1) - 1
  const to =
    endYear === null ? now.getFullYear() * 12 + now.getMonth() : endYear * 12 + (endMonth ?? 12) - 1

  return Math.max(0, to - from + 1)
}

/**
 * Srpski ima TRI oblika množine, i to je ceo razlog zbog kog ova funkcija postoji.
 *
 * „1 mesec", „2 meseca", „5 meseci" — pravilo ide po poslednjoj cifri, uz izuzetak za
 * 11–14 („11 meseci", ne „11 mesec"). Engleski ima dva oblika, pa mu je grana trivijalna.
 * Bez ovoga bi u CV-u pisalo „1 meseci" ili „5 mesec", što odmah odaje generisan tekst.
 */
const plural = (n: number, forms: readonly [string, string, string]): string => {
  const last = n % 10
  const lastTwo = n % 100

  if (lastTwo >= 11 && lastTwo <= 14) return forms[2]
  if (last === 1) return forms[0]
  if (last >= 2 && last <= 4) return forms[1]
  return forms[2]
}

const UNITS = {
  sr: {
    year: ['godina', 'godine', 'godina'] as const,
    month: ['mesec', 'meseca', 'meseci'] as const,
  },
  en: {
    year: ['year', 'years', 'years'] as const,
    month: ['month', 'months', 'months'] as const,
  },
} as const

/**
 * Trajanje kao „1 godina 3 meseca" / „1 year 3 months".
 *
 * Godine se izostavljaju kad ih nema, meseci kad su nula — „2 godine 0 meseci" niko ne
 * piše. Ispod jednog meseca vraća „1 mesec", jer je nula ovde uvek greška u datumima.
 */
export const formatDuration = (months: number, lang: CvLang): string => {
  const total = Math.max(1, months)
  const years = Math.floor(total / 12)
  const rest = total % 12
  const unit = UNITS[lang]

  const parts: string[] = []
  if (years > 0) parts.push(`${String(years)} ${plural(years, unit.year)}`)
  if (rest > 0) parts.push(`${String(rest)} ${plural(rest, unit.month)}`)

  return parts.join(' ')
}
