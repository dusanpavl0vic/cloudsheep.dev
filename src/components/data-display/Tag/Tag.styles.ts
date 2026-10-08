'use client'

import styled from 'styled-components'

export const Root = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 7px;
  background: ${({ theme }) => theme.colors.muted};
  color: ${({ theme }) => theme.colors.ink};
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 12px;
  line-height: 1.2;
  white-space: nowrap;
`

export const Logo = styled.img`
  width: 14px;
  height: 14px;
  object-fit: contain;
`
