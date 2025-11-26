import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getTemplates, updateTemplateStatus } from '@/server/notificationMock';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    return res.status(200).json({ items: getTemplates() });
  }

  if (req.method === 'PATCH') {
    const { templateId, status } = req.body as { templateId?: string; status?: 'draft' | 'active' | 'archived' };
    if (!templateId || !status) {
      return res.status(400).json({ message: 'Missing template ID or status' });
    }
    const updated = updateTemplateStatus(templateId, status);
    if (!updated) {
      return res.status(404).json({ message: 'Template not found' });
    }
    return res.status(200).json(updated);
  }

  res.setHeader('Allow', ['GET', 'PATCH']);
  return res.status(405).json({ message: 'Method Not Allowed' });
}
