import { css, styled } from 'next-yak'

import { Link } from '@/i18n/navigation'
import { focusRing, typographyH4 } from '@/styles/mixins'
import { colors, radii, spacing } from '@/styles/tokens.yak'

export const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 0;
  padding: 0;
  list-style: none;
`

export const Item = styled(Link)<{ $active: boolean }>`
  ${focusRing};
  ${typographyH4};
  display: block;
  padding: 12px 14px;
  border-radius: ${radii.base}px;
  color: ${colors.display};
  ${({ $active }) =>
    $active &&
    css`
      color: ${colors.accent};
    `}
  ${({ $active }) =>
    $active &&
    css`
      background: ${colors.muted};
    `}
`

export const Footer = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: ${spacing[4]}px;
`
