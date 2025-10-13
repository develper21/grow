import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { cache } from '@/utils/cache';
import { MFScheme } from '@/types';

const MFAPI_BASE = 'https://api.mfapi.in';
const CACHE_KEY = 'active_schemes';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check cache first
    const cachedData = cache.get<MFScheme[]>(CACHE_KEY);
    if (cachedData) {
      return res.status(200).json(cachedData);
    }

    // Fetch from external API and filter active funds
    const response = await axios.get(`${MFAPI_BASE}/mf`, { timeout: 10000 });
    const allSchemes: MFScheme[] = response.data;

    // For development: return a subset of schemes that are likely to be active
    // In production, you would check with MongoDB for funds with current NAV data
    const activeSchemes = [];

    for (const scheme of allSchemes.slice(0, 20)) { // Limit to first 20 for performance
      try {
        // Check if this scheme has current NAV data
        const navResponse = await axios.get(`${MFAPI_BASE}/mf/${scheme.schemeCode}`, { timeout: 5000 });
        const navData = navResponse.data;

        if (navData?.data && navData.data.length > 0) {
          // Check if latest NAV is recent (within last 7 days)
          const latestNAV = navData.data[navData.data.length - 1];
          const navDate = new Date(latestNAV.date);
          const today = new Date();
          const daysDiff = Math.floor((today.getTime() - navDate.getTime()) / (1000 * 60 * 60 * 24));

          if (daysDiff <= 7) {
            activeSchemes.push(scheme);
          }
        }
      } catch (error) {
        // Skip schemes that fail to fetch NAV data
        continue;
      }
    }

    // If no active schemes found, return basic schemes for development
    if (activeSchemes.length === 0) {
      return res.status(200).json(allSchemes.slice(0, 10));
    }

    // Cache for 6 hours
    cache.set(CACHE_KEY, activeSchemes, 21600);

    return res.status(200).json(activeSchemes);
  } catch (error) {
    console.error('Error fetching schemes:', error);

    // Fallback: return basic scheme list without NAV checking
    try {
      const response = await axios.get(`${MFAPI_BASE}/mf`, { timeout: 10000 });
      const schemes = response.data.slice(0, 20); // Return first 20 as fallback
      return res.status(200).json(schemes);
    } catch (fallbackError) {
      return res.status(500).json({ error: 'Failed to fetch schemes' });
    }
  }
}
