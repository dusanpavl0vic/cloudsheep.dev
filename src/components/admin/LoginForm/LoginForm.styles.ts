import { styled } from 'next-yak'

import { colors } from '@/styles/tokens.yak'

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

export const Check = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: ${colors.ink2};

  input {
    width: 18px;
    height: 18px;
    accent-color: ${colors.primary};
  }
`

export const Alert = styled.p`
  padding: 12px 14px;
  border-radius: 12px;
  background: ${colors.muted};
  color: ${colors.danger};
  font-size: 14px;
`

export const Notice = styled.p`
  padding: 12px 14px;
  border-radius: 12px;
  background: ${colors.muted};
  color: ${colors.ink2};
  font-size: 14px;
`
