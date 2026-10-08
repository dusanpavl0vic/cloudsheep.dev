'use client'

import styled from 'styled-components'

import { typography } from '@/styles/mixins'

export const Root = styled.section`
  min-height: 70vh;
  display: grid;
  place-content: center;
  gap: ${({ theme }) => theme.spacing[4]}px;
  padding: ${({ theme }) => theme.spacing[20]}px ${({ theme }) => theme.spacing[5]}px;
  text-align: center;
`

export const Eyebrow = styled.p`
  ${typography('eyebrow')};
  color: ${({ theme }) => theme.colors.accent};
`

export const Title = styled.h1`
  ${typography('display')};
`

export const Body = styled.p`
  ${typography('lead')};
  color: ${({ theme }) => theme.colors.ink2};
`
