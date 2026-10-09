'use client'

import styled from 'styled-components'

import { Link } from '@/i18n/navigation'
import { focusRing } from '@/styles/mixins'

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
  border: 1px solid ${({ theme }) => theme.colors.line2};
  background: ${({ $active, theme }) => ($active ? theme.colors.primary : theme.colors.card)};
  color: ${({ $active, theme }) => ($active ? theme.colors.onPrimary : theme.colors.ink)};
  font-size: 15px;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
  }
`

export const Count = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 12px;
  opacity: 0.6;
`
