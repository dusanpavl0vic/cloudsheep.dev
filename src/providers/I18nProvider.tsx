import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import type { ReactNode } from 'react'

import type { MessageNamespace } from '@/constants/i18n'
import { pick } from '@/helpers/object'

/** Namespace-i koje klijentske komponente ljuske koriste (header, meni, tema, greške). */
export const SHELL_NAMESPACES = [
  'common',
  'nav',
  'theme',
  'language',
  'errors',
  'shell',
  'footer',
] as const satisfies readonly MessageNamespace[]

interface I18nProviderProps {
  children: ReactNode
  /** Samo ovi prevodi idu u pregledač. Ostalo se prevodi na serveru (docs/09-i18n.md §3). */
  namespaces?: readonly MessageNamespace[]
}

/**
 * Prosleđuje klijentu SAMO tražene namespace-e. Bez `messages` next-intl bi poslao sve
 * prevode oba jezika u svaki odgovor — direktan trošak JS budžeta.
 */
const I18nProvider = async ({ children, namespaces = SHELL_NAMESPACES }: I18nProviderProps) => {
  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={pick(messages, namespaces)}>
      {children}
    </NextIntlClientProvider>
  )
}

export default I18nProvider
