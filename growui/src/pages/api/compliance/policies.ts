import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { addRetentionPolicy, getRetentionPolicies, updatePolicy } from '@/server/complianceMock';
import { Regulator } from '@/types/compliance';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    return res.status(200).json({ items: getRetentionPolicies() });
  }

  if (req.method === 'PATCH') {
    const { policyId, retentionPeriodMonths, regulator } = req.body as {
      policyId?: string;
      retentionPeriodMonths?: number;
      regulator?: Regulator;
    };
    if (!policyId || !retentionPeriodMonths) {
      return res.status(400).json({ message: 'Missing policy ID or retention period' });
    }
    const policy = updatePolicy(policyId, retentionPeriodMonths, regulator);
    if (!policy) {
      return res.status(404).json({ message: 'Policy not found' });
    }
    return res.status(200).json(policy);
  }

  if (req.method === 'POST') {
    const { regulator, dataCategory, retentionPeriodMonths, legalReference } = req.body as {
      regulator?: Regulator;
      dataCategory?: string;
      retentionPeriodMonths?: number;
      legalReference?: string;
    };
    if (!regulator || !dataCategory || !retentionPeriodMonths || !legalReference) {
      return res.status(400).json({ message: 'Missing fields' });
    }
    const created = addRetentionPolicy({
      regulator,
      dataCategory: dataCategory as any,
      retentionPeriodMonths,
      legalReference,
    });
    return res.status(201).json(created);
  }

  res.setHeader('Allow', ['GET', 'POST', 'PATCH']);
  return res.status(405).json({ message: 'Method Not Allowed' });
}
