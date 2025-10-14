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
    const cachedData = cache.get<MFScheme[]>(CACHE_KEY);
    if (cachedData) {
      return res.status(200).json(cachedData);
    }

    const response = await axios.get(`${MFAPI_BASE}/mf`, { timeout: 15000 });
    const allSchemes: MFScheme[] = response.data;

    console.log(`Fetched ${allSchemes.length} total schemes from MFAPI`);

    // Check more schemes for NAV data (increase from 20 to 100+)
    const schemesToCheck = allSchemes.slice(0, 150);
    const schemesWithNAV = [];

    for (const scheme of schemesToCheck) {
      try {
        const navResponse = await axios.get(`${MFAPI_BASE}/mf/${scheme.schemeCode}`, { timeout: 8000 });
        const navData = navResponse.data;

        if (navData?.data && navData.data.length > 0) {
          // Be less strict - just check if there's NAV data, not necessarily recent
          const latestNAV = navData.data[navData.data.length - 1];
          const navDate = new Date(latestNAV.date);
          const today = new Date();
          const daysDiff = Math.floor((today.getTime() - navDate.getTime()) / (1000 * 60 * 60 * 24));

          // Accept NAV data from last 30 days (more lenient)
          if (daysDiff <= 30) {
            schemesWithNAV.push(scheme);
          }
        }
      } catch (error) {
        // If NAV fetch fails, still include the scheme (less strict)
        schemesWithNAV.push(scheme);
      }
    }

    // If we still don't have many schemes, return more from the total list
    let finalSchemes = schemesWithNAV;
    if (schemesWithNAV.length < 100) {
      const additionalSchemes = allSchemes.slice(150, 300); // Get more schemes
      finalSchemes = [...schemesWithNAV, ...additionalSchemes];
    }

    console.log(`Returning ${finalSchemes.length} schemes`);

    cache.set(CACHE_KEY, finalSchemes, 21600);

    return res.status(200).json(finalSchemes);
  } catch (error) {
    console.error('Error fetching schemes:', error);

    try {
      const response = await axios.get(`${MFAPI_BASE}/mf`, { timeout: 10000 });
      const schemes = response.data.slice(0, 20);
      return res.status(200).json(schemes);
    } catch (fallbackError) {
      return res.status(500).json({ error: 'Failed to fetch schemes' });
    }
  }
}
