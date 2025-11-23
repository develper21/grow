import type { NextApiRequest, NextApiResponse } from 'next';
import { getOrderById } from '@/server/ordersStore';
import { createReceiptPdf } from '@/server/receiptService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Order id is required' });
  }

  const order = getOrderById(id);
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  try {
    const pdfBuffer = await createReceiptPdf(order);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${order.id}-receipt.pdf"`);
    return res.status(200).send(pdfBuffer);
  } catch (error) {
    console.error('Failed to generate receipt', error);
    return res.status(500).json({ message: 'Failed to generate receipt' });
  }
}
