import { styled } from 'next-yak'

import { zIndex } from '@/styles/tokens.yak'
/**
 * `overflow-x: clip` seče ono što viri van ekrana (kosa traka tehnologija, aurora). `hidden` na
 * `body` nije dovoljno: iOS Safari i dalje pušta vodoravno pomeranje stranice prstom. `clip` ne
 * pravi kontejner za skrol, pa `position: sticky` u headeru i procesu i dalje radi.
 */
export const Shell = styled.div`
  position: relative;
  min-height: 100vh;
  overflow-x: clip;
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
