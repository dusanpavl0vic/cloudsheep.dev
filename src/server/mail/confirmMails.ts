import 'server-only'

import { createTranslator } from 'next-intl'

import { SITE_URL } from '@/constants/env'
import { LOCALE_TAGS, type Locale } from '@/constants/i18n'
import { MESSAGES } from '@/constants/i18n/messages'

import { env, isProduction } from '../env'
import { log } from '../log'
import { actionMailHtml } from './template'
import { getTransporter, isMailConfigured } from './transport'

interface ConfirmMail {
  to: string
  locale: Locale
  link: string
  /** Ime iz upita; newsletter ga nema. */
  name?: string
}

/**
 * Bez SMTP-a u razvoju link ide u log (da se tok može proći ručno). U produkciji je to greška:
 * bez mejla niko ne može da potvrdi, pa servis poništava zahtev i vraća 503 (ADR 0016).
 */
const deliver = async (kind: 'confirmBrief' | 'confirmNewsletter', mail: ConfirmMail) => {
  const t = createTranslator({ locale: mail.locale, messages: MESSAGES[mail.locale], namespace: `mail.${kind}` })
  if (!isMailConfigured()) {
    if (isProduction()) throw new Error('SMTP nije podešen — potvrda adrese ne može da se pošalje')
    log.info('SMTP nije podešen — link za potvrdu', { to: mail.to, link: mail.link })
    return
  }

  const greeting = mail.name ? t('greeting', { name: mail.name }) : t('greetingAnonymous')
  const copy = {
    lang: LOCALE_TAGS[mail.locale],
    preheader: t('lead'),
    greeting,
    paragraphs: [t('lead'), t('expiry')],
    action: { label: t('button'), href: mail.link },
    note: t('ignore'),
    signoff: t('signoff'),
    siteUrl: SITE_URL,
  }

  await getTransporter().sendMail({
    from: { name: 'CloudSheep', address: env().SMTP_USER },
    to: mail.to,
    subject: t('subject'),
    headers: { 'Auto-Submitted': 'auto-generated', 'X-Auto-Response-Suppress': 'All' },
    text: [greeting, '', t('lead'), '', mail.link, '', t('expiry'), '', t('ignore'), '', t('signoff'), SITE_URL].join('\n'),
    html: actionMailHtml(copy),
  })
}

/** „Potvrdi adresu da bi upit stigao studiju." */
export const sendBriefConfirmation = (mail: ConfirmMail) => deliver('confirmBrief', mail)

/** „Potvrdi prijavu na newsletter." */
export const sendNewsletterConfirmation = (mail: ConfirmMail) => deliver('confirmNewsletter', mail)
