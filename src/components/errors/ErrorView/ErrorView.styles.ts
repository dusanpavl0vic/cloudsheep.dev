'use client'

import styled from 'styled-components'

import { focusRing, resetButton, typography } from '@/styles/mixins'

export const Root = styled.section`
  min-height: 60vh;
  display: grid;
  place-content: center;
  justify-items: center;
  gap: ${({ theme }) => theme.spacing[4]}px;
  padding: ${({ theme }) => theme.spacing[20]}px ${({ theme }) => theme.spacing[5]}px;
  text-align: center;
`

export const Title = styled.h1`
  ${typography('h2')};
`

export const Body = styled.p`
  ${typography('body')};
  color: ${({ theme }) => theme.colors.ink2};
`

export const Retry = styled.button`
  ${resetButton};
  ${focusRing};
  height: ${({ theme }) => theme.buttonHeights.m}px;
  padding: 0 ${({ theme }) => theme.spacing[5]}px;
  border-radius: ${({ theme }) => theme.radii.base}px;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.onPrimary};
  font-weight: 600;
`
