import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getWatchlist, toggleWatchlist } from '@/server/researchMock';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    return res.status(200).json({ items: getWatchlist() });
  }

  if (req.method === 'POST') {
    const { schemeCode } = req.body ?? {};
    if (!schemeCode) {
      return res.status(400).json({ message: 'Missing scheme code' });
    }
    const entry = toggleWatchlist(schemeCode);
    return res.status(200).json(entry);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ message: 'Method Not Allowed' });
}
