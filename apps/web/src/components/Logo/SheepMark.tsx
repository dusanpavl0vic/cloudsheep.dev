import type { SVGProps } from 'react'

type SheepMarkProps = SVGProps<SVGSVGElement>

/**
 * Brend marka CloudSheep-a: ovca čije je telo oblak.
 *
 * To je ime u jednoj slici — runo i oblak su isti oblik, pa se telo ne crta kao ovca sa
 * krznom nego kao oblak sa nogama. Ranija marka je bila samo oblak sa spiralom unutra;
 * spirala je tražila da posmatrač pogodi da je to vuna.
 *
 * **Sve kroz `currentColor`** — isti SVG radi na svetloj, tamnoj i inverznoj podlozi.
 * Nema `id`-jeva, `mask`-i ni gradijenata: marka se renderuje više puta na istoj stranici
 * (zaglavlje, podnožje, kartice), a duplirani `id` u SVG-u je tiha greška.
 *
 * **Režnjevi oblaka koriste `large-arc-flag=1`.** Tri obična luka daju glatku kupolu koja na
 * 24px izgleda kao kornjača — provereno rasterizovanjem, ne procenom. Luk duži od polukruga
 * pravi pravo urezivanje između režnjeva, pa se runo prepoznaje i na najmanjoj veličini.
 *
 * **Oko je rupa u glavi**, ne tačka preko nje: glava je puna površina, pa bi tačka morala da
 * bude u boji pozadine — a pozadinu ne znamo. Rupa se pravi obrnutim namotajem podputanje
 * (`sweep-flag=0`) uz podrazumevani `nonzero`, isti trik kao rupa u slovu „o".
 *
 * Geometrija je računata, ne crtana: svaki luk ima poluprečnik ≥ pola tetive (inače bi ga
 * pretraživač tiho uvećao), a okvir mastila je izmeren i centriran na (24, 24).
 */
export const SheepMark = ({ className, ...props }: SheepMarkProps) => (
  <svg viewBox="0 0 48 48" fill="none" aria-hidden className={className} {...props}>
    {/* Telo — oblak sa ravnim dnom. Ravno dno je ono što ga čita kao oblak, a ne kao runo. */}
    <path
      d="M9.45 28.5A5.4 5.4 0 1 1 15.45 21.5A5.6 5.6 0 1 1 24.45 20.5A5.2 5.2 0 1 1 30.95 25A4 4 0 0 1 31.45 28.5Z"
      stroke="currentColor"
      strokeWidth={2.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Noge — bez njih je ovo oblak sa glavom, a ne ovca. */}
    <path
      d="M13.95 29.5V36M26.95 29.5V36"
      stroke="currentColor"
      strokeWidth={2.8}
      strokeLinecap="round"
    />

    {/* Uvo ide PRE glave: puna glava prekriva njegov unutrašnji kraj, pa uvo izlazi ispod
        nje umesto da se vidi gde je zalepljeno. */}
    <path d="M35.25 17L32.05 18.8" stroke="currentColor" strokeWidth={3.4} strokeLinecap="round" />

    {/* Glava i oko u JEDNOJ putanji. Glava je nagnuta elipsa — duža osa je njuška; okrugla
        glava je izgledala kao lopta zalepljena na oblak. Puna površina usput prekriva ivicu
        tela ispod sebe, pa se dve linije ne seku. */}
    <path
      d="M33.07 17.68A6.72 5.1 38 0 1 43.63 25.92A6.72 5.1 38 0 1 33.07 17.68Z
         M39.05 21.4A1.5 1.5 0 0 0 42.05 21.4A1.5 1.5 0 0 0 39.05 21.4Z"
      fill="currentColor"
    />
  </svg>
)
