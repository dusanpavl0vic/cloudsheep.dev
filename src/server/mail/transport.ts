import 'server-only'

import nodemailer, { type Transporter } from 'nodemailer'

import { SITE_URL } from '@/constants/env'

import { env } from '../env'

/**
 * Transporter se pravi LENJO i JEDNOM: `createTransport` otvara pool konekcija, pa bi pravljenje
 * po zahtevu ostavljalo otvorene veze, a pri uvozu modula bi svaki build pokušao da se poveže.
 */
let transporter: Transporter | null = null

export const isMailConfigured = () =>
  Boolean(env().SMTP_USER && env().SMTP_PASS && env().CONTACT_TO)

export const getTransporter = (): Transporter => {
  transporter ??= nodemailer.createTransport({
    // EHLO ime: domen koji pokazuje na server. Bez ovoga je to ime kontejnera (nasumičan heks),
    // a to filteri boduju kao sumnjivo.
    name: new URL(SITE_URL).hostname,
    host: env().SMTP_HOST,
    port: env().SMTP_PORT,
    // 465 je implicitni TLS; 587 je STARTTLS
    secure: env().SMTP_PORT === 465,
    auth: { user: env().SMTP_USER, pass: env().SMTP_PASS },
  })
  return transporter
}
