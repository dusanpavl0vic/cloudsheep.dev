import { useTranslation } from 'react-i18next'

import { ProcessCard } from '@/components/ProcessCard'
import { PROCESS_STEPS } from '@/features/landing/landing.constants'
import { SECTION_IDS } from '@/lib/navigation'
import { SectionBlock } from '@app/ui'

export const ProcessSection = () => {
  const { t } = useTranslation(['landing', 'common'])

  return (
    <SectionBlock
      id={SECTION_IDS.PROCESS}
      eyebrow={t('process.eyebrow')}
      title={t('process.title')}
      muted={t('process.titleMuted')}
      align="center"
      surface="panel"
    >
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {PROCESS_STEPS.map((step) => (
          <ProcessCard
            key={step.id}
            index={step.index}
            title={t(step.titleKey)}
            description={t(step.descriptionKey)}
            meta={t(step.metaKey)}
            tone={step.tone}
          />
        ))}
      </div>
    </SectionBlock>
  )
}
