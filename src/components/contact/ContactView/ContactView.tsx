import { useTranslations } from 'next-intl'

import LocalClock from '@/components/data-display/LocalClock'
import I18nProvider from '@/providers/I18nProvider'

import BriefForm, { type BriefFormProps } from '../BriefForm'
import { Eyebrow, Intro, Lead, Muted, Reach, Root, Title } from './ContactView.styles'

interface ContactViewProps {
  email: string | null
  defaults: BriefFormProps['defaults']
}

/** Namespace-i koje forma upita koristi u pregledaču (docs/09 §3). */
const BRIEF_NAMESPACES = ['contact', 'validation', 'email', 'errors'] as const

/** `/contact` — uvod sa adresom i lokalnim vremenom, termini i upit u tri koraka. */
const ContactView = ({ email, defaults }: ContactViewProps) => {
  const t = useTranslations()

  const intro = (
    <Intro>
      <Eyebrow>{`[ ${t('common.primaryCta')} ]`}</Eyebrow>
      <Title>
        {t('contact.title')} <Muted>{t('contact.titleMuted')}</Muted>
      </Title>
      <Lead>{t('contact.lead')}</Lead>
      <Reach>
        {email && <a href={`mailto:${email}`}>{email}</a>}
        <LocalClock />
      </Reach>
    </Intro>
  )

  return (
    <Root>
      <I18nProvider namespaces={[...BRIEF_NAMESPACES, 'footer']}>
        <BriefForm intro={intro} defaults={defaults} />
      </I18nProvider>
    </Root>
  )
}

export default ContactView
