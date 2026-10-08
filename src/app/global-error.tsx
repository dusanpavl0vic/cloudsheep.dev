'use client'

/* eslint-disable i18next/no-literal-string -- pada sam koren: nema providera ni prevoda */

interface GlobalErrorProps {
  reset: () => void
}

/**
 * Poslednja linija — kad padne i sam `<html>` layout. Bez stila iz teme i bez prevoda,
 * namerno: sve to zavisi od onoga što je upravo palo. I ovde nikad poruka greške.
 */
const GlobalError = ({ reset }: GlobalErrorProps) => (
  <html lang="en">
    <body>
      <main>
        <h1>Something went wrong · Nešto je pošlo naopako</h1>
        <button
          type="button"
          onClick={() => {
            reset()
          }}
        >
          Try again · Pokušaj ponovo
        </button>
      </main>
    </body>
  </html>
)

export default GlobalError
