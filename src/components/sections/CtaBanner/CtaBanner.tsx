import { useTranslations } from 'next-intl'

import Button from '@/components/buttons/Button'
import Logo from '@/components/foundations/Logo'
import { EFFECT_ATTRS } from '@/constants/effects'
import { contactHref } from '@/constants/routes'

import { Accent, Actions, Dots, Glow, Panel, Title, Wrap } from './CtaBanner.styles'

interface CtaBannerProps {
  /** Adresa studija iz profila — dugme `mailto:`. Bez nje samo dugme ka upitu. */
  email: string | null
}

/** Završna traka pre podnožja (dizajn): „Jedan studio. Jedan čovek. Ceo proizvod." */
const CtaBanner = ({ email }: CtaBannerProps) => {
  const t = useTranslations('cta')

  return (
    <Wrap aria-labelledby="cta-title">
      <Panel {...{ [EFFECT_ATTRS.reveal]: '' }}>
        <Glow aria-hidden="true" />
        <Dots aria-hidden="true" />
        <Logo markOnly size={64} animated />
        <Title id="cta-title">
          {t('top')}
          <Accent>{t('bottom')}</Accent>
        </Title>
        <Actions>
          <Button href={contactHref()} variant="accent" size="l" iconRight="arrowRight">
            {t('button')}
          </Button>
          {email && (
            <Button href={`mailto:${email}`} variant="inverse" size="l">
              {email}
            </Button>
          )}
        </Actions>
      </Panel>
    </Wrap>
  )
}

export default CtaBanner
