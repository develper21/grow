import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { CreateStatementPayload, StatementRequest } from '@/types/statements';
import {
  getStatementRequests,
  triggerStatementGeneration,
} from '@/server/statementsMock';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StatementRequest[] | StatementRequest | { message: string }>
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    return res.status(200).json(getStatementRequests());
  }

  if (req.method === 'POST') {
    const payload = req.body as CreateStatementPayload | undefined;
    if (!payload) {
      return res.status(400).json({ message: 'Invalid payload' });
    }

    const { frequency, periodStart, periodEnd, format, deliveryChannels } = payload;
    if (!frequency || !periodStart || !periodEnd || !format || !deliveryChannels?.length) {
      return res.status(400).json({ message: 'Missing statement fields' });
    }

    const requestedBy = payload.requestedBy ?? session.user.email ?? 'system@grow.in';
    const derivedLabel =
      payload.periodLabel ??
      new Intl.DateTimeFormat('en-IN', { month: 'short', year: 'numeric' }).format(new Date(periodStart));

    const { request } = triggerStatementGeneration({
      frequency,
      periodStart,
      periodEnd,
      format,
      deliveryChannels,
      periodLabel: derivedLabel,
      requestedBy,
    });

    return res.status(201).json(request);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ message: 'Method Not Allowed' });
}
