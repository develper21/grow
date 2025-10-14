import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { processCommissionWithdrawal, getAvailableCommissions } from '@/utils/commissionCalculator';
import dbConnect from '@/utils/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.id || !session?.user?.role) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { userId, role } = session.user;
    const { commissionIds } = req.body;

    if (!commissionIds || !Array.isArray(commissionIds) || commissionIds.length === 0) {
      return res.status(400).json({ message: 'Commission IDs are required' });
    }

    // Verify user has access to these commissions and they are available for withdrawal
    const availableCommissions = await getAvailableCommissions(userId, role);

    const validCommissionIds = availableCommissions
      .filter(commission => commissionIds.includes(commission._id.toString()))
      .map(commission => commission._id.toString());

    if (validCommissionIds.length === 0) {
      return res.status(400).json({ message: 'No valid commissions found for withdrawal' });
    }

    // Process the withdrawal
    const result = await processCommissionWithdrawal(validCommissionIds, userId, role);

    if (!result.success) {
      return res.status(500).json({ message: 'Failed to process withdrawal' });
    }

    // Get updated available commissions after withdrawal
    const updatedAvailable = await getAvailableCommissions(userId, role);

    return res.status(200).json({
      success: true,
      message: result.message,
      withdrawnCount: result.withdrawnCount,
      remainingAvailable: updatedAvailable.length,
      totalRemainingAmount: updatedAvailable.reduce((sum, commission) => {
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
      }, 0)
    });

  } catch (error) {
    console.error('Error processing commission withdrawal:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
