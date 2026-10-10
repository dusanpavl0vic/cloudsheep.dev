import { styled } from 'next-yak'

import { EASE_OUT, HEADER_HEIGHT, colors, fonts, spacing, media } from '@/styles/tokens.yak'
import { BRAND_COLORS, BRAND_SHADOWS } from '@/styles/tokens.yak'

import { PIN_HEIGHT_VH } from './Process.yak'

/**
 * Telefon: lista karata · tablet: mreža 2×2 · desktop: sekcija se zakači i skrol smenjuje karte.
 * Kačenje traži ekran viši od svih karata zajedno — ispod desktopa ga nema (`useScrollEffects`).
 * Bez JS-a i uz smanjeno kretanje (`staticFallback`): obična lista i na desktopu.
 */
export const Root = styled.section`
  position: relative;

  ${media.desktop} {
    height: ${PIN_HEIGHT_VH}vh;
  }

  ${media.staticFallback} {
    height: auto;
  }
`

export const Sticky = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: clamp(60px, 8vw, 110px) ${spacing[5]}px;
  display: flex;
  flex-direction: column;
  gap: 32px;

  ${media.desktop} {
    position: sticky;
    top: ${HEADER_HEIGHT}px;
    height: calc(100vh - ${HEADER_HEIGHT}px);
    min-height: 560px;
    padding-block: clamp(24px, 4vh, 48px);
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 28px 64px;
    align-items: center;
  }

  ${media.staticFallback} {
    position: static;
    height: auto;
    padding-block: clamp(60px, 8vw, 110px);
  }
`

export const Intro = styled.div`
  display: flex;
  flex-direction: column;
  gap: 22px;
`

/** Spisak faza je putokaz za zakačeni špil — ispod desktopa karte su već jedna ispod druge. */
export const Steps = styled.ol`
  display: none;
  flex-direction: column;
  gap: 4px;
  margin-top: 8px;

  ${media.desktop} {
    display: flex;
  }
`

/**
 * Neaktivan korak je prigušen BOJOM, ne prozirnošću: tekst na 35–65 % prozirnosti pada ispod
 * kontrasta 4.5:1 (Lighthouse). Aktivan dobija `aria-current` iz `applyPin`.
 */
export const Step = styled.li`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 0;
  color: ${colors.faint};
  transition:
    color 0.4s,
    transform 0.4s ${EASE_OUT};

  &[aria-current='step'] {
    color: ${colors.display};
  }

  ${media.staticFallback} {
    color: ${colors.display};
  }
`

export const StepIndex = styled.span`
  width: 34px;
  font-family: ${fonts.mono};
  font-size: 13px;
  font-weight: 600;
`

export const StepTitle = styled.span`
  font-family: ${fonts.heading};
  font-weight: 600;
  font-size: clamp(18px, 2vw, 22px);
`

export const Progress = styled.div`
  display: none;
  position: relative;
  max-width: 360px;
  height: 3px;
  border-radius: 2px;
  background: ${colors.line};

  ${media.desktop} {
    display: block;
  }

  ${media.staticFallback} {
    display: none;
  }
`

export const ProgressFill = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 0;
  height: 100%;
  border-radius: 2px;
  background: linear-gradient(
    90deg,
    ${BRAND_COLORS.deep},
    ${BRAND_COLORS.blue},
    ${BRAND_COLORS.sky}
  );
  box-shadow: ${BRAND_SHADOWS.progress};
`

export const Deck = styled.ol`
  position: relative;
  display: grid;
  gap: 14px;

  ${media.tabletOnly} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18px;
  }

  ${media.desktop} {
    display: block;
    height: min(440px, 52vh);
    min-height: 340px;
  }

  ${media.staticFallback} {
    height: auto;
    display: grid;
    gap: 18px;
  }
`
