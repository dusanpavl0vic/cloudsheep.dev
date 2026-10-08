import { useTranslations } from 'next-intl'

import SectionHeader from '@/components/sections/SectionHeader'
import { EFFECT_ATTRS } from '@/constants/effects'
import { HOME_SECTIONS } from '@/constants/routes'
import { PROCESS_TONES } from '@/constants/theme'

import { PROCESS_STEPS } from './Process.constants'
import {
  BigNumber,
  Card,
  CardIndex,
  CardText,
  CardTitle,
  Deck,
  Intro,
  Meta,
  Progress,
  ProgressFill,
  Root,
  Step,
  StepIndex,
  Steps,
  StepTitle,
  Sticky,
} from './Process.styles'

const tone = (index: number) => PROCESS_TONES[index % PROCESS_TONES.length] ?? PROCESS_TONES[0]
const label = (index: number) => `/0${String(index + 1)}`

/**
 * „Proces bez iznenađenja." — sekcija se zakači, a skrol smenjuje karte faza (`PageEffects`).
 * Bez JS-a i uz smanjeno kretanje: obična lista.
 */
const Process = () => {
  const t = useTranslations('home.process')

  return (
    <Root id={HOME_SECTIONS.PROCESS} aria-labelledby="process-title" {...{ [EFFECT_ATTRS.pin]: '' }}>
      <Sticky>
        <Intro>
          <SectionHeader eyebrow={t('eyebrow')} title={t('title')} muted={t('muted')} titleId="process-title" />
          <Steps aria-hidden="true">
            {PROCESS_STEPS.map((key, index) => (
              <Step key={key} {...{ [EFFECT_ATTRS.pinStep]: index }}>
                <StepIndex $tone={tone(index)}>{label(index)}</StepIndex>
                <StepTitle>{t(`steps.${key}.title`)}</StepTitle>
              </Step>
            ))}
          </Steps>
          <Progress aria-hidden="true">
            <ProgressFill {...{ [EFFECT_ATTRS.pinFill]: '' }} />
          </Progress>
        </Intro>
        <Deck>
          {PROCESS_STEPS.map((key, index) => (
            <Card key={key} $tone={tone(index)} $layer={index + 1} {...{ [EFFECT_ATTRS.pinCard]: index }}>
              <BigNumber $tone={tone(index)} aria-hidden="true">
                {`0${String(index + 1)}`}
              </BigNumber>
              <CardIndex $tone={tone(index)} aria-hidden="true">
                {label(index)}
              </CardIndex>
              <CardTitle>{t(`steps.${key}.title`)}</CardTitle>
              <CardText>{t(`steps.${key}.desc`)}</CardText>
              <Meta>{t(`steps.${key}.meta`)}</Meta>
            </Card>
          ))}
        </Deck>
      </Sticky>
    </Root>
  )
}

export default Process
