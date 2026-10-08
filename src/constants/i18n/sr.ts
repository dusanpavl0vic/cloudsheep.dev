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
  validation: {
    required: 'Ovo polje je obavezno.',
    tooLong: 'Predugačko je.',
    email: 'Unesite ispravnu email adresu.',
    url: 'Unesite punu adresu, koja počinje sa https://',
    slug: 'Koristite mala slova, brojeve i crtice.',
    pick: 'Izaberite opciju da biste nastavili.',
    messageMin: 'Još nekoliko reči, molim.',
    passwordMin: 'Najmanje 8 znakova.',
    time: 'Koristite format SS:MM.',
    date: 'Koristite format GGGG-MM-DD.',
    dateRange: 'Krajnji datum mora biti posle početnog.',
  },
  email: {
    errors: {
      syntax: 'Ovo ne liči na email adresu.',
      typo: 'Da li ste mislili {suggestion}?',
      disposable:
        'Privremeni sandučići ne mogu da prime naš odgovor. Unesite adresu koju proveravate.',
      noMx: 'Ovaj domen ne prima poštu. Proverite adresu.',
    },
    useSuggestion: 'Koristi {suggestion}',
    keepAsTyped: 'Zadrži kako sam napisao',
    checking: 'Proveravam adresu…',
  },
  contact: {
    eyebrow: 'Kontakt',
    title: 'Reci mi šta',
    titleMuted: 'gradiš.',
    lead: 'Tri kratka koraka. Vođa projekta čita svaki upit i odgovara u roku od jednog radnog dana.',
    localTime: 'lokalno vreme',
    steps: {
      need: 'Šta vam je potrebno?',
      budget: 'Budžet',
      when: 'Kada bi trebalo da bude lansirano?',
      details: 'O vama i projektu',
    },
    fields: {
      name: 'Ime i prezime',
      email: 'Email',
      message: 'Nekoliko rečenica o projektu',
    },
    types: {
      webapp: { label: 'Web aplikacija', hint: 'SaaS, dashboard, portal' },
      mobile: { label: 'Mobilna aplikacija', hint: 'iOS i Android' },
      site: { label: 'Sajt', hint: 'Prezentacija ili prodavnica' },
      design: { label: 'Dizajn', hint: 'UX, UI, brend' },
    },
    budgets: {
      under5k: '< 5.000 €',
      '5to15k': '5–15.000 €',
      '15to40k': '15–40.000 €',
      over40k: '40.000 €+',
    },
    timelines: {
      asap: 'Što pre',
      '1to3': '1–3 meseca',
      '3to6': '3–6 meseci',
      flexible: 'Fleksibilno',
    },
    booking: {
      title: 'Izaberite termin za uvodni poziv',
      subtitle: '30 minuta · video poziv · centralnoevropsko vreme',
      none: 'Nema slobodnih termina u naredne dve nedelje — pošaljite upit i predložićemo termin.',
      optional: 'Nije obavezno — upit prolazi i bez poziva.',
    },
    summary: {
      type: 'Projekat',
      budget: 'Budžet',
      timeline: 'Lansiranje',
      call: 'Uvodni poziv',
      noCall: 'Nije zakazano',
    },
    actions: {
      back: '← Nazad',
      next: 'Nastavi',
      send: 'Pošalji upit',
    },
    done: {
      title: 'Hvala',
      body: 'Upit je stigao. Odgovor očekujte u roku od jednog radnog dana.',
    },
    errors: {
      invalid: 'Neka polja traže pažnju.',
      slotTaken: 'Taj termin je upravo zauzet. Izaberite drugi.',
    },
  },
  mail: {
    autoReply: {
      subject: 'Hvala na poruci — CloudSheep',
      greeting: 'Zdravo {name},',
      lead: 'hvala što ste nas kontaktirali. Upit je stigao i vođa projekta odgovara u roku od jednog radnog dana.',
      call: 'Uvodni poziv je zakazan za {when} (centralnoevropsko vreme). Link za video poziv stiže pre poziva.',
      note: 'Ako je u međuvremenu iskrslo nešto hitno, samo odgovorite na ovaj mejl.',
      cta: 'Pogledaj radove',
      signoff: 'Srdačno, CloudSheep',
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

export default sr
