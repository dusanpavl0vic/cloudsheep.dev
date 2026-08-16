/** Čita query string u objekat; ponovljeni ključ postaje niz. */
export function parseQuery(search: string): Record<string, string | string[]> {
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  const result: Record<string, string | string[]> = {};

  for (const key of new Set(params.keys())) {
    const all = params.getAll(key);
    /* v8 ignore next -- ključ je iz params.keys(), getAll uvek vraća bar jedan element */
    result[key] = all.length > 1 ? all : (all[0] ?? '');
  }

  return result;
}
