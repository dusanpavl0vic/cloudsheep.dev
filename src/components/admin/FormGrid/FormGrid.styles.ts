import { styled } from 'next-yak'

import { media } from '@/styles/tokens.yak'

/** Polja u dve kolone od tableta; `data-wide` na omotaču — preko obe. */
export const FormGrid = styled.div`
  display: grid;
  gap: 16px;

  ${media.tablet} {
    grid-template-columns: repeat(2, minmax(0, 1fr));

    & > [data-wide] {
      grid-column: 1 / -1;
    }
  }
`
