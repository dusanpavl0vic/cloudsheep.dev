import { styled } from 'next-yak'

import { Link } from '@/i18n/navigation'
import { glassStrong, lineClamp3 } from '@/styles/mixins'
import { EASE_OUT, colors, fonts, media } from '@/styles/tokens.yak'
import { BRAND_SHADOWS } from '@/styles/tokens.yak'

export const Root = styled.article`
  ${glassStrong};
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 12px 12px 22px;
  border-radius: 24px;
  box-shadow: ${BRAND_SHADOWS.listCard};
  transition:
    transform 0.5s ${EASE_OUT},
    box-shadow 0.5s;

  ${media.hover} {
    &:hover {
      transform: translateY(-6px);
      box-shadow: ${BRAND_SHADOWS.listCardHover};
    }
  }

  &:focus-within {
    outline: 2px solid ${colors.accent};
    outline-offset: 3px;
  }
`

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0 10px;
`

export const Meta = styled.p`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-family: ${fonts.mono};
  font-size: 12px;
  color: ${colors.faint};
`

export const Title = styled.h2`
  font-size: 26px;
  letter-spacing: -0.025em;
  color: ${colors.display};
`

/** Link u naslovu pokriva celu karticu (`::after`) — jedan tab stop, ceo pravougaonik klikabilan. */
export const TitleLink = styled(Link)`
  outline: none;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
  }
`

export const Summary = styled.p`
  ${lineClamp3};
  font-size: 15.5px;
  line-height: 1.55;
  color: ${colors.ink2};
`

export const Tags = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`
