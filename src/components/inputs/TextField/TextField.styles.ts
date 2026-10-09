import { css, styled } from 'next-yak'

import { colors, fonts } from '@/styles/tokens.yak'

export const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: ${colors.ink};
`

const control = css<{ $invalid: boolean }>`
  width: 100%;
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid ${colors.line2};
  background: ${colors.card};
  color: ${colors.ink};
  font-size: 16px;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;

  &::placeholder {
    color: ${colors.faint};
  }

  &:focus {
    outline: none;
    border-color: ${colors.accent};
    box-shadow: 0 0 0 3px ${colors.muted};
  }

  ${({ $invalid }) =>
    $invalid &&
    css`
      border-color: ${colors.danger};
    `}
`

export const Input = styled.input<{ $invalid: boolean }>`
  ${control}
`

export const TextArea = styled.textarea<{ $invalid: boolean }>`
  ${control}
  resize: vertical;
  min-height: 120px;
  font-family: ${fonts.sans};
`

export const ErrorText = styled.p`
  font-size: 14px;
  color: ${colors.danger};
`

export const Hint = styled.div`
  font-size: 14px;
  color: ${colors.faint};
`
