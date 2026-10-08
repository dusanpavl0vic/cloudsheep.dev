'use client'

import styled, { css } from 'styled-components'

import { Link } from '@/i18n/navigation'
import { focusRing, typography } from '@/styles/mixins'

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
  ${typography('h4')};
  display: block;
  padding: 12px 14px;
  border-radius: ${({ theme }) => theme.radii.base}px;
  color: ${({ theme, $active }) => ($active ? theme.colors.accent : theme.colors.display)};
  ${({ theme, $active }) =>
    $active &&
    css`
      background: ${theme.colors.muted};
    `}
`

export const Footer = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]}px;
`
