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
  validation: {
    required: 'This field is required.',
    tooLong: 'This is too long.',
    email: 'Enter a valid email address.',
    url: 'Enter a full address, starting with https://',
    slug: 'Use lowercase letters, numbers and dashes.',
    pick: 'Pick an option to continue.',
    messageMin: 'A few more words, please.',
    passwordMin: 'At least 8 characters.',
    time: 'Use the HH:MM format.',
    date: 'Use the YYYY-MM-DD format.',
    dateRange: 'The end date must come after the start date.',
  },
  email: {
    errors: {
      syntax: 'This does not look like an email address.',
      typo: 'Did you mean {suggestion}?',
      disposable: 'Temporary inboxes cannot receive our reply. Use an address you check.',
      noMx: 'This domain does not receive email. Check the address.',
    },
    useSuggestion: 'Use {suggestion}',
    keepAsTyped: 'Keep it as typed',
    checking: 'Checking the address…',
  },
  contact: {
    eyebrow: 'Contact',
    title: 'Tell me what',
    titleMuted: 'you are building.',
    lead: 'Three short steps. The lead reads every brief and replies within one working day.',
    localTime: 'local time',
    steps: {
      need: 'What do you need?',
      budget: 'Budget',
      when: 'When should it launch?',
      details: 'About you and the project',
    },
    fields: {
      name: 'Your name',
      email: 'Email',
      message: 'A few sentences about the project',
    },
    types: {
      webapp: { label: 'Web app', hint: 'SaaS, dashboard, portal' },
      mobile: { label: 'Mobile app', hint: 'iOS and Android' },
      site: { label: 'Website', hint: 'Marketing or e-commerce' },
      design: { label: 'Design', hint: 'UX, UI, brand' },
    },
    budgets: {
      under5k: '< €5k',
      '5to15k': '€5–15k',
      '15to40k': '€15–40k',
      over40k: '€40k+',
    },
    timelines: {
      asap: 'ASAP',
      '1to3': '1–3 months',
      '3to6': '3–6 months',
      flexible: 'Flexible',
    },
    booking: {
      title: 'Pick a time for the intro call',
      subtitle: '30 minutes · video call · Central European Time',
      none: 'No open slots in the next two weeks — send the brief and we will propose a time.',
      optional: 'Optional — the brief goes through without a call too.',
    },
    summary: {
      type: 'Project',
      budget: 'Budget',
      timeline: 'Launch',
      call: 'Intro call',
      noCall: 'Not booked',
    },
    actions: {
      back: '← Back',
      next: 'Continue',
      send: 'Send brief',
    },
    done: {
      title: 'Thanks',
      body: 'Your brief is in. Expect a reply within one working day.',
    },
    errors: {
      invalid: 'Some fields need attention.',
      slotTaken: 'That time was just booked. Pick another one.',
    },
  },
  mail: {
    autoReply: {
      subject: 'Thanks for reaching out — CloudSheep',
      greeting: 'Hi {name},',
      lead: 'thanks for getting in touch. Your brief arrived and the lead replies within one working day.',
      call: 'Your intro call is booked for {when} (Central European Time). A video link follows before the call.',
      note: 'If something urgent comes up in the meantime, just reply to this email.',
      cta: 'See the work',
      signoff: 'Best, CloudSheep',
    },
    studio: {
      subject: 'Upit: {type} · {budget} — {name}',
      name: 'Ime',
      email: 'E-mail',
      type: 'Projekat',
      budget: 'Budžet',
      timeline: 'Lansiranje',
      call: 'Uvodni poziv',
      noCall: 'nije zakazan',
      estimate: 'Procena sa sajta',
      language: 'Jezik forme',
    },
  },
}

export default en
