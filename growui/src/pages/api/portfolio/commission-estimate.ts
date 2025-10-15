import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { calculateMonthlyCommission } from '@/utils/commissionCalculator';
import { VirtualPortfolio } from '@/models/VirtualPortfolio';
import { User } from '@/models/User';
import { Company } from '@/models/Company';
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

    const { id: userId, role } = session.user || { id: '', role: '' };

    // Get user's portfolios
    const portfolios = await VirtualPortfolio.find({ userId });

    if (portfolios.length === 0) {
      return res.status(200).json({
        totalCurrentValue: 0,
        annualProjections: {
          totalAnnualCommission: 0,
          userShare: 0,
          monthlyAverage: 0
        },
        portfolios: []
      });
    }

    let companyId = null;
    if (role === 'customer') {
      const user = await User.findById(userId);
      companyId = user?.companyId;
    } else {
      companyId = userId;
    }

    const company = await Company.findOne({ headId: companyId });
    const annualRate = company?.settings?.annualCommissionRate || 2.0;

    const portfolioProjections = portfolios.map(portfolio => {
      const currentValue = portfolio.totalValue || 0;
      const calculation = calculateMonthlyCommission(currentValue, annualRate);

      return {
        portfolioId: portfolio._id,
        portfolioName: portfolio.name,
        currentValue,
        monthlyCommission: calculation.totalMonthlyCommission,
        annualProjection: calculation.totalMonthlyCommission * 12,
        userShare: role === 'company_head' ? calculation.breakdown.company * 12 :
                  role === 'admin' ? calculation.breakdown.admin * 12 :
                  role === 'seller' ? calculation.breakdown.seller * 12 :
                  calculation.breakdown.mutualFund * 12
      };
    });

    const totalCurrentValue = portfolioProjections.reduce((sum, p) => sum + p.currentValue, 0);
    const totalAnnualCommission = portfolioProjections.reduce((sum, p) => sum + p.annualProjection, 0);
    const totalUserShare = portfolioProjections.reduce((sum, p) => sum + p.userShare, 0);

    return res.status(200).json({
      totalCurrentValue,
      annualProjections: {
        totalAnnualCommission,
        userShare: totalUserShare,
        monthlyAverage: totalAnnualCommission / 12
      },
      portfolios: portfolioProjections,
      calculationBasis: {
        annualRate: `${annualRate}%`,
        monthlyRate: `${(annualRate / 12).toFixed(4)}%`,
        lastUpdated: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error calculating commission estimates:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
