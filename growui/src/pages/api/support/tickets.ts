import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { createTicket, getTickets, updateTicketStatus } from '@/server/supportMock';
import { SupportTicket } from '@/types/support';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    return res.status(200).json({ items: getTickets() });
  }

  if (req.method === 'PATCH') {
    const { ticketId, status } = req.body as { ticketId?: string; status?: SupportTicket['status'] };
    if (!ticketId || !status) {
      return res.status(400).json({ message: 'Missing ticket ID or status' });
    }
    const updated = updateTicketStatus(ticketId, status);
    if (!updated) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    return res.status(200).json(updated);
  }

  if (req.method === 'POST') {
    const { subject, channel, customer, body } = req.body as {
      subject?: string;
      channel?: SupportTicket['channel'];
      customer?: string;
      body?: string;
    };
    if (!subject || !channel || !customer || !body) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const ticket = createTicket(subject, channel, customer, body);
    return res.status(201).json(ticket);
  }

  res.setHeader('Allow', ['GET', 'POST', 'PATCH']);
  return res.status(405).json({ message: 'Method Not Allowed' });
}
