import { css, styled } from 'next-yak'

import { Link } from '@/i18n/navigation'
import { focusRing } from '@/styles/mixins'
import { colors, fonts } from '@/styles/tokens.yak'

export const List = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`

/** Filter je link (URL je izvor istine) koji izgleda kao `Chip` iz dizajna. */
export const Option = styled(Link)<{ $active: boolean }>`
  ${focusRing};
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 16px;
  border-radius: 10px;
  border: 1px solid ${colors.line2};
  background: ${colors.card};
  ${({ $active }) =>
    $active &&
    css`
      background: ${colors.primary};
    `}
  color: ${colors.ink};
  ${({ $active }) =>
    $active &&
    css`
      color: ${colors.onPrimary};
    `}
  font-size: 15px;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    border-color: ${colors.accent};
  }
`

export const Count = styled.span`
  font-family: ${fonts.mono};
  font-size: 12px;
  opacity: 0.6;
`
