'use client'

import { useTranslations } from 'next-intl'

import Button from '@/components/buttons/Button'
import Chip from '@/components/buttons/Chip'
import { ESTIMATE_FEATURES, ESTIMATE_PACES, ESTIMATE_PLATFORMS, ESTIMATE_TYPES } from '@/constants/estimator'
import { HOME_SECTIONS } from '@/constants/routes'
import { ESTIMATE_PHASE_COLORS } from '@/constants/theme'
import { useEstimator } from '@/hooks/estimator'

import {
  Bar,
  Eyebrow,
  Fact,
  Facts,
  Group,
  Heading,
  Legend,
  LegendItem,
  Muted,
  Note,
  Options,
  Panel,
  PhaseLegend,
  Questions,
  Range,
  Result,
  ResultLabel,
  Segment,
  Swatch,
  Title,
  Unit,
} from './Estimator.styles'

const keysOf = <T extends object>(source: T) => Object.keys(source) as (keyof T & string)[]
const phaseColor = (index: number) => ESTIMATE_PHASE_COLORS[index % ESTIMATE_PHASE_COLORS.length] ?? ESTIMATE_PHASE_COLORS[0]

interface EstimatorProps {
  /** Najraniji početak, već formatiran na serveru („nov 2026"). */
  earliestStart: string
}

/** „Proceni za 30 sekundi" — četiri pitanja, trajanje po fazama, prenos u upit. */
const Estimator = ({ earliestStart }: EstimatorProps) => {
  const t = useTranslations('home.estimator')
  const { selection, result, briefHref, setType, togglePlatform, toggleFeature, setPace } = useEstimator()
  const total = result.phases.reduce((sum, phase) => sum + phase.weeks, 0)
  const platformsApply = selection.type === 'webapp' || selection.type === 'mobile'

  return (
    <Panel id={HOME_SECTIONS.ESTIMATOR}>
      <Questions>
        <Heading>
          <Eyebrow>{`[ ${t('eyebrow')} ]`}</Eyebrow>
          <Title>
            {t('title')} <Muted>{t('muted')}</Muted>
          </Title>
        </Heading>
        <Group role="radiogroup">
          <Legend>{t('questions.type')}</Legend>
          <Options>
            {keysOf(ESTIMATE_TYPES).map((type) => (
              <Chip key={type} selected={selection.type === type} onClick={() => { setType(type) }}>
                {t(`types.${type}`)}
              </Chip>
            ))}
          </Options>
        </Group>
        <Group disabled={!platformsApply}>
          <Legend>{t('questions.platforms')}</Legend>
          <Options>
            {keysOf(ESTIMATE_PLATFORMS).map((platform) => (
              <Chip key={platform} role="checkbox" selected={selection.platforms.includes(platform)} onClick={() => { togglePlatform(platform) }}>
                {t(`platforms.${platform}`)}
              </Chip>
            ))}
          </Options>
        </Group>
        <Group>
          <Legend>{t('questions.features')}</Legend>
          <Options>
            {keysOf(ESTIMATE_FEATURES).map((feature) => (
              <Chip key={feature} role="checkbox" selected={selection.features.includes(feature)} onClick={() => { toggleFeature(feature) }}>
                {t(`features.${feature}`)}
              </Chip>
            ))}
          </Options>
        </Group>
        <Group role="radiogroup">
          <Legend>{t('questions.pace')}</Legend>
          <Options>
            {keysOf(ESTIMATE_PACES).map((pace) => (
              <Chip key={pace} selected={selection.pace === pace} onClick={() => { setPace(pace) }}>
                {t(`paces.${pace}`)}
              </Chip>
            ))}
          </Options>
        </Group>
      </Questions>

      <Result>
        <ResultLabel id="estimate-result">{t('result')}</ResultLabel>
        <Range aria-labelledby="estimate-result" aria-live="polite">
          {`${String(result.low)}–${String(result.high)} `}
          <Unit>{t('weeks')}</Unit>
        </Range>
        <Bar aria-hidden="true">
          {result.phases.map((phase, index) => (
            <Segment key={phase.key} $color={phaseColor(index)} style={{ width: `${String((phase.weeks / total) * 100)}%` }} />
          ))}
        </Bar>
        <PhaseLegend>
          {result.phases.map((phase, index) => (
            <LegendItem key={phase.key}>
              <Swatch $color={phaseColor(index)} aria-hidden="true" />
              {t('phaseWeeks', { name: t(`phases.${phase.key}`), weeks: phase.weeks })}
            </LegendItem>
          ))}
        </PhaseLegend>
        <Facts>
          <Fact>
            <dt>{t('team')}</dt>
            <dd>{result.specialists === 0 ? t('leadOnly') : t('leadWith', { count: result.specialists })}</dd>
          </Fact>
          <Fact>
            <dt>{t('start')}</dt>
            <dd>{earliestStart}</dd>
          </Fact>
        </Facts>
        <Button href={briefHref} variant="accent" size="l" iconRight="arrowRight" fullWidth>
          {t('send')}
        </Button>
        <Note>{t('note')}</Note>
      </Result>
    </Panel>
  )
}

export default Estimator
