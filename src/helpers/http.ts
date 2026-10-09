/**
 * POST JSON bez RTK Query-ja — za forme koje su na svakoj stranici (newsletter u podnožju),
 * gde bi RTK Query koštao budžet (ADR 0014). Greška ima ISTI oblik kao RTK Query greška
 * (`{ status, data }` / `{ status: 'FETCH_ERROR' }`), pa je čita isti `parseApiError`.
 */
export const postJson = async <T>(url: string, body: unknown): Promise<T> => {
  let response: Response
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch {
    // Promise odbijen samo za greške mreže koje se moraju razlikovati od HTTP grešaka.
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw { status: 'FETCH_ERROR' }
  }

  const data: unknown = response.status === 204 ? null : await response.json().catch(() => null)
  // eslint-disable-next-line @typescript-eslint/only-throw-error
  if (!response.ok) throw { status: response.status, data }
  return data as T
}
