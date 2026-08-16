import { useTranslation } from 'react-i18next'

import { SECTION_IDS } from '@/constants/navigation'
import { HERO_STATS, TECH_STACK } from '@/features/landing/landing.constants'
import { Badge, Container, StatItem, TagList } from '@app/ui'

import {
  studioGridVariants,
  studioIndexVariants,
  studioLeadVariants,
  studioStackLabelVariants,
  studioStackRowVariants,
  studioStatsVariants,
  studioTextVariants,
  studioTitleVariants,
} from './StudioSection.variants'

export const StudioSection = () => {
  const { t } = useTranslation()

  return (
    <section id={SECTION_IDS.STUDIO} className="py-24">
      <Container className={studioGridVariants()}>
        <div className="flex flex-col gap-3">
          <span className={studioIndexVariants()}>{t('studio.index')}</span>
          <h2 className={studioTitleVariants()}>{t('studio.title')}</h2>
          <Badge dot="success" className="mt-1 self-start">
            {t('studio.availability')}
          </Badge>
        </div>

        <div className="flex flex-col gap-5">
          <p className={studioLeadVariants()}>{t('studio.lead')}</p>
          <p className={studioTextVariants()}>{t('studio.body')}</p>

          <div className={studioStatsVariants()}>
            {HERO_STATS.map((stat) => (
              <StatItem
                key={stat.id}
                value={t(stat.valueKey)}
                label={t(stat.labelKey)}
                tone={stat.tone}
              />
            ))}
          </div>

          <div className="flex flex-col gap-3 pt-6">
            {TECH_STACK.map((row) => (
              <div key={row.id} className={studioStackRowVariants()}>
                <span className={studioStackLabelVariants()}>{t(row.labelKey)}</span>
                <TagList tags={row.tags} variant="outline" font="sans" />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
