import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getDisasterRecoveryTasks, updateDrTaskStatus } from '@/server/complianceMock';
import { DisasterRecoveryTask } from '@/types/compliance';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    return res.status(200).json({ items: getDisasterRecoveryTasks() });
  }

  if (req.method === 'PATCH') {
    const { taskId, status } = req.body as { taskId?: string; status?: DisasterRecoveryTask['status'] };
    if (!taskId || !status) {
      return res.status(400).json({ message: 'Missing task ID or status' });
    }
    const updated = updateDrTaskStatus(taskId, status);
    if (!updated) {
      return res.status(404).json({ message: 'Task not found' });
    }
    return res.status(200).json(updated);
  }

  res.setHeader('Allow', ['GET', 'PATCH']);
  return res.status(405).json({ message: 'Method Not Allowed' });
}
