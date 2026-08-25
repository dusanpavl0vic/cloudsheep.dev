import type { VariantProps } from 'class-variance-authority'

import { cn } from '@app/ui'

import {
  paperDegreeVariants,
  paperFooterSepVariants,
  paperFooterVariants,
  paperFrameVariants,
  paperGrainVariants,
  paperProgrammeVariants,
  paperRuleVariants,
  paperStampImageVariants,
  paperStampVariants,
  paperUniversityVariants,
  paperVariants,
} from './CredentialSeal.variants'

type CredentialSealProps = VariantProps<typeof paperVariants> & {
  /** Zaglavlje dokumenta — „Univerzitet u Nišu". */
  university: string
  /** Zvanje — „Diplomirani inženjer elektrotehnike i računarstva". */
  degree: string
  /** Studijski program — „Računarstvo i informatika". */
  programme: string
  /** Ustanova koja je izdala diplomu. */
  faculty: string
  /** Grad i država. */
  city: string
  /**
   * Adresa grba. `null` je dozvoljen — otkad pečat dolazi iz baze, član sa diplomom ali
   * bez otpremljenog grba je normalno stanje; kartica se tada prikazuje bez pečata.
   */
  logo: string | null
  className?: string
}

/**
 * Diploma kao dokument, a ne kao oznaka.
 *
 * Ranije je ovo bio grb na okrugloj pločici sa dva reda teksta pored — što je izgledalo kao
 * još jedan tag. Sada je papir sa uokvirenim poljem, a grb je **otisnut preko** sadržaja,
 * kako pečat i stoji na stvarnom dokumentu.
 *
 * Sav tekst dolazi kroz propse: komponenta ne zove `t()`, iz istog razloga iz kog ga ne zove
 * ni `TechTile` — prevod je posao pozivaoca.
 *
 * **Papir se ne invertuje** (`bg-plate`), pa ni mastilo ne sme (`text-plate-ink`). Da tekst
 * koristi `text-foreground`, u tamnoj temi bi postao skoro beo i nestao sa svetlog papira.
 *
 * Grb je `alt=""` + `aria-hidden`: sve što piše na njemu piše i u tekstu ispod, pa bi opisan
 * alt naterao screen reader da istu ustanovu pročita dvaput. `width`/`height` su obavezni —
 * bez njih se raspored pomeri kad se slika učita (docs/07 §7).
 *
 * Redosled u DOM-u je redosled čitanja dokumenta: univerzitet → zvanje → program → fakultet
 * i grad. Vizuelni položaj pečata na to ne utiče, jer je van pristupačnog stabla.
 */
export const CredentialSeal = ({
  university,
  degree,
  programme,
  faculty,
  city,
  logo,
  className,
  layout,
}: CredentialSealProps) => (
  <div className={cn(paperVariants({ layout }), className)}>
    <span aria-hidden className={paperGrainVariants()} />

    <div className={paperFrameVariants()}>
      <span className={paperUniversityVariants()}>{university}</span>

      <h3 className={paperDegreeVariants()}>{degree}</h3>

      <p className={paperProgrammeVariants()}>{programme}</p>

      <span aria-hidden className={paperRuleVariants()} />

      <p className={paperFooterVariants({ stamped: Boolean(logo) })}>
        {/* Podaci ostaju u `span`-ovima: `<p>` je običan tok teksta, pa su inline i prelamaju
            se kao rečenica — a svaki podatak i dalje stoji kao zaseban čvor. */}
        <span>{faculty}</span>
        {/* `\u00A0` je NELOMLJIVI razmak: vezuje tačku za reč ispred, pa pri prelamanju ne
            završi sama na početku novog reda. */}
        <span aria-hidden className={paperFooterSepVariants()}>
          {'\u00A0·'}
        </span>{' '}
        <span>{city}</span>
      </p>

      {logo && (
        <span aria-hidden className={paperStampVariants()}>
          <img
            src={logo}
            alt=""
            width={104}
            height={104}
            loading="lazy"
            decoding="async"
            className={paperStampImageVariants()}
          />
        </span>
      )}
    </div>
  </div>
)
