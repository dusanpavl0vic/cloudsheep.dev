import { styled } from 'next-yak'

import { glassStrong } from '@/styles/mixins'
import { colors, media } from '@/styles/tokens.yak'

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

/** Tekst levo, pregled desno — od desktopa; na telefonu jedno ispod drugog. */
export const Split = styled.div`
  display: grid;
  gap: 20px;
  align-items: start;

  ${media.desktop} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  textarea {
    min-height: 480px;
    font-size: 15px;
    line-height: 1.6;
  }
`

export const Preview = styled.section`
  ${glassStrong};
  padding: 24px 28px;
  border-radius: 18px;
  min-height: 200px;
  max-height: 80vh;
  overflow-y: auto;

  h2 {
    margin-bottom: 14px;
    font-size: 12px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${colors.faint};
  }
`

export const Bar = styled.div`
  position: sticky;
  bottom: 16px;
  display: flex;
  justify-content: flex-end;
`
