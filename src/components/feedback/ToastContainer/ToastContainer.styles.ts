'use client'

import styled from 'styled-components'

export const Root = styled.div`
  position: fixed;
  right: ${({ theme }) => theme.spacing[4]}px;
  bottom: ${({ theme }) => theme.spacing[4]}px;
  z-index: ${({ theme }) => theme.zIndex.toast};
  display: grid;
  gap: ${({ theme }) => theme.spacing[2]}px;
`
