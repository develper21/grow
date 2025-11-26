import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getAlertWorkflows, toggleAlertWorkflow } from '@/server/adminMock';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    return res.status(200).json({ items: getAlertWorkflows() });
  }

  if (req.method === 'PATCH') {
    const { workflowId, active } = req.body as { workflowId?: string; active?: boolean };
    if (!workflowId || typeof active !== 'boolean') {
      return res.status(400).json({ message: 'Missing workflow ID or active flag' });
    }
    const workflow = toggleAlertWorkflow(workflowId, active);
    if (!workflow) {
      return res.status(404).json({ message: 'Workflow not found' });
    }
    return res.status(200).json(workflow);
  }

  res.setHeader('Allow', ['GET', 'PATCH']);
  return res.status(405).json({ message: 'Method Not Allowed' });
}
