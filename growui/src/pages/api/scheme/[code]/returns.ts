import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { cache } from '@/utils/cache';
import { SchemeDetails, ReturnData } from '@/types';
import {
  findNAVForDate,
  parseNAV,
  calculateSimpleReturn,
  calculateAnnualizedReturn,
  getDaysBetween,
  getDateFromPeriod,
} from '@/utils/calculations';

const MFAPI_BASE = 'https://api.mfapi.in';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code, period, from, to } = req.query;

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Invalid scheme code' });
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

    // Determine date range
    let startDate: Date;
    let endDate: Date = new Date();

    if (period && typeof period === 'string') {
      startDate = getDateFromPeriod(period);
    } else if (from && to && typeof from === 'string' && typeof to === 'string') {
      startDate = new Date(from);
      endDate = new Date(to);
    } else {
      return res.status(400).json({ 
        error: 'Either period or from/to dates required' 
      });
    }

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

    const days = getDaysBetween(new Date(startNAVData.date), new Date(endNAVData.date));
    const simpleReturn = calculateSimpleReturn(startNAV, endNAV);
    const annualizedReturn = days >= 30 
      ? calculateAnnualizedReturn(startNAV, endNAV, days)
      : undefined;

    const returnData: ReturnData = {
      startDate: startNAVData.date,
      endDate: endNAVData.date,
      startNAV,
      endNAV,
      simpleReturn,
      annualizedReturn,
      duration: days,
    };

    return res.status(200).json(returnData);
  } catch (error) {
    console.error('Error calculating returns:', error);
    return res.status(500).json({ error: 'Failed to calculate returns' });
  }
}
