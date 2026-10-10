import type { ReactNode } from 'react'

import { Actions, Lead, Root, Title } from './PageHeader.styles'

interface PageHeaderProps {
  title: string
  lead?: string
  actions?: ReactNode
}

/** Naslov admin stranice sa akcijama desno (dodaj, izvezi…). */
const PageHeader = ({ title, lead, actions }: PageHeaderProps) => (
  <Root>
    <div>
      <Title>{title}</Title>
      {lead && <Lead>{lead}</Lead>}
    </div>
    {actions && <Actions>{actions}</Actions>}
  </Root>
)

export default PageHeader
