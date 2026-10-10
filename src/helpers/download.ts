/** Snima sadržaj kao fajl u pregledaču (CSV, PDF iz admin API-ja, koji traži Authorization). */
export const saveBlob = (content: Blob | string, filename: string, type = 'text/csv;charset=utf-8') => {
  const blob = typeof content === 'string' ? new Blob([content], { type }) : content
  const url = URL.createObjectURL(blob)
  const link = Object.assign(document.createElement('a'), { href: url, download: filename })
  link.click()
  URL.revokeObjectURL(url)
}

/** Preuzima već napravljen object URL (PDF iz admin API-ja) i oslobađa ga. */
export const saveObjectUrl = (url: string, filename: string) => {
  Object.assign(document.createElement('a'), { href: url, download: filename }).click()
  URL.revokeObjectURL(url)
}
