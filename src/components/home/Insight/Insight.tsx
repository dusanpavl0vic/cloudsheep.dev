import { useTranslations } from 'next-intl'

import CountUp from '@/components/data-display/CountUp'
import Section from '@/components/sections/Section'
import SectionHeader from '@/components/sections/SectionHeader'
import { EFFECT_ATTRS } from '@/constants/effects'
import { HOME_SECTIONS } from '@/constants/routes'

import { INSIGHT_STATS } from './Insight.constants'
import { Label, Stat, Stats, Value } from './Insight.styles'

const reveal = { [EFFECT_ATTRS.reveal]: '' }

/** „Napravljeno da radi" — brojke studija. */
const Insight = () => {
  const t = useTranslations('home.insight')

  return (
    <Section id={HOME_SECTIONS.INSIGHT} labelledBy="insight-title" align="center" spacing="loose">
      <SectionHeader
        eyebrow={t('eyebrow')}
        title={t('title')}
        muted={t('muted')}
        lead={t('body')}
        titleId="insight-title"
        align="center"
      />
      <Stats {...reveal}>
        {INSIGHT_STATS.map((stat) => (
          <Stat key={stat.key}>
            <Value>
              <CountUp value={stat.value} decimals={stat.decimals} suffix={stat.suffix} />
            </Value>
            <Label>{t(`stats.${stat.key}`)}</Label>
          </Stat>
        ))}
      </Stats>
    </Section>
  )
}

export default Insight
