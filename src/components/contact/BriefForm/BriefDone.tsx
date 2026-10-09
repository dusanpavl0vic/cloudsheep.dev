'use client'

import { useTranslations } from 'next-intl'

import Icon from '@/components/foundations/Icon'
import type { useBriefForm } from '@/hooks/contact'

import { Done, DoneMark, DoneTitle, Muted, Summary } from './BriefForm.styles'

interface BriefDoneProps {
  values: ReturnType<typeof useBriefForm>['values']
  slotLabel: string | null
}

/** Potvrda posle slanja, sa pregledom upita (dizajn). Fokus prelazi na naslov — čitač ga najavi. */
const BriefDone = ({ values, slotLabel }: BriefDoneProps) => {
  const t = useTranslations('contact')
  const rows = [
    [t('summary.type'), values.projectType ? t(`types.${values.projectType}.label`) : '—'],
    [t('summary.budget'), values.budget ? t(`budgets.${values.budget}`) : '—'],
    [t('summary.timeline'), values.timeline ? t(`timelines.${values.timeline}`) : '—'],
    [t('summary.call'), slotLabel ?? t('summary.noCall')],
  ] as const

  return (
    <Done role="status">
      <DoneMark aria-hidden="true">
        <Icon name="check" size={26} />
      </DoneMark>
      <DoneTitle tabIndex={-1} ref={(node) => node?.focus()}>
        {t('done.title', { name: values.name ?? '' })}
      </DoneTitle>
      <Muted>{t('done.body')}</Muted>
      <Summary>
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </Summary>
    </Done>
  )
}

export default BriefDone
