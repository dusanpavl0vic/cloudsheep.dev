'use client'

import styled, { css } from 'styled-components'

import { focusRing, resetButton } from '@/styles/mixins'

export const Root = styled.button<{ $selected: boolean; $hasHint: boolean }>`
  ${resetButton};
  ${focusRing};
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  min-height: ${({ theme }) => theme.buttonHeights.s}px;
  padding: ${({ $hasHint }) => ($hasHint ? '12px 16px' : '8px 14px')};
  border-radius: ${({ theme }) => theme.radii.base}px;
  border: 1px solid ${({ theme }) => theme.colors.line};
  font-size: 14.5px;
  font-weight: 500;
  text-align: left;
  transition:
    background 0.25s,
    color 0.25s,
    border-color 0.25s,
    transform 0.25s;

  ${({ theme, $selected }) =>
    $selected
      ? css`
          background: ${theme.colors.primary};
          color: ${theme.colors.onPrimary};
          border-color: ${theme.colors.primary};
        `
      : css`
          background: ${theme.colors.card};
          color: ${theme.colors.ink};
          &:hover {
            border-color: ${theme.colors.accent};
            transform: translateY(-1px);
          }
        `}
`

export const Hint = styled.span`
  font-size: 13px;
  font-weight: 400;
  opacity: 0.75;
`
