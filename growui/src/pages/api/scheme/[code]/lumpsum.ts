import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { cache } from '@/utils/cache';
import { SchemeDetails, LumpsumRequest, LumpsumResponse } from '@/types';
import {
  findNAVForDate,
  parseNAV,
  calculateSimpleReturn,
  calculateAnnualizedReturn,
  getDaysBetween,
} from '@/utils/calculations';

const MFAPI_BASE = 'https://api.mfapi.in';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.query;
  const { amount, from, to }: LumpsumRequest = req.body;

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Invalid scheme code' });
  }

  if (!amount || !from || !to) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Fetch scheme data
    const cacheKey = `scheme_${code}`;
    let schemeData = cache.get<SchemeDetails>(cacheKey);

    if (!schemeData) {
      const response = await axios.get(`${MFAPI_BASE}/mf/${code}`);
      schemeData = response.data;
      cache.set(cacheKey, schemeData, 43200);
    }

    if (!schemeData || schemeData.status !== 'SUCCESS') {
      return res.status(404).json({ error: 'Scheme not found' });
    }

    const startDate = new Date(from);
    const endDate = new Date(to);

    // Find NAV for dates
    const startNAVData = findNAVForDate(schemeData.data, startDate);
    const endNAVData = findNAVForDate(schemeData.data, endDate);

    if (!startNAVData || !endNAVData) {
      return res.status(400).json({ 
        error: 'Insufficient data for the requested period',
        status: 'needs_review'
      });
    }

    const startNAV = parseNAV(startNAVData.nav);
    const endNAV = parseNAV(endNAVData.nav);

    if (startNAV === 0 || endNAV === 0) {
      return res.status(400).json({ 
        error: 'Invalid NAV data',
        status: 'needs_review'
      });
    }

    // Calculate lumpsum investment
    const units = amount / startNAV;
    const currentValue = units * endNAV;
    const absoluteReturn = calculateSimpleReturn(amount, currentValue);
    
    const days = getDaysBetween(new Date(startNAVData.date), new Date(endNAVData.date));
    const annualizedReturn = calculateAnnualizedReturn(amount, currentValue, days);

    const response: LumpsumResponse = {
      invested: amount,
      currentValue,
      units,
      absoluteReturn,
      annualizedReturn,
      startDate: startNAVData.date,
      endDate: endNAVData.date,
      startNAV,
      endNAV,
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Error calculating lumpsum:', error);
    return res.status(500).json({ error: 'Failed to calculate lumpsum returns' });
  }
}
