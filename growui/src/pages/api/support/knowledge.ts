import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getKnowledgeBase, searchFaqs } from '@/server/supportMock';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const term = typeof req.query.search === 'string' ? req.query.search : undefined;
  if (term) {
    return res.status(200).json({ items: searchFaqs(term) });
  }

  return res.status(200).json({ categories: getKnowledgeBase() });
}
