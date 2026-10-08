'use client'

import { useServerInsertedHTML } from 'next/navigation'
import { useState, type ReactNode } from 'react'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'

/**
 * Skuplja CSS styled komponenti tokom SSR-a i ubacuje ga u `<head>` — bez ovoga server
 * šalje HTML bez stila, pa stranica „skoči" kad JS stigne.
 */
const StyledRegistry = ({ children }: { children: ReactNode }) => {
  const [sheet] = useState(() => new ServerStyleSheet())

  useServerInsertedHTML(() => {
    const styles = sheet.getStyleElement()
    sheet.instance.clearTag()
    return <>{styles}</>
  })

  if (typeof window !== 'undefined') return <>{children}</>

  return <StyleSheetManager sheet={sheet.instance}>{children}</StyleSheetManager>
}

export default StyledRegistry
