import { useTranslation } from 'react-i18next'

import { TechGrid } from '@/features/landing/components/TechGrid'
import { SECTION_IDS } from '@/lib/navigation'
import { SectionBlock } from '@app/ui'

/** Sekcija sa mrežom tehnologija — zamenjuje spisak tagova tekstom u StudioSection. */
export const TechSection = () => {
  const { t } = useTranslation('landing')

  return (
    <SectionBlock
      id={SECTION_IDS.STACK}
      eyebrow={t('stack.eyebrow')}
      title={t('stack.title')}
      muted={t('stack.titleMuted')}
      subtitle={t('stack.subtitle')}
      align="center"
    >
      <TechGrid />
    </SectionBlock>
  )
}
