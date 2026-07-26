/** Dekorativne teksture oblaka u hero pozadini (SVG data-URI iz dizajna). */
const CLOUD_PATH =
  'M35,110C16,110,10,88,26,80C18,60,44,49,57,60C61,38,99,38,103,61C124,50,146,66,137,83C156,85,156,110,136,110Z'

const cloudUrl = (stroke: string, width: string, opacity: string) =>
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='150'%3E%3Cpath d='${CLOUD_PATH}' fill='none' stroke='${encodeURIComponent(
    stroke,
  )}' stroke-width='${width}' stroke-opacity='${opacity}'/%3E%3C/svg%3E")`

export const CLOUD_DIM = cloudUrl('#133E87', '1.1', '0.11')
export const CLOUD_LIT = cloudUrl('#1E56E0', '1.5', '0.95')

export const CLOUD_SIZE = '88px 66px'

/** Prečnik svetla koje prati kursor. */
export const SPOTLIGHT_MASK =
  'radial-gradient(circle 150px at var(--mx, -600px) var(--my, -600px), #000 0%, rgba(0,0,0,.38) 46%, transparent 72%)'
