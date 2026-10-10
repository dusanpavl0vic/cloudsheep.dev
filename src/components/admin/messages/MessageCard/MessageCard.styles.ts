import { styled } from 'next-yak'

import { focusRing, glassStrong } from '@/styles/mixins'
import { colors, fonts } from '@/styles/tokens.yak'

export const Root = styled.details`
  ${glassStrong};
  border-radius: 16px;

  &[open] summary {
    border-bottom: 1px solid ${colors.line};
  }
`

export const Summary = styled.summary`
  ${focusRing};
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 4px 16px;
  padding: 16px 20px;
  border-radius: 16px;
  cursor: pointer;
  list-style: none;

  &::-webkit-details-marker {
    display: none;
  }
`

export const Name = styled.span`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  color: ${colors.display};
`

export const Subject = styled.span`
  grid-column: 1 / -1;
  font-size: 14.5px;
  color: ${colors.ink2};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const Date = styled.span`
  font-family: ${fonts.mono};
  font-size: 12px;
  color: ${colors.faint};
  white-space: nowrap;
`

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 18px 20px 20px;
`

export const Facts = styled.dl`
  display: flex;
  flex-wrap: wrap;
  gap: 8px 22px;
  font-size: 14px;

  dt {
    font-family: ${fonts.mono};
    font-size: 11px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${colors.faint};
  }

  dd {
    color: ${colors.ink};
  }
`

export const Text = styled.p`
  white-space: pre-wrap;
  line-height: 1.6;
  color: ${colors.ink};
`

export const Warning = styled.p`
  font-size: 14px;
  color: ${colors.danger};
`

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`
