import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getModerationCases, updateModerationStatus } from '@/server/adminMock';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    return res.status(200).json({ items: getModerationCases() });
  }

  if (req.method === 'PATCH') {
    const { caseId, status } = req.body as { caseId?: string; status?: 'open' | 'reviewing' | 'resolved' };
    if (!caseId || !status) {
      return res.status(400).json({ message: 'Missing case ID or status' });
    }
    const updated = updateModerationStatus(caseId, status);
    if (!updated) {
      return res.status(404).json({ message: 'Case not found' });
    }
    return res.status(200).json(updated);
  }

  res.setHeader('Allow', ['GET', 'PATCH']);
  return res.status(405).json({ message: 'Method Not Allowed' });
}
