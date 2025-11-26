import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { FundScreenerFilters } from '@/types/research';
import { getScreenerResults } from '@/server/researchMock';

const parseArray = (value?: string | string[]) => {
  if (!value) return undefined;
  if (Array.isArray(value)) return value;
  return value.split(',').filter(Boolean);
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const categories = parseArray(req.query.categories) as FundScreenerFilters['categories'];
  const riskLevels = parseArray(req.query.riskLevels) as FundScreenerFilters['riskLevels'];
  const amcs = parseArray(req.query.amcs);
  const tags = parseArray(req.query.tags);
  const minRating = req.query.minRating ? Number(req.query.minRating) : undefined;
  const maxExpenseRatio = req.query.maxExpenseRatio ? Number(req.query.maxExpenseRatio) : undefined;
  const searchTerm = typeof req.query.searchTerm === 'string' ? req.query.searchTerm : undefined;

  const filters: FundScreenerFilters = {
    categories,
    riskLevels,
    amcs,
    tags,
    minRating,
    maxExpenseRatio,
    searchTerm,
  };

  return res.status(200).json(getScreenerResults(filters));
}
