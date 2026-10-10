import { useTranslations } from 'next-intl'

import CountUp from '@/components/data-display/CountUp'
import Section from '@/components/sections/Section'
import SectionHeader from '@/components/sections/SectionHeader'
import { EFFECT_ATTRS } from '@/constants/effects'
import { HOME_SECTIONS } from '@/constants/routes'

import { INSIGHT_STATS } from './Insight.constants'
import { Label, Stat, Stats, Uptime, Value } from './Insight.styles'
import UptimeBars from './UptimeBars'

const reveal = { [EFFECT_ATTRS.reveal]: '' }

/** „Napravljeno da radi" — brojke studija i 90 dana uptime-a. */
const Insight = () => {
  const t = useTranslations('home.insight')

  return (
    <Section id={HOME_SECTIONS.INSIGHT} labelledBy="insight-title" align="center" spacing="loose">
      <SectionHeader eyebrow={t('eyebrow')} title={t('title')} muted={t('muted')} lead={t('body')} titleId="insight-title" align="center" />
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
      <Uptime {...reveal}>
        <UptimeBars label={t('uptime.label')} period={t('uptime.period')} summary={t('uptime.ok')} />
      </Uptime>
    </Section>
  )
}

export default Insight
