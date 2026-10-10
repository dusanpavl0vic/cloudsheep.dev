import { css, styled } from 'next-yak'

import { focusRing, glassStrong, resetButton, visuallyHidden } from '@/styles/mixins'
import { BRAND_COLORS, BRAND_SHADOWS, colors, fonts } from '@/styles/tokens.yak'

export const Layout = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 400px), 1fr));
  gap: 40px;
  align-items: start;
`

export const Aside = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

export const Card = styled.div`
  ${glassStrong};
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: clamp(18px, 5vw, 24px);
  border-radius: 22px;
`

export const CardTitle = styled.h2`
  font-size: 20px;
  color: ${colors.display};
`

export const Muted = styled.p`
  font-size: 14px;
  color: ${colors.faint};
`

export const Days = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: clamp(4px, 1.6vw, 8px);
`

export const Day = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const DayName = styled.span`
  text-align: center;
  font-size: 13px;
  font-weight: 700;
`

export const DayDate = styled.span`
  margin-bottom: 4px;
  text-align: center;
  font-size: 12px;
  color: ${colors.faint};
`

export const Slot = styled.button<{ $selected: boolean }>`
  ${resetButton};
  ${focusRing};
  padding: 10px 0;
  border-radius: 10px;
  border: 1px solid ${colors.line2};
  background: ${colors.card};
  color: ${colors.ink};
  font-family: ${fonts.mono};
  font-size: 12px;
  text-align: center;
  transition: all 0.2s;

  &:hover {
    border-color: ${colors.accent};
  }

  ${({ $selected }) =>
    $selected &&
    css`
      background: ${colors.primary};
      border-color: ${colors.primary};
      color: ${colors.onPrimary};
    `}
`

export const Picked = styled.p`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 700;
  color: ${colors.accent};
`

export const LinkButton = styled.button`
  ${resetButton};
  ${focusRing};
  font-size: 14px;
  font-weight: 600;
  color: ${colors.faint};
  text-decoration: underline;
`

export const Brief = styled.form`
  ${glassStrong};
  display: flex;
  flex-direction: column;
  gap: 26px;
  padding: clamp(24px, 3.5vw, 44px);
  border-radius: 28px;
  box-shadow: ${BRAND_SHADOWS.estimator};
`

export const Bars = styled.div`
  display: flex;
  gap: 6px;
`

export const Bar = styled.span<{ $done: boolean }>`
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background: ${colors.line};
  transition: background 0.4s;

  ${({ $done }) =>
    $done &&
    css`
      background: ${colors.accent};
    `}
`

export const Step = styled.fieldset`
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin: 0;
  padding: 0;
  border: 0;
  min-width: 0;
`

export const StepTitle = styled.legend`
  margin-bottom: 18px;
  font-family: ${fonts.heading};
  font-weight: 700;
  font-size: 26px;
  color: ${colors.display};
`

export const Group = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const GroupTitle = styled.span`
  font-family: ${fonts.heading};
  font-weight: 700;
  font-size: 22px;
  color: ${colors.display};
`

export const Cards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 180px), 1fr));
  gap: 10px;
`

export const Options = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`

export const FieldError = styled.p`
  font-size: 14px;
  color: ${colors.danger};
`

export const Nav = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
`

export const Honeypot = styled.div`
  ${visuallyHidden};
`

export const DoneMark = styled.span`
  width: 56px;
  height: 56px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: ${BRAND_COLORS.blue};
  color: ${BRAND_COLORS.white};
`

export const DoneTitle = styled.h2`
  font-size: 30px;
  letter-spacing: -0.02em;
  color: ${colors.display};
`

export const Summary = styled.dl`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 14px;
  border-top: 1px solid ${colors.line};

  div {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    font-size: 15px;
  }

  dt {
    color: ${colors.faint};
  }
`

export const Done = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`
