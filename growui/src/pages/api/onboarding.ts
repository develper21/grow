import type { NextApiRequest, NextApiResponse } from 'next';
import { OnboardingPayload } from '@/types/onboarding';
import { getOnboardingStore, saveOnboardingStore, scheduleAutoDecision, updateOnboardingStatus } from '@/server/onboardingStore';

export default function handler(req: NextApiRequest, res: NextApiResponse<OnboardingPayload | { message: string }>) {
  if (req.method === 'GET') {
    return res.status(200).json(getOnboardingStore());
  }

  if (req.method === 'POST') {
    const payload = req.body as OnboardingPayload | undefined;
    if (!payload) {
      return res.status(400).json({ message: 'Invalid payload' });
    }

    if (req.query.submit === 'true') {
      const submitted = saveOnboardingStore({ ...payload, status: 'pending', consentsAccepted: true });
      scheduleAutoDecision();
      return res.status(200).json(submitted);
    }

    const saved = saveOnboardingStore(payload);
    return res.status(200).json(saved);
  }

  if (req.method === 'PUT') {
    const { status } = req.body as Partial<OnboardingPayload>;
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }
    const updated = updateOnboardingStatus(status);
    return res.status(200).json(updated);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ message: 'Method Not Allowed' });
}
