'use client'

import styled, { keyframes } from 'styled-components'

import { glass } from '@/styles/mixins'

const slideIn = keyframes`
  from { transform: translateX(24px); opacity: 0; }
  to { transform: none; opacity: 1; }
`

export const Panel = styled.div`
  ${glass('strong')};
  width: min(360px, 100%);
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[6]}px;
  padding: ${({ theme }) => theme.spacing[5]}px;
  border-radius: ${({ theme }) => theme.radii.lg}px 0 0 ${({ theme }) => theme.radii.lg}px;
  animation: ${slideIn} 0.3s cubic-bezier(0.16, 1, 0.3, 1);
`

export const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`
