/** Sidro-sekcije na landing stranici — koriste ih i header i footer. */
export const SECTION_IDS = {
  TOP: 'top',
  STUDIO: 'studio',
  SERVICES: 'services',
  PROCESS: 'process',
  WORK: 'work',
  PRICING: 'pricing',
  FAQ: 'faq',
  CONTACT: 'contact',
} as const

export const MAIN_NAV = [
  { id: SECTION_IDS.WORK, labelKey: 'nav.work' },
  { id: SECTION_IDS.SERVICES, labelKey: 'nav.services' },
  { id: SECTION_IDS.PRICING, labelKey: 'nav.pricing' },
  { id: SECTION_IDS.PROCESS, labelKey: 'nav.process' },
  { id: SECTION_IDS.CONTACT, labelKey: 'nav.contact' },
] as const

export const FOOTER_NAV = [
  {
    titleKey: 'footer.groupSite',
    links: [
      { id: SECTION_IDS.TOP, labelKey: 'nav.home' },
      { id: SECTION_IDS.WORK, labelKey: 'nav.work' },
      { id: SECTION_IDS.STUDIO, labelKey: 'nav.studio' },
      { id: SECTION_IDS.CONTACT, labelKey: 'nav.contact' },
    ],
  },
  {
    titleKey: 'footer.groupStudio',
    links: [
      { id: SECTION_IDS.SERVICES, labelKey: 'nav.services' },
      { id: SECTION_IDS.PRICING, labelKey: 'nav.pricing' },
      { id: SECTION_IDS.PROCESS, labelKey: 'nav.process' },
      { id: SECTION_IDS.FAQ, labelKey: 'nav.faq' },
    ],
  },
] as const

export const CONTACT_EMAIL = 'hi@cloudsheep.dev'

export const SOCIAL_LINKS = [
  { href: 'https://github.com/cloudsheep', labelKey: 'footer.github' },
  { href: 'https://linkedin.com/in/cloudsheep', labelKey: 'footer.linkedin' },
  { href: `mailto:${CONTACT_EMAIL}`, labelKey: 'footer.email' },
] as const
