/**
 * Engleske poruke — IZVOR ISTINE za oblik (`types.ts`). Novi ključ ide ovde, pa u `sr.ts`;
 * TypeScript prijavljuje svaki koji fali. ICU sintaksa: `{count, plural, one {…} other {…}}`.
 */
const en = {
  common: {
    brand: 'CloudSheep',
    brandLower: 'cloudsheep',
    brandTld: '.dev',
    loading: 'Loading…',
    sending: 'Sending…',
    retry: 'Try again',
    close: 'Close',
    back: 'Back',
    skipToContent: 'Skip to content',
    primaryCta: 'Start a project',
    secondaryCta: 'View work',
  },
  theme: {
    toLight: 'Switch to light theme',
    toDark: 'Switch to dark theme',
  },
  language: {
    label: 'Language',
    switchTo: 'Read in {language}',
  },
  nav: {
    label: 'Main navigation',
    home: 'Home',
    studio: 'Studio',
    services: 'Services',
    process: 'Process',
    work: 'Work',
    stack: 'Stack',
    pricing: 'Pricing',
    faq: 'FAQ',
    notes: 'Notes',
    contact: 'Contact',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
  },
  meta: {
    siteName: 'CloudSheep',
    home: {
      title: 'CloudSheep — product studio from Niš',
      description:
        'One-person product studio: design, web and mobile apps from a single pair of hands. No handoffs, one owner from first sketch to launch.',
    },
    projects: {
      title: 'Work — CloudSheep',
      description:
        'Selected case studies: web and mobile products, from first sketch to production. Proof, not promises.',
    },
    project: { title: '{name} — CloudSheep' },
    notes: {
      title: 'Notes — CloudSheep',
      description: 'Notes from the desk: how we scope, design and ship digital products.',
    },
    note: { title: '{title} — CloudSheep' },
    contact: {
      title: 'Contact — CloudSheep',
      description:
        'Start a project with a product studio from Niš, Serbia. Reply within one working day.',
    },
    notFound: { title: 'Page not found — CloudSheep' },
    ogAlt: 'CloudSheep — a sheep whose body is a cloud',
  },
  errors: {
    notFoundEyebrow: '404',
    notFoundTitle: 'This page drifted off.',
    notFoundBody: 'The address may have changed. Start from home — the sheep knows the way.',
    backHome: 'Back home',
    browseWork: 'Browse work',
    genericTitle: 'Something went wrong on our side.',
    genericBody: 'The page could not load right now. Try again in a moment.',
    retry: 'Try again',
    network: 'No connection. Check your network and try again.',
    unexpected: 'Something went wrong. Try again.',
    tooManyRequests: 'Too many attempts. Wait a moment and try again.',
  },
}

export default en
