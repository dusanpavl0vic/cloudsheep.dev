import { styled } from 'next-yak'

import { Link } from '@/i18n/navigation'
import { EASE_OUT, blur, colors, fonts, media } from '@/styles/tokens.yak'
import { BRAND_SHADOWS } from '@/styles/tokens.yak'

export const Head = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 20px;
`

export const List = styled.ol`
  display: flex;
  flex-direction: column;
  gap: 48px;
  margin-top: 8px;

  ${media.desktop} {
    gap: 56px;
    margin-top: 16px;
  }
`

/**
 * Telefon: slika iznad teksta · od tableta: slika i tekst jedno pored drugog (`auto-fit` sa
 * 420 px je tablet ostavljao na slici preko cele širine i tekstu ispod nje).
 */
export const Row = styled.li`
  display: grid;
  gap: 20px;
  align-items: center;

  ${media.tablet} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 24px 32px;
  }

  ${media.desktop} {
    gap: 32px 56px;
  }
`

/** Slika naizmenično levo/desno (`$flip`); na telefonu uvek iznad teksta. */
export const Media = styled.div<{ $flip: boolean }>`
  order: 0;
  padding: 8px;
  border-radius: 20px;
  background: ${colors.glass};
  border: 1px solid ${colors.edge};
  backdrop-filter: ${blur.soft};
  -webkit-backdrop-filter: ${blur.soft};
  box-shadow: ${BRAND_SHADOWS.featured};
  transition: transform 0.6s ${EASE_OUT};

  ${media.tablet} {
    order: ${({ $flip }) => ($flip ? 2 : 0)};
  }

  ${media.desktop} {
    padding: 12px;
    border-radius: 26px;
  }

  ${media.hover} {
    &:hover {
      transform: translateY(-6px) rotate(-0.6deg);
    }
  }
`

export const Body = styled.div`
  order: 1;
  display: flex;
  flex-direction: column;
  gap: 14px;
`

export const Meta = styled.p`
  display: flex;
  align-items: center;
  gap: 16px;
  font-family: ${fonts.mono};
  font-size: 13px;
  color: ${colors.faint};
`

export const Index = styled.span`
  color: ${colors.accent};
  font-weight: 600;
`

export const Title = styled.h3`
  font-size: clamp(1.75rem, 3.4vw, 2.8rem);
  letter-spacing: -0.035em;
  color: ${colors.display};
`

/** Ispod desktopa sažetak staje u četiri reda — ceo opis je na stranici projekta. */
export const Summary = styled.p`
  max-width: 46ch;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 16px;
  line-height: 1.6;
  color: ${colors.ink2};

  ${media.desktop} {
    display: block;
    overflow: visible;
    font-size: 17px;
  }
`

export const Metric = styled.p`
  display: flex;
  align-items: baseline;
  gap: 10px;
  padding: 14px 0;
  border-top: 1px solid ${colors.line};
  border-bottom: 1px solid ${colors.line};
`

export const MetricValue = styled.span`
  font-family: ${fonts.heading};
  font-weight: 700;
  font-size: 32px;
  color: ${colors.accent};
`

export const MetricLabel = styled.span`
  font-size: 14px;
  color: ${colors.faint};
`

export const Tags = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`

/** Slika je drugi put do iste studije — samo za miš (bez fokusa, skrivena od čitača ekrana). */
export const CoverLink = styled(Link)`
  display: block;
`
