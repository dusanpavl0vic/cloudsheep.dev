import { useTranslation } from 'react-i18next'

import { DisciplineRow } from '@/components/DisciplineRow'
import { DISCIPLINES } from '@/features/landing/landing.constants'
import { SECTION_IDS } from '@/lib/navigation'
import { SectionBlock } from '@app/ui'

export const ServicesSection = () => {
  const { t } = useTranslation(['landing', 'common'])

  return (
    <SectionBlock
      id={SECTION_IDS.SERVICES}
      eyebrow={t('services.eyebrow')}
      title={t('services.title')}
    >
      <div className="flex flex-col">
        {DISCIPLINES.map((item, itemIndex) => (
          <DisciplineRow
            key={item.id}
            index={item.index}
            title={t(item.titleKey)}
            description={t(item.descriptionKey)}
            tags={item.tags}
            emphasis={itemIndex === 0 ? 'first' : 'default'}
          />
        ))}
      </div>
    </SectionBlock>
  )
}
