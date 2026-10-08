'use client'

import styled from 'styled-components'

export const Root = styled.a`
  position: absolute;
  left: 16px;
  top: -60px;
  z-index: ${({ theme }) => theme.zIndex.toast};
  padding: 10px 16px;
  border-radius: ${({ theme }) => theme.radii.base}px;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.onPrimary};
  font-weight: 600;
  transition: top 0.2s;

  &:focus {
    top: 12px;
  }
`
