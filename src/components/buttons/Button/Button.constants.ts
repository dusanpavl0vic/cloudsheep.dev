/** `mailto:` i `tel:` se otvaraju u istom tabu; `http(s)` u novom. */
export const EXTERNAL_HREF = /^(https?:|mailto:|tel:)/
export const NEW_TAB_HREF = /^https?:/
