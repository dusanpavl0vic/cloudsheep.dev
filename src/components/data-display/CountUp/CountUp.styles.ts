'use client'

import styled from 'styled-components'

export const Root = styled.span`
  font-variant-numeric: tabular-nums;
`

export const Suffix = styled.span`
  color: ${({ theme }) => theme.colors.accent};
`
