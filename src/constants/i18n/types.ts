import type en from './en'

type DeepString<T> = { [K in keyof T]: T[K] extends string ? string : DeepString<T[K]> }

/** Oblik poruka — `en.ts` je izvor istine, `sr.ts` mora imati iste ključeve. */
export type Messages = DeepString<typeof en>
export type MessageNamespace = keyof Messages

/** Putanja do grupe poruka (`'home'`, `'home.estimator'`) — za isečke koji idu klijentu. */
type GroupPaths<T> = {
  [K in keyof T & string]: T[K] extends string ? never : K | `${K}.${GroupPaths<T[K]>}`
}[keyof T & string]
export type MessagePath = GroupPaths<Messages>
