import type { ReactNode } from 'react'

import { CONTAINER_MAX_WIDTH } from '@/constants/layout'

import { Root } from './Container.styles'

interface ContainerProps {
  children: ReactNode
  /** Najveća širina u px (podrazumevano 1280). */
  width?: number
  className?: string
}

/** Centrirana kolona sa bočnim razmakom od 20 px. */
const Container = ({ children, width = CONTAINER_MAX_WIDTH, className }: ContainerProps) => (
  <Root $width={width} className={className}>
    {children}
  </Root>
)

export default Container
