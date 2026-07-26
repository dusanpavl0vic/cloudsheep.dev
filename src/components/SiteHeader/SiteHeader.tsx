import { useTranslation } from 'react-i18next'
import { Link, NavLink } from 'react-router'

import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { Logo } from '@/components/Logo'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { MAIN_NAV } from '@/constants/navigation'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/lib/cn'

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
        <Link to={ROUTES.HOME} aria-label={t('common.appName')}>
          <Logo size="sm" label={t('common.appNameLower')} />
        </Link>

        <nav className={siteNavVariants()} aria-label={t('nav.label')}>
          {MAIN_NAV.map((item) =>
            item.route ? (
              // Rute (Work, Contact) dobijaju aktivno stanje kad si na toj stranici
              <NavLink
                key={item.id}
                to={item.to}
                className={({ isActive }) =>
                  cn(siteNavLinkVariants(), isActive && 'text-foreground')
                }
              >
                {t(item.labelKey)}
              </NavLink>
            ) : (
              // Sidra na landing sekcije — bez aktivnog stanja
              <Link key={item.id} to={item.to} className={siteNavLinkVariants()}>
                {t(item.labelKey)}
              </Link>
            ),
          )}
        </nav>

        <div className="ml-auto flex items-center gap-3 md:ml-0">
          <LanguageSwitcher />
          <ThemeToggle />
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link to={ROUTES.CONTACT}>{t('nav.getStarted')}</Link>
          </Button>
        </div>
      </Container>
    </header>
  )
}
