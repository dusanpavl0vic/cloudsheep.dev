import type { ReactNode } from 'react'

import CtaBanner from '@/components/sections/CtaBanner'
import type { Locale } from '@/constants/i18n'
import { emailFrom } from '@/helpers/links'
import { bindRequestLocale } from '@/i18n/locale'
import { getSiteProfile } from '@/server/services/profile'

interface CtaGroupLayoutProps {
  children: ReactNode
  params: Promise<{ locale: Locale }>
}

/**
 * Podstranice koje se završavaju CTA trakom (dizajn: sve osim kontakta). Grupa ne menja URL;
 * `/contact` je van nje, jer bi traka tamo vodila na samu sebe.
 *
 * Početna NIJE u grupi (CTA renderuje `HomeView`): webpack `page.tsx` iz korena grupe učitava i
 * na ostalim stranicama grupe — merenjem +20 KB JS-a na `/projects` (docs/07 §6).
 */
const CtaGroupLayout = async ({ children, params }: CtaGroupLayoutProps) => {
  const { locale } = await params
  bindRequestLocale(locale)
  const { links } = await getSiteProfile(locale)

  return (
    <>
      {children}
      <CtaBanner email={emailFrom(links)} />
    </>
  )
}

export default CtaGroupLayout
