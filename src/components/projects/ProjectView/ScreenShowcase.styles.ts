import { styled } from 'next-yak'

import { BRAND_COLORS, DEVICE_FRAME, fonts } from '@/styles/tokens.yak'

export const Panel = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
  padding: clamp(20px, 4vw, 48px);
  border-radius: 30px;
  background: linear-gradient(160deg, ${BRAND_COLORS.ice}, ${BRAND_COLORS.sky} 140%);
`

export const Tabs = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
`

export const Divider = styled.span`
  width: 1px;
  margin: 0 6px;
  background: ${DEVICE_FRAME.browserLine};
`

export const Phone = styled.div`
  width: min(100%, 300px);
  aspect-ratio: 9 / 19;
  padding: 12px;
  border-radius: 46px;
  background: ${DEVICE_FRAME.phone};
  box-shadow: ${DEVICE_FRAME.shadow};
`

export const PhoneScreen = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 36px;
  overflow: hidden;
  background: ${DEVICE_FRAME.screen};

  &::after {
    content: '';
    position: absolute;
    top: 10px;
    left: 50%;
    width: 90px;
    height: 26px;
    border-radius: 999px;
    background: ${DEVICE_FRAME.phone};
    transform: translateX(-50%);
  }
`

export const Browser = styled.div`
  width: 100%;
  max-width: 1040px;
  border-radius: 16px;
  overflow: hidden;
  background: ${DEVICE_FRAME.browser};
  box-shadow: ${DEVICE_FRAME.shadow};
`

export const BrowserBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-bottom: 1px solid ${DEVICE_FRAME.browserLine};
`

export const Light = styled.span`
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: ${BRAND_COLORS.sky};
`

export const Url = styled.span`
  flex: 1;
  margin-left: 12px;
  padding: 6px 12px;
  border-radius: 8px;
  background: ${DEVICE_FRAME.screen};
  font-family: ${fonts.mono};
  font-size: 12px;
  color: ${DEVICE_FRAME.url};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const BrowserScreen = styled.div`
  position: relative;
  aspect-ratio: 16 / 9;
  background: ${DEVICE_FRAME.screen};
`

export const Shot = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
`
