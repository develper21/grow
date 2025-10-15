import { Commission } from '@/models/Commission';
import { VirtualPortfolio } from '@/models/VirtualPortfolio';
import { User } from '@/models/User';
import { Company } from '@/models/Company';

export interface CommissionCalculationResult {
  portfolioValue: number;
  annualRate: number;
  monthlyRate: number;
  totalMonthlyCommission: number;
  breakdown: {
    company: number;
    admin: number;
    seller: number;
    mutualFund: number;
  };
  period: {
    month: number;
    year: number;
  };
}

export function calculateMonthlyCommission(
  portfolioValue: number,
  annualRate: number = 2.0
): CommissionCalculationResult {
  const monthlyRate = annualRate / 12;
  const shareAnnualRate = annualRate / 4;
  const shareMonthlyRate = shareAnnualRate / 12;

  const totalMonthlyCommission = portfolioValue * (monthlyRate / 100);
  const shareAmount = portfolioValue * (shareMonthlyRate / 100);

  return {
    portfolioValue,
    annualRate,
    monthlyRate: monthlyRate,
    totalMonthlyCommission,
    breakdown: {
      company: shareAmount,
      admin: shareAmount,
      seller: shareAmount,
      mutualFund: shareAmount
    },
    period: {
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear()
    }
  };
}

export async function processMonthlyCommissions() {
  try {
    console.log('Starting monthly commission calculation...');

    const now = new Date();
    const currentPeriod = {
      month: now.getMonth() + 1,
      year: now.getFullYear()
    };

    const existingCommissions = await Commission.countDocuments({
      'period.month': currentPeriod.month,
      'period.year': currentPeriod.year
    });

    if (existingCommissions > 0) {
      console.log(`Commissions for ${currentPeriod.month}/${currentPeriod.year} already processed`);
      return;
    }

    const portfolios = await VirtualPortfolio.find({}).populate('userId');

    console.log(`Processing ${portfolios.length} portfolios...`);

    const commissionRecords = [];

    for (const portfolio of portfolios) {
      if (portfolio.totalValue <= 0) continue;

      const user = portfolio.userId as any;
      if (!user || (user as any).role !== 'customer') continue;

      let sellerId = user._id;
      let adminId = user.parentId;
      let companyId = user.companyId;

      if ((user as any).role === 'customer') {
        sellerId = user.parentId || user._id;
      }

      const company = await Company.findOne({ headId: companyId });
      if (!company) continue;

      const calculation = calculateMonthlyCommission(
        portfolio.totalValue,
        company.settings.annualCommissionRate
      );

      const stakeholders = [
        { id: companyId, type: 'company', amount: calculation.breakdown.company },
        { id: adminId, type: 'admin', amount: calculation.breakdown.admin },
        { id: sellerId, type: 'seller', amount: calculation.breakdown.seller },
        { id: 'mutual_fund', type: 'mutualFund', amount: calculation.breakdown.mutualFund }
      ];

      for (const stakeholder of stakeholders) {
        if (!stakeholder.id) continue;

        const commissionRecord = new Commission({
          period: currentPeriod,
          customerId: user._id,
          sellerId: sellerId,
          adminId: adminId,
          companyId: companyId,
          portfolioValue: portfolio.totalValue,
          annualRate: calculation.annualRate,
          monthlyRate: calculation.monthlyRate,
          totalCommission: calculation.totalMonthlyCommission,
          breakdown: calculation.breakdown,
          status: 'accrued',
          withdrawalDate: new Date(now.getFullYear(), now.getMonth() + 1, company.settings.monthlyPayoutDay),
          generatedAt: now,
          metadata: {
            calculationMethod: 'monthly_portfolio',
            navDate: portfolio.lastCalculated,
            notes: `Portfolio: ${portfolio.name}`
          }
        });

        commissionRecords.push(commissionRecord);
      }
    }

    if (commissionRecords.length > 0) {
      await Commission.insertMany(commissionRecords);
      console.log(`Created ${commissionRecords.length} commission records`);
    }

    return { success: true, recordsCreated: commissionRecords.length };
  } catch (error) {
    console.error('Error processing monthly commissions:', error);
    throw error;
  }
}

export async function getUserCommissionSummary(
  userId: string,
  userRole: string,
  period?: { month: number; year: number }
) {
  try {
    const now = new Date();
    const targetPeriod = period || {
      month: now.getMonth() + 1,
      year: now.getFullYear()
    };

    let matchConditions: any = {};

    switch (userRole) {
      case 'company_head':
        matchConditions.companyId = userId;
        break;
      case 'admin':
        matchConditions.adminId = userId;
        break;
      case 'seller':
        matchConditions.sellerId = userId;
        break;
      case 'customer':
        matchConditions.customerId = userId;
        break;
      default:
        throw new Error('Invalid user role');
    }

    matchConditions['period.month'] = targetPeriod.month;
    matchConditions['period.year'] = targetPeriod.year;

    const commissions = await Commission.aggregate([
      { $match: matchConditions },
      {
        $group: {
          _id: null,
          totalCommission: { $sum: '$totalCommission' },
          userShare: { $sum: `$${userRole === 'company_head' ? 'breakdown.company' : userRole === 'admin' ? 'breakdown.admin' : userRole === 'seller' ? 'breakdown.seller' : 'breakdown.mutualFund'}` },
          count: { $sum: 1 },
          avgPortfolioValue: { $avg: '$portfolioValue' }
        }
      }
    ]);

    return commissions[0] || {
      totalCommission: 0,
      userShare: 0,
      count: 0,
      avgPortfolioValue: 0
    };
  } catch (error) {
    console.error('Error getting commission summary:', error);
    throw error;
  }
}

export async function getAvailableCommissions(userId: string, userRole: string) {
  try {
    const now = new Date();
    const matchConditions: any = {};

    switch (userRole) {
      case 'company_head':
        matchConditions.companyId = userId;
        break;
      case 'admin':
        matchConditions.adminId = userId;
        break;
      case 'seller':
        matchConditions.sellerId = userId;
        break;
      case 'customer':
        matchConditions.customerId = userId;
        break;
    }

    matchConditions.status = 'available';
    matchConditions.withdrawalDate = { $lte: now };

    const commissions = await Commission.find(matchConditions)
      .sort({ withdrawalDate: -1 })
      .limit(50);

    return commissions;
  } catch (error) {
    console.error('Error getting available commissions:', error);
    throw error;
  }
}

export async function processCommissionWithdrawal(
  commissionIds: string[],
  userId: string,
  userRole: string
) {
  try {
    const now = new Date();

    const matchConditions: any = {
      _id: { $in: commissionIds },
      status: 'available',
      withdrawalDate: { $lte: now }
    };

    switch (userRole) {
      case 'company_head':
        matchConditions.companyId = userId;
        break;
      case 'admin':
        matchConditions.adminId = userId;
        break;
      case 'seller':
        matchConditions.sellerId = userId;
        break;
      case 'customer':
        matchConditions.customerId = userId;
        break;
    }

    const result = await Commission.updateMany(
      matchConditions,
      {
        $set: {
          status: 'withdrawn',
          withdrawnAt: now
        }
      }
    );

    return {
      success: true,
      withdrawnCount: result.modifiedCount,
      message: `Successfully withdrew ${result.modifiedCount} commission records`
    };
  } catch (error) {
    console.error('Error processing commission withdrawal:', error);
    throw error;
  }
}

export async function getCommissionHistory(
  userId: string,
  userRole: string,
  limit: number = 50,
  offset: number = 0
) {
  try {
    const matchConditions: any = {};

    switch (userRole) {
      case 'company_head':
        matchConditions.companyId = userId;
        break;
      case 'admin':
        matchConditions.adminId = userId;
        break;
      case 'seller':
        matchConditions.sellerId = userId;
        break;
      case 'customer':
        matchConditions.customerId = userId;
        break;
    }

    const commissions = await Commission.find(matchConditions)
      .sort({ generatedAt: -1 })
      .skip(offset)
      .limit(limit);

    const total = await Commission.countDocuments(matchConditions);

    return {
      commissions,
      total,
      hasMore: (offset + limit) < total
    };
  } catch (error) {
    console.error('Error getting commission history:', error);
    throw error;
  }
}
