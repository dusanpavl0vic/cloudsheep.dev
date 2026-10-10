import { styled } from 'next-yak'

import { Link } from '@/i18n/navigation'
import { focusRing, glassStrong } from '@/styles/mixins'
import { EASE_OUT, HEADER_HEIGHT, anim, colors, fonts, media } from '@/styles/tokens.yak'
import { BRAND_COLORS, BRAND_SHADOWS } from '@/styles/tokens.yak'

export const Layout = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 360px), 1fr));
  gap: 40px 64px;
  align-items: start;
`

export const Aside = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  ${media.desktop} {
    position: sticky;
    top: calc(${HEADER_HEIGHT}px + 26px);
  }
`

export const Chat = styled.div`
  ${glassStrong};
  margin-top: 18px;
  padding: 22px;
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  box-shadow:
    inset 0 1px 0 0 ${colors.spec},
    ${BRAND_SHADOWS.panel};
`

export const ChatHead = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 12px;
  border-bottom: 1px solid ${colors.line};
`

export const ChatWho = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

export const ChatName = styled.span`
  font-family: ${fonts.heading};
  font-weight: 700;
  font-size: 15px;
  color: ${colors.display};
`

export const ChatTld = styled.span`
  color: ${BRAND_COLORS.blue};
`

export const ChatStatus = styled.span`
  font-size: 12px;
  color: ${colors.faint};
`

export const Asked = styled.p`
  align-self: flex-end;
  max-width: 85%;
  padding: 12px 16px;
  border-radius: 18px 18px 4px 18px;
  background: ${colors.primary};
  color: ${colors.onPrimary};
  font-size: 15px;
  line-height: 1.45;
`

export const Reply = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 10px;
`

export const Answer = styled.p`
  max-width: 85%;
  padding: 12px 16px;
  border-radius: 18px 18px 18px 4px;
  background: ${colors.muted};
  color: ${colors.ink};
  font-size: 15px;
  line-height: 1.5;
`

export const Typing = styled.span`
  display: inline-flex;
  gap: 4px;
  margin-left: 38px;
  align-self: flex-start;
  padding: 12px 14px;
  border-radius: 18px 18px 18px 4px;
  background: ${colors.muted};
`

export const Dot = styled.span<{ $index: number }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${colors.accent};
  animation: ${anim.hint} 1s ease-in-out ${({ $index }) => `${String($index * 0.15)}s`} infinite;
`

export const Ask = styled(Link)`
  ${focusRing};
  margin-top: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 14px;
  border: 1px dashed ${colors.line2};
  color: ${colors.ink};
  font-size: 15px;
  transition: all 0.25s;

  strong {
    color: ${colors.display};
  }

  svg {
    flex-shrink: 0;
    color: ${colors.accent};
  }

  &:hover {
    border-color: ${colors.accent};
    background: ${colors.muted};
  }
`

export const Items = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

/** Nativni `<details>`: radi bez JS-a, Google vidi i zatvorene odgovore. */
export const Item = styled.details`
  border-radius: 18px;
  border: 1px solid ${colors.line};
  background: transparent;
  transition: background 0.3s;

  &[open] {
    background: ${colors.glassStrong};
  }

  @supports (interpolate-size: allow-keywords) {
    interpolate-size: allow-keywords;

    &::details-content {
      height: 0;
      overflow: hidden;
      transition:
        height 0.45s ${EASE_OUT},
        content-visibility 0.45s allow-discrete;
    }

    &[open]::details-content {
      height: auto;
    }
  }
`

export const Summary = styled.summary`
  ${focusRing};
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 22px;
  border-radius: 18px;
  list-style: none;
  cursor: pointer;
  color: ${colors.display};

  &::-webkit-details-marker {
    display: none;
  }
`

export const Number = styled.span`
  font-family: ${fonts.mono};
  font-size: 12px;
  color: ${colors.accent};
`

export const Question = styled.span`
  flex: 1;
  font-family: ${fonts.heading};
  font-weight: 600;
  font-size: 18px;
`

export const Toggle = styled.span`
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: ${colors.muted};
  color: ${colors.accent};
  transition: rotate 0.4s ${EASE_OUT};

  details[open] & {
    rotate: 45deg;
  }
`

export const AnswerText = styled.p`
  padding: 0 22px 22px 58px;
  font-size: 16px;
  line-height: 1.65;
  color: ${colors.ink2};
`
