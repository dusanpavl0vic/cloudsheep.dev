/**
 * Sanduče Mailpit-a (lažni SMTP u CI-ju i u infra/docker-compose.yml). Bez `MAILPIT_URL`
 * testovi koji ga traže se preskaču — lokalni dev server mejl samo ispiše u log.
 */
export const MAILPIT_URL = process.env.MAILPIT_URL

interface MailSummary {
  ID: string
  Subject: string
  To: { Address: string }[]
}

/** Čeka poslednji mejl za adresu (slanje je asinhrono u odnosu na odgovor forme). */
export const waitForMail = async (to: string, timeoutMs = 15_000): Promise<{ subject: string; text: string }> => {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    const response = await fetch(`${MAILPIT_URL ?? ''}/api/v1/search?query=${encodeURIComponent(`to:"${to}"`)}`)
    const { messages } = (await response.json()) as { messages: MailSummary[] }
    const latest = messages[0]
    if (latest) {
      const message = (await (await fetch(`${MAILPIT_URL ?? ''}/api/v1/message/${latest.ID}`)).json()) as { Text: string }
      return { subject: latest.Subject, text: message.Text }
    }
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
  throw new Error(`Mejl za ${to} nije stigao za ${String(timeoutMs)} ms`)
}

/** Link potvrde iz mejla, prebačen na server koji se testira (mejl nosi kanonski domen). */
export const confirmPathFrom = (text: string) => {
  const match = /https?:\/\/[^\s]+\/(?:[a-z]{2}\/)?(?:contact|newsletter)\/confirm\?token=[\w%-]+/.exec(text)
  if (!match) throw new Error('U mejlu nema linka potvrde')
  const url = new URL(match[0])
  return `${url.pathname}${url.search}`
}
