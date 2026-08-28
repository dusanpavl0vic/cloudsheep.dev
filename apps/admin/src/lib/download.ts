/**
 * Ponudi `Blob` korisniku kao datoteku za snimanje.
 *
 * Postoji kao helper, a ne u komponenti, iz jednog razloga: `URL.createObjectURL` drži
 * referencu na `Blob` dok se ne pozove `revokeObjectURL`. Zaboravljen `revoke` znači da
 * ceo PDF ostaje u memoriji do osvežavanja strane — greška koja se ne vidi ni u jednom
 * testu, a nakupi se kroz sesiju.
 *
 * `<a>` se pravi i uklanja u istom kadru: element ne sme da ostane u DOM-u, a `click()` na
 * nezakačenom čvoru ne radi u svim pretraživačima.
 */
export const downloadBlob = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = filename
  document.body.append(link)
  link.click()
  link.remove()

  URL.revokeObjectURL(url)
}
