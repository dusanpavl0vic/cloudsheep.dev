'use client'

import { useTranslations } from 'next-intl'

import Button from '@/components/buttons/Button'
import Logo from '@/components/foundations/Logo'
import LanguageSwitch from '@/components/navigation/LanguageSwitch'
import SideDrawer from '@/components/overlays/SideDrawer'
import { ROUTES } from '@/constants/routes'
import { useMainNav } from '@/hooks/navigation'

import { Footer, Item, List } from './MobileNav.styles'
import type { OverlayModalProps } from '../shared/types'

/**
 * Navigacija ispod desktop širine. Klik na stavku zatvara meni sam — sidro na istoj stranici
 * (`/#pricing`) ne menja putanju, pa ga `ModalRoot` ne bi zatvorio.
 */
const MobileNav = ({ onClose }: OverlayModalProps) => {
  const t = useTranslations()
  const { links } = useMainNav()

  return (
    <SideDrawer onClose={onClose} label={t('nav.label')} closeLabel={t('nav.closeMenu')} header={<Logo size={30} />}>
      <nav aria-label={t('nav.label')}>
        <List>
          {links.map((link) => (
            <li key={link.key}>
              <Item href={link.href} $active={link.isActive} onClick={() => { onClose(); }}>
                {t(`nav.${link.key}`)}
              </Item>
            </li>
          ))}
        </List>
      </nav>
      <Footer>
        <LanguageSwitch />
        <Button href={ROUTES.CONTACT} size="l" fullWidth iconRight="arrowRight">
          {t('common.primaryCta')}
        </Button>
      </Footer>
    </SideDrawer>
  )
}

export default MobileNav
