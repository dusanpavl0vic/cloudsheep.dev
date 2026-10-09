'use client'

import styled, { css } from 'styled-components'

import { EASE_OUT } from '@/constants/layout'
import { Link } from '@/i18n/navigation'
import { focusRing } from '@/styles/mixins'

export const Root = styled(Link)<{ $underline: boolean; $tone: 'accent' | 'muted' }>`
  ${focusRing};
  display: inline-flex;
  align-items: center;
  gap: 6px;
  align-self: flex-start;
  font-weight: 600;
  font-size: 16px;
  color: ${({ $tone, theme }) => ($tone === 'accent' ? theme.colors.accent : theme.colors.faint)};
  transition: color 0.2s;

  ${({ $underline, theme }) =>
    $underline &&
    css`
      padding: 6px 0;
      border-bottom: 2px solid ${theme.colors.accent};
    `}

  svg {
    transition: transform 0.25s ${EASE_OUT};
  }

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }

  &:hover svg:last-child {
    transform: translateX(4px);
  }

  &:hover svg:first-child:not(:last-child) {
    transform: translateX(-4px);
  }
`
