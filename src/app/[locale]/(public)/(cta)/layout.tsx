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
 * Početna nije u grupi — CTA traku renderuje sam `HomeView` (stranica je u `(home)/`).
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
