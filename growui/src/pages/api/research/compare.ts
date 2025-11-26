import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getCompareData } from '@/server/researchMock';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const baseCode = typeof req.query.base === 'string' ? req.query.base : undefined;
  const peersParam = req.query.peers;
  const peerCodes = Array.isArray(peersParam)
    ? peersParam
    : typeof peersParam === 'string'
    ? peersParam.split(',').filter(Boolean)
    : [];

  if (!baseCode) {
    return res.status(400).json({ message: 'Missing base fund' });
  }

  const results = getCompareData(baseCode, peerCodes);
  if (!results) {
    return res.status(404).json({ message: 'Base fund not found' });
  }
  return res.status(200).json(results);
}
