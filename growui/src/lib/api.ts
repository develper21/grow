// src/lib/api.ts
import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 60 * 60 * 12 }); // 12 hours

/**
 * Fetch with caching
 */
export async function fetchWithCache<T>(url: string, key: string): Promise<T> {
  const cached = cache.get<T>(key);
  if (cached) return cached;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch: ${url}`);
  const data = await res.json();

  cache.set(key, data);
  return data;
}

/**
 * Get all mutual fund schemes
 */
export async function getAllSchemes() {
  return fetchWithCache<any[]>("https://api.mfapi.in/mf", "allSchemes");
}

/**
 * Get scheme NAV + metadata
 */
export async function getScheme(code: string) {
  return fetchWithCache<any>(`https://api.mfapi.in/mf/${code}`, `scheme_${code}`);
}
