'use client'

import styled from 'styled-components'

import { focusRing, resetButton } from '@/styles/mixins'

export const Root = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
`

export const Arrow = styled.button`
  ${resetButton};
  ${focusRing};
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.colors.line2};
  background: ${({ theme }) => theme.colors.card};
  color: ${({ theme }) => theme.colors.ink};
  transition: all 0.25s;

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.onPrimary};
  }
`

export const Dots = styled.div`
  display: flex;
  gap: 6px;
`

/** Tačka je vizuelno 8 px, ali meta za dodir je 24 px (docs/15 §3). */
export const Dot = styled.button<{ $active: boolean }>`
  ${resetButton};
  ${focusRing};
  position: relative;
  width: ${({ $active }) => ($active ? 26 : 8)}px;
  height: 8px;
  border-radius: 4px;
  background: ${({ $active, theme }) => ($active ? theme.colors.accent : theme.colors.line2)};
  transition: width 0.35s;

  &::after {
    content: '';
    position: absolute;
    inset: -8px -4px;
  }
`
