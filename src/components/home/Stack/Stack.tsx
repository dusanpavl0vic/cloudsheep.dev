import { useTranslations } from 'next-intl'

import TechTile from '@/components/data-display/TechTile'
import Section from '@/components/sections/Section'
import SectionHeader from '@/components/sections/SectionHeader'
import { EFFECT_ATTRS } from '@/constants/effects'
import { HOME_SECTIONS } from '@/constants/routes'
import type { Technology } from '@/types/technology'

import { stackRows } from './Stack.constants'
import { Board, Grid, Item, Row, Rows } from './Stack.styles'

interface StackProps {
  technologies: Technology[]
}

/** „Alati koje koristim" — tehnologije iz admin-a kao pločice u talasu nad mrežom. */
const Stack = ({ technologies }: StackProps) => {
  const t = useTranslations('home.stack')
  if (technologies.length === 0) return null

  return (
    <Section id={HOME_SECTIONS.STACK} labelledBy="stack-title" align="center">
      <SectionHeader eyebrow={t('eyebrow')} title={t('title')} muted={t('muted')} lead={t('subtitle')} titleId="stack-title" align="center" />
      <Board {...{ [EFFECT_ATTRS.reveal]: '' }}>
        <Grid aria-hidden="true" />
        <Rows>
          {stackRows(technologies).map((row, index) => (
            <Row key={index}>
              {row.map(({ tech, size, lift }) => (
                <Item key={tech.id} $lift={lift}>
                  <TechTile label={tech.label} logoUrl={tech.logoUrl} size={size} />
                </Item>
              ))}
            </Row>
          ))}
        </Rows>
      </Board>
    </Section>
  )
}

export default Stack
