import { styled } from 'next-yak'

import { glassStrong } from '@/styles/mixins'
import { colors, media } from '@/styles/tokens.yak'

export const Form = styled.form`
  ${glassStrong};
  /* Dijalog je pun — tekst se ne meša sa sadržajem iza zamućene pozadine. */
  background: ${colors.card};
  display: flex;
  flex-direction: column;
  width: min(640px, calc(100vw - 32px));
  max-height: calc(100vh - 48px);
  border-radius: 20px;
`

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 20px 24px 12px;
`

export const Title = styled.h2`
  font-size: 22px;
  letter-spacing: -0.02em;
  color: ${colors.display};
`

/** Telo se skroluje, zaglavlje i dugmad ostaju na mestu. */
export const Body = styled.div`
  display: grid;
  gap: 16px;
  padding: 8px 24px 20px;
  overflow-y: auto;

  ${media.tablet} {
    grid-template-columns: repeat(2, minmax(0, 1fr));

    & > [data-wide] {
      grid-column: 1 / -1;
    }
  }
`

export const Footer = styled.footer`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 24px 20px;
  border-top: 1px solid ${colors.line};
`
