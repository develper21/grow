import type { NextApiRequest, NextApiResponse } from 'next';
import { getMandates, toggleMandateStatus } from '@/server/ordersStore';
import { MandateRecord } from '@/types/orders';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<MandateRecord[] | MandateRecord | { message: string }>
) {
  if (req.method === 'GET') {
    return res.status(200).json(getMandates());
  }

  if (req.method === 'PUT') {
    const { id } = req.body as { id?: string };
    if (!id) {
      return res.status(400).json({ message: 'Mandate id is required' });
    }
    const updated = toggleMandateStatus(id);
    if (!updated) {
      return res.status(404).json({ message: 'Mandate not found' });
    }
    return res.status(200).json(updated);
  }

  res.setHeader('Allow', ['GET', 'PUT']);
  return res.status(405).json({ message: 'Method Not Allowed' });
}
