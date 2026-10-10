'use client'

import { useTranslations } from 'next-intl'

import Button from '@/components/buttons/Button'
import ThemeToggle from '@/components/buttons/ThemeToggle'
import Logo from '@/components/foundations/Logo'
import LanguageSwitch from '@/components/navigation/LanguageSwitch'
import SideDrawer from '@/components/overlays/SideDrawer'
import { ROUTES } from '@/constants/routes'
import { useMainNav } from '@/hooks/navigation'
import { useThemeToggle } from '@/hooks/preferences'

import { Footer, Index, Item, List, Settings } from './MobileNav.styles'
import type { OverlayModalProps } from '../shared/types'

const pad = (index: number) => String(index + 1).padStart(2, '0')

/**
 * Navigacija dok pun meni ne stane u header (ispod 1200 px). Klik na stavku zatvara meni sam —
 * sidro na istoj stranici (`/#pricing`) ne menja putanju, pa ga `ModalRoot` ne bi zatvorio.
 * Na telefonu panel prekriva i header, pa su jezik i tema ovde.
 */
const MobileNav = ({ onClose }: OverlayModalProps) => {
  const t = useTranslations()
  const { links } = useMainNav()
  const { isDark, toggle } = useThemeToggle()

  return (
    <SideDrawer
      onClose={onClose}
      label={t('nav.label')}
      closeLabel={t('nav.closeMenu')}
      header={<Logo size={30} />}
    >
      <nav aria-label={t('nav.label')}>
        <List>
          {links.map((link, index) => (
            <li key={link.key}>
              <Item
                href={link.href}
                $active={link.isActive}
                onClick={() => {
                  onClose()
                }}
              >
                <Index aria-hidden="true">{pad(index)}</Index>
                {t(`nav.${link.key}`)}
              </Item>
            </li>
          ))}
        </List>
      </nav>
      <Footer>
        <Settings>
          <LanguageSwitch />
          <ThemeToggle
            isDark={isDark}
            onToggle={toggle}
            label={t(isDark ? 'theme.toLight' : 'theme.toDark')}
          />
        </Settings>
        <Button href={ROUTES.CONTACT} size="l" fullWidth iconRight="arrowRight">
          {t('common.primaryCta')}
        </Button>
      </Footer>
    </SideDrawer>
  )
}

export default MobileNav
