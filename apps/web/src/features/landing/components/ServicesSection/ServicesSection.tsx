import { useTranslation } from 'react-i18next'

import { DisciplineCard } from '@/features/landing/components/DisciplineCard'
import { DISCIPLINES } from '@/features/landing/landing.constants'
import { usePointerGlow } from '@/hooks/usePointerGlow'
import { SECTION_IDS } from '@/lib/navigation'
import { SectionBlock } from '@app/ui'

import { servicesGridVariants } from './ServicesSection.variants'

export const ServicesSection = () => {
  const { t } = useTranslation(['landing', 'common'])

  // Jedan slušalac za sva četiri panela — kartica pod kursorom se nalazi kroz `closest()`
  const gridRef = usePointerGlow<HTMLDivElement>()

  return (
    <SectionBlock
      id={SECTION_IDS.SERVICES}
      eyebrow={t('services.eyebrow')}
      title={t('services.title')}
      muted={t('services.titleMuted')}
      align="center"
    >
      <div ref={gridRef} className={servicesGridVariants()}>
        {DISCIPLINES.map((item) => (
          <DisciplineCard
            key={item.id}
            no={item.no}
            slug={item.slug}
            title={t(item.titleKey)}
            description={t(item.descriptionKey)}
            tags={item.tags}
          />
        ))}
      </div>
    </SectionBlock>
  )
}
