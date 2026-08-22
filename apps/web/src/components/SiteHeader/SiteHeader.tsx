import { useTranslation } from 'react-i18next'
import { Link, NavLink } from 'react-router'

import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { MobileNav } from '@/components/MobileNav'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useActiveSection } from '@/hooks/useActiveSection'
import { MAIN_NAV, TRACKED_SECTION_IDS } from '@/lib/navigation'
import { ROUTES } from '@/lib/routes'
import { Button, Container, Logo, cn } from '@app/ui'

import {
  siteHeaderInnerVariants,
  siteHeaderVariants,
  siteNavLinkVariants,
  siteNavVariants,
} from './SiteHeader.variants'

export const SiteHeader = () => {
  const { t } = useTranslation('common')

  const activeSection = useActiveSection(TRACKED_SECTION_IDS)

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
              // Rute (Work, Contact) — aktivne kad si na toj stranici
              <NavLink
                key={item.id}
                to={item.to}
                className={({ isActive }) =>
                  cn(siteNavLinkVariants(), isActive && 'is-active text-foreground')
                }
              >
                {t(item.labelKey)}
              </NavLink>
            ) : (
              // Sidra na landing sekcije — aktivna kad je ta sekcija na ekranu
              <Link
                key={item.id}
                to={item.to}
                aria-current={item.sectionId === activeSection ? 'location' : undefined}
                className={cn(
                  siteNavLinkVariants(),
                  item.sectionId === activeSection && 'is-active text-foreground',
                )}
              >
                {t(item.labelKey)}
              </Link>
            ),
          )}
        </nav>

        {/* Ispod `lg` sve ovo seli u bočni panel — na tabletu pet linkova, dva prebacivača
            i dugme ne staju u red od 72px, a zbijeni su premali za prst. */}
        <div className="ml-auto hidden items-center gap-3 lg:ml-0 lg:flex">
          <LanguageSwitcher />
          <ThemeToggle />
          <Button asChild size="sm">
            <Link to={ROUTES.CONTACT}>{t('nav.getStarted')}</Link>
          </Button>
        </div>

        <div className="ml-auto lg:hidden">
          <MobileNav activeSection={activeSection} />
        </div>
      </Container>
    </header>
  )
}
