import type en from './en'

type DeepString<T> = { [K in keyof T]: T[K] extends string ? string : DeepString<T[K]> }

/** Oblik poruka — `en.ts` je izvor istine, `sr.ts` mora imati iste ključeve. */
export type Messages = DeepString<typeof en>
export type MessageNamespace = keyof Messages
