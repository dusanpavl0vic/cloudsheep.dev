'use client'

import { useTranslations } from 'next-intl'

import Button from '@/components/buttons/Button'
import IconButton from '@/components/buttons/IconButton'
import ThemeToggle from '@/components/buttons/ThemeToggle'
import Logo from '@/components/foundations/Logo'
import LanguageSwitch from '@/components/navigation/LanguageSwitch'
import ScrollProgress from '@/components/navigation/ScrollProgress'
import { MODALS } from '@/constants/modals'
import { ROUTES } from '@/constants/routes'
import { useMainNav } from '@/hooks/navigation'
import { useThemeToggle } from '@/hooks/preferences'
import { useModal } from '@/hooks/useModal'

import {
  Actions,
  Bar,
  BelowWide,
  HomeLink,
  Nav,
  NavLink,
  OnTablet,
  OnWide,
  Root,
} from './Header.styles'

/** Plutajući stakleni header javnog sajta (dizajn): navigacija, jezik, tema, CTA, napredak. */
const Header = () => {
  const t = useTranslations()
  const { links } = useMainNav()
  const { isDark, toggle } = useThemeToggle()
  const mobileNav = useModal(MODALS.MOBILE_NAV)

  return (
    <Root>
      <Bar>
        <HomeLink href={ROUTES.HOME} aria-label={t('nav.home')}>
          <Logo animated />
        </HomeLink>

        <Nav aria-label={t('nav.label')}>
          {links.map((link) => (
            <NavLink
              key={link.key}
              href={link.href}
              $active={link.isActive}
              aria-current={link.isActive ? 'location' : undefined}
            >
              {t(`nav.${link.key}`)}
            </NavLink>
          ))}
        </Nav>

        <Actions>
          <OnWide>
            <LanguageSwitch />
          </OnWide>
          <ThemeToggle
            isDark={isDark}
            onToggle={toggle}
            label={t(isDark ? 'theme.toLight' : 'theme.toDark')}
          />
          <OnTablet>
            <Button href={ROUTES.CONTACT} size="s" iconRight="arrowRight">
              {t('common.primaryCta')}
            </Button>
          </OnTablet>
          <BelowWide>
            <IconButton icon="menu" label={t('nav.openMenu')} onClick={() => mobileNav.open()} />
          </BelowWide>
        </Actions>

        <ScrollProgress />
      </Bar>
    </Root>
  )
}

export default Header
