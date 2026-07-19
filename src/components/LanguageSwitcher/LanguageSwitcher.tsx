import { useTranslation } from 'react-i18next'

import { LANGUAGE_OPTIONS } from './LanguageSwitcher.constants'
import { languageOptionVariants, languageSwitcherVariants } from './LanguageSwitcher.variants'

export const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation()

  return (
    <div role="group" aria-label={t('language.label')} className={languageSwitcherVariants()}>
      {LANGUAGE_OPTIONS.map((option) => (
        <button
          key={option.code}
          type="button"
          onClick={() => void i18n.changeLanguage(option.code)}
          className={languageOptionVariants({ active: i18n.resolvedLanguage === option.code })}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
