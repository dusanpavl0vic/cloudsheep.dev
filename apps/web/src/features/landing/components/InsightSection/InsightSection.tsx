import { useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { STUDIO_METRICS, type StudioMetric } from '@/features/landing/landing.constants'
import { SECTION_IDS } from '@/lib/navigation'
import { useCountUp, useIntersection, useMediaQuery } from '@app/hooks'
import { SectionBlock } from '@app/ui'

import {
  statItemVariants,
  statLabelVariants,
  statStripVariants,
  statSuffixVariants,
  statValueVariants,
} from './InsightSection.variants'

/**
 * Jedna brojka.
 *
 * Odbrojava tek kad traka uđe u viewport — brojač koji se odvrti van ekrana niko ne vidi.
 * `useCountUp` i `useIntersection` već postoje u `@app/hooks` i testirani su.
 */
function Stat({ metric, active }: { metric: StudioMetric; active: boolean }) {
  const { t } = useTranslation('landing')
  const prefersReduced = useMediaQuery('(prefers-reduced-motion: reduce)')

  const shown = useCountUp(metric.value, {
    active,
    decimals: metric.decimals,
    immediate: prefersReduced,
  })

  return (
    <div className={statItemVariants()}>
      <p className={statValueVariants()}>
        {shown.toFixed(metric.decimals)}
        <span className={statSuffixVariants()}>{metric.suffix}</span>
      </p>
      <p className={statLabelVariants()}>{t(metric.labelKey)}</p>
    </div>
  )
}

/** Traka sa brojkama koje govore kako studio radi. */
export const InsightSection = () => {
  const { t } = useTranslation('landing')
  const ref = useRef<HTMLDivElement>(null)
  const isVisible = useIntersection(ref, { once: true, threshold: 0.3 })

  return (
    <SectionBlock
      id={SECTION_IDS.INSIGHT}
      eyebrow={t('insight.eyebrow')}
      title={t('insight.title')}
      muted={t('insight.titleMuted')}
      subtitle={t('insight.body')}
      align="center"
    >
      <div ref={ref} className={statStripVariants()}>
        {STUDIO_METRICS.map((metric) => (
          <Stat key={metric.id} metric={metric} active={isVisible} />
        ))}
      </div>
    </SectionBlock>
  )
}
