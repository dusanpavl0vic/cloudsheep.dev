'use client'

import NextLink from 'next/link'
import { useTranslations } from 'next-intl'
import type { ReactNode } from 'react'

import Button from '@/components/buttons/Button'
import SegmentedControl from '@/components/buttons/SegmentedControl'
import ThemeToggle from '@/components/buttons/ThemeToggle'
import Spinner from '@/components/feedback/Spinner'
import Logo from '@/components/foundations/Logo'
import { LOCALE_LABELS } from '@/constants/i18n'
import { ROUTES } from '@/constants/routes'
import { useAdminLocale, useAdminNav, useLogout, useRequireAdmin } from '@/hooks/admin/session'
import { useThemeToggle } from '@/hooks/preferences'

import { Brand, Centered, Footer, Main, MobileBar, NavLink, NavList, Root, Sidebar, User } from './AppShell.styles'

/** Ljuska admin-a: meni, korisnik, jezik, tema, odjava. Bez sesije — ništa (preusmerenje na prijavu). */
const AppShell = ({ children }: { children: ReactNode }) => {
  const t = useTranslations('admin')
  const tTheme = useTranslations('theme')
  const { status, user } = useRequireAdmin()
  const nav = useAdminNav()
  const language = useAdminLocale()
  const theme = useThemeToggle()
  const { logout, isLoggingOut } = useLogout()

  if (status !== 'authenticated') {
    return (
      <Centered role="status">
        <Spinner size={22} />
        {t('shell.checking')}
      </Centered>
    )
  }

  const controls = (
    <>
      <SegmentedControl
        mono
        label={t('shell.language')}
        value={language.locale}
        onChange={language.switchTo}
        options={language.locales.map((value) => ({ value, label: LOCALE_LABELS[value] }))}
      />
      <ThemeToggle isDark={theme.isDark} onToggle={theme.toggle} label={tTheme(theme.isDark ? 'toLight' : 'toDark')} />
    </>
  )

  return (
    <Root>
      <Sidebar>
        <Brand>
          <NextLink href={ROUTES.ADMIN} aria-label={t('nav.dashboard')}>
            <Logo size={26} />
          </NextLink>
          <MobileBar>{controls}</MobileBar>
        </Brand>
        <nav aria-label={t('shell.label')}>
          <NavList>
            {nav.map((item) => (
              <li key={item.key}>
                <NavLink component={NextLink} href={item.href} $active={item.isActive} aria-current={item.isActive ? 'page' : undefined}>
                  {t(`nav.${item.key}`)}
                </NavLink>
              </li>
            ))}
          </NavList>
        </nav>
        <Footer>
          {user && <User>{user.email}</User>}
          {controls}
          <Button href={ROUTES.HOME} variant="ghost" size="s" iconRight="arrowUpRight" linkComponent={NextLink}>
            {t('shell.viewSite')}
          </Button>
          <Button variant="secondary" size="s" iconLeft="logOut" loading={isLoggingOut} onClick={() => void logout()}>
            {t('shell.logout')}
          </Button>
        </Footer>
      </Sidebar>
      <Main id="main">{children}</Main>
    </Root>
  )
}

export default AppShell
