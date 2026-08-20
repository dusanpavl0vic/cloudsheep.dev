import type { VariantProps } from 'class-variance-authority'
import { useState } from 'react'

import { cn } from '@app/ui'

import {
  techTileFallbackVariants,
  techTileImageVariants,
  techTileVariants,
} from './TechTile.variants'

type TechTileProps = VariantProps<typeof techTileVariants> & {
  /** Ime tehnologije — ide u pristupačno ime i u rezervni inicijal. */
  label: string
  /**
   * Adresa logotipa, ili `null` kad tehnologija nema otpremljen logotip.
   *
   * `null` NIJE greška: pločica tada prikazuje inicijal, isto kao kad se učitavanje ne
   * uspe. Otkad logotipi žive u bazi, tehnologija bez logotipa je normalno stanje.
   */
  icon: string | null
  className?: string
}

/**
 * Logotip tehnologije u squircle pločici.
 *
 * Prima `label` i `icon` kao primitive, ne ceo `TechItem`: deljena komponenta ne sme da zna
 * za oblik podataka nekog feature-a (docs/01 §2) — lint pravilo `no-restricted-paths` je to
 * i uhvatilo kad je prvo bilo napisano sa importom tipa.
 *
 * Logo se učitava kao `<img>` iz `public/`, ne kao inline SVG: obojeni brend logotipi
 * ne mogu kroz `currentColor`, a inline bi ih ubacio u JS bundle (docs/07 §6).
 *
 * `loading="lazy"` jer su pločice ispod fold-a; `width`/`height` da CLS ostane 0 (docs/07 §7).
 * Ako fajl nedostaje, prikazuje se inicijal — prazna pločica bi izgledala kao greška u rasporedu.
 */
export const TechTile = ({ label, icon, size, interactive, className }: TechTileProps) => {
  const [failed, setFailed] = useState(false)
  const showFallback = failed || !icon

  return (
    <span
      className={cn(techTileVariants({ size, interactive }), className)}
      title={label}
      role="img"
      aria-label={label}
    >
      {showFallback ? (
        <span aria-hidden className={techTileFallbackVariants({ size })}>
          {label.charAt(0)}
        </span>
      ) : (
        <img
          src={icon}
          alt=""
          aria-hidden
          width={36}
          height={36}
          loading="lazy"
          decoding="async"
          className={techTileImageVariants({ size })}
          onError={() => {
            setFailed(true)
          }}
        />
      )}
    </span>
  )
}
