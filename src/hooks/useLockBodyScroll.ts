'use client'

import { useEffect } from 'react'

/** Dok je overlay otvoren, stranica ispod ne skroluje (i ne skače za širinu scrollbar-a). */
export const useLockBodyScroll = (locked: boolean) => {
  // effect: stil `<body>` — spoljni DOM
  useEffect(() => {
    if (!locked) return
    const { overflow, paddingRight } = document.body.style
    const scrollbar = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    if (scrollbar > 0) document.body.style.paddingRight = `${String(scrollbar)}px`
    return () => {
      document.body.style.overflow = overflow
      document.body.style.paddingRight = paddingRight
    }
  }, [locked])
}
