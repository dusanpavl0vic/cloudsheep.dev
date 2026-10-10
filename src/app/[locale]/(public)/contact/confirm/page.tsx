import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import ConfirmView from '@/components/confirm/ConfirmView'
import { API_BASE_URL, API_ENDPOINTS } from '@/constants/api'
import { CONFIRM_STATUSES, type ConfirmStatus } from '@/constants/confirmation'
import type { Locale } from '@/constants/i18n'
import { ROUTES } from '@/constants/routes'
import { formatDate } from '@/helpers/date'
import { buildPageMetadata } from '@/helpers/seo'
import { bindRequestLocale } from '@/i18n/locale'
import { getBriefForConfirmation } from '@/server/services/contact'

interface ConfirmPageProps {
  params: Promise<{ locale: Locale }>
  searchParams: Promise<{ token?: string | string[]; status?: string | string[] }>
}

export const generateMetadata = async ({ params }: ConfirmPageProps): Promise<Metadata> => {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'confirm.brief' })
  return buildPageMetadata({ locale, path: ROUTES.CONTACT_CONFIRM, title: t('title'), description: t('lead'), noindex: true })
}

const isStatus = (value: unknown): value is ConfirmStatus => CONFIRM_STATUSES.includes(value as ConfirmStatus)

/** `/contact/confirm?token=…` — potvrda upita (ADR 0016); posle POST-a `?status=…`. */
const ConfirmBriefPage = async ({ params, searchParams }: ConfirmPageProps) => {
  const { locale } = await params
  bindRequestLocale(locale)
  const { token, status } = await searchParams

  if (isStatus(status)) return <ConfirmView kind="brief" state={status} backHref={ROUTES.CONTACT} />
  if (typeof token !== 'string') return <ConfirmView kind="brief" state="invalid" backHref={ROUTES.CONTACT} />

  const [brief, t] = await Promise.all([getBriefForConfirmation(token), getTranslations({ locale })])
  const details =
    'name' in brief
      ? [
          t('confirm.brief.summary', { name: brief.name, type: t(`contact.types.${brief.projectType as 'webapp'}.label`) }),
          ...(brief.callAt ? [t('confirm.brief.call', { when: formatDate(brief.callAt, locale, { dateStyle: 'full', timeStyle: 'short' }) })] : []),
        ]
      : []

  return (
    <ConfirmView
      kind="brief"
      state={brief.status}
      form={{ action: `${API_BASE_URL}${API_ENDPOINTS.CONTACT_CONFIRM}`, token, locale }}
      details={details}
      backHref={ROUTES.CONTACT}
    />
  )
}

export default ConfirmBriefPage
