import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getFeatureFlags, toggleFeatureFlag } from '@/server/adminMock';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    return res.status(200).json({ items: getFeatureFlags() });
  }

  if (req.method === 'PATCH') {
    const { key, enabled } = req.body as { key?: string; enabled?: boolean };
    if (!key || typeof enabled !== 'boolean') {
      return res.status(400).json({ message: 'Missing key or enabled flag' });
    }
    const updated = toggleFeatureFlag(key, enabled);
    if (!updated) {
      return res.status(404).json({ message: 'Feature flag not found' });
    }
    return res.status(200).json(updated);
  }

  res.setHeader('Allow', ['GET', 'PATCH']);
  return res.status(405).json({ message: 'Method Not Allowed' });
}
