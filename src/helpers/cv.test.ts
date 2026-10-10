import { describe, expect, it } from 'vitest'

import { cvFormSchema } from '@/schemas/cv'

import { toCvInput } from './cv'

const experience = {
  company: 'Acme',
  startYear: 2022,
  bulletsSr: 'Prvo\n\n  Drugo  \n',
  bulletsEn: 'First',
  technologies: 'React,  Next.js , ,TypeScript',
}

describe('toCvInput', () => {
  it('postignuća deli po redovima, tehnologije po zarezu, i izbacuje prazne', () => {
    const form = cvFormSchema.parse({ experiences: [experience] })
    const [result] = toCvInput(form).experiences ?? []
    expect(result?.bulletsSr).toEqual(['Prvo', 'Drugo'])
    expect(result?.technologies).toEqual(['React', 'Next.js', 'TypeScript'])
  })
})
