import { useTranslations } from 'next-intl'

import SectionHeader from '@/components/sections/SectionHeader'
import { EFFECT_ATTRS } from '@/constants/effects'
import { HOME_SECTIONS } from '@/constants/routes'
import { PROCESS_TONES } from '@/constants/theme'

import { PROCESS_STEPS } from './Process.constants'
import {
  Deck,
  Intro,
  Progress,
  ProgressFill,
  Root,
  Step,
  StepIndex,
  Steps,
  StepTitle,
  Sticky,
} from './Process.styles'
import ProcessCard from './ProcessCard'

const tone = (index: number) => PROCESS_TONES[index % PROCESS_TONES.length] ?? PROCESS_TONES[0]
const label = (index: number) => `/0${String(index + 1)}`

/**
 * „Proces bez iznenađenja." — na desktopu se sekcija zakači, a skrol smenjuje karte faza
 * (`PageEffects`). Na telefonu su karte lista, na tabletu mreža 2×2; isto i bez JS-a.
 */
const Process = () => {
  const t = useTranslations('home.process')

  return (
    <Root
      id={HOME_SECTIONS.PROCESS}
      aria-labelledby="process-title"
      {...{ [EFFECT_ATTRS.pin]: '' }}
    >
      <Sticky>
        <Intro>
          <SectionHeader
            eyebrow={t('eyebrow')}
            title={t('title')}
            muted={t('muted')}
            titleId="process-title"
          />
          <Steps aria-hidden="true">
            {PROCESS_STEPS.map((key, index) => (
              <Step key={key} {...{ [EFFECT_ATTRS.pinStep]: index }}>
                <StepIndex>{label(index)}</StepIndex>
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
            <ProcessCard
              key={key}
              index={index}
              tone={tone(index)}
              title={t(`steps.${key}.title`)}
              text={t(`steps.${key}.desc`)}
              meta={t(`steps.${key}.meta`)}
            />
          ))}
        </Deck>
      </Sticky>
    </Root>
  )
}

export default Process
