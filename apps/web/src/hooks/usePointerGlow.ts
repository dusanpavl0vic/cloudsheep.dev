import { useEffect, useRef } from 'react'

import { useMediaQuery } from '@app/hooks'

/**
 * Atribut kojim panel govori da prima svetlo. Panel ga dobija kroz `glowPanelProps`.
 *
 * Atribut, ne klasa: klasa bi tvrdila da uz nju ide stil, a ovde je reč o ponašanju.
 */
const GLOW_ATTR = 'data-glow'

/** Spread na panel koji treba da svetli pod kursorom. */
export const glowPanelProps = { [GLOW_ATTR]: '' } as const

/**
 * Svetlo koje prati kursor po grupi panela.
 *
 * Vraća ref za KONTEJNER, ne za panel: jedan slušalac umesto jednog po kartici. Panel pod
 * kursorom se nalazi kroz `closest()`, a koordinate se pišu direktno na njegov stil
 * (`--gx`/`--gy`) — bez `setState`, jer pomeraj miša ne sme da rerenderuje sekciju.
 *
 * **Pravougaonik se čita samo kad se panel promeni**, ne pri svakom pomeraju. Ista greška je
 * u hero-u već izmerena: `getBoundingClientRect()` unutar `mousemove`, odmah posle
 * `setProperty` iz prethodnog događaja, je layout thrashing — upis poništi stil, sledeće
 * čitanje natera pretraživač da preračuna raspored pre nego što odgovori. Lighthouse je to
 * naplatio 104 ms prisilnog preračunavanja.
 *
 * Skrol i promena veličine pomere panel, pa keširana vrednost postane laž — osvežava se
 * najviše jednom po kadru, i samo dok je neki panel aktivan.
 *
 * Pri `prefers-reduced-motion` se ne kači ništa: bez `--gx`/`--gy` gradijent ostaje na svojoj
 * podrazumevanoj poziciji van panela, dakle nevidljiv.
 */
export const usePointerGlow = <T extends HTMLElement>() => {
  const areaRef = useRef<T>(null)
  const prefersReduced = useMediaQuery('(prefers-reduced-motion: reduce)')

  // effect: pointer nad kontejnerom — spoljni sistem je kursor, ne naš state
  useEffect(() => {
    if (prefersReduced) return

    const area = areaRef.current
    if (!area) return

    let panel: HTMLElement | null = null
    let rect: DOMRect | null = null
    let queued = false

    const release = () => {
      panel?.style.removeProperty('--gx')
      panel?.style.removeProperty('--gy')
      panel = null
      rect = null
    }

    const onOver = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target : null
      const next = target?.closest<HTMLElement>(`[${GLOW_ATTR}]`) ?? null
      if (next === panel) return

      release()
      panel = next
      rect = next?.getBoundingClientRect() ?? null
    }

    const onMove = (event: PointerEvent) => {
      if (!panel || !rect) return
      panel.style.setProperty('--gx', `${String(event.clientX - rect.left)}px`)
      panel.style.setProperty('--gy', `${String(event.clientY - rect.top)}px`)
    }

    const onShift = () => {
      if (!panel || queued) return
      queued = true
      requestAnimationFrame(() => {
        rect = panel?.getBoundingClientRect() ?? null
        queued = false
      })
    }

    area.addEventListener('pointerover', onOver)
    area.addEventListener('pointermove', onMove)
    area.addEventListener('pointerleave', release)
    window.addEventListener('scroll', onShift, { passive: true })
    window.addEventListener('resize', onShift)

    return () => {
      area.removeEventListener('pointerover', onOver)
      area.removeEventListener('pointermove', onMove)
      area.removeEventListener('pointerleave', release)
      window.removeEventListener('scroll', onShift)
      window.removeEventListener('resize', onShift)
    }
  }, [prefersReduced])

  return areaRef
}
