import nodemailer, { type Transporter } from 'nodemailer'

import { autoReplyHtml } from './mailTemplate.ts'
import { env } from '../env.ts'

/**
 * Slanje mejla preko SMTP-a.
 *
 * Transporter se pravi **lenjo i jednom**: `createTransport` otvara pool konekcija, pa bi
 * pravljenje po zahtevu ostavljalo otvorene veze, a pravljenje pri uvozu modula bi značilo
 * da svaki test i svaka `--help` komanda pokušavaju da se povežu na Gmail.
 */
let transporter: Transporter | null = null

export const isMailConfigured = (): boolean =>
  Boolean(env.SMTP_USER && env.SMTP_PASS && env.CONTACT_TO)

const getTransporter = (): Transporter => {
  transporter ??= nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    // 465 je implicitni TLS; 587 je STARTTLS, koji `secure: false` pa `requireTLS` rešava
    secure: env.SMTP_PORT === 465,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
  })

  return transporter
}

interface ContactMail {
  name: string
  email: string
  subject: string
  message: string
}

/**
 * Automatski odgovor pošiljaocu, po jeziku sa kog je forma poslata.
 *
 * Tekst stoji ovde, a ne u i18n fajlovima: `apps/api` nema i18n, a ovo je jedini tekst koji
 * server ikad pošalje čoveku. Kad ih bude više, ide u zaseban modul.
 */
const AUTOREPLY = {
  sr: {
    subject: 'Hvala na poruci — CloudSheep',
    greeting: (name: string) => `Zdravo ${name},`,
    lead: 'hvala što ste nas kontaktirali. Poruka je stigla i javljamo se u roku od 48 sati.',
    note: 'Ako je u međuvremenu iskrslo nešto hitno, samo odgovorite na ovaj mejl.',
    cta: 'Pogledaj radove',
    signoff: 'Srdačno, CloudSheep',
  },
  en: {
    subject: 'Thanks for reaching out — CloudSheep',
    greeting: (name: string) => `Hi ${name},`,
    lead: 'thanks for getting in touch. Your message arrived and we will reply within 48 hours.',
    note: 'If something urgent comes up in the meantime, just reply to this email.',
    cta: 'See the work',
    signoff: 'Best, CloudSheep',
  },
} as const

export type MailLocale = keyof typeof AUTOREPLY

/**
 * Šalje poruku sa kontakt forme.
 *
 * **Telo je čist tekst, nikad HTML.** Poruka dolazi od nepoznatog posetioca; ubacivanje
 * njegovog teksta u HTML bi bilo injektovanje u tuđi mejl klijent.
 *
 * **Adresa pošiljaoca je NAŠA, i to se ne može zaobići.** Gmail dozvoljava slanje samo sa
 * autentifikovanog naloga; `from: posetilac@nesto.com` bi bio prepisan, a i da nije,
 * SPF/DKIM provera na strani primaoca bi poruku proglasila lažnom i poslala u spam. Isto
 * radi svaka kontakt forma na internetu.
 *
 * Ono što se MOŽE je da ime u sandučetu bude posetiočevo:
 *
 *     Marko Marković (preko cloudsheep.dev) <cloudsheep.dev016@gmail.com>
 *
 * Tako u listi poruka vidiš ko je pisao, iako je tehnička adresa tvoja. Prava adresa stoji
 * u `replyTo` i u telu poruke — pritisneš „Odgovori" i pišeš njemu, ne sebi.
 */
export async function sendContactMail(mail: ContactMail): Promise<void> {
  if (!isMailConfigured()) {
    // Nije greška: lokalni razvoj bez SMTP kredencijala je normalno stanje
    console.log(`[mail] SMTP nije podešen — poruka od ${mail.email} nije poslata:\n${mail.message}`)
    return
  }

  await getTransporter().sendMail({
    /*
     * Ime pošiljaoca je NAŠE, ne posetiočevo.
     *
     * Ranije je ovde stajalo `${mail.name} (preko cloudsheep.dev)`. To je izgledalo lepše u
     * sandučetu, ali je **klasičan obrazac krađe identiteta**: prikazano ime tvrdi jednu
     * osobu, a adresa pripada drugoj. Gmail i Outlook to boduju kao sumnjivo i takva poruka
     * češće završi u nepoželjnoj pošti — što je tačno problem koji se ovde rešava.
     *
     * Ko je pisao vidi se iz naslova, prvog reda tela i `replyTo` adrese.
     */
    from: { name: 'CloudSheep — poruka sa sajta', address: env.SMTP_USER },
    to: env.CONTACT_TO,
    replyTo: `${mail.name} <${mail.email}>`,
    subject: mail.subject ? `${mail.subject} — ${mail.name}` : `Nova poruka — ${mail.name}`,
    text: [
      `Ime: ${mail.name}`,
      `E-mail: ${mail.email}`,
      mail.subject ? `Naslov: ${mail.subject}` : '',
      '',
      mail.message,
    ]
      .filter(Boolean)
      .join('\n'),
  })
}

/**
 * Potvrda pošiljaocu — „primili smo, javljamo se za 48h".
 *
 * **Šalje se odvojeno od poruke tebi, i namerno.** Ako ovaj mejl padne (pogrešna adresa,
 * pun sandučić, greylisting), tvoja kopija je već otišla; ne sme da je povuče sa sobom.
 * Zato je i poziv u ruti u zasebnom `try`.
 *
 * `replyTo` je tvoja adresa: posetilac pritisne „Odgovori" i piše tebi, ne u prazno.
 */
export async function sendAutoReply(mail: ContactMail, locale: MailLocale): Promise<void> {
  if (!isMailConfigured()) {
    console.log(`[mail] SMTP nije podešen — potvrda za ${mail.email} nije poslata`)
    return
  }

  const copy = AUTOREPLY[locale]

  /*
   * Šalju se OBE verzije, `text` i `html`.
   *
   * Nodemailer od njih pravi `multipart/alternative`, pa klijent bira šta ume da prikaže.
   * Bez `text` verzije poruka pada u spam osetno češće — filteri je čitaju kao znak da
   * pošiljalac ne mari, a i čitači ekrana i mejl klijenti u tekstualnom režimu bi ostali
   * bez sadržaja.
   */
  await getTransporter().sendMail({
    from: { name: 'CloudSheep', address: env.SMTP_USER },
    to: mail.email,
    replyTo: env.CONTACT_TO,
    subject: copy.subject,
    /*
     * Zaglavlja koja smanjuju šansu da potvrda završi u nepoželjnoj pošti.
     *
     * `Auto-Submitted: auto-replied` je standard iz RFC 3834 za automatske odgovore: filteri
     * po njemu prepoznaju da poruka nije ni masovna ni ručno pisana, a drugi automatski
     * sistemi po njemu znaju da NE odgovore — bez toga dva auto-odgovora mogu da se
     * doživotno dopisuju.
     *
     * `X-Auto-Response-Suppress` je isto to za Outlook i Exchange, koji RFC ne poštuju.
     */
    headers: {
      'Auto-Submitted': 'auto-replied',
      'X-Auto-Response-Suppress': 'All',
    },
    text: [
      copy.greeting(mail.name),
      '',
      copy.lead,
      '',
      copy.note,
      '',
      copy.signoff,
      'https://cloudsheep.dev',
    ].join('\n'),
    html: autoReplyHtml(mail.name, copy),
  })
}
