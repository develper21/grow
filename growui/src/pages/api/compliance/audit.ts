import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getAuditArtifacts, regenerateArtifact } from '@/server/complianceMock';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    return res.status(200).json({ items: getAuditArtifacts() });
  }

  if (req.method === 'POST') {
    const { artifactId } = req.body as { artifactId?: string };
    if (!artifactId) {
      return res.status(400).json({ message: 'Missing artifact ID' });
    }
    const artifact = regenerateArtifact(artifactId);
    if (!artifact) {
      return res.status(404).json({ message: 'Artifact not found' });
    }
    return res.status(200).json(artifact);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ message: 'Method Not Allowed' });
}
