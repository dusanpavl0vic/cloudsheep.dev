import { styled } from 'next-yak'

import { Link } from '@/i18n/navigation'
import { focusRing, glassStrong } from '@/styles/mixins'
import { EASE_OUT, INVERSE, colors, fonts, media } from '@/styles/tokens.yak'

export const Head = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: clamp(48px, 7vw, 90px) 20px 40px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`

export const Body = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 20px 60px;
  display: flex;
  flex-direction: column;
  gap: 48px;
`

export const Facts = styled.dl`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
  gap: 32px;
`

export const Fact = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  dt {
    font-family: ${fonts.mono};
    font-size: 12px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: ${colors.accent};
  }

  dd {
    font-size: 17px;
    line-height: 1.5;
  }
`

export const Stack = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`

export const Chapter = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr));
  gap: 16px 56px;
  padding-top: 28px;
  border-top: 1px solid ${colors.line};

  h2 {
    font-size: clamp(1.8rem, 3vw, 2.6rem);
    letter-spacing: -0.03em;
    color: ${colors.display};
  }

  p {
    font-size: 18px;
    line-height: 1.65;
    color: ${colors.ink2};
  }

  p + p {
    margin-top: 1em;
  }
`

export const Panel = styled.section`
  ${glassStrong};
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: clamp(22px, 3vw, 40px);
  border-radius: 24px;

  h2 {
    font-size: 22px;
    color: ${colors.display};
  }
`

export const Gallery = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr));
  gap: 18px;
`

export const Links = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`

/** Tamna kartica „Sledeći projekat" (dizajn) — ceo pravougaonik je link. */
export const Next = styled(Link)`
  ${focusRing};
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: clamp(24px, 3vw, 40px);
  border-radius: 24px;
  background: ${INVERSE.surface};
  color: ${INVERSE.soft};
  transition: transform 0.4s ${EASE_OUT};

  ${media.hover} {
    &:hover {
      transform: translateY(-4px);
    }
  }

  svg {
    flex-shrink: 0;
    color: ${INVERSE.accent};
  }
`

export const NextText = styled.span`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const NextLabel = styled.span`
  font-family: ${fonts.mono};
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${INVERSE.accent};
`

export const NextTitle = styled.span`
  font-family: ${fonts.heading};
  font-weight: 700;
  font-size: clamp(2rem, 4vw, 3rem);
  letter-spacing: -0.035em;
`
