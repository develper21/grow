import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { cache } from '@/utils/cache';
import { MFScheme } from '@/types';

const MFAPI_BASE = 'https://api.mfapi.in';
const CACHE_KEY = 'active_schemes';
const CACHE_TTL_SECONDS = 6 * 60 * 60;
const DEFAULT_LIMIT = 500;
const MAX_LIMIT = 10000;
const DEFAULT_OFFSET = 0;
const MAX_OFFSET = 50000;

interface MFResponseItem {
  schemeCode: number;
  schemeName: string;
}

function parseLimit(limitParam?: string | string[]): number {
  if (!limitParam) return DEFAULT_LIMIT;
  const value = Array.isArray(limitParam) ? limitParam[0] : limitParam;
  const parsed = parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    return DEFAULT_LIMIT;
  }
  return Math.min(parsed, MAX_LIMIT);
}

function parseOffset(offsetParam?: string | string[]): number {
  if (!offsetParam) return DEFAULT_OFFSET;
  const value = Array.isArray(offsetParam) ? offsetParam[0] : offsetParam;
  const parsed = parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed < 0) {
    return DEFAULT_OFFSET;
  }
  return Math.min(parsed, MAX_OFFSET);
}

function normalizeSchemes(rawSchemes: MFResponseItem[]): MFScheme[] {
  if (!Array.isArray(rawSchemes)) return [];
  return rawSchemes
    .filter((scheme) => scheme && scheme.schemeCode && scheme.schemeName)
    .map((scheme) => ({
      schemeCode: Number(scheme.schemeCode),
      schemeName: scheme.schemeName.trim(),
    }));
}

async function fetchSchemesFromAPI(): Promise<MFScheme[]> {
  const response = await axios.get(`${MFAPI_BASE}/mf`, {
    timeout: 20000,
    headers: {
      'Accept-Encoding': 'gzip, deflate, br',
    },
  });

  const normalizedSchemes = normalizeSchemes(response.data);
  cache.set(CACHE_KEY, normalizedSchemes, CACHE_TTL_SECONDS);
  return normalizedSchemes;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const limit = parseLimit(req.query.limit);
  const offset = parseOffset(req.query.offset);
  const refresh = Array.isArray(req.query.refresh)
    ? req.query.refresh[0] === 'true'
    : req.query.refresh === 'true';

  try {
    let schemes = refresh ? null : cache.get<MFScheme[]>(CACHE_KEY);

    if (!schemes) {
      schemes = await fetchSchemesFromAPI();
      console.log(`Fetched ${schemes.length} schemes from MFAPI`);
    } else {
      console.log(`Serving ${schemes.length} schemes from cache`);
    }

    const slicedSchemes = schemes.slice(offset, offset + limit);
    const hasMore = offset + limit < schemes.length;

    return res.status(200).json({
      data: slicedSchemes,
      meta: {
        total: schemes.length,
        limit,
        offset,
        hasMore,
        cacheHit: !refresh && !!cache.get<MFScheme[]>(CACHE_KEY),
      },
    });
  } catch (error) {
    console.error('Error fetching schemes:', error);

    const cachedData = cache.get<MFScheme[]>(CACHE_KEY);
    if (cachedData) {
      const slicedSchemes = cachedData.slice(offset, offset + limit);
      const hasMore = offset + limit < cachedData.length;
      return res.status(200).json({
        data: slicedSchemes,
        meta: {
          total: cachedData.length,
          limit,
          offset,
          hasMore,
          cacheHit: true,
          degraded: true,
        },
      });
    }

    return res.status(502).json({ error: 'MFAPI unavailable. Please try again later.' });
  }
}
