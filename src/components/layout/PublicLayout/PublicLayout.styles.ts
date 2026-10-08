'use client'

import styled from 'styled-components'

export const Shell = styled.div`
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`

export const Main = styled.main`
  position: relative;
  z-index: ${({ theme }) => theme.zIndex.content};
  flex: 1;

  &:focus {
    outline: none;
  }
`
