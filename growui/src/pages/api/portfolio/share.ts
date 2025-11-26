import type { NextApiRequest, NextApiResponse } from 'next';
import { randomUUID } from 'crypto';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { PortfolioFilters } from '@/types/portfolio';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { timeRange = '6M', accountId } = req.body ?? {};
  const filters: PortfolioFilters = {
    timeRange: (timeRange as PortfolioFilters['timeRange']) ?? '6M',
    accountId: typeof accountId === 'string' ? accountId : undefined,
  };

  const token = randomUUID();
  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://grow.example.com'}/share/${token}`;
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString();

  return res.status(200).json({ shareUrl, expiresAt, filters });
}
