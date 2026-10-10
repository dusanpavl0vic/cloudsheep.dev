import { styled } from 'next-yak'

import { visuallyHidden } from '@/styles/mixins'
import { EASE_OUT, blur, colors, media, radii } from '@/styles/tokens.yak'
import { BRAND_SHADOWS } from '@/styles/tokens.yak'

/**
 * Telefon i tablet: pločice sa nazivom, centrirane u toku — talas sitnih ikonica bez naziva je
 * na uskom ekranu izgledao kao nasumična gomila. Desktop: talas iz dizajna nad mrežom.
 */
export const Board = styled.div`
  position: relative;
  width: 100%;

  ${media.desktop} {
    margin-top: 30px;
    padding: 48px 0;
  }
`

export const Grid = styled.div`
  display: none;
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    repeating-linear-gradient(to right, ${colors.line2} 0 1px, transparent 1px 128px),
    repeating-linear-gradient(to bottom, ${colors.line2} 0 1px, transparent 1px 128px);
  background-position: center;
  opacity: 0.7;
  mask-image: radial-gradient(ellipse 80% 75% at 50% 50%, black 35%, transparent 100%);

  ${media.desktop} {
    display: block;
  }
`

export const Rows = styled.div`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;

  ${media.desktop} {
    flex-direction: column;
    flex-wrap: nowrap;
    gap: 28px;
  }
`

/** Red talasa postoji samo na desktopu; ispod toga su sve pločice u jednom toku. */
export const Row = styled.ul`
  display: contents;

  ${media.desktop} {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 24px;
  }
`

export const Item = styled.li<{ $lift: number }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 12px 5px 5px;
  border-radius: ${radii.md}px;
  border: 1px solid ${colors.edge};
  background: ${colors.glassStrong};
  backdrop-filter: ${blur.soft};
  -webkit-backdrop-filter: ${blur.soft};
  font-size: 14px;
  font-weight: 500;
  color: ${colors.display};

  /* Ispod desktopa su sve pločice iste veličine; veličina iz talasa važi samo za talas. */
  ${media.belowDesktop} {
    > :first-child {
      width: 32px;
      height: 32px;
    }

    img {
      width: 18px;
      height: 18px;
    }
  }

  ${media.desktop} {
    display: block;
    padding: 0;
    border: 0;
    border-radius: 0;
    background: none;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    translate: 0 ${({ $lift }) => `${String($lift)}px`};

    > :first-child {
      outline: 1px solid ${colors.line2};
      transition:
        transform 0.4s ${EASE_OUT},
        box-shadow 0.4s;
    }

    ${media.hover} {
      > :first-child:hover {
        transform: translateY(-8px) scale(1.08) rotate(-4deg);
        box-shadow: ${BRAND_SHADOWS.tileHover};
      }
    }
  }
`

/** Naziv tehnologije: vidljiv ispod desktopa, na desktopu samo za čitač ekrana. */
export const Name = styled.span`
  white-space: nowrap;

  ${media.desktop} {
    ${visuallyHidden};
  }
`
