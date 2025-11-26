import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getAdminUsers, updateAdminUser } from '@/server/adminMock';
import { UserRole } from '@/types/admin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    return res.status(200).json({ items: getAdminUsers() });
  }

  if (req.method === 'PATCH') {
    const { userId, role, status } = req.body as { userId?: string; role?: UserRole; status?: 'active' | 'suspended' };
    if (!userId || (!role && !status)) {
      return res.status(400).json({ message: 'Missing fields' });
    }
    const user = updateAdminUser(userId, { role, status });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json(user);
  }

  res.setHeader('Allow', ['GET', 'PATCH']);
  return res.status(405).json({ message: 'Method Not Allowed' });
}
