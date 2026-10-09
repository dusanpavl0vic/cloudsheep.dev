import '@/styles/global'
import '@/styles/animations'

import { LOCALE_TAGS } from '@/constants/i18n'
import { FONT_FACES } from '@/constants/theme'
import AppProviders from '@/providers/AppProviders'

import type { DocumentProps } from './Document.types'

/**
 * `<html>` i `<body>` javnog sajta i admin-a: jezik, tema iz kolačića, provideri.
 * Fontovi prvog ekrana se preload-uju — LCP je naslov u hero-u (docs/07-performance.md §7).
 */
const Document = ({ children, locale, theme, namespaces }: DocumentProps) => (
  <html lang={LOCALE_TAGS[locale]} {...(theme ? { 'data-theme': theme } : {})}>
    <head>
      {FONT_FACES.filter((face) => face.preload).map((face) => (
        <link
          key={face.file}
          rel="preload"
          href={face.file}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      ))}
    </head>
    <body>
      <AppProviders theme={theme} {...(namespaces ? { namespaces } : {})}>
        {children}
      </AppProviders>
    </body>
  </html>
)

export default Document
