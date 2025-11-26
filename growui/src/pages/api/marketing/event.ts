import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getEventPageBySlug } from '@/server/marketingMock';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const slug = typeof req.query.slug === 'string' ? req.query.slug : undefined;
  if (!slug) {
    return res.status(400).json({ message: 'Missing slug' });
  }

  const page = getEventPageBySlug(slug);
  if (!page) {
    return res.status(404).json({ message: 'Event page not found' });
  }

  return res.status(200).json(page);
}
