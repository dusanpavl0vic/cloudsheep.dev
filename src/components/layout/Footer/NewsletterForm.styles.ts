import { styled } from 'next-yak'

import { focusRing, resetButton, visuallyHidden } from '@/styles/mixins'
import { BRAND_COLORS, INVERSE, colors, fonts, radii } from '@/styles/tokens.yak'

export const Root = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 380px), 1fr));
  gap: 24px 40px;
  align-items: center;
  padding: 32px clamp(20px, 3vw, 36px);
  border-radius: ${radii.lg}px;
  background: ${INVERSE.wash};
  border: 1px solid ${INVERSE.line};
`

export const Intro = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
`

export const Badge = styled.span`
  width: 52px;
  height: 52px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: ${INVERSE.button};
  color: ${INVERSE.onButton};
`

export const Title = styled.span`
  display: block;
  font-family: ${fonts.heading};
  font-weight: 700;
  font-size: clamp(20px, 2vw, 24px);
  letter-spacing: -0.02em;
  color: ${INVERSE.heading};
`

export const Subtitle = styled.span`
  display: block;
  margin-top: 4px;
  font-size: 15px;
`

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const Field = styled.div`
  display: flex;
  gap: 6px;
  padding: 6px;
  border-radius: ${radii.md}px;
  background: ${BRAND_COLORS.white};
`

export const Input = styled.input`
  flex: 1;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  padding: 10px 12px;
  font-size: 15px;
  color: ${colors.display};

  &::placeholder {
    color: ${INVERSE.faint};
  }
`

export const Submit = styled.button`
  ${resetButton};
  ${focusRing};
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 11px 18px;
  border-radius: ${radii.sm}px;
  background: ${INVERSE.button};
  color: ${INVERSE.onButton};
  font-weight: 700;
  font-size: 15px;
  white-space: nowrap;
  transition: background 0.2s;

  &:hover:not(:disabled) {
    background: ${INVERSE.accent};
  }
`

export const Done = styled.p`
  padding: 16px 18px;
  border-radius: ${radii.md}px;
  background: ${INVERSE.wash};
  color: ${INVERSE.soft};
  font-weight: 600;
`

export const Fine = styled.span`
  padding-left: 4px;
  font-size: 13px;
  color: ${INVERSE.faint};
`

export const Error = styled.p`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding-left: 4px;
  font-size: 14px;
  color: ${INVERSE.accent};
`

export const TextAction = styled.button`
  ${resetButton};
  ${focusRing};
  text-decoration: underline;
  text-underline-offset: 3px;
  color: ${INVERSE.heading};
`

/** Honeypot: van ekrana i van tab redosleda — vidi ga samo bot. */
export const Trap = styled.input`
  ${visuallyHidden};
`
