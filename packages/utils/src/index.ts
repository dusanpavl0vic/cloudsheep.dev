// Javni API paketa. Barrel je ovde legitiman — ovo je granica paketa (docs/adr/0005).

// string
export { capitalize } from './string/capitalize'
export { mask } from './string/mask'
export { slugify } from './string/slugify'
export { truncate } from './string/truncate'

// number
export { bytes } from './number/bytes'
export { clamp } from './number/clamp'
export { percentage } from './number/percentage'
export { round } from './number/round'

// date — formatiranje za prikaz je u @app/i18n, ne ovde
export { diffInDays } from './date/diffInDays'
export { isExpired } from './date/isExpired'
export { toISODate } from './date/toISODate'

// array
export { chunk } from './array/chunk'
export { groupBy } from './array/groupBy'
export { partition } from './array/partition'
export { sortBy } from './array/sortBy'
export { uniqueBy } from './array/uniqueBy'

// object
export { deepMerge } from './object/deepMerge'
export { isEmpty } from './object/isEmpty'
export { omit } from './object/omit'
export { pick } from './object/pick'

// validation
export { isEmail } from './validation/isEmail'
export { isJMBG } from './validation/isJMBG'
export { isPhoneRS } from './validation/isPhoneRS'
export { isPIB } from './validation/isPIB'

// storage
export {
  browserStorage,
  createStorage,
  type StorageLike,
  type TypedStorage,
} from './storage/createStorage'

// url
export { buildQuery } from './url/buildQuery'
export { parseQuery } from './url/parseQuery'

// async
export { pRetry } from './async/pRetry'
export { sleep } from './async/sleep'
export { TimeoutError, withTimeout } from './async/withTimeout'
