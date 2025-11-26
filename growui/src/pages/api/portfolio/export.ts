import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { PortfolioFilters } from '@/types/portfolio';
import { getPortfolioExport } from '@/server/portfolioMock';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { format = 'csv', timeRange = '6M', accountId } = req.body ?? {};
  if (!['csv', 'pdf'].includes(format)) {
    return res.status(400).json({ message: 'Invalid export format' });
  }

  const filters: PortfolioFilters = {
    timeRange: (timeRange as PortfolioFilters['timeRange']) ?? '6M',
    accountId: typeof accountId === 'string' ? accountId : undefined,
  };

  const exportInfo = getPortfolioExport(format, filters);
  return res.status(200).json(exportInfo);
}
