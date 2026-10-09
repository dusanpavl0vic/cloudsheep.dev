import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import ConfirmView from '@/components/confirm/ConfirmView'
import { API_BASE_URL, API_ENDPOINTS } from '@/constants/api'
import { CONFIRM_STATUSES, type ConfirmStatus } from '@/constants/confirmation'
import type { Locale } from '@/constants/i18n'
import { ROUTES } from '@/constants/routes'
import { buildPageMetadata } from '@/helpers/seo'
import { bindRequestLocale } from '@/i18n/locale'
import { subscriptionStatus } from '@/server/services/newsletter'

interface ConfirmPageProps {
  params: Promise<{ locale: Locale }>
  searchParams: Promise<{ token?: string | string[]; status?: string | string[] }>
}

export const generateMetadata = async ({ params }: ConfirmPageProps): Promise<Metadata> => {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'confirm.newsletter' })
  return buildPageMetadata({ locale, path: ROUTES.NEWSLETTER_CONFIRM, title: t('title'), description: t('lead'), noindex: true })
}

const isStatus = (value: unknown): value is ConfirmStatus => CONFIRM_STATUSES.includes(value as ConfirmStatus)

/** `/newsletter/confirm?token=…` — potvrda prijave (ADR 0016); posle POST-a `?status=…`. */
const ConfirmNewsletterPage = async ({ params, searchParams }: ConfirmPageProps) => {
  const { locale } = await params
  bindRequestLocale(locale)
  const { token, status } = await searchParams

  if (isStatus(status)) return <ConfirmView kind="newsletter" state={status} backHref={ROUTES.HOME} />
  if (typeof token !== 'string') return <ConfirmView kind="newsletter" state="invalid" backHref={ROUTES.HOME} />

  return (
    <ConfirmView
      kind="newsletter"
      state={await subscriptionStatus(token)}
      form={{ action: `${API_BASE_URL}${API_ENDPOINTS.NEWSLETTER_CONFIRM}`, token, locale }}
      backHref={ROUTES.HOME}
    />
  )
}

export default ConfirmNewsletterPage
