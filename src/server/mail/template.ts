import 'server-only'

import { PALETTE } from '@/constants/theme'

/**
 * HTML za automatski odgovor. Pravila mejl HTML-a nisu ista kao veb HTML-a:
 * stil je INLINE (Gmail briše `<style>` u prosleđenim porukama), raspored kroz `<table>`
 * (Outlook renderuje Word engine-om), boje su hex, bez spoljnih fontova i slika.
 */
const COLOR = {
  background: PALETTE.light.bg,
  card: PALETTE.light.card,
  ink: PALETTE.light.display,
  text: PALETTE.light.ink2,
  primary: PALETTE.light.primary,
  muted: PALETTE.light.faint,
  border: PALETTE.light.line,
} as const

const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif"

/** NIJE opciono: ime dolazi iz javne forme — bez ovoga `<img onerror>` stiže živ u tuđe sanduče. */
export const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

export interface AutoReplyCopy {
  greeting: string
  lead: string
  call: string | null
  note: string
  cta: string
  signoff: string
  siteUrl: string
  lang: string
}

const paragraph = (text: string, size: number, color: string, margin: number) =>
  `<p style="margin:0 0 ${String(margin)}px;font:400 ${String(size)}px/1.65 ${FONT};color:${color};">${escapeHtml(text)}</p>`

export const autoReplyHtml = (copy: AutoReplyCopy) => `<!doctype html>
<html lang="${copy.lang}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${COLOR.background};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(copy.lead)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLOR.background};padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:${COLOR.card};border:1px solid ${COLOR.border};border-radius:18px;">
        <tr><td style="padding:28px 32px 0;">
          <span style="font:700 16px/1 ${FONT};letter-spacing:-0.03em;color:${COLOR.primary};">cloudsheep<span style="color:${PALETTE.light.accent};">.dev</span></span>
        </td></tr>
        <tr><td style="padding:20px 32px 0;">
          <p style="margin:0 0 14px;font:600 19px/1.35 ${FONT};color:${COLOR.ink};">${escapeHtml(copy.greeting)}</p>
          ${paragraph(copy.lead, 15, COLOR.text, 14)}
          ${copy.call ? paragraph(copy.call, 15, COLOR.text, 14) : ''}
          ${paragraph(copy.note, 14, COLOR.muted, 24)}
        </td></tr>
        <tr><td style="padding:0 32px 28px;">
          <a href="${escapeHtml(copy.siteUrl)}" style="display:inline-block;padding:11px 22px;border-radius:10px;background:${COLOR.primary};color:${PALETTE.light.onPrimary};font:600 14px/1 ${FONT};text-decoration:none;">${escapeHtml(copy.cta)}</a>
        </td></tr>
        <tr><td style="padding:18px 32px 24px;border-top:1px solid ${COLOR.border};">
          <p style="margin:0;font:400 13px/1.6 ${FONT};color:${COLOR.muted};">${escapeHtml(copy.signoff)}<br>
            <a href="${escapeHtml(copy.siteUrl)}" style="color:${COLOR.primary};text-decoration:none;">cloudsheep.dev</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
