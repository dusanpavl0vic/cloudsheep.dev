import { styled } from 'next-yak'

import { colors } from '@/styles/tokens.yak'

export const Item = styled.fieldset`
  margin: 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px;
  border: 1px solid ${colors.line};
  border-radius: 14px;

  legend {
    padding: 0 6px;
    font-weight: 700;
    color: ${colors.display};
  }
`

export const Remove = styled.div`
  display: flex;
  justify-content: flex-end;
`
