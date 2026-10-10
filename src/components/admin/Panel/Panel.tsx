import type { ReactNode } from 'react'

import { Root, Title } from './Panel.styles'

/** Staklena kartica admin-a sa naslovom. */
const Panel = ({ title, children, className }: { title?: string; children: ReactNode; className?: string }) => (
  <Root className={className}>
    {title && <Title>{title}</Title>}
    {children}
  </Root>
)

export default Panel
