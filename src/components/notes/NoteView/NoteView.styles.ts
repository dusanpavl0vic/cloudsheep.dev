import { styled } from 'next-yak'

import { CONTAINER_MAX_WIDTH, colors, fonts } from '@/styles/tokens.yak'

export const Article = styled.article`
  max-width: ${CONTAINER_MAX_WIDTH}px;
  margin: 0 auto;
  padding: clamp(48px, 7vw, 90px) 20px 60px;
  display: flex;
  flex-direction: column;
  gap: 28px;
`

/** Čitljiva kolona: ~70 znakova u redu. */
export const Column = styled.div`
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 18px;
`

export const Meta = styled.p`
  display: flex;
  flex-wrap: wrap;
  gap: 6px 14px;
  font-family: ${fonts.mono};
  font-size: 13px;
  color: ${colors.faint};
`

export const Tag = styled.span`
  color: ${colors.accent};
`

export const Title = styled.h1`
  font-size: clamp(2.4rem, 6vw, 4.4rem);
  line-height: 1;
  letter-spacing: -0.045em;
  color: ${colors.display};
  text-wrap: balance;
`

export const Lead = styled.p`
  font-size: clamp(1.1rem, 1.8vw, 1.3rem);
  line-height: 1.55;
  color: ${colors.ink2};
`

export const More = styled.section`
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  gap: 22px;

  h2 {
    font-size: clamp(1.6rem, 3vw, 2.2rem);
    letter-spacing: -0.03em;
    color: ${colors.display};
  }
`

export const MoreGrid = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr));
  gap: 22px;
`
