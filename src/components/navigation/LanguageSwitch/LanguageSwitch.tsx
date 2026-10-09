'use client'

import { useTranslations } from 'next-intl'

import SegmentedControl from '@/components/buttons/SegmentedControl'
import { LOCALE_LABELS } from '@/constants/i18n'
import { useLocaleSwitch } from '@/hooks/preferences'

/** EN / SR prekidač — u header-u od tableta naviše, u mobilnom meniju ispod toga. */
const LanguageSwitch = () => {
  const t = useTranslations()
  const { locale, locales, switchTo } = useLocaleSwitch()

  return (
    <SegmentedControl
      mono
      label={t('language.label')}
      value={locale}
      onChange={switchTo}
      options={locales.map((value) => ({ value, label: LOCALE_LABELS[value], ariaLabel: t(`shell.languageNames.${value}`) }))}
    />
  )
}

export default LanguageSwitch
