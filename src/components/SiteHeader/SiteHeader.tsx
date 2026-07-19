import { useTranslation } from 'react-i18next'

import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { Logo } from '@/components/Logo'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { CONTACT_EMAIL, MAIN_NAV, SECTION_IDS } from '@/constants/navigation'

import {
  siteHeaderInnerVariants,
  siteHeaderVariants,
  siteNavLinkVariants,
  siteNavVariants,
} from './SiteHeader.variants'

export const SiteHeader = () => {
  const { t } = useTranslation()

  return (
    <header className={siteHeaderVariants()}>
      <Container className={siteHeaderInnerVariants()}>
        <a href={`#${SECTION_IDS.TOP}`} aria-label={t('common.appName')}>
          <Logo size="sm" label={t('common.appNameLower')} />
        </a>

        <nav className={siteNavVariants()} aria-label={t('nav.label')}>
          {MAIN_NAV.map((item) => (
            <a key={item.id} href={`#${item.id}`} className={siteNavLinkVariants()}>
              {t(item.labelKey)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <ThemeToggle />
          <Button asChild variant="accent" size="sm" className="hidden sm:inline-flex">
            <a href={`mailto:${CONTACT_EMAIL}`}>{t('nav.hire')}</a>
          </Button>
        </div>
      </Container>
    </header>
  )
}
