import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getConsentRecords, toggleConsentStatus } from '@/server/complianceMock';
import { ConsentStatus } from '@/types/compliance';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    return res.status(200).json({ items: getConsentRecords() });
  }

  if (req.method === 'PATCH') {
    const { consentId, status } = req.body as { consentId?: string; status?: ConsentStatus };
    if (!consentId || !status) {
      return res.status(400).json({ message: 'Missing consent ID or status' });
    }
    const updated = toggleConsentStatus(consentId, status);
    if (!updated) {
      return res.status(404).json({ message: 'Consent not found' });
    }
    return res.status(200).json(updated);
  }

  res.setHeader('Allow', ['GET', 'PATCH']);
  return res.status(405).json({ message: 'Method Not Allowed' });
}
