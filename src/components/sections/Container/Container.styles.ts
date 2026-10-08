'use client'

import styled from 'styled-components'

export const Root = styled.div<{ $width: number }>`
  width: 100%;
  max-width: ${({ $width }) => $width}px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing[5]}px;
`
