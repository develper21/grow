import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getAvailableCommissions } from '@/utils/commissionCalculator';
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

    // Get available commissions for withdrawal
    const availableCommissions = await getAvailableCommissions(userId, role);

    // Calculate totals
    const totalAvailable = availableCommissions.reduce((sum, commission) => {
      let userShare = 0;
      switch (role) {
        case 'company_head':
          userShare = commission.breakdown.company;
          break;
        case 'admin':
          userShare = commission.breakdown.admin;
          break;
        case 'seller':
          userShare = commission.breakdown.seller;
          break;
        case 'customer':
          userShare = commission.breakdown.mutualFund;
          break;
      }
      return sum + userShare;
    }, 0);

    // Group by period for better display
    const groupedByPeriod = availableCommissions.reduce((acc, commission) => {
      const periodKey = `${commission.period.month}/${commission.period.year}`;
      if (!acc[periodKey]) {
        acc[periodKey] = {
          period: commission.period,
          commissions: [],
          totalAmount: 0,
          count: 0
        };
      }

      let userShare = 0;
      switch (role) {
        case 'company_head':
          userShare = commission.breakdown.company;
          break;
        case 'admin':
          userShare = commission.breakdown.admin;
          break;
        case 'seller':
          userShare = commission.breakdown.seller;
          break;
        case 'customer':
          userShare = commission.breakdown.mutualFund;
          break;
      }

      acc[periodKey].commissions.push({
        _id: commission._id,
        customerId: commission.customerId,
        portfolioValue: commission.portfolioValue,
        userShare: userShare,
        withdrawalDate: commission.withdrawalDate,
        generatedAt: commission.generatedAt
      });

      acc[periodKey].totalAmount += userShare;
      acc[periodKey].count += 1;

      return acc;
    }, {} as Record<string, any>);

    return res.status(200).json({
      totalAvailable,
      count: availableCommissions.length,
      periods: Object.values(groupedByPeriod),
      canWithdraw: totalAvailable > 0
    });

  } catch (error) {
    console.error('Error fetching available commissions:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
