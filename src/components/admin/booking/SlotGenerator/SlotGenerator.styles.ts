import { styled } from 'next-yak'

import { colors, media } from '@/styles/tokens.yak'

export const Form = styled.form`
  display: grid;
  gap: 16px;

  ${media.tablet} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  input {
    min-width: 0;
    width: 100%;
  }
`

export const Wide = styled.div`
  ${media.tablet} {
    grid-column: 1 / -1;
  }
`

export const Fieldset = styled.fieldset`
  margin: 0;
  padding: 0;
  border: 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;

  legend {
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 600;
    color: ${colors.ink};
  }
`

export const Days = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`

export const Error = styled.p`
  font-size: 13.5px;
  color: ${colors.danger};
`

