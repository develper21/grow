import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getTriggerRules, toggleTrigger } from '@/server/notificationMock';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    return res.status(200).json({ items: getTriggerRules() });
  }

  if (req.method === 'PATCH') {
    const { triggerId, active } = req.body as { triggerId?: string; active?: boolean };
    if (!triggerId || typeof active !== 'boolean') {
      return res.status(400).json({ message: 'Missing trigger ID or active flag' });
    }
    const updated = toggleTrigger(triggerId, active);
    if (!updated) {
      return res.status(404).json({ message: 'Trigger not found' });
    }
    return res.status(200).json(updated);
  }

  res.setHeader('Allow', ['GET', 'PATCH']);
  return res.status(405).json({ message: 'Method Not Allowed' });
}
