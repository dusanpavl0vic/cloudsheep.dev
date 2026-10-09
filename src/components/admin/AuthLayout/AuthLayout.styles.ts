import { styled } from 'next-yak'

import { glassStrong } from '@/styles/mixins'
import { colors } from '@/styles/tokens.yak'

export const Root = styled.main`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px 16px;
`

export const Card = styled.div`
  ${glassStrong};
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  gap: 22px;
  padding: 36px 32px;
  border-radius: 24px;
`

export const Title = styled.h1`
  font-size: 28px;
  letter-spacing: -0.03em;
  color: ${colors.display};
`

export const Lead = styled.p`
  margin-top: -14px;
  font-size: 15px;
  color: ${colors.faint};
`
