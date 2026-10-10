import { useTranslations } from 'next-intl'

import Icon from '@/components/foundations/Icon'
import { BRAND } from '@/constants/brand'
import { EFFECT_ATTRS } from '@/constants/effects'
import { contactHref, HOME_SECTIONS, homeSectionHref } from '@/constants/routes'
import { BRAND_COLORS } from '@/constants/theme'

import { SCROLL_TARGET, TERM_KEYS, WORD_START_S, WORD_STEP_S } from './Hero.constants'
import {
  Actions,
  Badge,
  BadgeTld,
  Content,
  Description,
  GlassButton,
  Highlight,
  Line,
  Root,
  ScrollHint,
  ShinyButton,
  Title,
  Underline,
  Word,
  WordMask,
} from './Hero.styles'
import type { HeroProps } from './Hero.types'
import HeroBackdrop from './HeroBackdrop'
import HeroTerminal from './HeroTerminal'
import HeroThoughts from './HeroThoughts'

const words = (text: string) => text.split(' ').filter(Boolean)

/** Hero početne: naslov reč po reč, terminal, dva CTA, oblaci misli i sjaj kursora. */
const Hero = ({ technologies }: HeroProps) => {
  const t = useTranslations('home.hero')
  const top = words(t('titleTop'))
  const bottom = words(t('titleBottom'))
  const delay = (index: number) => WORD_START_S + index * WORD_STEP_S

  return (
    <Root aria-labelledby="hero-title" {...{ [EFFECT_ATTRS.hero]: '' }}>
      <HeroBackdrop />
      <HeroThoughts technologies={technologies} />

      <Content {...{ [EFFECT_ATTRS.heroContent]: '' }}>
        <Badge>
          {BRAND.wordmark}
          <BadgeTld>{BRAND.tld}</BadgeTld>
        </Badge>
        <Title id="hero-title">
          <Line>
            {top.map((word, index) => (
              <WordMask key={`${word}-${String(index)}`}>
                <Word $delay={delay(index)}>{word}</Word>
              </WordMask>
            ))}
          </Line>{' '}
          <Line $muted>
            {bottom.map((word, index) => (
              <WordMask key={`${word}-${String(index)}`}>
                <Word $delay={delay(top.length + index)}>{word}</Word>
              </WordMask>
            ))}
            <WordMask>
              <Word $delay={delay(top.length + bottom.length)}>
                <Highlight>{t('titleHighlight')}</Highlight>
              </Word>
            </WordMask>
          </Line>
        </Title>
        <Underline viewBox="0 0 400 24" aria-hidden="true">
          <defs>
            <linearGradient id="hero-underline" x1="0" x2="1">
              <stop offset="0" stopColor={BRAND_COLORS.blue} />
              <stop offset="1" stopColor={BRAND_COLORS.sky} />
            </linearGradient>
          </defs>
          <path
            d="M4 16 C 80 4, 160 4, 220 12 S 340 22, 396 8"
            fill="none"
            stroke="url(#hero-underline)"
            strokeWidth={5}
            strokeLinecap="round"
          />
        </Underline>
        <Description>{t('description')}</Description>
        <HeroTerminal phrases={TERM_KEYS.map((key) => t(`terms.${key}`))} />
        <Actions>
          <ShinyButton href={contactHref()} size="l" iconRight="arrowRight">
            {t('primaryCta')}
          </ShinyButton>
          <GlassButton href={homeSectionHref(HOME_SECTIONS.WORK)} variant="secondary" size="l">
            {t('secondaryCta')}
          </GlassButton>
        </Actions>
      </Content>

      <ScrollHint href={SCROLL_TARGET}>
        {t('scroll')}
        <Icon name="arrowDown" size={14} />
      </ScrollHint>
    </Root>
  )
}

export default Hero
