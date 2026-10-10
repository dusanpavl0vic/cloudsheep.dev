interface JsonLdProps {
  data: Record<string, unknown>
  /** CSP nonce zahteva — bez njega `script-src` ne pušta ni `application/ld+json`. */
  nonce: string | undefined
}

/**
 * Strukturisani podaci za Google. `<` se ekranira: string iz baze (naslov, opis) ne može da
 * zatvori `<script>` (docs/20-security.md §1).
 */
const JsonLd = ({ data, nonce }: JsonLdProps) => (
  <script
    type="application/ld+json"
    nonce={nonce}
    // Jedno od dva mesta sa sirovim HTML-om (docs/20 §1): JSON je ekraniran, `<` postaje \u003c.
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
  />
)

export default JsonLd
