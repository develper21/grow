import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { FormSubmissionInput } from '@/types/marketing';
import { submitForm } from '@/server/marketingMock';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const payload = req.body as FormSubmissionInput | undefined;
  if (!payload?.formId || !payload?.name || !payload?.email) {
    return res.status(400).json({ message: 'Missing required form fields' });
  }

  const response = submitForm(payload);
  return res.status(200).json(response);
}
