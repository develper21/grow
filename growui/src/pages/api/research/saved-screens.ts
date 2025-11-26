import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { SavedScreen } from '@/types/research';
import { getSavedScreens, saveScreen } from '@/server/researchMock';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    return res.status(200).json({ items: getSavedScreens() });
  }

  if (req.method === 'POST') {
    const payload = req.body as Omit<SavedScreen, 'id' | 'createdAt' | 'updatedAt'> | undefined;
    if (!payload?.name || !payload.filters) {
      return res.status(400).json({ message: 'Invalid screen payload' });
    }
    const created = saveScreen(payload);
    return res.status(201).json(created);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ message: 'Method Not Allowed' });
}
