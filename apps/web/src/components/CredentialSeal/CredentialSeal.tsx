import { cn } from '@app/ui'

import {
  credentialDegreeVariants,
  credentialImageVariants,
  credentialInstitutionVariants,
  credentialPlateVariants,
  credentialSealVariants,
  credentialTextVariants,
} from './CredentialSeal.variants'

interface CredentialSealProps {
  /** Zvanje — „Diplomirani inženjer elektrotehnike i računarstva". */
  degree: string
  /** Ustanova koja ga je izdala. */
  institution: string
  /** Putanja do grba u `public/`. */
  logo: string
  className?: string
}

/**
 * Pečat sa diplomom: grb ustanove pored zvanja.
 *
 * Tekst je prevod i dolazi kroz propse, pa komponenta ne zove `t()` — isti razlog zbog kog
 * `TechTile` prima `label` umesto `TechItem`.
 *
 * Grb je `alt=""` i `aria-hidden`: tekst pored njega nosi isto značenje, pa bi opisan alt
 * naterao screen reader da istu diplomu pročita dvaput. `width`/`height` su obavezni —
 * bez njih tekst poskoči kad se slika učita (docs/07 §7).
 *
 * Nema `onError` rezerve kao `TechTile`: ovde nema šta da zameni grb, a prazan krug je
 * pošteniji od inicijala koji bi izgledao kao pokvaren logo.
 */
export const CredentialSeal = ({ degree, institution, logo, className }: CredentialSealProps) => (
  <div className={cn(credentialSealVariants(), className)}>
    <span aria-hidden className={credentialPlateVariants()}>
      <img
        src={logo}
        alt=""
        width={72}
        height={72}
        loading="lazy"
        decoding="async"
        className={credentialImageVariants()}
      />
    </span>

    <span className={credentialTextVariants()}>
      <span className={credentialDegreeVariants()}>{degree}</span>
      <span className={credentialInstitutionVariants()}>{institution}</span>
    </span>
  </div>
)
