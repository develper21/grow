import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { PortfolioFilters } from '@/types/portfolio';
import { getPortfolioSnapshot } from '@/server/portfolioMock';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { timeRange = '6M', accountId } = req.query;
  const filters: PortfolioFilters = {
    timeRange: (timeRange as PortfolioFilters['timeRange']) ?? '6M',
    accountId: typeof accountId === 'string' ? accountId : undefined,
  };

  const snapshot = getPortfolioSnapshot(filters);
  return res.status(200).json(snapshot);
}
