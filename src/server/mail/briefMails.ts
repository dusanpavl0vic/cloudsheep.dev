import 'server-only'

import { createTranslator } from 'next-intl'

import { BOOKING_TIME_ZONE } from '@/constants/booking'
import { SITE_URL } from '@/constants/env'
import { INTL_LOCALES, LOCALE_TAGS, type Locale } from '@/constants/i18n'
import { MESSAGES } from '@/constants/i18n/messages'
import type { Brief } from '@/schemas/contact'

import { env } from '../env'
import { log } from '../log'
import { autoReplyHtml } from './template'
import { getTransporter, isMailConfigured } from './transport'

/** Termin poziva u vremenu studija, na jeziku primaoca. */
const formatCall = (startsAt: Date, locale: Locale) =>
  new Intl.DateTimeFormat(INTL_LOCALES[locale], {
    timeZone: BOOKING_TIME_ZONE,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  }).format(startsAt)

export interface BriefMail {
  brief: Brief
  callAt: Date | null
}

/**
 * Upit studiju. Telo je ČIST TEKST — tekst nepoznatog posetioca se nikad ne ubacuje u HTML.
 *
 * Adresa i ime pošiljaoca su NAŠI: Gmail dozvoljava slanje samo sa autentifikovanog naloga, a
 * „Marko (preko sajta) <naša adresa>" je obrazac krađe identiteta koji filteri kažnjavaju. Ko je
 * pisao vidi se iz naslova, prvog reda i `replyTo` — „Odgovori" piše posetiocu.
 */
export const sendStudioMail = async ({ brief, callAt }: BriefMail) => {
  const studio = createTranslator({ locale: 'sr', messages: MESSAGES.sr, namespace: 'mail.studio' })
  const contact = createTranslator({ locale: 'sr', messages: MESSAGES.sr, namespace: 'contact' })

  const type = contact(`types.${brief.projectType}.label`)
  const budget = contact(`budgets.${brief.budget}`)
  const lines = [
    `${studio('name')}: ${brief.name}`,
    `${studio('email')}: ${brief.email}`,
    `${studio('type')}: ${type}`,
    `${studio('budget')}: ${budget}`,
    `${studio('timeline')}: ${contact(`timelines.${brief.timeline}`)}`,
    `${studio('call')}: ${callAt ? formatCall(callAt, 'sr') : studio('noCall')}`,
    `${studio('language')}: ${brief.locale}`,
    brief.estimate ? `${studio('estimate')}: ${JSON.stringify(brief.estimate)}` : '',
    '',
    brief.message,
  ].filter((line, index, all) => line !== '' || all[index - 1] !== '')

  if (!isMailConfigured()) {
    // Nije greška: lokalni razvoj bez SMTP-a je normalno stanje — vidljivo u logu, ne tiho
    log.info('SMTP nije podešen — upit nije poslat mejlom', { email: brief.email })
    return
  }

  await getTransporter().sendMail({
    from: { name: 'CloudSheep — upit sa sajta', address: env().SMTP_USER },
    to: env().CONTACT_TO,
    replyTo: `${brief.name} <${brief.email}>`,
    subject: studio('subject', { type, budget, name: brief.name }),
    text: lines.join('\n'),
  })
}

/**
 * Potvrda posetiocu, na jeziku forme. Šalje se ODVOJENO od mejla studiju (zaseban `try` u
 * servisu): pun sandučić posetioca ne sme da povuče sa sobom kopiju koja je već otišla.
 */
export const sendAutoReply = async ({ brief, callAt }: BriefMail) => {
  if (!isMailConfigured()) {
    log.info('SMTP nije podešen — potvrda nije poslata', { email: brief.email })
    return
  }

  const locale = brief.locale
  const t = createTranslator({ locale, messages: MESSAGES[locale], namespace: 'mail.autoReply' })
  const copy = {
    greeting: t('greeting', { name: brief.name }),
    lead: t('lead'),
    call: callAt ? t('call', { when: formatCall(callAt, locale) }) : null,
    note: t('note'),
    cta: t('cta'),
    signoff: t('signoff'),
    siteUrl: SITE_URL,
    lang: LOCALE_TAGS[locale],
  }

  await getTransporter().sendMail({
    from: { name: 'CloudSheep', address: env().SMTP_USER },
    to: brief.email,
    replyTo: env().CONTACT_TO,
    subject: t('subject'),
    // RFC 3834: automatski odgovor — filteri ga ne vide kao masovnu poštu, a drugi
    // auto-responderi mu ne odgovaraju (bez ovoga se dva auto-odgovora dopisuju zauvek).
    headers: { 'Auto-Submitted': 'auto-replied', 'X-Auto-Response-Suppress': 'All' },
    // Obe verzije: bez tekstualne poruka češće završi u spamu.
    text: [
      copy.greeting,
      '',
      copy.lead,
      ...(copy.call ? ['', copy.call] : []),
      '',
      copy.note,
      '',
      copy.signoff,
      SITE_URL,
    ].join('\n'),
    html: autoReplyHtml(copy),
  })
}
