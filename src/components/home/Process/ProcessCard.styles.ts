import { styled } from 'next-yak'

import { blur, colors, fonts, media } from '@/styles/tokens.yak'
import { BRAND_COLORS, BRAND_SHADOWS } from '@/styles/tokens.yak'

/**
 * Ispod desktopa karta stoji u toku stranice (staklo, kao ostale kartice). Na desktopu je karta
 * u špilu: apsolutno pozicionirana i NEPROVIDNA — kroz staklo bi se čitao tekst karte ispod nje.
 */
export const Root = styled.li<{ $tone: string; $layer: number }>`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 26px 22px 24px;
  border-radius: 22px;
  overflow: hidden;
  background: ${colors.glassStrong};
  backdrop-filter: ${blur.soft};
  -webkit-backdrop-filter: ${blur.soft};
  border: 1px solid ${colors.edge};
  box-shadow:
    inset 0 1px 0 0 ${colors.spec},
    ${BRAND_SHADOWS.panel};

  &::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 4px;
    background: linear-gradient(90deg, ${({ $tone }) => $tone}, ${BRAND_COLORS.sky});
  }

  ${media.desktop} {
    position: absolute;
    inset: 0;
    z-index: ${({ $layer }) => $layer};
    gap: 16px;
    padding: clamp(26px, 3.5vw, 44px);
    border-radius: 28px;
    background: ${colors.card};
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    box-shadow:
      inset 0 1px 0 0 ${colors.spec},
      ${BRAND_SHADOWS.deck};
    transform-origin: top center;
    will-change: transform, opacity;

    &::before {
      height: 5px;
    }
  }

  ${media.staticFallback} {
    position: relative;
    inset: auto;
    will-change: auto;
  }
`

/** Ispod desktopa gore desno (kao na karticama usluga) — dole bi stajao iza oznake isporuke. */
export const BigNumber = styled.span<{ $tone: string }>`
  position: absolute;
  top: 14px;
  right: 18px;
  font-family: ${fonts.heading};
  font-weight: 700;
  font-size: 72px;
  line-height: 1;
  letter-spacing: -0.06em;
  color: ${({ $tone }) => $tone};
  opacity: 0.08;
  pointer-events: none;

  /* Ukras je u pseudo-elementu: provera kontrasta ga tada ne broji kao tekst (8 % prozirnosti). */
  &::before {
    content: attr(data-number);
  }

  ${media.desktop} {
    top: auto;
    right: 24px;
    bottom: -30px;
    font-size: 200px;
  }
`

/** Boja faze je ukras (traka, veliki broj); oznaka je u `primary` — čitljiva u obe teme. */
export const Index = styled.span`
  font-family: ${fonts.mono};
  font-size: 13px;
  font-weight: 600;
  color: ${colors.primary};

  ${media.desktop} {
    font-size: 14px;
  }
`

export const Title = styled.h3`
  font-size: 1.75rem;
  letter-spacing: -0.03em;
  color: ${colors.display};

  ${media.desktop} {
    font-size: clamp(2rem, 4vw, 3.2rem);
    letter-spacing: -0.04em;
  }
`

export const Text = styled.p`
  flex: 1;
  max-width: 40ch;
  font-size: 16px;
  line-height: 1.6;
  color: ${colors.ink2};

  ${media.desktop} {
    font-size: clamp(16px, 1.5vw, 19px);
  }
`

export const Meta = styled.span`
  position: relative;
  align-self: flex-start;
  max-width: 100%;
  padding: 7px 11px;
  border-radius: 9px;
  background: ${colors.muted};
  font-family: ${fonts.mono};
  font-size: 12.5px;
  color: ${colors.ink};

  ${media.desktop} {
    padding: 8px 12px;
    font-size: 13px;
  }
`
