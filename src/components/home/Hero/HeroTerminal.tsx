'use client'

import { useTyper } from '@/hooks/useTyper'

import { Caret, Prompt, Root, Text } from './HeroTerminal.styles'

interface HeroTerminalProps {
  phrases: string[]
}

/** Terminal ispod naslova koji kuca fraze. Čitač ekrana dobija sve fraze odjednom, bez kucanja. */
const HeroTerminal = ({ phrases }: HeroTerminalProps) => {
  const text = useTyper(phrases)

  return (
    <Root aria-label={phrases.join(' · ')}>
      <Prompt aria-hidden="true">$</Prompt>
      <Text aria-hidden="true">{text}</Text>
      <Caret aria-hidden="true" />
    </Root>
  )
}

export default HeroTerminal
