import type { ReactNode } from 'react'

import Logo from '@/components/foundations/Logo'

import { Card, Lead, Root, Title } from './AuthLayout.styles'

interface AuthLayoutProps {
  title: string
  lead: string
  children: ReactNode
}

/** Okvir stranica za goste admin-a (prijava). */
const AuthLayout = ({ title, lead, children }: AuthLayoutProps) => (
  <Root>
    <Card>
      <Logo size={30} />
      <Title>{title}</Title>
      <Lead>{lead}</Lead>
      {children}
    </Card>
  </Root>
)

export default AuthLayout
