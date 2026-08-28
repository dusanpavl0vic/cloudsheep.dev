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
