import { css, styled } from 'next-yak'

import { Link } from '@/i18n/navigation'
import { focusRing, glassStrong } from '@/styles/mixins'
import { CONTAINER_MAX_WIDTH, colors, media, radii, zIndex } from '@/styles/tokens.yak'

export const Root = styled.header`
  position: sticky;
  top: 0;
  z-index: ${zIndex.header};
  padding: 12px clamp(12px, 3vw, 28px);
`

export const Bar = styled.div`
  ${glassStrong};
  /* Bez ivice: nad tamnim sekcijama (footer) 1px svetla ivica se vidi kao okvir. */
  border: 0;
  position: relative;
  overflow: hidden;
  max-width: ${CONTAINER_MAX_WIDTH}px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 10px 9px 14px;
  border-radius: ${radii.lg}px;

  ${media.tablet} {
    gap: 18px;
  }
`

export const HomeLink = styled(Link)`
  ${focusRing};
  display: flex;
  border-radius: ${radii.sm}px;
  transition: opacity 0.25s;

  &:hover {
    opacity: 0.85;
  }
`

/**
 * Pun meni tek od `wide` (1200): osam stavki + jezik + tema + CTA traže ~1100 px, pa se na
 * 1024 (iPad položeno, mali laptop) logo i meni preklapaju, a CTA ispada iz trake.
 */
export const Nav = styled.nav`
  display: none;
  flex: 1;
  justify-content: center;
  gap: 2px;

  ${media.wide} {
    display: flex;
  }
`

export const NavLink = styled(Link)<{ $active: boolean }>`
  ${focusRing};
  padding: 8px 12px;
  border-radius: ${radii.base}px;
  font-size: 14.5px;
  font-weight: 500;
  transition:
    background 0.25s,
    color 0.25s;

  ${({ $active }) =>
    $active
      ? css`
          background: ${colors.muted};
          color: ${colors.accent};
        `
      : css`
          color: ${colors.ink};
          &:hover {
            background: ${colors.muted};
            color: ${colors.accent};
          }
        `}
`

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;

  ${media.wide} {
    margin-left: 0;
  }
`

/** CTA u headeru ne staje na telefon — tamo je u meniju. */
export const OnTablet = styled.span`
  display: none;

  ${media.tablet} {
    display: inline-flex;
  }
`

/** Jezik je u traci samo uz pun meni; ispod toga je u mobilnom meniju, da traka ostane čista. */
export const OnWide = styled.span`
  display: none;

  ${media.wide} {
    display: inline-flex;
  }
`

/** Dugme menija dok pun meni ne stane u traku. */
export const BelowWide = styled.span`
  display: inline-flex;

  ${media.wide} {
    display: none;
  }
`
