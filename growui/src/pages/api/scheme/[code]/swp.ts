import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { cache } from '@/utils/cache';
import { SchemeDetails, SWPRequest, SWPResponse } from '@/types';
import {
  findNAVForDate,
  parseNAV,
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
  const { initialInvestment, withdrawalAmount, frequency, from, to }: SWPRequest = req.body;

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Invalid scheme code' });
  }

  if (!initialInvestment || !withdrawalAmount || !frequency || !from || !to) {
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

    // Get initial NAV
    const initialNAVData = findNAVForDate(schemeData.data, startDate);
    if (!initialNAVData) {
      return res.status(400).json({ error: 'No NAV data available for start date' });
    }

    const initialNAV = parseNAV(initialNAVData.nav);
    if (initialNAV === 0) {
      return res.status(400).json({ error: 'Invalid initial NAV' });
    }

    // Calculate initial units
    let remainingUnits = initialInvestment / initialNAV;
    let totalWithdrawn = 0;
    const withdrawals: SWPResponse['withdrawals'] = [];

    // Process withdrawals
    let currentDate = getNextSIPDate(startDate, frequency === 'monthly' ? 'monthly' : 'quarterly');
    
    while (currentDate <= endDate && remainingUnits > 0) {
      const navData = findNAVForDate(schemeData.data, currentDate);
      
      if (navData) {
        const nav = parseNAV(navData.nav);
        
        if (nav > 0) {
          const unitsToRedeem = Math.min(withdrawalAmount / nav, remainingUnits);
          const actualWithdrawal = unitsToRedeem * nav;
          
          remainingUnits -= unitsToRedeem;
          totalWithdrawn += actualWithdrawal;

          withdrawals.push({
            date: navData.date,
            withdrawalAmount: actualWithdrawal,
            nav,
            unitsRedeemed: unitsToRedeem,
            remainingUnits,
            remainingValue: remainingUnits * nav,
          });

          if (remainingUnits <= 0) {
            break;
          }
        }
      }

      currentDate = getNextSIPDate(currentDate, frequency === 'monthly' ? 'monthly' : 'quarterly');
    }

    // Calculate final remaining value
    const latestNAV = parseNAV(schemeData.data[0].nav);
    const remainingValue = remainingUnits * latestNAV;

    const response: SWPResponse = {
      initialInvestment,
      totalWithdrawn,
      remainingValue,
      remainingUnits,
      withdrawals,
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Error calculating SWP:', error);
    return res.status(500).json({ error: 'Failed to calculate SWP' });
  }
}
