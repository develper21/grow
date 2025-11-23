import type { NextApiRequest, NextApiResponse } from 'next';
import { createOrder, getOrders } from '@/server/ordersStore';
import { OrderInput, OrderRecord } from '@/types/orders';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<OrderRecord[] | OrderRecord | { message: string }>
) {
  if (req.method === 'GET') {
    return res.status(200).json(getOrders());
  }

  if (req.method === 'POST') {
    const payload = req.body as OrderInput | undefined;
    if (!payload) {
      return res.status(400).json({ message: 'Invalid order payload' });
    }
    try {
      const order = createOrder(payload);
      return res.status(201).json(order);
    } catch (error) {
      return res.status(500).json({ message: 'Failed to create order' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ message: 'Method Not Allowed' });
}
