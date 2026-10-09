import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import ContactView from '@/components/contact/ContactView'
import type { Locale } from '@/constants/i18n'
import { ROUTES } from '@/constants/routes'
import { parseContactPrefill } from '@/helpers/contact'
import { estimate } from '@/helpers/estimator'
import { emailFrom } from '@/helpers/links'
import { buildPageMetadata } from '@/helpers/seo'
import { bindRequestLocale } from '@/i18n/locale'
import { getSiteProfile } from '@/server/services/profile'

interface ContactPageProps {
  params: Promise<{ locale: Locale }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export const generateMetadata = async ({ params }: ContactPageProps): Promise<Metadata> => {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta.contact' })
  // Canonical bez query-ja: `/contact?type=…` nije zaseban dokument.
  return buildPageMetadata({ locale, path: ROUTES.CONTACT, title: t('title'), description: t('description') })
}

const ContactPage = async ({ params, searchParams }: ContactPageProps) => {
  const { locale } = await params
  bindRequestLocale(locale)
  const [prefill, site, t] = await Promise.all([searchParams.then(parseContactPrefill), getSiteProfile(locale), getTranslations({ locale })])

  // Početna poruka iz procene ili paketa (dizajn: „Web app · Web, iOS · … · 10–13 weeks").
  const fromEstimate = prefill.estimate
    ? (() => {
        const result = estimate(prefill.estimate)
        const parts = [
          t(`home.estimator.types.${prefill.estimate.type}`),
          prefill.estimate.platforms.map((p) => t(`home.estimator.platforms.${p}`)).join(', '),
          prefill.estimate.features.map((f) => t(`home.estimator.features.${f}`)).join(', '),
          `${String(result.low)}–${String(result.high)} ${t('home.estimator.weeks')}`,
        ].filter(Boolean)
        return t('contact.prefill.estimate', { summary: parts.join(' · ') })
      })()
    : null
  const fromPlan = prefill.plan ? t('contact.prefill.plan', { plan: t(`home.pricing.plans.${prefill.plan}.title`) }) : null

  return (
    <ContactView
      email={emailFrom(site.links)}
      defaults={{
        projectType: prefill.projectType,
        budget: prefill.budget,
        timeline: prefill.timeline,
        message: fromEstimate ?? fromPlan ?? '',
        estimate: prefill.estimate,
      }}
    />
  )
}

export default ContactPage
