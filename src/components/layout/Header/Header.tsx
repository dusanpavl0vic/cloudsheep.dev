'use client'

import { useTranslations } from 'next-intl'

import Button from '@/components/buttons/Button'
import IconButton from '@/components/buttons/IconButton'
import SegmentedControl from '@/components/buttons/SegmentedControl'
import ThemeToggle from '@/components/buttons/ThemeToggle'
import Logo from '@/components/foundations/Logo'
import ScrollProgress from '@/components/navigation/ScrollProgress'
import { LOCALE_LABELS } from '@/constants/i18n'
import { MODALS } from '@/constants/modals'
import { ROUTES } from '@/constants/routes'
import { useMainNav } from '@/hooks/navigation'
import { useLocaleSwitch, useThemeToggle } from '@/hooks/preferences'
import { useModal } from '@/hooks/useModal'

import { Actions, Bar, BelowDesktop, HomeLink, Nav, NavLink, OnTablet, Root } from './Header.styles'

/** Plutajući stakleni header javnog sajta (dizajn): navigacija, jezik, tema, CTA, napredak. */
const Header = () => {
  const t = useTranslations()
  const { links } = useMainNav()
  const { isDark, toggle } = useThemeToggle()
  const { locale, locales, switchTo } = useLocaleSwitch()
  const mobileNav = useModal(MODALS.MOBILE_NAV)

  return (
    <Root>
      <Bar>
        <HomeLink href={ROUTES.HOME} aria-label={t('nav.home')}>
          <Logo animated />
        </HomeLink>

        <Nav aria-label={t('nav.label')}>
          {links.map((link) => (
            <NavLink key={link.key} href={link.href} $active={link.isActive} aria-current={link.isActive ? 'location' : undefined}>
              {t(`nav.${link.key}`)}
            </NavLink>
          ))}
        </Nav>

        <Actions>
          <SegmentedControl
            mono
            label={t('language.label')}
            value={locale}
            onChange={switchTo}
            options={locales.map((value) => ({ value, label: LOCALE_LABELS[value], ariaLabel: t(`shell.languageNames.${value}`) }))}
          />
          <ThemeToggle isDark={isDark} onToggle={toggle} label={t(isDark ? 'theme.toLight' : 'theme.toDark')} />
          <OnTablet>
            <Button href={ROUTES.CONTACT} size="s" iconRight="arrowRight">
              {t('common.primaryCta')}
            </Button>
          </OnTablet>
          <BelowDesktop>
            <IconButton icon="menu" label={t('nav.openMenu')} onClick={() => mobileNav.open()} />
          </BelowDesktop>
        </Actions>

        <ScrollProgress />
      </Bar>
    </Root>
  )
}

export default Header
