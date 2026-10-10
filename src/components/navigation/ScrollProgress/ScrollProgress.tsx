'use client'

import { useRef } from 'react'

import { useScrollProgress } from '@/hooks/useScrollProgress'

import { Bar } from './ScrollProgress.styles'

/** Tanka traka koliko je stranica pročitana (dno headera). Dekorativna. */
const ScrollProgress = () => {
  const ref = useRef<HTMLDivElement>(null)
  useScrollProgress(ref)
  return <Bar ref={ref} aria-hidden="true" />
}

export default ScrollProgress
