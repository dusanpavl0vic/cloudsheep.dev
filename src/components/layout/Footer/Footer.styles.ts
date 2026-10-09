import { styled } from 'next-yak'

import { Link } from '@/i18n/navigation'
import { focusRing } from '@/styles/mixins'
import { BRAND_COLORS, INVERSE, fonts, zIndex } from '@/styles/tokens.yak'

export const Root = styled.footer`
  position: relative;
  z-index: ${zIndex.content};
  margin-top: 40px;
  overflow: hidden;
  background: ${INVERSE.bg};
  color: ${INVERSE.text};
`

export const Glow = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(ellipse 60% 40% at 15% 0%, ${INVERSE.glowA}, transparent 70%),
    radial-gradient(ellipse 50% 40% at 90% 10%, ${INVERSE.wash}, transparent 70%);
  opacity: 0.4;
`

export const Inner = styled.div`
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: 72px clamp(16px, 4vw, 40px) 0;
  display: flex;
  flex-direction: column;
  gap: 56px;
`

export const Columns = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 190px), 1fr));
  gap: 40px;
`

export const Column = styled.nav`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
`

export const Heading = styled.span`
  font-family: ${fonts.heading};
  font-weight: 700;
  font-size: 16px;
  color: ${INVERSE.heading};
`

export const ColumnLink = styled(Link)`
  ${focusRing};
  font-size: 15px;
  color: ${INVERSE.text};
  transition:
    color 0.2s,
    transform 0.2s;

  &:hover {
    color: ${INVERSE.accent};
    transform: translateX(3px);
  }
`

export const Tagline = styled.p`
  max-width: 280px;
  font-size: 15px;
  line-height: 1.55;
  color: ${INVERSE.text};
`

export const Socials = styled.ul`
  display: flex;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
`

export const Social = styled.a`
  ${focusRing};
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  border: 1px solid ${INVERSE.lineStrong};
  color: ${INVERSE.soft};
  font-family: ${fonts.mono};
  font-size: 12px;
  font-weight: 600;
  transition: all 0.25s;

  &:hover {
    background: ${INVERSE.button};
    border-color: ${INVERSE.button};
    color: ${INVERSE.onButton};
  }
`

export const Cities = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 8px 22px;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 15px;
`

export const Bottom = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px 24px;
  padding: 22px 0;
  border-top: 1px solid ${INVERSE.line};
  font-size: 14px;
  color: ${INVERSE.faint};
`

export const BottomGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`

export const Mail = styled.a`
  ${focusRing};
  color: ${INVERSE.accent};
  text-decoration: underline;
  text-underline-offset: 3px;
`

export const WordWrap = styled.div`
  position: relative;
  overflow: hidden;
  height: clamp(90px, 17vw, 250px);
  margin-top: -6px;
`

/** Reč izranja dok se skroluje — `PageEffects` piše `transform` (`data-footword`). */
export const Word = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  text-align: center;
  font-family: ${fonts.heading};
  font-weight: 700;
  font-size: clamp(70px, 15.6vw, 250px);
  line-height: 0.86;
  letter-spacing: -0.065em;
  white-space: nowrap;
  background: linear-gradient(180deg, ${INVERSE.button} 0%, ${BRAND_COLORS.deep} 70%, transparent 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  transform: translateY(40%);
  will-change: transform;
`
