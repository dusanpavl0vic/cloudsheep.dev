import { useTranslations } from 'next-intl'

import TechTile from '@/components/data-display/TechTile'
import type { Technology } from '@/types/technology'

import { Item, List, Root, Track } from './TechRibbon.styles'

interface TechRibbonProps {
  technologies: Technology[]
}

/**
 * Beskonačna traka tehnologija. Spisak je dvaput u DOM-u da bi petlja bila bez šava; drugi
 * primerak je skriven od čitača ekrana.
 */
const TechRibbon = ({ technologies }: TechRibbonProps) => {
  const t = useTranslations('home.hero')
  if (technologies.length === 0) return null

  const list = (hidden: boolean) => (
    <List aria-hidden={hidden || undefined}>
      {technologies.map((tech) => (
        <Item key={tech.id}>
          <TechTile label={tech.label} logoUrl={tech.logoUrl} size={40} captioned />
          {tech.label}
        </Item>
      ))}
    </List>
  )

  return (
    <Root aria-label={t('technologies')}>
      <Track>
        {list(false)}
        {list(true)}
      </Track>
    </Root>
  )
}

export default TechRibbon
