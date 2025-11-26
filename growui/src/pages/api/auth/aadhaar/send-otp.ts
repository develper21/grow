import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/db';
import { User } from '@/models/User';
import { createAadhaarOtp, getOtpRetryInfo } from '@/server/otpService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { aadhaarNumber } = req.body as { aadhaarNumber?: string };
  if (!aadhaarNumber) {
    return res.status(400).json({ message: 'Aadhaar number is required' });
  }

  const normalized = aadhaarNumber.replace(/\D/g, '');
  if (normalized.length !== 12) {
    return res.status(400).json({ message: 'Invalid Aadhaar number' });
  }

  try {
    await dbConnect();
    const user = await User.findOne({ aadhaarNumber: normalized });

    if (!user) {
      return res.status(404).json({ message: 'No account is linked to this Aadhaar number' });
    }

    const retryInfo = getOtpRetryInfo(normalized);
    if (!retryInfo.canRetry) {
      const timeLeft = retryInfo.timeLeft || 0;
      return res.status(429).json({
        message: `Please wait ${Math.ceil(timeLeft / 1000)} seconds before requesting another OTP`,
        retryAfterMs: timeLeft,
      });
    }

    const { expiresAt } = await createAadhaarOtp(normalized);

    return res.status(200).json({ message: 'OTP dispatched', expiresAt, retryAfterMs: 0 });
  } catch (error) {
    console.error('Aadhaar OTP send error:', error);
    return res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
  }
}
