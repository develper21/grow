import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { addFeedbackEntry, getFeedbackEntries } from '@/server/supportMock';
import { FeedbackEntry } from '@/types/support';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    return res.status(200).json({ items: getFeedbackEntries() });
  }

  if (req.method === 'POST') {
    const { user, rating, comment, type } = req.body as Pick<FeedbackEntry, 'user' | 'rating' | 'comment' | 'type'>;
    if (!user || !rating || !type) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const feedback = addFeedbackEntry({ user, rating, comment, type });
    return res.status(201).json(feedback);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ message: 'Method Not Allowed' });
}
