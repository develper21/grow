import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { cache } from '@/utils/cache';
import { SchemeDetails, SIPRequest, SIPResponse } from '@/types';
import {
  findNAVForDate,
  parseNAV,
  calculateAnnualizedReturn,
  getDaysBetween,
  getNextSIPDate,
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
  const { amount, frequency, from, to }: SIPRequest = req.body;

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Invalid scheme code' });
  }

  if (!amount || !frequency || !from || !to) {
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
    
    let totalInvested = 0;
    let totalUnits = 0;
    const investments: SIPResponse['investments'] = [];

    // Calculate SIP investments
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const navData = findNAVForDate(schemeData.data, currentDate);
      
      if (navData) {
        const nav = parseNAV(navData.nav);
        
        if (nav > 0) {
          const units = amount / nav;
          totalUnits += units;
          totalInvested += amount;

          // Get current NAV for valuation
          const latestNAV = parseNAV(schemeData.data[0].nav);
          const currentValue = totalUnits * latestNAV;

          investments.push({
            date: navData.date,
            amount,
            nav,
            units,
            totalUnits,
            totalInvested,
            currentValue,
          });
        }
      }

      currentDate = getNextSIPDate(currentDate, frequency);
    }

    if (investments.length === 0) {
      return res.status(400).json({ 
        error: 'No valid SIP dates found',
        status: 'needs_review'
      });
    }

    // Calculate final values
    const latestNAV = parseNAV(schemeData.data[0].nav);
    const currentValue = totalUnits * latestNAV;
    const absoluteReturn = ((currentValue - totalInvested) / totalInvested) * 100;
    
    const days = getDaysBetween(startDate, endDate);
    const annualizedReturn = calculateAnnualizedReturn(
      totalInvested / investments.length,
      currentValue / investments.length,
      days
    );

    const response: SIPResponse = {
      totalInvested,
      currentValue,
      totalUnits,
      absoluteReturn,
      annualizedReturn,
      investments,
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Error calculating SIP:', error);
    return res.status(500).json({ error: 'Failed to calculate SIP returns' });
  }
}
