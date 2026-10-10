import { useTranslations } from 'next-intl'
import type { ReactNode } from 'react'

import AuroraBackground from '../AuroraBackground'
import type { FooterProps } from '../Footer'
import Footer from '../Footer'
import Header from '../Header'
import PageEffects from '../PageEffects'
import SkipLink from '../SkipLink'
import { Main, Shell } from './PublicLayout.styles'

interface PublicLayoutProps extends Pick<FooterProps, 'links' | 'projects'> {
  children: ReactNode
}

/** Okvir javnog sajta: aurora, header, sadržaj, podnožje, efekti iz dizajna. */
const PublicLayout = ({ children, links, projects }: PublicLayoutProps) => {
  const t = useTranslations('shell')

  return (
    <Shell>
      <SkipLink label={t('skipToContent')} />
      <AuroraBackground />
      <Header />
      <Main id="main" tabIndex={-1}>
        {children}
      </Main>
      <Footer links={links} projects={projects} />
      <PageEffects />
    </Shell>
  )
}

export default PublicLayout
