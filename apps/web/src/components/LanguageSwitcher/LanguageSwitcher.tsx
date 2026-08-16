import { Check, ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { cn } from '@app/ui'


import { DEFAULT_LANGUAGE_OPTION, LANGUAGE_OPTIONS } from './LanguageSwitcher.constants'
import {
  languageMenuVariants,
  languageOptionVariants,
  languageSwitcherVariants,
  languageTriggerVariants,
} from './LanguageSwitcher.variants'

export const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation('common')
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const current =
    LANGUAGE_OPTIONS.find((option) => option.code === i18n.resolvedLanguage) ??
    DEFAULT_LANGUAGE_OPTION

  // Zatvaranje na klik van menija i na Escape — subscribe na DOM evente (PROJECT_GUIDE 2.1)
  // effect: document — klik van menija i Escape su globalni DOM događaji
  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const select = (code: string) => {
    void i18n.changeLanguage(code)
    setOpen(false)
  }

  return (
    <div ref={ref} className={languageSwitcherVariants()}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t('language.label')}
        onClick={() => { setOpen((value) => !value); }}
        className={languageTriggerVariants()}
      >
        {current.label}
        <ChevronDown
          aria-hidden
          className={cn('size-3.5 transition-transform duration-200', open && 'rotate-180')}
        />
      </button>

      {open && (
        <ul role="listbox" aria-label={t('language.label')} className={languageMenuVariants()}>
          {LANGUAGE_OPTIONS.map((option) => {
            const active = option.code === current.code
            return (
              <li key={option.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => { select(option.code); }}
                  className={languageOptionVariants({ active })}
                >
                  {option.name}
                  {active && <Check aria-hidden className="size-3.5 text-primary" />}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
