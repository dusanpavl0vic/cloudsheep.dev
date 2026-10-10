import { styled } from 'next-yak'

import { zIndex } from '@/styles/tokens.yak'
export const Shell = styled.div`
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`

export const Main = styled.main`
  position: relative;
  z-index: ${zIndex.content};
  flex: 1;

  &:focus {
    outline: none;
  }
`
