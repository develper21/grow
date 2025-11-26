import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getUserPreferences, updatePreference } from '@/server/notificationMock';
import { Channel } from '@/types/notification';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    return res.status(200).json({ items: getUserPreferences() });
  }

  if (req.method === 'PATCH') {
    const { userId, channel, optedIn } = req.body as { userId?: string; channel?: Channel; optedIn?: boolean };
    if (!userId || !channel || typeof optedIn !== 'boolean') {
      return res.status(400).json({ message: 'Missing user ID, channel, or opted state' });
    }
    const updated = updatePreference(userId, channel, optedIn);
    if (!updated) {
      return res.status(404).json({ message: 'Preference not found' });
    }
    return res.status(200).json(updated);
  }

  res.setHeader('Allow', ['GET', 'PATCH']);
  return res.status(405).json({ message: 'Method Not Allowed' });
}
