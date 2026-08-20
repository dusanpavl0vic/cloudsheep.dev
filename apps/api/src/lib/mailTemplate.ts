/**
 * HTML šablon za automatski odgovor posetiocu.
 *
 * **Pravila mejl HTML-a nisu ista kao veb HTML-a**, otud izgled koji deluje zastarelo:
 *
 * - **Stil je inline**, ne u `<style>` bloku — Gmail ga u prosleđenim porukama uklanja.
 * - **Raspored ide kroz `<table>`**, ne kroz flex ili grid; Outlook koristi Word engine
 *   za renderovanje i moderan raspored jednostavno ne razume.
 * - **Boje su hex**, ne `oklch` iz teme: nijedan mejl klijent ne podržava taj zapis.
 *   Vrednosti su ručno prevedene iz `theme.css` i moraju se ažurirati zajedno s njim.
 * - **Nema spoljnih fontova ni slika**: mejl klijenti blokiraju daljinsko učitavanje dok
 *   korisnik ne dozvoli, pa bi poruka do tada izgledala polomljeno.
 */

/** Boje iz `packages/config/tailwind-config/theme.css`, prevedene u hex. */
const COLOR = {
  background: '#f7f7f4',
  card: '#fdfdfb',
  ink: '#1e3a7b',
  primary: '#1f5fd8',
  muted: '#6b7280',
  border: '#e5e3de',
} as const

/**
 * Ekranira tekst pre umetanja u HTML.
 *
 * **Nije opciono.** Ime dolazi iz javne forme, od nepoznate osobe; bez ovoga bi unos
 * `<img src=x onerror=...>` završio kao živ HTML u tuđem sandučetu.
 */
const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

interface TemplateCopy {
  greeting: (name: string) => string
  lead: string
  note: string
  signoff: string
  cta: string
}

export const autoReplyHtml = (name: string, copy: TemplateCopy): string => {
  const safeName = escapeHtml(name)

  return `<!doctype html>
<html lang="sr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${COLOR.background};">
  <!-- Pretpregled u listi poruka; sakriven u samom telu -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(copy.lead)}</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLOR.background};padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:${COLOR.card};border:1px solid ${COLOR.border};border-radius:14px;">

        <tr><td style="padding:28px 32px 0;">
          <!-- Ovčica kao tekst, ne slika: klijenti blokiraju daljinske slike -->
          <span style="display:inline-block;font:700 15px/1 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;letter-spacing:-0.02em;color:${COLOR.ink};">
            ☁ cloudsheep<span style="color:${COLOR.primary};">.dev</span>
          </span>
        </td></tr>

        <tr><td style="padding:20px 32px 0;">
          <p style="margin:0 0 14px;font:600 19px/1.35 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:${COLOR.ink};">
            ${copy.greeting(safeName)}
          </p>
          <p style="margin:0 0 14px;font:400 15px/1.65 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:${COLOR.ink};">
            ${escapeHtml(copy.lead)}
          </p>
          <p style="margin:0 0 24px;font:400 14px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:${COLOR.muted};">
            ${escapeHtml(copy.note)}
          </p>
        </td></tr>

        <tr><td style="padding:0 32px 28px;">
          <a href="https://cloudsheep.dev" style="display:inline-block;padding:11px 22px;border-radius:10px;background:${COLOR.primary};color:#ffffff;font:600 14px/1 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;text-decoration:none;">
            ${escapeHtml(copy.cta)}
          </a>
        </td></tr>

        <tr><td style="padding:18px 32px 24px;border-top:1px solid ${COLOR.border};">
          <p style="margin:0;font:400 13px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:${COLOR.muted};">
            ${escapeHtml(copy.signoff)}<br>
            <a href="https://cloudsheep.dev" style="color:${COLOR.primary};text-decoration:none;">cloudsheep.dev</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}
