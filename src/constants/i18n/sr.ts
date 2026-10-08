import type { Messages } from './types'

/** Srpske poruke (latinica). Oblik je `Messages` — ključ koji fali je greška tipa. */
const sr: Messages = {
  common: {
    brand: 'CloudSheep',
    brandLower: 'cloudsheep',
    brandTld: '.dev',
    loading: 'Učitavanje…',
    sending: 'Slanje…',
    retry: 'Pokušaj ponovo',
    close: 'Zatvori',
    back: 'Nazad',
    skipToContent: 'Pređi na sadržaj',
    primaryCta: 'Pokreni projekat',
    secondaryCta: 'Pogledaj radove',
  },
  theme: {
    toLight: 'Prebaci na svetlu temu',
    toDark: 'Prebaci na tamnu temu',
  },
  language: {
    label: 'Jezik',
    switchTo: 'Čitaj na jeziku: {language}',
  },
  nav: {
    label: 'Glavna navigacija',
    home: 'Početna',
    studio: 'Studio',
    services: 'Usluge',
    process: 'Proces',
    work: 'Radovi',
    stack: 'Stack',
    pricing: 'Cene',
    faq: 'Pitanja',
    notes: 'Blog',
    contact: 'Kontakt',
    openMenu: 'Otvori meni',
    closeMenu: 'Zatvori meni',
  },
  meta: {
    siteName: 'CloudSheep',
    home: {
      title: 'CloudSheep — produktni studio iz Niša',
      description:
        'Jednočlani produktni studio: dizajn, web i mobilne aplikacije iz jednog para ruku. Bez primopredaja, jedan vlasnik od prve skice do lansiranja.',
    },
    projects: {
      title: 'Radovi — CloudSheep',
      description:
        'Izabrane studije slučaja: web i mobilne aplikacije, od prve skice do produkcije. Dokazi, ne obećanja.',
    },
    project: { title: '{name} — CloudSheep' },
    notes: {
      title: 'Blog — CloudSheep',
      description:
        'Beleške sa radnog stola: kako procenjujemo, dizajniramo i isporučujemo digitalne proizvode.',
    },
    note: { title: '{title} — CloudSheep' },
    contact: {
      title: 'Kontakt — CloudSheep',
      description:
        'Pokreni projekat sa produkt studijom iz Niša. Odgovor u roku od jednog radnog dana.',
    },
    notFound: { title: 'Stranica nije pronađena — CloudSheep' },
    ogAlt: 'CloudSheep — ovca čije je telo oblak',
  },
  errors: {
    notFoundEyebrow: '404',
    notFoundTitle: 'Ova stranica je odlutala.',
    notFoundBody: 'Adresa je možda promenjena. Kreni od početne — ovca zna put.',
    backHome: 'Nazad na početnu',
    browseWork: 'Pogledaj radove',
    genericTitle: 'Nešto je pošlo naopako kod nas.',
    genericBody: 'Stranica trenutno ne može da se učita. Pokušaj ponovo za trenutak.',
    retry: 'Pokušaj ponovo',
    network: 'Nema veze. Proveri mrežu i pokušaj ponovo.',
    unexpected: 'Nešto je pošlo naopako. Pokušaj ponovo.',
    tooManyRequests: 'Previše pokušaja. Sačekaj trenutak pa pokušaj ponovo.',
  },
}

export default sr
