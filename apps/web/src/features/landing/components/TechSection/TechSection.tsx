import { useTranslation } from 'react-i18next'

import { TechGrid } from '@/features/landing/components/TechGrid'
import type { Technology } from '@/features/projects'
import { SECTION_IDS } from '@/lib/navigation'
import { SectionBlock } from '@app/ui'

/** Sekcija sa mrežom tehnologija — zamenjuje spisak tagova tekstom u StudioSection. */
interface TechSectionProps {
  technologies: readonly Technology[]
}

export const TechSection = ({ technologies }: TechSectionProps) => {
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
      <TechGrid technologies={technologies} />
    </SectionBlock>
  )
}
