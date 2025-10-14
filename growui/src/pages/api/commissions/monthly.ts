import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getUserCommissionSummary, getCommissionHistory } from '@/utils/commissionCalculator';
import dbConnect from '@/utils/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.id || !session?.user?.role) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { userId, role } = session.user;
    const { period, limit = 12, offset = 0 } = req.query;

    let targetPeriod;
    if (period) {
      const [month, year] = (period as string).split('-').map(Number);
      targetPeriod = { month, year };
    }

    // Get current month summary
    const currentMonthSummary = await getUserCommissionSummary(userId, role, targetPeriod);

    // Get historical data for the last 12 months
    const historicalData = [];
    const now = new Date();

    for (let i = 0; i < 12; i++) {
      const month = now.getMonth() + 1 - i;
      const year = month > 0 ? now.getFullYear() : now.getFullYear() - 1;
      const adjustedMonth = month > 0 ? month : 12 + month;

      const summary = await getUserCommissionSummary(userId, role, {
        month: adjustedMonth,
        year: year
      });

      historicalData.push({
        period: `${adjustedMonth}/${year}`,
        ...summary
      });
    }

    // Get recent commission records
    const recentCommissions = await getCommissionHistory(
      userId,
      role,
      parseInt(limit as string),
      parseInt(offset as string)
    );

    return res.status(200).json({
      currentMonth: currentMonthSummary,
      historical: historicalData,
      recentCommissions: recentCommissions.commissions,
      pagination: {
        total: recentCommissions.total,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        hasMore: recentCommissions.hasMore
      }
    });

  } catch (error) {
    console.error('Error fetching monthly commissions:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
