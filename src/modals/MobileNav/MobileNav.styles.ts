import { css, styled } from 'next-yak'

import { Link } from '@/i18n/navigation'
import { focusRing, typographyH4 } from '@/styles/mixins'
import { colors, fonts, radii, spacing } from '@/styles/tokens.yak'

export const List = styled.ul`
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  list-style: none;
`

/** Stavka je ceo red (lak pogodak prstom); redovi su odvojeni linijom. */
export const Item = styled(Link)<{ $active: boolean }>`
  ${focusRing};
  ${typographyH4};
  display: flex;
  align-items: baseline;
  gap: 14px;
  padding: 14px 10px;
  border-bottom: 1px solid ${colors.line};
  border-radius: ${radii.sm}px;
  font-size: 20px;
  color: ${colors.display};
  ${({ $active }) =>
    $active &&
    css`
      color: ${colors.accent};
      background: ${colors.muted};
    `}
`

export const Index = styled.span`
  min-width: 22px;
  font-family: ${fonts.mono};
  font-size: 12px;
  font-weight: 600;
  color: ${colors.faint};
`

export const Footer = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: ${spacing[4]}px;
`

export const Settings = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${spacing[3]}px;
`
