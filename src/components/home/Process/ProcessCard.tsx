import { EFFECT_ATTRS } from '@/constants/effects'

import { BigNumber, Index, Meta, Root, Text, Title } from './ProcessCard.styles'

interface ProcessCardProps {
  /** Redni broj faze od nule — `applyPin` po njemu smenjuje karte. */
  index: number
  tone: string
  title: string
  text: string
  meta: string
}

const pad = (index: number) => `0${String(index + 1)}`

/** Jedna faza procesa: traka u boji faze, oznaka, naslov, opis, isporuka i veliki broj kao ukras. */
const ProcessCard = ({ index, tone, title, text, meta }: ProcessCardProps) => (
  <Root $tone={tone} $layer={index + 1} {...{ [EFFECT_ATTRS.pinCard]: index }}>
    <BigNumber $tone={tone} aria-hidden="true" data-number={pad(index)} />
    <Index aria-hidden="true">{`/${pad(index)}`}</Index>
    <Title>{title}</Title>
    <Text>{text}</Text>
    <Meta>{meta}</Meta>
  </Root>
)

export default ProcessCard
