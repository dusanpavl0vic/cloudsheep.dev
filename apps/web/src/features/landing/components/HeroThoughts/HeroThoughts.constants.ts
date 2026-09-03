import type { CSSProperties } from 'react'

type Tail = 'tl' | 'tr' | 'bl' | 'br'

/**
 * Pozicije lebdećih misli — važe samo za `xl` raspored; slot ih ignoriše.
 *
 * **Rep uvek gleda ka naslovu** (docs/22 §3b), a naslov je u sredini sekcije. Otud pravilo:
 * misao gore-levo nosi rep u donjem-desnom uglu, dole-desno u gornjem-levom, i tako redom.
 * Rep koji pokazuje u prazno je crtež, ne znak — zato smer stoji uz poziciju, a ne u `.tsx`.
 */
export const FLOAT_POSITION: Record<string, { style: CSSProperties; tail: Tail }> = {
  // Uvučena više gore-levo otkad je žuta misao veća: njen rep je krenuo da dodiruje `W`
  // iz naslova, a ukras ne sme da ulazi u tipografiju.
  note: { style: { top: '11%', left: '2.5%', rotate: '-6deg' }, tail: 'br' },
  tasks: { style: { bottom: '9%', left: '3%', rotate: '3deg' }, tail: 'tr' },
  deploy: { style: { top: '16%', right: '4%', rotate: '4deg' }, tail: 'bl' },
  stack: { style: { bottom: '12%', right: '3%', rotate: '-4deg' }, tail: 'tl' },
  score: { style: { top: '44%', right: '9%', rotate: '-3deg' }, tail: 'tl' },
}

/**
 * Takt ulaza po misli. Postoji kao **niz konstanti**, a ne kao indeks iz `.map()`-a: cva
 * varijanta prima uniju `0 | 1 | 2 | 3 | 4`, pa bi `number` iz petlje pao na tipovima —
 * i to s razlogom, jer šesta misao ne bi imala definisano kašnjenje.
 */
export const STEP_ORDER = [0, 1, 2, 3, 4] as const
