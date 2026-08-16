type QueryValue = string | number | boolean | null | undefined | readonly (string | number)[];

/**
 * Gradi query string. `null`/`undefined`/prazan string se izostavljaju — inače URL
 * skuplja `?tag=&page=` smeće pri svakom resetu filtera.
 */
export function buildQuery(params: Record<string, QueryValue>): string {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined || value === '') continue;
    if (Array.isArray(value)) {
      for (const item of value) search.append(key, String(item));
    } else {
      search.set(key, String(value));
    }
  }

  const query = search.toString();
  return query ? `?${query}` : '';
}
