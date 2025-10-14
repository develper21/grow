import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { cache } from '@/utils/cache';
import { SchemeDetails } from '@/types';

const MFAPI_BASE = 'https://api.mfapi.in';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.query;

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Invalid scheme code' });
  }

  try {
    const cacheKey = `scheme_${code}`;
    
    const cachedData = cache.get<SchemeDetails>(cacheKey);
    if (cachedData) {
      return res.status(200).json(cachedData);
    }

    const response = await axios.get(`${MFAPI_BASE}/mf/${code}`);
    const schemeData: SchemeDetails = response.data;

    if (schemeData.status !== 'SUCCESS') {
      return res.status(404).json({ error: 'Scheme not found' });
    }

    cache.set(cacheKey, schemeData, 43200);

    return res.status(200).json(schemeData);
  } catch (error) {
    console.error('Error fetching scheme details:', error);
    return res.status(500).json({ error: 'Failed to fetch scheme details' });
  }
}
